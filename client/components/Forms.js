import gql from 'graphql-tag';
import React, { Component } from 'react';
import { Query } from 'react-apollo';
import Error from './ErrorMessage';
import Nav from './Nav';
import { endpoint, prodEndpoint } from '../config';

const GET_ALL_FORMS = gql`
  query GET_ALL_FORMS {
    forms {
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

class Forms extends Component {
  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <>
        <Nav />
        <p>
          Dosyalara{' '}
          <code>
            {process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint}
            /files/file_name
          </code>{' '}
          den erişilebilir.
        </p>
        <Query query={GET_ALL_FORMS}>
          {({ data, loading, error }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <Error error={error} />;
            return (
              <div>
                <pre>{JSON.stringify(data, undefined, 4)}</pre>
              </div>
            );
          }}
        </Query>
      </>
    );
  }
}

export default Forms;
