import gql from 'graphql-tag';
import React, { Component } from 'react';
import { Query } from 'react-apollo';
import Error from './ErrorMessage';

const GET_ALL_APPLICATIONS_QUERY = gql`
  query GET_ALL_APPLICATIONS_QUERY {
    applications {
      id
      user {
        id
        name
        email
      }
      otherinfo1
      gpa
    }
  }
`;

class Admin extends Component {
  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <Query query={GET_ALL_APPLICATIONS_QUERY}>
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
    );
  }
}

export default Admin;
