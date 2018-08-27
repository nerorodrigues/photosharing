import React from "react";
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import propTypes from 'prop-types';

export const AUTH_MUTATION = gql`
    mutation login($userName: String!, $password: String!){
        login(userName: $userName, password: $password){
            token
        }
    }
`;

const AuthMutation = ({ children }) => <Mutation mutation={AUTH_MUTATION}>{children}</Mutation>

AuthMutation.propTypes = {
    children: propTypes.func.isRequired,
};

export default AuthMutation ;