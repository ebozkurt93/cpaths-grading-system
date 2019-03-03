import Nav from '../components/Nav';
import PleaseLogin from '../components/PleaseLogin';
import Forms from '../components/Forms';
import User from '../components/User';
import FormGrades from '../components/FormGrades';
import Meta from '../components/Meta';
import { tablePageStyle } from '../helper';
const ApplicationsPage = props => (
  <div>
    <Meta title='Başvurular' />
    <Nav />
    <PleaseLogin requiredPermissions={['ADMIN', 'JURY']}>
      <User>
        {({ data: { me } }) => {
          {/* return <pre>{JSON.stringify(me, null, 4)}</pre> */}
          if (me && me.permissions.includes('JURY')) {
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
