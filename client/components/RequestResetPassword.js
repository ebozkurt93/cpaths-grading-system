import gql from 'graphql-tag';
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Error from './ErrorMessage';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestPasswordReset(email: $email) {
      message
    }
  }
`;

class RequestPasswordReset extends Component {
  state = {
    email: ''
  };
  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <Mutation mutation={REQUEST_RESET_MUTATION} variables={this.state}>
        {(requestPasswordReset, { error, loading }) => (
          <form
            method="post"
            onSubmit={async e => {
              e.preventDefault();
              await requestPasswordReset();
              this.setState({ email: '', password: '' });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Request a password reset</h2>
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
              <button type="submit">Request Reset!</button>
            </fieldset>
          </form>
        )}
      </Mutation>
    );
  }
}

export default RequestPasswordReset;
