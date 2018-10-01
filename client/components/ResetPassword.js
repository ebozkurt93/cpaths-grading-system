import gql from 'graphql-tag';
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Error from './ErrorMessage';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      email
      name
    }
  }
`;
class ResetPassword extends Component {
  state = {
    email: '',
    password: '',
    confirmPassword: ''
  };
  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <Mutation
        mutation={RESET_MUTATION}
        variables={{
          resetToken: this.props.resetToken,
          password: this.state.password,
          confirmPassword: this.state.confirmPassword
        }}
      >
        {(resetPassword, { error, loading }) => (
          <form
            method="post"
            onSubmit={async e => {
              e.preventDefault();
              await resetPassword();
              this.setState({ email: '', password: '', confirmPassword: '' });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Reset Password</h2>
              <Error error={error} />
              <label htmlFor="email">
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="email"
                  value={this.state.email}
                  onChange={this.saveToState}
                />
              </label>
              <label htmlFor="password">
                Password
                <input
                  type="password"
                  name="password"
                  placeholder="password"
                  value={this.state.password}
                  onChange={this.saveToState}
                />
              </label>
              <label htmlFor="confirmPassword">
                Confirm Password
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="confirmPassword"
                  value={this.state.confirmPassword}
                  onChange={this.saveToState}
                />
              </label>
              <button type="submit">Reset password</button>
            </fieldset>
          </form>
        )}
      </Mutation>
    );
  }
}

export default ResetPassword;
