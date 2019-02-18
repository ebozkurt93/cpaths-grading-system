import Link from 'next/link';
import RequestEditInitialForm from '../components/RequestEditInitialForm';

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
    <br />
    <br />
    <RequestEditInitialForm />
  </div>
);

export default HomePage;
