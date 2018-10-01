import gql from 'graphql-tag';
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Error from './ErrorMessage';

const REGISTER_MUTATION = gql`
  mutation REGISTER_MUTATION($otherinfo1: String!, $gpa: Float!) {
    registerApplication(otherinfo1: $otherinfo1, gpa: $gpa) {
      message
    }
  }
`;

class Register extends Component {
  state = {
    otherinfo1: '',
    gpa: ''
  };
  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <Mutation mutation={REGISTER_MUTATION} variables={this.state}>
        {(registerApplication, { error, loading }) => (
          <form
            method="post"
            onSubmit={async e => {
              e.preventDefault();
              await registerApplication();
              console.log(this.state);
              this.setState({ otherinfo1: '', gpa: '' });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Apply</h2>
              <Error error={error} />
              <label htmlFor="otherinfo1">
                otherinfo1
                <textarea
                  type="input"
                  name="otherinfo1"
                  placeholder="otherinfo1"
                  value={this.state.otherinfo1}
                  onChange={this.saveToState}
                />
              </label>
              <label htmlFor="gpa">
                gpa
                <input
                  type="number"
                  step={0.01}
                  min={0}
                  max={4}
                  name="gpa"
                  placeholder="gpa"
                  value={this.state.gpa}
                  onChange={this.saveToState}
                />
              </label>
              <button type="submit">Apply!</button>
            </fieldset>
          </form>
        )}
      </Mutation>
    );
  }
}

export default Register;
