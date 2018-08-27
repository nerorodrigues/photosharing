import React from 'react';
import propTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation, Subscription } from 'react-apollo';

export const UPLOAD_FILE = gql`
    mutation uploadPhoto($image: Upload!, $caption: String!, $private: Boolean!){
        uploadPhoto(image: $image, caption: $caption, private: $private) {
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

const Upload = ({ children }) => <Mutation mutation={UPLOAD_FILE}>{children}</Mutation>;

Upload.propTypes = {
    id: propTypes.string,
    children: propTypes.func.isRequired,
};

export default Upload;
