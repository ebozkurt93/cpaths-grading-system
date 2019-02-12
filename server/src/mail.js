const { initialForm } = require('./data');
const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

const mailContent = text => `
  <div className="email" style="
  padding: 20px;
  font-family: sans-serif;
  line-height: 2;
  font-size: 18px;
  border: 1px solid black;
  margin: auto;
  max-width: 50rem;
  "> 
    ${text}
  </div>
`;

const acceptedApplicationContent = data => {
  var formattedData = '';
  Object.keys(initialForm).map(k => {
    if (k in data) {
      formattedData += `<p><b>${initialForm[k]}:</b> ${data[k]}</p>`;
    }
  });
  return `
  Merhaba ${data.name},<br />
  Başvurunu aldık....<br /><br />
  <div class="details">
  <h3 style="text-align: center;">Başvuru Detayları</h3>
  ${formattedData}
  </div>`;
};

exports.transport = transport;
exports.mailContent = mailContent;
exports.acceptedApplicationContent = acceptedApplicationContent;
