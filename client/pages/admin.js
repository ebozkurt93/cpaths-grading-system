import Nav from '../components/Nav';
import PleaseLogin from '../components/PleaseLogin';
import Forms from '../components/Forms';
import User from '../components/User';
import Settings from '../components/Settings';
import FormGrades from '../components/FormGrades';
const AdminPage = props => (
  <div>
    <Nav />
    <User>{({ data: { me } }) => me && <Settings user={me} />}</User>
    <PleaseLogin requiredPermissions={['ADMIN', 'JURY']}>
      <User>
        {({ data: { me } }) => {
          if (me.permissions.includes('JURY')) {
            return (
              <FormGrades>
                {({ data: { formGrades } }) => {
                  let filledFormIds = new Set();
                  if (formGrades) {
                    formGrades.map(fg => filledFormIds.add(fg['form']['id']));
                  }
                  return <Forms filledFormIds={filledFormIds} />;
                }}
              </FormGrades>
            );
          } else {
            return <Forms />;
          }
        }}
      </User>
      <User>
        {({ data: { me } }) =>
          me.permissions.includes('ADMIN') && (
            <FormGrades type='full'>
              {({ data: { formGrades } }) => {
                console.log(formGrades);
                return (
                  <div>
                    <h6>Grade data</h6>
                    <pre>{JSON.stringify(formGrades, null, 4)}</pre>
                  </div>
                );
              }}
            </FormGrades>
          )
        }
      </User>
    </PleaseLogin>
  </div>
);

export default AdminPage;
