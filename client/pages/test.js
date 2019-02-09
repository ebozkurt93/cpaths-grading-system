import Nav from '../components/Nav';
import User from '../components/User';
import PleaseLogin from '../components/PleaseLogin';
import Settings from '../components/Settings';

const TestPage = props => (
  <div>
    <PleaseLogin>
      <Nav />
      <p style={{ fontWeight: 'bold' }}>Bu sayfa test amaçlı, kaldırılacak</p>
      <User>{({ data: { me } }) => me && <Settings user={me} />}</User>
    </PleaseLogin>
  </div>
);

export default TestPage;
