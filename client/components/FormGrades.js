import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

const GET_ALL_FORMGRADES = gql`
  query GET_ALL_FORMGRADES {
    formGrades {
      id
      form {
        id
        email
      }
    }
  }
`;

const FormGrades = props => (
  <Query {...props} query={GET_ALL_FORMGRADES}>
    {payload => props.children(payload)}
  </Query>
);

FormGrades.propTypes = {
  children: PropTypes.func.isRequired
};

export default FormGrades;
