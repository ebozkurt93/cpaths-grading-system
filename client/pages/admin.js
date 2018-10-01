import Nav from '../components/Nav';
import PleaseLogin from '../components/PleaseLogin';
import Admin from '../components/Admin';

const AdminPage = props => (
  <div>
    <Nav />
    <PleaseLogin requiredPermissions={['ADMIN']}>
      <Admin />
    </PleaseLogin>
  </div>
);

export default AdminPage;
