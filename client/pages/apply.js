import FirstForm from '../components/FirstForm';
import Meta from '../components/Meta';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import ErrorMessage from '../components/ErrorMessage';
import Error from 'next/error';

const FORM_BY_TOKEN_QUERY = gql`
  query FORM_BY_TOKEN_QUERY($token: String!) {
    formByToken(token: $token) {
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

const ApplyPage = ({ query }) => {
  var content = <FirstForm />;
  if (query.token) {
    content = (
      <Query
        query={FORM_BY_TOKEN_QUERY}
        variables={{ token: query.token }}
        ssr={false}
      >
        {({ data: { formByToken }, loading, error }) => {
          if (loading) return <p>Yükleniyor...</p>;
          if (error) return <ErrorMessage error={error} />;
          if (formByToken) {
            return <FirstForm oldForm={formByToken} token={query.token} />;
          }
          return <Error statusCode='400' />;
        }}
      </Query>
    );
  }
  return (
    <div>
      <Meta title={query.token ? 'Başvurunu Güncelle' : 'Başvur'} />
      {content}
    </div>
  );
};

export default ApplyPage;
