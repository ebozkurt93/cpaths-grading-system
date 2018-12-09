import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const FIRST_FORM_MUTATION = gql`
  mutation FIRST_FORM_MUTATION(
    $email: String!
    $name: String!
    $lastname: String!
    $university: String!
    $universityYear: String!
    $universityDept: String!
    $gpa: String!
    $cv: Upload!
    $transcript: Upload!
    $longQuestion1: String!
    $longQuestion2: String!
    $longQuestion3: String!
    $longQuestion4: String!
    $aboutUs: String!
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
    ) {
      message
    }
  }
`;
class FirstForm extends Component {
  state = {
    warningMsg: '',
    errorMsg: '',
    // form elements
    // TODO move them to required
    // required fields
    required: {
      email: 'a@a.com',
      name: 'as',
      lastname: 'asd',
      university: 'asd',
      universityYear: '3',
      universityDept: 'asd',
      gpa: '3.45',
      cv: '',
      transcript: '',
      longQuestion1: 'asd',
      longQuestion2: 'asd',
      longQuestion3: 'asd',
      longQuestion4: 'asda',
      aboutUs: 'Diğer:',
      accept: true
      // email: '',
      // name: '',
      // lastname: '',
      // university: '',
      // universityYear: '',
      // universityDept: '',
      // gpa: '',
      // longQuestion1: '',
      // longQuestion2: '',
      // longQuestion3: '',
      // longQuestion4: '',
      // aboutUs: '',
      // accept: ''
    },
    aboutUsOther: 'a'
    // aboutUsOther: ''
  };

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
    console.log(this.state);
  };

  valueIsEmpty = val => !val || val.length === 0 || /^\s*$/.test(val); // empty defined as null or trimmed length is 0, or false for checkboxes etc

  checkFormValidity = e => {
    e.preventDefault();
    // TODO: maybe add a honeypot field
    // Check if all required inputs are valid
    const temp = this.state.required.aboutUs !== 'Diğer:';
    if (
      Object.values(this.state.required).every(v => !this.valueIsEmpty(v)) &&
      (temp || (!temp && !this.valueIsEmpty(this.state.aboutUsOther)))
    ) {
      console.log('form fields are valid');
      return true;
    } else {
      this.setState({ warningMsg: 'Eksik yada hatalı veri' });
      return false;
    }
  };

  render() {
    var renderOptionalField = this.state.required.aboutUs === 'Diğer:';
    return (
      <div
        className='col-8 col-mx-auto bg-gray'
        style={{
          maxWidth: '800px',
          padding: '10px 10px'
        }}
      >
        <h3>Başvuru Formu</h3>
        <Mutation
          mutation={FIRST_FORM_MUTATION}
          variables={{
            ...this.state.required,
            aboutUs:
              this.state.required.aboutUs === 'Diğer:'
                ? this.state.aboutUsOther
                : this.state.required.aboutUs
          }}
        >
          {(formSubmission, { error, loading }) => (
            <form
              method='post'
              onSubmit={async e => {
                if (this.checkFormValidity(e)) {
                  await formSubmission();
                }
              }}
            >
              <fieldset disabled={loading}>
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
                    value={this.state.required.email}
                    onChange={this.saveToState}
                  />
                </div>
                <div className='form-group'>
                  <label htmlFor='name' className='form-label'>
                    Ad
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
                    Soyad
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
                    Üniversite
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
                    Üniversite Yılı
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
                    <option>4</option>
                    <option>5</option>
                    <option>Diğer</option>
                  </select>
                </div>
                <div className='form-group'>
                  <label htmlFor='universityDept' className='form-label'>
                    Bölüm (ve varsa çift ana dal veya yan dal)
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
                    GPA
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
                    CV
                  </label>
                  <input
                    className='form-input'
                    type='file'
                    name='CV'
                    accept='application/pdf'
                    onChange={({
                      target: {
                        validity,
                        files: [file]
                      }
                    }) => {
                      // valid file and size is smaller than 5 mb
                      if (file && validity.valid && file.size <= 5242880) {
                        var newState = { ...this.state };
                        newState.required.cv = file;
                        this.setState({ ...newState });
                        console.log(this.state);
                      }
                    }}
                  />
                  <span className='form-input-hint'>
                    Yüklenen dosya PDF formatında ve 5MB dan küçük olmalı
                  </span>
                </div>
                <div className='form-group'>
                  <label htmlFor='Transcript' className='form-label'>
                    Transcript
                  </label>
                  <input
                    className='form-input'
                    type='file'
                    name='transcript'
                    accept='application/pdf'
                    onChange={({
                      target: {
                        validity,
                        files: [file]
                      }
                    }) => {
                      // valid file and size is smaller than 5 mb
                      if (file && validity.valid && file.size <= 5242880) {
                        var newState = { ...this.state };
                        newState.required.transcript = file;
                        this.setState({ ...newState });
                        console.log(this.state);
                      }
                    }}
                  />
                  <span className='form-input-hint'>
                    Yüklenen dosya PDF formatında ve 5MB dan küçük olmalı
                  </span>
                </div>
                <div className='form-group'>
                  <label htmlFor='longQuestion1' className='form-label'>
                    2018 Haziran ayında kendini nerede görmek istiyorsun,
                    detaylı bir şekilde açıklayabilir misin? Yurt dışında staj
                    yapmak istiyorum veya X şirketinde çalışmak istiyorum gibi
                    yüzeysel cevaplar maalesef başvurunu güçsüz gösterecek.
                    Hangi spesifik alanda staj yapmak istediğinden veya X
                    şirketinde hangi pozisyonda çalışmak istediğinden açık ve
                    net bir şekilde bahsetmelisin :)
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
                    Bu spesifik hedefe yönelik yaptığın çalışmaları veya
                    edindiğin tecrübeleri bizimle paylaşabilir misin? Daha önce
                    hedefine yönelik bir çalışma yapmadıysan da hiç sorun değil,
                    diğer soruya geçebilirsin; bu başvurunu güçsüz göstermeyecek
                    ;)
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
                    Seni bu hedefe götüren yolu bize kısaca anlatabilir misin?
                    Biraz ilham için:{' '}
                    <a href='https://goo.gl/Ug74nM'>https://goo.gl/Ug74nM</a>{' '}
                    (Geçmiş çalışmaların veya tecrübelerin, neden bu alanlarda
                    devam etmek istediğin/istemediğin, tanıştığın bir kişi veya
                    ilham aldığın bir başarı hikayesinden bahsedebilirsin!)
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
                    Kesişen Yollar Danışmanlık Programı veya Kariyer
                    Sohbetlerinden haberdar mısın? Danışmanlık Programına
                    dahilsen veya Kariyer Sohbetlerini takip ediyorsan, ne
                    sıklıkla takip ediyorsun? Programları faydalı buluyor musun?
                    Bu soru başvuru değerlendirmeni etkilemeyecek, ama son bir
                    gayret max. bir kaç dk. ayırıp bu soruyu da samimi şekilde
                    cevaplamanı rica ediyoruz :)
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
                    Kariyer Koçum'dan nasıl haberdar oldun?
                  </label>
                  <select
                    className='form-select'
                    name='aboutUs'
                    value={this.state.required.aboutUs}
                    onChange={this.saveToState}
                  >
                    <option hidden value='' />
                    <option>
                      Kesişen Yollar Facebook Sayfası aracılığıyla
                    </option>
                    <option>Üniversite Facebook Grupları</option>
                    <option>Üniversite Kariyer Merkezleri</option>
                    <option>Üniversite Öğrenci Kulüpleri</option>
                    <option>Arkadaş</option>
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
                    Yukarıda vermiş olduğum bilgilerin doğruluğunu ve herhangi
                    bir tutarsızlığın veya yanlışlığın doğurabileceği sonuçların
                    yükümlülüğünü kabul ediyorum. Bu belgeyi tamamlayarak;
                    Kariyer Koçum programına başvuru yaptığımın ve kabul edilmem
                    durumunda danışan olmanın kurallarını onayladığımın
                    farkındayım. Danışan olarak, Kesişen Yollardan herhangi bir
                    maddi gelir beklemediğimi, oluşumla bağım devam ettiği
                    sürece yukarıdaki bilgilerimden herhangi birinin değişiminde
                    gerekli kişileri bilgilendireceğimi, danışmanım veya koçum
                    ile aramdaki ilişkinin mahremiyetine saygı gösteriyor olmak
                    ile birlikte gerekli durumlarda Kesişen Yollar platformu ile
                    iletişime geçeceğimi onaylıyorum. Kariyer Koçum ile
                    etkileşimim sürecinde bireysel özgürlük sınırlarını
                    aşmayacağımı, karşı tarafın isteği olmadan herhangi bir konu
                    üzerinde durmayacağımı, özel hayatla ilgili ve siyasi ve
                    dini hassasiyetlere dikkat edeceğimi kabul ediyorum. Kesişen
                    Yollar’a başvurmanın hukuki akıbetlerinin bilincindeyim: (a)
                    Kesişen Yollar derneğini herhangi bir hukuksal açıdan dolayı
                    sorumlu tutmayacağım. (b) Kesişen Yollar derneğine, danışan
                    veya danışmanlarına ve koçum’a dava açmayacağım. (c) Bu
                    programa katılmanın tüm risklerinin bilincindeyim. (d) Bu
                    programa dahil olarak paylaştığım bilgilerin danışmanlık
                    programı iç sosyal ağında paylaşılmasını ve diğer üyeler ve
                    Kesişen Yollar çalışanları tarafından görülmesini
                    onaylıyorum. (e-mail adresi gizli tutulacaktır.)
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
          )}
        </Mutation>
        {this.state.errorMsg && (
          <div className='toast toast-error'>
            <button
              className='btn btn-clear float-right'
              onClick={() => this.setState({ errorMsg: '' })}
            />
            {this.state.errorMsg}
          </div>
        )}
        {this.state.warningMsg && (
          <div className='toast toast-warning'>
            <button
              className='btn btn-clear float-right'
              onClick={() => this.setState({ warningMsg: '' })}
            />
            {this.state.warningMsg}
          </div>
        )}
      </div>
    );
  }
}

export default FirstForm;
