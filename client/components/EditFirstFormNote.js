import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import ErrorMessage from './ErrorMessage';
import { textToInnerHtml } from '../helper';
import { initialForm } from '../data';

const UPDATE_NOTE_MUTATION = gql`
  mutation UPDATE_NOTE_MUTATION($initialFormId: ID!, $notes: String) {
    updateInitialFormNote(initialFormId: $initialFormId, notes: $notes) {
      message
    }
  }
`;

class FirstFormNote extends Component {
  state = { note: this.props.form.notes || '' };

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    console.log(this.props);
    return (
      <Mutation
        mutation={UPDATE_NOTE_MUTATION}
        variables={{
          notes: this.state.note,
          initialFormId: this.props.form.id
        }}
      >
        {(formSubmission, { error, loading }) => (
          <>
            <form
              method='post'
              onSubmit={async e => {
                e.preventDefault();
                let resp = await formSubmission();
                if (resp.data.updateInitialFormNote.message === 'Success') {
                  // reload page
                  window.location.reload();
                }
              }}
            >
              <fieldset>
                <div className='form-group'>
                  <label htmlFor='note' className='form-label'>
                    {textToInnerHtml(initialForm['notesNoHtml'])}
                  </label>
                  <textarea
                    placeholder=' '
                    type='text'
                    className='form-input'
                    name='note'
                    rows='5'
                    value={this.state.note}
                    onChange={this.saveToState}
                  />
                </div>
                <button
                  className={`btn btn-primary ${
                    loading === true ? 'loading' : ''
                  }`}
                  style={{ marginTop: '15px' }}
                  type='submit'
                >
                  Güncelle{loading === true ? 'niyor' : ''}
                </button>
              </fieldset>
            </form>
            <ErrorMessage error={error} />
          </>
        )}
      </Mutation>
    );
  }
}
export default FirstFormNote;
