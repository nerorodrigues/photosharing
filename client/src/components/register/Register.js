import React, { Component } from 'react';
import RegisterMutation from '../../containers/register';
import propTypes from 'prop-types';
import './register.css';

class RegisterInner extends Component {
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
                username: this.state.userName,
                password: this.state.password,
            }
        })

    }

    inputChangeHandle(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    render() {
        if (this.props.loading) return <div>Loading...</div>;
        if (this.props.error) return <div>Error :(</div>;
        return (<div className="Register">
            <div>
                <label>Username:</label>
                <input name="userName" type="text" placeholder="User Name" value={this.state.userName} onChange={this.inputChangeHandle} />
            </div>
            <div>
                <label>Password:</label>
                <input name="password" type="password" placeholder="Password" value={this.state.password} onChange={this.inputChangeHandle} />
            </div>
            <div>
                <button onClick={this.enviarHandle}>Enviar</button>
            </div>
        </div>)
    }
}


RegisterInner.propTypes = {
    userName: propTypes.string,
    password: propTypes.string.isRequired
};
RegisterInner.defaultProps = {
    username: '',
    password: ''
};


const Registercomponent = (mutation, { loading, error }) => {
    return <RegisterInner mutation={mutation} loading={loading} error={error} />
};

export default props => <RegisterMutation {...props}>{Registercomponent}</RegisterMutation>;
