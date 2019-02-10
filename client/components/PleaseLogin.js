import { Query } from 'react-apollo';
import { CURRENT_USER_QUERY } from './User';
import { endpoint } from '../config';
import { tablePageStyle } from '../helper';

const PleaseLogin = props => (
  <Query query={CURRENT_USER_QUERY} ssr={false}>
    {({ data, loading }) => {
      if (loading) return <p>Yükleniyor...</p>;
      if (!data.me) {
        return (
          <div style={tablePageStyle}>
            <p>Bu sayfaya giriş yapmadan erişilemiyor.</p>
            <a className='btn btn-primary' href={`${endpoint}/auth/google`}>
              Giriş
            </a>
          </div>
        );
      } else if (data.me && props.requiredPermissions) {
        const myPermissions = data.me.permissions;
        const matchedPermissions = myPermissions.filter(permission =>
          props.requiredPermissions.includes(permission)
        );
        if (!matchedPermissions.length) {
          return (
            <p style={tablePageStyle}>Bu sayfa için yeterli yetkiniz yok!!</p>
          );
        }
      }
      return props.children;
    }}
  </Query>
);

export default PleaseLogin;
