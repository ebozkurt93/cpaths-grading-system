import { Query } from 'react-apollo';
import Link from 'next/link';
import { CURRENT_USER_QUERY } from './User';
import Login from './Login';
import { endpoint } from '../config';

const PleaseLogin = props => (
  <Query query={CURRENT_USER_QUERY}>
    {({ data, loading }) => {
      if (loading) return <p>Loading...</p>;
      if (!data.me) {
        return (
          <div>
            <p>Bu sayfaya giriş yapmadan erişilemiyor.</p>
            <a className='btn btn-primary' href={`${endpoint}/auth/google`}>
              Login
            </a>
          </div>
        );
      } else if (data.me && props.requiredPermissions) {
        const myPermissions = data.me.permissions;
        const matchedPermissions = myPermissions.filter(permission =>
          props.requiredPermissions.includes(permission)
        );
        if (!matchedPermissions.length) {
          return <p>Bu sayfa için yeterli yetkiniz yok!!</p>;
        }
      }
      return props.children;
    }}
  </Query>
);

export default PleaseLogin;
