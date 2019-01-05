import Nav from '../components/Nav';
import PleaseLogin from '../components/PleaseLogin';
import Forms from '../components/Forms';
import User from '../components/User';
import Settings from '../components/Settings';

const AdminPage = props => (
  <div>
    <Nav />
    <User>{({ data: { me } }) => me && <Settings user={me} />}</User>
    <PleaseLogin requiredPermissions={['ADMIN', 'JURY']}>
      <Forms />
    </PleaseLogin>
  </div>
);

export default AdminPage;
