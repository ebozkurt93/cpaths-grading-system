import ResetPassword from '../components/ResetPassword';

const ResetPage = props => (
  <ResetPassword resetToken={props.query.resetToken} />
);

export default ResetPage;
