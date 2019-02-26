import Head from 'next/head';

const Meta = props => (
  <Head>
    <meta name='viewport' content='width=device-width, initial-scale=1' />
    <meta charSet='utf-8' lang='tr' />
    <link rel='stylesheet' type='text/css' href='static/nprogress.css' />
    <link rel='stylesheet' href='../static/spectre.min.css' />
    <link rel='stylesheet' href='../static/spectre-exp.min.css' />
    <link rel='stylesheet' href='../static/spectre-icons.min.css' />
    <link rel='icon' type='image/png' href='../static/favicon.png' />
    <link
      href='https://fonts.googleapis.com/css?family=Muli:400,400i,600,600i,700,700i&amp;subset=latin-ext'
      rel='stylesheet'
    />
    <title>
      {props.title ? `${props.title} | ` : ''}Kesişen Yollar Staj 2019
    </title>
  </Head>
);

export default Meta;
