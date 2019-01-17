import React, { Component } from 'react';
import { user as userFields } from '../data';

class EditUserPermissions extends Component {
  render() {
    const users = this.props.users;
    var table = (
      <table className='table table-striped table-hover table-scroll'>
        <thead>
          <tr>
            {users.length > 0 &&
              Object.keys(users[0]).map(key => {
                console.log(key);
                console.log(userFields);
                if (key in userFields) {
                  console.log(key);
                  return <th key={userFields[key]}>{userFields[key]}</th>;
                }
              })}
          </tr>
        </thead>
        <tbody>
          {users.length > 0 &&
            users.map((user, index) => (
              <tr key={index}>
                {Object.keys(user).map(key => {
                  if (key in userFields) {
                    return <td key={key}>{user[key]}</td>;
                  }
                })}
              </tr>
            ))}
        </tbody>
      </table>
    );
    return <div>{users.length > 0 ? table : <p>asda</p>}</div>;
  }
}
export default EditUserPermissions;
