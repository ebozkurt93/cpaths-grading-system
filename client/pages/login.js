import Login from '../components/Login';
import Signup from '../components/Signup';
import RequestResetPassword from '../components/RequestResetPassword';
import Nav from '../components/Nav';

const LoginPage = props => (
  <div>
    <Nav />
    <Signup />
    <Login />
    <RequestResetPassword />
  </div>
);

export default LoginPage;
