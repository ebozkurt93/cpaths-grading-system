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
        <h4>Başvuru güncelleme</h4>
        <p>
          Girdiğiniz mail adresi ile başvurunuzu yaptığınız adres aynı olmalı.
        </p>
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
                  <input
                    style={{ minWidth: '15rem' }}
                    required
                    placeholder='example@email.com'
                    type='email'
                    className='form-input'
                    name='email'
                    value={this.state.email}
                    onChange={this.saveToState}
                  />
                </div>
                <button className='btn btn-primary p-centered' type='submit'>
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
          Başvurunuzu güncellemeniz için gereken link mail adresinize
          gönderildi.
        </p>
      );
  }
}

export default RequestEditInitialForm;
