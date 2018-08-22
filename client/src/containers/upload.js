import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation, Subscription } from 'react-apollo';

export const UPLOAD_FILE = gql`
    mutation uploadPhoto($image: Upload!, $caption: String!, $private: Boolean!){
        uploadPhoto(image: $image, caption: $caption, private: $private) {
            id
        }
    }
`;

export const UPLOAD_SUBSCRIPTION = gql`
    subscription  onPhotoAdded($id: ID){
        photoAdded(id : $id){
            id
            width
            height
            image
            caption
            owner {
                id
                name
            }
        }
    }
`;

const Upload = ({ props, children }) => <Mutation mutation={UPLOAD_FILE}>{children}</Mutation>;

const UploadSubscription = ({ id, children }) => <Subscription subscription={UPLOAD_SUBSCRIPTION} >{children}</Subscription>;

Upload.propTypes = {
    id: PropTypes.string,
    children: PropTypes.func.isRequired,
};

UploadSubscription.propTypes = {
    children: PropTypes.func.isRequired,
};

export { Upload, UploadSubscription };
