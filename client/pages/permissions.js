import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Nav from '../components/Nav';
import PleaseLogin from '../components/PleaseLogin';
import EditUserPermissions from '../components/EditUserPermissions';
import Meta from '../components/Meta';
import { tablePageStyle } from '../helper';

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
    <Meta title='Kullanıcı Yetkileri' />
    <Nav />
    <PleaseLogin requiredPermissions={['ADMIN']}>
      {/* TODO: PASS USERS PROP */}
      <Query query={GET_ALL_USERS_QUERY} ssr={false}>
        {({ data, loading, error }) => {
          if (loading) return <p>Yükleniyor...</p>;
          if (error) return <Error error={error} />;
          return (
            <>
              <div style={tablePageStyle}>
                <h5>Yetkiler ve açıklamaları:</h5>
                <li>
                  <b>ADMIN:</b> Başvuruları geçerli/geçersiz olarak
                  değiştirebilir, kullanıcıların yetkilerini değiştirebilir,
                  sonuçları görebilir.
                </li>
                <li>
                  <b>JURY:</b> Geçerli başvuruları görebilir, başvuruları
                  değerlendirebilir.
                </li>
                <li>
                  <b>RESULTS:</b> Sadece sonuçları görebilir.
                </li>
                <EditUserPermissions users={data.users} />
              </div>
            </>
          );
        }}
      </Query>
    </PleaseLogin>
  </div>
);

export default AdminPage;
