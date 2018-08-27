const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');

const DEFAULT_SECRET = 'totally-unguessable-jwt-secret';

module.exports = {
    resolver: {
        Mutation: {
            register: async (root, args, { db, }) => {
                const { username, password } = await args;
                const pass = await bcryptjs.hash(password, 10);
                const user = await db.users.insert({
                    name: username,
                    password: pass,
                    createdAt: new Date()
                });
                const newUser = { id: user._id, name: user.name };
                return newUser;
            },

            login: async (root, args, context) => {
                const { userName, password } = args;
                const pass = bcryptjs.hash(password, 10);
                return await db.users.findOne({
                    userName: userName,
                    password: pass
                }, (err, user) => {
                    return jsonwebtoken.sign({
                        exp: Math.floor(Date.now() / 1000) + (60 * 60),
                        subject: user.ID,
                    }, DEFAULT_SECRET);
                })
            },

            logout: async (root, args, context) => {
                // TODO: Handle user logout here
            },
        },
    },
};
