const { initialForm, isAFile } = require('./data');
const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

const mailContent = text => `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
</head>

<body>
    <div className="email" style="
padding: 20px;
line-height: 2;
margin: 0 auto;
font-size: 16px;
max-width: 50rem;">
        ${text}
        <br />
        Sevgiler,<br />
        Kesişen Yollar Staj Ekibi
    </div>
</body>

</html>
`;

const acceptedApplicationContent = (data, isNew) => {
  var formattedData = '';
  Object.keys(initialForm).map(k => {
    if (k in data) {
      if (isAFile.includes(k)) {
        formattedData += `<p><a target="_blank" href="${
          process.env.SERVER_ENDPOINT
        }/files/${data[k]}">${initialForm[k]}</a>`;
      } else {
        formattedData += `<p><b>${initialForm[k]}:</b> ${data[k]}</p>`;
      }
    }
  });
  const content = `
  Merhaba ${data.name},<br />
  Başvurun${isNew ? 'u aldık' : ' güncellendi'}.<br /><br />
  <div class="details">
  <h3 style="text-align: center;">${
    isNew ? '' : 'Güncel '
  }Başvuru Detayları</h3>
  ${formattedData}
  </div>`;
  return mailContent(content);
};

const updateApplicationContent = data => {
  const content = `
  Merhaba ${data.name},<br />
  Başvurunu önümüzdeki 1 saat içerisinde <a href=${
    data.url
  } target="_blank">şu linke</a> tıklayarak güncelleyebilirsin.`;
  return mailContent(content);
};

exports.transport = transport;
exports.mailContent = mailContent;
exports.acceptedApplicationContent = acceptedApplicationContent;
exports.updateApplicationContent = updateApplicationContent;
