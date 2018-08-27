import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
export const GET_ALL_PHOTOS = gql`
    query getAllPhotos {
        photos {
            id
            width
            height
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

const SUBSCRIBE_TO_MORE = ({ options }) => {
    
};

const AllPhotos = ({ children }) => <Query query={GET_ALL_PHOTOS} subscribeToMore={SUBSCRIBE_TO_MORE}>{children}</Query>;

AllPhotos.propTypes = {
    children: PropTypes.func.isRequired,
};

export default AllPhotos;
