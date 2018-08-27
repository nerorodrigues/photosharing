import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AllPhotos from '../../containers/allPhotos';
import Photo from './Photo';
import gql from 'graphql-tag';
import { UPLOAD_SUBSCRIPTION } from "../../containers/photoAdded";



export const PhotoListInner = ({ ...props }) => {
    
    if (props.loading) return <div>Loading...</div>;
    if (props.error) return <div>Error :(</div>;
    props.subscribeToMore({
        document: UPLOAD_SUBSCRIPTION,
        variables: {
            id: 1//props.match.params.ID
        },
        updateQuery: (prev, { subscriptionData }) => {
            if (subscriptionData.data)
                return prev;

            const newMessage = subscriptionData.data.messageAdded;
            if (!prev.channel.messages.find((msg) => msg.id == newMessage.id)) {
                return Object.assign({}, prev, {
                    channel: Object.assign({}, prev.channel, {
                        messages: [...prev.channel.messages, newMessage]
                    })
                });
            } else
                return prev;
        }
    });
    return (
        <div className="PhotoList">
            {props.data.photos.map(photo => <Photo key={photo.id} id={photo.id} width={photo.width} height={photo.height} />)}
        </div>
    );
};

PhotoListInner.propTypes = {
    loading: PropTypes.bool.isRequired,
    error: PropTypes.instanceOf(Error), // eslint-disable-line react/require-default-props
    data: PropTypes.shape({
        photos: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            width: PropTypes.number,
            height: PropTypes.number,
        })),
    }),
};

PhotoListInner.defaultProps = {
    data: {},
};

const PhotoList = () => <AllPhotos>{PhotoListInner}</AllPhotos>;

export default PhotoList;


