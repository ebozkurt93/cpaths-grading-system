import React, { Component } from 'react';
import { result, resultPartial } from '../data';

export default class Results extends Component {
  render() {
    // const juryIds = this.props.juryIds
    // const results = this.props.results
    // const users = this.props.users
    const { juryIds, results, users } = this.props;
    return (
      <div>
        <table className='table table-striped table-hover table-scroll'>
          <thead>
            <tr>
              {results.length > 0 &&
                Object.keys(results[0]).map(key => {
                  if (key in result) {
                    return <th key={key}>{result[key]}</th>;
                  }
                })}
              {results.length > 0 &&
                juryIds.length > 0 &&
                Object.values(juryIds).map(id => {
                  console.log(users.find(user => user['id'] === id));
                  return Object.values(resultPartial).map(r => {
                    return (
                      <th key={`${id}_${r}`}>
                        {users.find(user => user.id === id).name} {r}
                      </th>
                    );
                  });
                })}
            </tr>
          </thead>
        </table>
        <pre>{JSON.stringify(users, null, 4)}</pre>
        <pre>{JSON.stringify(results, null, 4)}</pre>
        <pre>{JSON.stringify(juryIds, null, 4)}</pre>
      </div>
    );
  }
}
