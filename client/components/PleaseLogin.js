import { Query } from 'react-apollo';
import { CURRENT_USER_QUERY } from './User';
import Login from './Login';
import Link from 'next/link';

const PleaseLogin = props => (
  <Query query={CURRENT_USER_QUERY}>
    {({ data, loading }) => {
      if (loading) return <p>Loading...</p>;
      if (!data.me) {
        return (
          <div>
            <p>You must be logged in to continue</p>
            <Login />
            <Link href="/login">
              <a>If you need to sign up click here</a>
            </Link>
          </div>
        );
      } else if (data.me && props.requiredPermissions) {
        const myPermissions = data.me.permissions;
        const matchedPermissions = myPermissions.filter(permission =>
          props.requiredPermissions.includes(permission)
        );
        if (!matchedPermissions.length) {
          return <p>You shall not pass!!!</p>;
        }
      }
      return props.children;
    }}
  </Query>
);

export default PleaseLogin;
