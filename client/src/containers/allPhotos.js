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

const AllPhotos = ({ children }) => <Query query={GET_ALL_PHOTOS}>{children}</Query>;

AllPhotos.propTypes = {
    children: PropTypes.func.isRequired,
};

export default AllPhotos;
