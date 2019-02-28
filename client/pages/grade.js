import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Nav from '../components/Nav';
import PleaseLogin from '../components/PleaseLogin';
import Grade from '../components/Grade';
import DisplayData from '../components/DisplayData';
import Error from '../components/ErrorMessage';
import Meta from '../components/Meta';

const FORM_BY_ID_QUERY = gql`
  query FORM_BY_ID_QUERY($id: ID!) {
    form(id: $id) {
      id
      university
      universityYear
      universityDept
      gpa
      cvAnon
      transcriptAnon
      internshipCountry
      internshipType
      companyName
      internshipPeriod
      internshipPosition
      economicSupport
      longQuestion1
      longQuestion2
      longQuestion3
      ourPrograms
      aboutUs
    }
  }
`;

const GRADE_BY_FORM_ID_QUERY = gql`
  query GRADE_BY_FORM_ID_QUERY($initialFormId: ID!) {
    formGradeForInitialForm(initialFormId: $initialFormId) {
      score1
      score2
      score3
      boolean
      notes
    }
  }
`;

const LoginPage = ({ query }) => (
  <div>
    <Meta title='Değerlendir' />
    <Nav />
    <PleaseLogin requiredPermissions={['JURY']}>
      <Query query={FORM_BY_ID_QUERY} variables={{ id: query.id }} ssr={false}>
        {({ data: { form }, loading, error }) => {
          if (loading) return <p>Yükleniyor...</p>;
          if (error) return <Error error={error} />;

          if (form) {
            return (
              <div className='columns'>
                <div className='column col-md-12 col-6'>
                  <div className='m-2'>
                    <DisplayData data={form} />
                  </div>
                </div>
                <div className='column col-md-12 col-6'>
                  <div className='m-2'>
                    {query.edit === 'true' ? (
                      <Query
                        query={GRADE_BY_FORM_ID_QUERY}
                        variables={{ initialFormId: query.id }}
                      >
                        {({
                          data: { formGradeForInitialForm },
                          loading,
                          error
                        }) => {
                          if (loading) return <p>Yükleniyor...</p>;
                          if (error) return <Error error={error} />;
                          return (
                            <Grade
                              formId={query.id}
                              gradeData={formGradeForInitialForm}
                            />
                          );
                        }}
                      </Query>
                    ) : (
                      <Grade formId={query.id} />
                    )}
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
