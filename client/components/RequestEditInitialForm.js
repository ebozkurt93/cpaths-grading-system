import gql from 'graphql-tag';
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Error from './ErrorMessage';

const REQUEST_EDIT_INITIALFORM_MUTATION = gql`
  mutation REQUEST_EDIT_INITIALFORM_MUTATION($email: String!) {
    requestInitialFormEdit(email: $email) {
      message
    }
  }
`;

class RequestEditInitialForm extends Component {
  state = {
    email: '',
    submitted: false
  };
  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    const form = (
      <>
        <h4>Başvuru değiştirme</h4>
        <Mutation
          mutation={REQUEST_EDIT_INITIALFORM_MUTATION}
          variables={{ email: this.state.email }}
        >
          {(requestFormEdit, { error, loading }) => (
            <form
              method='post'
              style={{ maxWidth: '20rem' }}
              onSubmit={async e => {
                e.preventDefault();
                let resp = await requestFormEdit();
                console.log(resp.data);
                if (resp.data.requestInitialFormEdit.message === 'Success') {
                  this.setState({ email: '', submitted: true });
                } else {
                  this.setState({ submitted: false });
                }
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <Error error={error} />
                <div className='form-group'>
                  <label htmlFor='email' className='form-label'>
                    Email
                  </label>
                  <input
                    required
                    placeholder=' '
                    type='email'
                    className='form-input'
                    name='email'
                    value={this.state.email}
                    onChange={this.saveToState}
                  />
                </div>
                <button className='btn btn-primary' type='submit'>
                  Gönder
                </button>
              </fieldset>
            </form>
          )}
        </Mutation>
      </>
    );
    if (!this.state.submitted) return form;
    else
      return (
        <p>
          Başvurunuzu güncellemek için gereken linke mail adresinize gönderildi.
        </p>
      );
  }
}

export default RequestEditInitialForm;
