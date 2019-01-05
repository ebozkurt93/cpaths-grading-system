import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Nav from '../components/Nav';
import PleaseLogin from '../components/PleaseLogin';
import Grade from '../components/Grade';
import DisplayData from '../components/DisplayData';
import Error from '../components/ErrorMessage';

const FORM_BY_ID_QUERY = gql`
  query FORM_BY_ID_QUERY($id: ID!) {
    form(id: $id) {
      id
      email
      name
      lastname
      university
      universityYear
      universityDept
      gpa
      cv
      transcript
      longQuestion1
      longQuestion2
      longQuestion3
      longQuestion4
      aboutUs
    }
  }
`;

const LoginPage = ({ query }) => (
  <div>
    <Nav />
    <PleaseLogin requiredPermissions={['JURY']}>
      <Query query={FORM_BY_ID_QUERY} variables={{ id: query.id }}>
        {({ data: { form }, loading, error }) => {
          if (loading) return <p>Yükleniyor...</p>;
          if (error) return <Error error={error} />;

          if (form) {
            return (
              <div className='columns'>
                <div className='column col-6'>
                  <div className='m-2'>
                    <DisplayData data={form} />;
                  </div>
                </div>
                <div className='column col-6'>
                  <div
                    style={{
                      position: 'fixed',
                      width: '49%',
                      height: '100%',
                      padding: '0'
                    }}
                    className='m-2'
                  >
                    <Grade formId={query.id} edit={query.edit} />
                  </div>
                </div>
              </div>
            );
          } else return null;
        }}
      </Query>
    </PleaseLogin>
  </div>
);

export default LoginPage;
