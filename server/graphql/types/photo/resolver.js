const { PubSub, withFilter } = require('graphql-subscriptions');

const convertToBase64 = async (stream) => {
    return await stream.read().toString('Base64');
};

const PHOTO_ADDED = 'PHOTO_ADDED';

const pubSub = new PubSub();

/* eslint-disable no-underscore-dangle */
module.exports = {
    resolver: {
        Photo: { id: ({ _id }) => _id },
        User: {
            photos: (owner, args, { user, db }) =>
                db.photos
                    .cfind({
                        $and: [
                            { ownerId: owner._id },
                            user
                                ? {
                                    $or: {
                                        $and: { private: true, ownerId: user.id },
                                        private: false,
                                    },
                                }
                                : { private: false },
                        ],
                    })
                    .sort({ createdAt: -1 })
                    .exec(),
        },
        Query: {
            photos: (root, args, { user, db }) =>
                db.photos
                    .cfind(user
                        ? {
                            $or: {
                                $and: { private: true, ownerId: parseInt(user.id, 10) },
                                private: false,
                            },
                        }
                        : { private: false })
                    .sort({ createdAt: -1 })
                    .exec(),
            photo: (root, { id }, { db, user }) =>
                db.photos.findOne({
                    $and: [
                        { _id: id },
                        user
                            ? {
                                $or: {
                                    $and: { private: true, ownerId: user.id },
                                    private: false,
                                },
                            }
                            : { private: false },
                    ],
                }),
        },
        Mutation: {
            uploadPhoto: async (root, args, { user, db }) => {

                const { stream, filename, mimetype, encoding } = await args.image;

                var data = await db.photos.insert({
                    ownerId: 1,
                    image: await convertToBase64(stream),
                    private: !!args.private,
                    caption: args.caption,
                    width: 800,
                    height: 600,
                });
                var photo = {
                    'Photo.id': data._id,
                    'Photo.ownerId': 1,
                    'Photo.private': data.private,
                    'Photo.caption': '',
                    'Photo.owner': null,
                    'Photo.width': 800,
                    'Photo.height': 600,
                    'Photo.image': data.image,
                    'Photo.createdAt': new Date()
                };

                pubSub.publish(PHOTO_ADDED, {
                    payload: {
                        photoAdded: photo
                    }
                });
                return photo;
            },
            editPhoto: async (root, args, { user }) => {
                // TODO: handle editPhoto
            },
            deletePhoto: async (root, args, { user }) => {
                // TODO: handle deletePhoto
            },
        },
        Subscription: {
            photoAdded: {
                subscribe: async (root, args, ctx) => await pubSub.asyncIterator([PHOTO_ADDED])
            },
            photoEdited: async (root, args, ctx) => {
                console.log(2);
            },
            photoDeleted: async (root, args, ctx) => {
                console.log(3);
            },
        },
    },
};
