import gql from 'graphql-tag';

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
