import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Nav from '../components/Nav';
import PleaseLogin from '../components/PleaseLogin';
import User from '../components/User';
import EditUserPermissions from '../components/EditUserPermissions';

const GET_ALL_USERS_QUERY = gql`
  query GET_ALL_USERS_QUERY {
    users {
      id
      name
      email
      permissions
    }
  }
`;

const AdminPage = props => (
  <div>
    <Nav />
    <PleaseLogin requiredPermissions={['ADMIN']}>
      {/* TODO: PASS USERS PROP */}
      <Query query={GET_ALL_USERS_QUERY} ssr={true}>
        {({ data, loading, error }) => {
          if (loading) return <p>Yükleniyor...</p>;
          if (error) return <Error error={error} />;
          return <EditUserPermissions users={data.users} />;
        }}
      </Query>
    </PleaseLogin>
  </div>
);

export default AdminPage;
