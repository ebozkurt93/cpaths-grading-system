import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

const GET_ALL_FORMGRADES = gql`
  query GET_ALL_FORMGRADES {
    formGrades {
      id
      jury {
        id
        name
        email
      }
      form {
        id
        email
        name
        lastname
      }
      score1
      score2
      score3
      boolean
      notes
    }
  }
`;
const GET_ALL_FORMGRADES_SHORT = gql`
  query GET_ALL_FORMGRADES_SHORT {
    formGrades {
      id
      form {
        id
        email
      }
    }
  }
`;

const FormGrades = props => {
  if (props.type === 'full') {
    return (
      <Query {...props} query={GET_ALL_FORMGRADES} ssr={false}>
        {payload => props.children(payload)}
      </Query>
    );
  } else {
    return (
      <Query {...props} query={GET_ALL_FORMGRADES_SHORT} ssr={false}>
        {payload => props.children(payload)}
      </Query>
    );
  }
};

FormGrades.propTypes = {
  children: PropTypes.func.isRequired
};

export default FormGrades;
