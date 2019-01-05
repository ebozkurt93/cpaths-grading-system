import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import ErrorMessage from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const possiblePermissions = ['ADMIN', 'JURY'];

const EDIT_PERMISSIONS_MUTATION = gql`
  mutation EDIT_PERMISSIONS_MUTATION($permissions: [Permission]) {
    editYourPermissions(permissions: $permissions) {
      id
      name
      email
    }
  }
`;
class Settings extends Component {
  user = this.props.user;
  state = {
    permissions: this.user.permissions
  };

  handlePermissionChange = e => {
    const checkbox = e.target;
    // take a copy of the current permissions
    let updatedPermissions = [...this.state.permissions];
    // figure out if we need to remove or add the permission
    if (checkbox.checked) {
      // add it in
      updatedPermissions.push(checkbox.value);
    } else {
      updatedPermissions = updatedPermissions.filter(
        permission => permission !== checkbox.value
      );
    }
    this.setState({ permissions: updatedPermissions });
  };

  render() {
    var settings = (
      <>
        <h5>Kullanıcı yetkileri</h5>
        <Mutation
          mutation={EDIT_PERMISSIONS_MUTATION}
          refetchQueries={[{ query: CURRENT_USER_QUERY }]}
          variables={{
            permissions: this.state.permissions
          }}
        >
          {(editPermissions, { error, loading }) => (
            <>
              <ErrorMessage error={error} />
              <div style={{ display: 'flex' }}>
                {possiblePermissions.map(p => (
                  <label key={p} className='form-checkbox'>
                    <input
                      required
                      type='checkbox'
                      value={p}
                      disabled={loading}
                      checked={this.state.permissions.includes(p)}
                      onChange={this.handlePermissionChange}
                    />
                    <i className='form-icon' /> {p}
                  </label>
                ))}
                <button
                  className='btn btn-secondary'
                  disabled={loading}
                  onClick={editPermissions}
                >
                  Değiş{loading ? 'iyor' : 'tir'}
                </button>
              </div>
            </>
          )}
        </Mutation>
      </>
    );

    return settings;
  }
}

export default Settings;
