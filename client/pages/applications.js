import Nav from '../components/Nav';
import PleaseLogin from '../components/PleaseLogin';
import Forms from '../components/Forms';
import User from '../components/User';
import FormGrades from '../components/FormGrades';
import { tablePageStyle } from '../helper';
const ApplicationsPage = props => (
  <div>
    <Nav />
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
                  return (
                    <div style={tablePageStyle}>
                      <Forms filledFormIds={filledFormIds} />
                    </div>
                  );
                }}
              </FormGrades>
            );
          } else {
            return (
              <div style={tablePageStyle}>
                <Forms style={tablePageStyle} />
              </div>
            );
          }
        }}
      </User>
    </PleaseLogin>
  </div>
);

export default ApplicationsPage;
