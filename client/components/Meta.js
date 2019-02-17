import Head from 'next/head';

const Meta = props => (
  <Head>
    <meta name='viewport' content='width=device-width, initial-scale=1' />
    <meta charSet='utf-8' />
    <link rel='stylesheet' type='text/css' href='static/nprogress.css' />
    <link rel='stylesheet' href='../static/spectre.min.css' />
    <link rel='stylesheet' href='../static/spectre-exp.min.css' />
    <link rel='stylesheet' href='../static/spectre-icons.min.css' />
    <title>{props.title ? `${props.title} | ` : ''}Staj 2019</title>
  </Head>
);

export default Meta;
