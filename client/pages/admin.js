import Nav from '../components/Nav';
import PleaseLogin from '../components/PleaseLogin';
import Forms from '../components/Forms';
// import Admin from '../components/Admin';

const AdminPage = props => (
  <div>
    {/* <Nav /> */}
    {/* <PleaseLogin requiredPermissions={['ADMIN']}>
      <Admin />
    </PleaseLogin> */}
    <Forms />
  </div>
);

export default AdminPage;
