import Nav from '../components/Nav';
import Register from '../components/Register';
import PleaseLogin from '../components/PleaseLogin';

const RegisterPage = props => (
  <div>
    <Nav />
    <PleaseLogin>
      <Register />
    </PleaseLogin>
  </div>
);

export default RegisterPage;
