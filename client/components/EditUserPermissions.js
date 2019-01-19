import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { user as userFields, possiblePermissions } from '../data';

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation UPDATE_PERMISSIONS_MUTATION(
    $permissions: [Permission]
    $userId: ID!
  ) {
    updateUserPermissions(permissions: $permissions, userId: $userId) {
      id
      name
      email
      permissions
    }
  }
`;

class EditUserPermissions extends Component {
  render() {
    const users = this.props.users;
    var table = (
      <table className='table table-striped table-hover table-scroll'>
        <thead>
          <tr>
            {users.length > 0 &&
              Object.keys(users[0]).map(key => {
                if (key in userFields) {
                  return <th key={userFields[key]}>{userFields[key]}</th>;
                }
              })}
            {users.length > 0 &&
              possiblePermissions.map(permission => (
                <th key={permission}>{permission}</th>
              ))}
            {/* Adding one empty table header for permission update button */}
            <th />
          </tr>
        </thead>
        <tbody>
          {users.length > 0 &&
            users.map((user, index) => (
              <UserPermissions key={index} user={user} />
            ))}
        </tbody>
      </table>
    );
    return (
      <div>{users.length > 0 ? table : <h2>Kayıtlı kullanıcı yok.</h2>}</div>
    );
  }
}

class UserPermissions extends Component {
  state = {
    permissions: this.props.user.permissions
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
      // remove
      updatedPermissions = updatedPermissions.filter(
        permission => permission !== checkbox.value
      );
    }
    this.setState({ permissions: updatedPermissions });
  };

  render() {
    const user = this.props.user;
    return (
      <Mutation
        mutation={UPDATE_PERMISSIONS_MUTATION}
        variables={{
          permissions: this.state.permissions,
          userId: this.props.user.id
        }}
      >
        {(updatePermissions, { error, loading }) => (
          <tr>
            {Object.keys(user).map(key => {
              if (key in userFields) {
                return <td key={key}>{user[key]}</td>;
              }
            })}
            {possiblePermissions.map(permission => (
              <td key={permission}>
                <label className='form-checkbox'>
                  <input
                    type='checkbox'
                    checked={this.state.permissions.includes(permission)}
                    value={permission}
                    onChange={this.handlePermissionChange}
                  />
                  <i className='form-icon' />
                </label>
              </td>
            ))}
            {
              <td>
                <button
                  className='btn btn-secondary'
                  onClick={updatePermissions}
                >
                  Güncelle{loading ? 'niyor' : ''}
                </button>
              </td>
            }
          </tr>
        )}
      </Mutation>
    );
  }
}

export default EditUserPermissions;
