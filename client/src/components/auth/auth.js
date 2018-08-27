import React, { Component } from 'react';
import AuthMutation from '../../containers/auth';
import propTypes from 'prop-types';
import './register.css';

class AuthInner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            password: '',
        };
        this.enviarHandle = this.enviarHandle.bind(this);
        this.inputChangeHandle = this.inputChangeHandle.bind(this);
    }

    enviarHandle() {
        this.props.mutation({
            variables: {
                userName: this.state.userName,
                password: this.state.password,
            }
        })

    }

    inputChangeHandle(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });
    }

    render() {
        if (this.props.loading) return <div>Loading...</div>;
        if (this.props.error) return <div>Error :(</div>;
        return (<div>
            <div>
                <input name="userName" type="text" placeholder="User Name" value={this.state.userName} onChange={this.inputChangeHandle} />
            </div>
            <div>
                <input name="password" type="password" placeholder="Password" value={this.state.password} onChange={this.inputChangeHandle} />
            </div>
            <button onClick={this.enviarHandle}>Login</button>
        </div>)
    }
}


RegisterInner.propTypes = {
    userName: propTypes.string.isRequired,
    password: propTypes.string.isRequired
};
RegisterInner.defaultProps = {
    username: '',
    password: ''
};


const Registercomponent = (props) => {
    return <RegisterInner {...props} />
};

export default props => <AuthMutation {...props}>{Registercomponent}</AuthMutation>;
