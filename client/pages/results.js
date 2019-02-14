import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Nav from '../components/Nav';
import PleaseLogin from '../components/PleaseLogin';
import ErrorMessage from '../components/ErrorMessage';
import Results from '../components/Results';
import Meta from '../components/Meta';
import { resultJuryPattern } from '../data';
import { tablePageStyle } from '../helper';

const GET_ALL_USERS_QUERY = gql`
  query GET_ALL_USERS_QUERY {
    users {
      id
      name
    }
  }
`;

const GET_RESULTS_QUERY = gql`
  query GET_RESULTS_QUERY {
    results
  }
`;

const ResultsPage = props => (
  <div>
    <Meta title='Sonuçlar' />
    <Nav />
    <PleaseLogin requiredPermissions={['ADMIN', 'RESULTS']}>
      <Query query={GET_ALL_USERS_QUERY} ssr={false}>
        {({ data: { users }, loading, error }) => {
          if (loading) return <p>Yükleniyor...</p>;
          if (error) return <ErrorMessage error={error} />;
          return (
            <Query query={GET_RESULTS_QUERY} ssr={false}>
              {({ data: { results }, loading, error }) => {
                if (loading) return <p>Yükleniyor...</p>;
                if (error) return <ErrorMessage error={error} />;
                let idList = new Set();
                JSON.parse(results).map(result => {
                  var key = null;
                  for (key in result) {
                    if (!resultJuryPattern.includes(key)) {
                      idList.add(key.split('_')[0]);
                    }
                  }
                });
                return (
                  <div style={tablePageStyle}>
                    <Results
                      users={users}
                      results={JSON.parse(results).sort(
                        (a, b) => b.total_score - a.total_score
                      )}
                      juryIds={Array.from(idList)}
                    />
                  </div>
                );
              }}
            </Query>
          );
        }}
      </Query>
    </PleaseLogin>
  </div>
);

export default ResultsPage;
