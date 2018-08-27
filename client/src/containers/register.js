import React from "react";
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import propTypes from 'prop-types';

export const REGISTER_MUTATION = gql`
    mutation register($username: String!, $password: String!){
        register(username: $username, password: $password) {
            id
            name
        }
    }
`;


const RegisterMutation = ({ children }) => <Mutation mutation={REGISTER_MUTATION}>{children}</Mutation>;

RegisterMutation.propTypes = {
    children: propTypes.func.isRequired,
};
export default RegisterMutation;