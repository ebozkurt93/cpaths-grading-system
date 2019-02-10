import Router from 'next/router';
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import ErrorMessage from './ErrorMessage';
import { valueIsEmpty } from '../helper';

const SUBMIT_FORMGRADE_MUTATION = gql`
  mutation SUBMIT_FORMGRADE_MUTATION(
    $initialFormId: ID!
    $score1: Int!
    $score2: Int!
    $score3: Int!
    $boolean: Boolean!
    $notes: String
  ) {
    submitFormGrade(
      initialFormId: $initialFormId
      score1: $score1
      score2: $score2
      score3: $score3
      boolean: $boolean
      notes: $notes
    ) {
      message
    }
  }
`;

class Grade extends Component {
  constructor(props) {
    super(props);
    if (props.gradeData) {
      this.state = {
        // submitted: false,
        warningMsg: '',
        required: {
          score1: this.props.gradeData.score1 || '',
          score2: this.props.gradeData.score2 || '',
          score3: this.props.gradeData.score3 || ''
          // score1: '1',
          // score2: '3',
          // score3: '5',
        },
        boolean: (this.props.gradeData.boolean ? 'E' : 'H') || '',
        // boolean: true,
        notes: this.props.gradeData.notes || ''
        // notes: 'asdasdd'
      };
    } else {
      this.state = {
        warningMsg: '',
        required: {
          score1: '',
          score2: '',
          score3: ''
          // score1: '1',
          // score2: '3',
          // score3: '5',
        },
        boolean: '',
        // boolean: true,
        notes: ''
        // notes: 'asdasdd'
      };
    }
  }

  saveToState = e => {
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    // handling state for required fields
    if (e.target.name in this.state.required) {
      // e.target.setAttribute('required', ''); //Adding required on runtime
      var newState = { ...this.state };
      newState.required[e.target.name] = value;
      this.setState({ ...newState });
    } else {
      this.setState({ [e.target.name]: value });
    }
  };

  checkFormValidity = e => {
    e.preventDefault();
    if (Object.values(this.state.required).every(v => !valueIsEmpty(v))) {
      return true;
    } else {
      this.setState({ warningMsg: 'Eksik yada hatalı veri' });
      return false;
    }
  };

  render() {
    var form = (
      <>
        <Mutation
          mutation={SUBMIT_FORMGRADE_MUTATION}
          variables={{
            score1: parseInt(this.state.required.score1),
            score2: parseInt(this.state.required.score2),
            score3: parseInt(this.state.required.score3),
            boolean: this.state.boolean === 'E' ? true : false,
            notes: this.state.notes,
            initialFormId: this.props.formId
          }}
        >
          {(formSubmission, { error, loading }) => (
            <>
              <form
                method='post'
                onSubmit={async e => {
                  if (this.checkFormValidity(e)) {
                    let resp = await formSubmission();
                    if (resp.data.submitFormGrade.message === 'Success') {
                      //TODO: clear form data (maybe)
                      {
                        /* this.setState(({ submitted }) => ({
                        submitted: !submitted
                      })); */
                      }
                      Router.back();
                    }
                  }
                }}
              >
                <fieldset
                //TODO add loading to fieldset
                >
                  <div className='form-group'>
                    <label htmlFor='score1' className='form-label'>
                      score1
                    </label>
                    <input
                      required
                      placeholder=' '
                      type='number'
                      className='form-input'
                      name='score1'
                      min='0'
                      max='5'
                      step='1'
                      value={this.state.required.score1}
                      onChange={this.saveToState}
                    />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='score2' className='form-label'>
                      score2
                    </label>
                    <input
                      required
                      placeholder=' '
                      type='number'
                      className='form-input'
                      name='score2'
                      min='0'
                      max='5'
                      step='1'
                      value={this.state.required.score2}
                      onChange={this.saveToState}
                    />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='score3' className='form-label'>
                      score3
                    </label>
                    <input
                      required
                      placeholder=' '
                      type='number'
                      className='form-input'
                      name='score3'
                      min='0'
                      max='5'
                      step='1'
                      value={this.state.required.score3}
                      onChange={this.saveToState}
                    />
                  </div>
                  <div className='form-group'>
                    <label className='form-label'>Evet / Hayır</label>
                    <label className='form-radio'>
                      <input
                        required
                        type='radio'
                        name='boolean'
                        value='E'
                        checked={this.state.boolean === 'E'}
                        onChange={this.saveToState}
                      />
                      <i className='form-icon' />
                      Evet
                    </label>
                    <label className='form-radio'>
                      <input
                        required
                        type='radio'
                        name='boolean'
                        value='H'
                        checked={this.state.boolean === 'H'}
                        onChange={this.saveToState}
                      />
                      <i className='form-icon' />
                      Hayır
                    </label>
                  </div>
                  {/* <div className='form-group'>
                    <label className='form-checkbox'>
                      <input
                        type='checkbox'
                        name='boolean'
                        checked={this.state.boolean}
                        onChange={this.saveToState}
                      />
                      <i className='form-icon' /> Boolean score
                    </label>
                  </div> */}
                  <div className='form-group'>
                    <label htmlFor='notes' className='form-label'>
                      Notlar
                    </label>
                    <textarea
                      placeholder=' '
                      type='text'
                      className='form-input'
                      name='notes'
                      rows='5'
                      value={this.state.notes}
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
                    Gönder
                  </button>
                </fieldset>
              </form>
              <ErrorMessage error={error} />
            </>
          )}
        </Mutation>
      </>
    );
    return form;
  }
}

export default Grade;
