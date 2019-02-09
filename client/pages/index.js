import Link from 'next/link';

const HomePage = props => (
  <div
    className='col-8 col-mx-auto bg-gray'
    style={{
      maxWidth: '800px',
      padding: '10px 10px'
    }}
  >
    <h2>Başvuru Koşulları</h2>
    <p>...</p>
    <Link href='/apply'>
      <a className='btn btn-primary'>Başvur</a>
    </Link>
  </div>
);

export default HomePage;
