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
    $cvAnon: Upload
    $transcript: Upload
    $transcriptAnon: Upload
    $internshipCountry: String!
    $internshipType: String!
    $companyName: String!
    $internshipPeriod: String!
    $internshipPosition: String!
    $acceptanceLetter: Upload
    $acceptanceEmail: String!
    $economicSupport: String!
    $longQuestion1: String!
    $longQuestion2: String!
    $longQuestion3: String!
    $ourPrograms: String!
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
      cvAnon: $cvAnon
      transcript: $transcript
      transcriptAnon: $transcriptAnon
      internshipCountry: $internshipCountry
      internshipType: $internshipType
      companyName: $companyName
      internshipPeriod: $internshipPeriod
      internshipPosition: $internshipPosition
      acceptanceLetter: $acceptanceLetter
      acceptanceEmail: $acceptanceEmail
      economicSupport: $economicSupport
      longQuestion1: $longQuestion1
      longQuestion2: $longQuestion2
      longQuestion3: $longQuestion3
      ourPrograms: $ourPrograms
      aboutUs: $aboutUs
      token: $token
    ) {
      message
    }
  }
`;

const universityYearOptions = [
  '2',
  '3',
  {
    'Son Sınıf (Başvuru koşulları gereği başvurunuz geçersiz sayılacak!)':
      'Son Sınıf'
  }
];

const internshipTypeOptions = [
  'Kurumsal şirket',
  'Startup',
  'Üniversite veya araştırma kuruluşu'
];
const aboutUsOptions = [
  'Kesişen Yollar Facebook Sayfası aracılığıyla',
  'Kesişen Yollar Diğer Sosyal Medya Hesapları aracılığıyla',
  'Üniversite Facebook Grupları',
  'Üniversite Kariyer Merkezleri',
  'Üniversite Öğrenci Kulüpleri',
  'TEV',
  'Arkadaş'
];
class FirstForm extends Component {
  constructor(props) {
    super(props);
    if (props.oldForm) {
      const o = this.props.oldForm;
      console.log(o);
      const universityYearPredefined = ['2', '3', 'Son Sınıf'].includes(
        o.universityYear
      );
      const internshipTypePredefined = internshipTypeOptions.includes(
        o.internshipType
      );
      const economicSupportPredefined = o.economicSupport === 'Hayır';
      const aboutUsPredefined = aboutUsOptions.includes(o.aboutUs);
      // todo for all other predefined parts...
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
          universityYear: universityYearPredefined
            ? o.universityYear
            : 'Diğer:',
          universityDept: o.universityDept || '',
          gpa: o.gpa || '',
          internshipCountry: o.internshipCountry || '',
          internshipType: internshipTypePredefined
            ? o.internshipType
            : 'Diğer:',
          companyName: o.companyName || '',
          internshipPeriod: o.internshipPeriod || '',
          internshipPosition: o.internshipPosition || '',
          acceptanceEmail: o.acceptanceEmail || '',
          economicSupport: !economicSupportPredefined ? 'Evet' : 'Hayır',
          longQuestion1: o.longQuestion1 || '',
          longQuestion2: o.longQuestion2 || '',
          longQuestion3: o.longQuestion3 || '',
          ourPrograms: o.ourPrograms || '',
          aboutUs: !aboutUsPredefined ? 'Diğer:' : o.aboutUs || '',
          token: this.props.token || ''
        },
        // Optional fields
        universityYearOther: universityYearPredefined
          ? ''
          : o.universityYear || '',
        internshipTypeOther: internshipTypePredefined
          ? ''
          : o.internshipType || '',
        economicSupportQ2: !economicSupportPredefined ? o.economicSupport : '',
        aboutUsOther: aboutUsPredefined ? '' : o.aboutUs || ''
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
          internshipCountry: '',
          internshipType: '',
          companyName: '',
          internshipPeriod: '',
          internshipPosition: '',
          acceptanceEmail: '',
          economicSupport: '',
          longQuestion1: '',
          longQuestion2: '',
          longQuestion3: '',
          ourPrograms: '',
          aboutUs: ''
        },
        // Optional fields
        aboutUsOther: '',
        economicSupportQ2: ''
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
    var renderUniversityYearOptionalField =
      this.state.required.universityYear === 'Diğer:';
    var renderInternshipTypeOptionalField =
      this.state.required.internshipType === 'Diğer:';
    var renderEconomicSupportOptionalField = this.state.required.economicSupport.startsWith(
      'Evet'
    );
    var renderAboutUsOptionalField = this.state.required.aboutUs === 'Diğer:';
    var form = (
      <>
        <br />
        <h3 style={{ textAlign: 'center' }}>
          Yurt Dışında Staj Başvuru Formu 2019
        </h3>
        <p>
          This is the Internship Abroad application form in Turkish. If you
          don't speak Turkish, please send an e-mail to:{' '}
          <a href='mailto:staj@cpaths.org'>staj@cpaths.org</a>
        </p>
        <p>
          <b>ÖNEMLİ NOT:</b> CV ve transkriptinin hem orijinallerini, hem de
          isminin üzeri karalı (anonim) hallerini yüklemen gerekiyor. Jürimiz
          değerlendirmeyi anonim dökümanlar üzerinden yapıyor olacak.
        </p>
        <p>
          Aklına bir soru mu takıldı? Cevabı yüksek ihtimalle Yurt Dışında Staj
          SSS sayfasında bulabilirsin:{' '}
          <a target='_blank' href='https://goo.gl/kVDKWD'>
            https://goo.gl/kVDKWD
          </a>
        </p>
        <p>
          Eğer ki SSS sayfasında soruna cevap bulamadıysan, bize bu adresten
          ulaşabilirsin: <a href='mailto:staj@cpaths.org'>staj@cpaths.org</a>
        </p>
        <Mutation
          mutation={FIRST_FORM_MUTATION}
          variables={{
            ...this.state.required,
            gpa: parseFloat(this.state.required.gpa),
            universityYear: renderUniversityYearOptionalField
              ? this.state.universityYearOther
              : this.state.required.universityYear,
            internshipType: renderInternshipTypeOptionalField
              ? this.state.internshipTypeOther
              : this.state.required.internshipType,
            economicSupport: renderEconomicSupportOptionalField
              ? this.state.economicSupportQ2
              : this.state.required.economicSupport,
            aboutUs: renderAboutUsOptionalField
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
                      {universityYearOptions.map((o, i) => {
                        if (typeof o === 'object') {
                          return (
                            <option key={i} value={Object.values(o)[0]}>
                              {Object.keys(o)[0]}
                            </option>
                          );
                        } else return <option key={i}>{o}</option>;
                      })}
                      <option>Diğer:</option>
                    </select>
                    {renderUniversityYearOptionalField && (
                      <>
                        <div style={{ minHeight: '10px' }} />
                        <input
                          required={renderUniversityYearOptionalField}
                          placeholder=' '
                          type='text'
                          className='form-input'
                          name='universityYearOther'
                          value={this.state.universityYearOther}
                          onChange={this.saveToState}
                        />
                      </>
                    )}
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
                    <label htmlFor='CV Anon' className='form-label'>
                      {textToInnerHtml(initialForm['cvAnon'])}
                    </label>
                    <input
                      className='form-input'
                      type='file'
                      name='CV Anon'
                      accept='application/pdf'
                      onChange={e => this.checkFileValidity(e, 'cvAnon')}
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
                  <div className='form-group'>
                    <label htmlFor='Transcript Anon' className='form-label'>
                      {textToInnerHtml(initialForm['transcriptAnon'])}
                    </label>
                    <input
                      className='form-input'
                      type='file'
                      name='transcript Anon'
                      accept='application/pdf'
                      onChange={e =>
                        this.checkFileValidity(e, 'transcriptAnon')
                      }
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
                        href={`${endpoint}/files/${this.props.oldForm.cvAnon}`}
                      >
                        Eski Anonim CV
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
                      {' – '}
                      <a
                        target='_blank'
                        href={`${endpoint}/files/${
                          this.props.oldForm.transcriptAnon
                        }`}
                      >
                        Eski Anonim Transcript
                      </a>
                      <br />
                      <br />
                    </>
                  ) : (
                    ''
                  )}
                  <div className='form-group'>
                    <label htmlFor='internshipCountry' className='form-label'>
                      {textToInnerHtml(initialForm['internshipCountry'])}
                    </label>
                    <input
                      required
                      placeholder=' '
                      type='text'
                      className='form-input'
                      name='internshipCountry'
                      value={this.state.required.internshipCountry}
                      onChange={this.saveToState}
                    />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='internshipType' className='form-label'>
                      {textToInnerHtml(initialForm['internshipType'])}
                    </label>
                    <select
                      required
                      className='form-select'
                      name='internshipType'
                      value={this.state.required.internshipType}
                      onChange={this.saveToState}
                    >
                      <option hidden value='' />
                      {internshipTypeOptions.map((o, i) => {
                        if (typeof o === 'object') {
                          return (
                            <option key={i} value={Object.values(o)[0]}>
                              {Object.keys(o)[0]}
                            </option>
                          );
                        } else return <option key={i}>{o}</option>;
                      })}
                      <option>Diğer:</option>
                    </select>
                    {renderInternshipTypeOptionalField && (
                      <>
                        <div style={{ minHeight: '10px' }} />
                        <input
                          required={renderInternshipTypeOptionalField}
                          placeholder=' '
                          type='text'
                          className='form-input'
                          name='internshipTypeOther'
                          value={this.state.internshipTypeOther}
                          onChange={this.saveToState}
                        />
                      </>
                    )}
                  </div>
                  <div className='form-group'>
                    <label htmlFor='companyName' className='form-label'>
                      {textToInnerHtml(initialForm['companyName'])}
                    </label>
                    <input
                      required
                      placeholder=' '
                      type='text'
                      className='form-input'
                      name='companyName'
                      value={this.state.required.companyName}
                      onChange={this.saveToState}
                    />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='internshipPeriod' className='form-label'>
                      {textToInnerHtml(initialForm['internshipPeriod'])}
                    </label>
                    <input
                      required
                      placeholder=' '
                      type='text'
                      className='form-input'
                      name='internshipPeriod'
                      value={this.state.required.internshipPeriod}
                      onChange={this.saveToState}
                    />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='internshipPosition' className='form-label'>
                      {textToInnerHtml(initialForm['internshipPosition'])}
                    </label>
                    <input
                      required
                      placeholder=' '
                      type='text'
                      className='form-input'
                      name='internshipPosition'
                      value={this.state.required.internshipPosition}
                      onChange={this.saveToState}
                    />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='acceptanceLetter' className='form-label'>
                      {textToInnerHtml(initialForm['acceptanceLetter'])}
                    </label>
                    <input
                      className='form-input'
                      type='file'
                      name='acceptanceLetter'
                      accept='application/pdf'
                      onChange={e =>
                        this.checkFileValidity(e, 'acceptanceLetter')
                      }
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
                        href={`${endpoint}/files/${
                          this.props.oldForm.acceptanceLetter
                        }`}
                      >
                        Eski Staj Kabul Belgesi
                      </a>
                      <br />
                      <br />
                    </>
                  ) : (
                    ''
                  )}
                  <div className='form-group'>
                    <label htmlFor='acceptanceEmail' className='form-label'>
                      {textToInnerHtml(initialForm['acceptanceEmail'])}
                    </label>
                    <input
                      required
                      placeholder=' '
                      type='text'
                      className='form-input'
                      name='acceptanceEmail'
                      value={this.state.required.acceptanceEmail}
                      onChange={this.saveToState}
                    />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='economicSupport' className='form-label'>
                      {textToInnerHtml(initialForm['economicSupport'])}
                    </label>
                    <select
                      required
                      className='form-select'
                      name='economicSupport'
                      value={this.state.required.economicSupport}
                      onChange={this.saveToState}
                    >
                      <option hidden value='' />
                      <option>Evet</option>
                      <option>Hayır</option>
                    </select>
                  </div>
                  {renderEconomicSupportOptionalField && (
                    <div className='form-group'>
                      <label htmlFor='economicSupportQ2' className='form-label'>
                        {textToInnerHtml(initialForm['economicSupportQ2'])}
                      </label>
                      <input
                        required={renderEconomicSupportOptionalField}
                        placeholder=' '
                        type='text'
                        className='form-input'
                        name='economicSupportQ2'
                        value={this.state.economicSupportQ2}
                        onChange={this.saveToState}
                      />
                    </div>
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
                    <label htmlFor='ourPrograms' className='form-label'>
                      {textToInnerHtml(initialForm['ourPrograms'])}
                    </label>
                    <textarea
                      required
                      placeholder=' '
                      type='text'
                      className='form-input'
                      name='ourPrograms'
                      rows='5'
                      value={this.state.required.ourPrograms}
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
                    {renderAboutUsOptionalField && (
                      <>
                        <div style={{ minHeight: '10px' }} />
                        <input
                          required={renderAboutUsOptionalField}
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
