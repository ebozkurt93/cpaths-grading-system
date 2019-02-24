import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import ErrorMessage from './ErrorMessage';
import { valueIsEmpty, textToInnerHtml } from '../helper';
import { initialForm } from '../data';
import { endpoint } from '../config';

const FIRST_FORM_MUTATION = gql`
  mutation FIRST_FORM_MUTATION(
    $email: String!
    $name: String!
    $lastname: String!
    $university: String!
    $universityYear: String!
    $universityDept: String!
    $gpa: Float!
    $cv: Upload
    $transcript: Upload
    $longQuestion1: String!
    $longQuestion2: String!
    $longQuestion3: String!
    $longQuestion4: String!
    $aboutUs: String!
    $token: String
  ) {
    registerApplication(
      email: $email
      name: $name
      lastname: $lastname
      university: $university
      universityYear: $universityYear
      universityDept: $universityDept
      gpa: $gpa
      cv: $cv
      transcript: $transcript
      longQuestion1: $longQuestion1
      longQuestion2: $longQuestion2
      longQuestion3: $longQuestion3
      longQuestion4: $longQuestion4
      aboutUs: $aboutUs
      token: $token
    ) {
      message
    }
  }
`;

const aboutUsOptions = [
  'Kesişen Yollar Facebook Sayfası aracılığıyla',
  'Üniversite Facebook Grupları',
  'Üniversite Kariyer Merkezleri',
  'Üniversite Öğrenci Kulüpleri',
  'Arkadaş'
];
class FirstForm extends Component {
  constructor(props) {
    super(props);
    if (props.oldForm) {
      const o = this.props.oldForm;
      const aboutUsPredefined = aboutUsOptions.includes(o);
      this.state = {
        submitted: false,
        warningMsg: '',
        // form elements
        // required fields
        required: {
          email: o.email || '',
          name: o.name || '',
          lastname: o.lastname || '',
          university: o.university || '',
          universityYear: o.universityYear || '',
          universityDept: o.universityDept || '',
          gpa: o.gpa || '',
          longQuestion1: o.longQuestion1 || '',
          longQuestion2: o.longQuestion2 || '',
          longQuestion3: o.longQuestion3 || '',
          longQuestion4: o.longQuestion4 || '',
          aboutUs: aboutUsPredefined ? '' : o.aboutUs || '',
          accept: '',
          token: this.props.token || ''
        },
        // Optional fields
        aboutUsOther: !aboutUsPredefined ? '' : o.aboutUs || ''
      };
    } else {
      this.state = {
        submitted: false,
        warningMsg: '',
        // form elements
        // required fields
        required: {
          email: '',
          name: '',
          lastname: '',
          university: '',
          universityYear: '',
          universityDept: '',
          gpa: '',
          longQuestion1: '',
          longQuestion2: '',
          longQuestion3: '',
          longQuestion4: '',
          aboutUs: '',
          accept: ''
        },
        // Optional fields
        aboutUsOther: ''
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
    // TODO: maybe add a honeypot field
    // Check if all required inputs are valid
    const temp = this.state.required.aboutUs !== 'Diğer:';
    if (
      Object.values(this.state.required).every(v => !valueIsEmpty(v)) &&
      (temp || (!temp && !valueIsEmpty(this.state.aboutUsOther)))
    ) {
      //valid form
      return true;
    } else {
      this.setState({ warningMsg: 'Eksik yada hatalı veri' });
      return false;
    }
  };
  checkFileValidity = (e, category) => {
    const validity = e.target.validity;
    const file = e.target.files[0];
    // valid file and size is smaller than 5 mb
    if (file && validity.valid && file.size <= 5242880) {
      var newState = { ...this.state };
      newState.required[category] = file;
      this.setState({ ...newState });
    } else {
      e.target.value = null; // clear file value
    }
  };

  render() {
    var renderOptionalField = this.state.required.aboutUs === 'Diğer:';
    var form = (
      <>
        <br />
        <h3 style={{ textAlign: 'center' }}>Başvuru Formu</h3>
        <Mutation
          mutation={FIRST_FORM_MUTATION}
          variables={{
            ...this.state.required,
            gpa: parseFloat(this.state.required.gpa),
            aboutUs:
              this.state.required.aboutUs === 'Diğer:'
                ? this.state.aboutUsOther
                : this.state.required.aboutUs
          }}
        >
          {(formSubmission, { error, loading }) => (
            <>
              <form
                method='post'
                onSubmit={async e => {
                  if (this.checkFormValidity(e)) {
                    if (this.props.token) {
                      formSubmission.variables = {
                        ...formSubmission.variables,
                        token: this.props.token
                      };
                    }
                    let resp = await formSubmission();
                    if (resp.data.registerApplication.message === 'Success') {
                      //TODO: clear form data (maybe)
                      this.setState(({ submitted }) => ({
                        submitted: !submitted
                      }));
                    }
                  }
                }}
              >
                <fieldset disabled={loading}>
                  <div className='form-group'>
                    <label htmlFor='email' className='form-label'>
                      {textToInnerHtml(initialForm['email'])}
                    </label>
                    <input
                      required
                      disabled={this.props.oldForm}
                      placeholder=' '
                      type='email'
                      className='form-input'
                      name='email'
                      value={this.state.required.email}
                      onChange={this.saveToState}
                    />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='name' className='form-label'>
                      {textToInnerHtml(initialForm['name'])}
                    </label>
                    <input
                      placeholder=' '
                      type='text'
                      className='form-input'
                      name='name'
                      value={this.state.required.name}
                      onChange={this.saveToState}
                    />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='lastname' className='form-label'>
                      {textToInnerHtml(initialForm['lastname'])}
                    </label>
                    <input
                      required
                      placeholder=' '
                      type='text'
                      className='form-input'
                      name='lastname'
                      value={this.state.required.lastname}
                      onChange={this.saveToState}
                    />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='university' className='form-label'>
                      {textToInnerHtml(initialForm['university'])}
                    </label>
                    <input
                      required
                      placeholder=' '
                      type='text'
                      className='form-input'
                      name='university'
                      value={this.state.required.university}
                      onChange={this.saveToState}
                    />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='universityYear' className='form-label'>
                      {textToInnerHtml(initialForm['universityYear'])}
                    </label>
                    <select
                      required
                      className='form-select'
                      name='universityYear'
                      value={this.state.required.universityYear}
                      onChange={this.saveToState}
                    >
                      <option hidden value='' />
                      <option>2</option>
                      <option>3</option>
                      <option value='Son Sınıf'>
                        Son Sınıf (Başvuru koşulları gereği başvurunuz geçersiz
                        sayılacak!)
                      </option>
                      <option>Diğer</option>
                    </select>
                  </div>
                  <div className='form-group'>
                    <label htmlFor='universityDept' className='form-label'>
                      {textToInnerHtml(initialForm['universityDept'])}
                    </label>
                    <input
                      required
                      placeholder=' '
                      type='text'
                      className='form-input'
                      name='universityDept'
                      value={this.state.required.universityDept}
                      onChange={this.saveToState}
                    />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='gpa' className='form-label'>
                      {textToInnerHtml(initialForm['gpa'])}
                    </label>
                    <input
                      required
                      placeholder=' '
                      type='number'
                      className='form-input'
                      name='gpa'
                      min='0'
                      max='4'
                      step='0.01'
                      value={this.state.required.gpa}
                      onChange={this.saveToState}
                    />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='CV' className='form-label'>
                      {textToInnerHtml(initialForm['cv'])}
                    </label>
                    <input
                      className='form-input'
                      type='file'
                      name='CV'
                      accept='application/pdf'
                      onChange={e => this.checkFileValidity(e, 'cv')}
                    />
                    <span className='form-input-hint'>
                      Yüklenen dosya PDF formatında ve 5MB dan küçük olmalı
                    </span>
                  </div>
                  <div className='form-group'>
                    <label htmlFor='Transcript' className='form-label'>
                      {textToInnerHtml(initialForm['transcript'])}
                    </label>
                    <input
                      className='form-input'
                      type='file'
                      name='transcript'
                      accept='application/pdf'
                      onChange={e => this.checkFileValidity(e, 'transcript')}
                    />
                    <span className='form-input-hint'>
                      Yüklenen dosya PDF formatında ve 5MB dan küçük olmalı
                    </span>
                  </div>
                  {this.props.oldForm ? (
                    <>
                      <br />
                      <a
                        target='_blank'
                        href={`${endpoint}/files/${this.props.oldForm.cv}`}
                      >
                        Eski CV
                      </a>
                      {' – '}
                      <a
                        target='_blank'
                        href={`${endpoint}/files/${
                          this.props.oldForm.transcript
                        }`}
                      >
                        Eski Transcript
                      </a>
                      <br />
                      <br />
                    </>
                  ) : (
                    ''
                  )}
                  <div className='form-group'>
                    <label htmlFor='longQuestion1' className='form-label'>
                      {textToInnerHtml(initialForm['longQuestion1'])}
                    </label>
                    <textarea
                      required
                      placeholder=' '
                      type='text'
                      className='form-input'
                      name='longQuestion1'
                      rows='5'
                      value={this.state.required.longQuestion1}
                      onChange={this.saveToState}
                    />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='longQuestion2' className='form-label'>
                      {textToInnerHtml(initialForm['longQuestion2'])}
                    </label>
                    <textarea
                      required
                      placeholder=' '
                      type='text'
                      className='form-input'
                      name='longQuestion2'
                      rows='5'
                      value={this.state.required.longQuestion2}
                      onChange={this.saveToState}
                    />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='longQuestion3' className='form-label'>
                      {textToInnerHtml(initialForm['longQuestion3'])}
                    </label>
                    <textarea
                      required
                      placeholder=' '
                      type='text'
                      className='form-input'
                      name='longQuestion3'
                      rows='5'
                      value={this.state.required.longQuestion3}
                      onChange={this.saveToState}
                    />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='longQuestion4' className='form-label'>
                      {textToInnerHtml(initialForm['longQuestion4'])}
                    </label>
                    <textarea
                      required
                      placeholder=' '
                      type='text'
                      className='form-input'
                      name='longQuestion4'
                      rows='5'
                      value={this.state.required.longQuestion4}
                      onChange={this.saveToState}
                    />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='aboutUs' className='form-label'>
                      {textToInnerHtml(initialForm['aboutUs'])}
                    </label>
                    <select
                      className='form-select'
                      name='aboutUs'
                      value={this.state.required.aboutUs}
                      onChange={this.saveToState}
                    >
                      <option hidden value='' />
                      {aboutUsOptions.map((o, i) => (
                        <option key={i}>{o}</option>
                      ))}
                      <option>Diğer:</option>
                    </select>
                    {renderOptionalField && (
                      <>
                        <div style={{ minHeight: '10px' }} />
                        <input
                          required={renderOptionalField}
                          placeholder=' '
                          type='text'
                          className='form-input'
                          name='aboutUsOther'
                          value={this.state.aboutUsOther}
                          onChange={this.saveToState}
                        />
                      </>
                    )}
                  </div>
                  <div className='form-group'>
                    <label className='form-label'>
                      {textToInnerHtml(initialForm['accept'])}
                    </label>
                    <label className='form-checkbox'>
                      <input
                        required
                        type='checkbox'
                        name='accept'
                        checked={this.state.required.accept}
                        onChange={this.saveToState}
                      />
                      <i className='form-icon' /> Evet, okudum onaylıyorum.
                    </label>
                  </div>
                  <button
                    className={`btn btn-primary ${
                      loading === true ? 'loading' : ''
                    }`}
                    style={{ marginTop: '15px' }}
                    type='submit'
                  >
                    Başvur
                  </button>
                </fieldset>
              </form>
              <ErrorMessage error={error} />
            </>
          )}
        </Mutation>

        {this.state.warningMsg && (
          <div className='toast toast-warning'>
            <button
              className='btn btn-clear float-right'
              onClick={() => this.setState({ warningMsg: '' })}
            />
            {this.state.warningMsg}
          </div>
        )}
      </>
    );
    var success = (
      <div>
        <br />
        <h4 style={{ textAlign: 'center' }}>Başvurunuz kaydedildi</h4>
      </div>
    );
    return (
      <>
        <div
          className='col-8 col-mx-auto bg-gray'
          style={{
            maxWidth: '800px',
            padding: '10px 10px'
          }}
        >
          {this.state.submitted ? success : form}
        </div>
      </>
    );
  }
}

export default FirstForm;
