import React, { Component } from 'react';
import DisplayData from './DisplayData';
import Modal from './Modal';
import { resultConst, resultPartial } from '../data';
import { formContentStyle } from '../helper';

export default class Results extends Component {
  state = {
    modalData: null
  };
  openResultModal = (result, juryIds, users) => {
    var keys = [];
    var values = [];
    Object.keys(result).map(k => {
      if (k in resultConst) {
        values.push(result[k]);
      }
    });
    Object.keys(resultPartial).map(partial => {
      return juryIds.map(juryId => {
        const s = `${juryId}_${partial}`;
        if (s in result) {
          var r =
            typeof result[s] === 'boolean'
              ? result[s]
                ? 'E'
                : 'H'
              : result[s];
          values.push(r);
        } else {
          values.push('-');
        }
      });
    });
    Object.keys(result).map(key => {
      if (key in resultConst) {
        keys.push(resultConst[key]);
      }
    });
    Object.values(resultPartial).map(r => {
      return Object.values(juryIds).map(id => {
        keys.push(`${users.find(user => user.id === id).name} ${r}`);
      });
    });
    var res = {};
    var space = ' ';
    for (var i = 0; i < keys.length; i++) {
      if (keys[i] in res) {
        // if multiple juries have same name & lastname
        res[`${keys[i]}${space}`] = values[i];
        space += ' ';
      } else {
        res[keys[i]] = values[i];
      }
    }
    this.setState({ modalData: res });
  };
  render() {
    const { juryIds, results, users } = this.props;
    return (
      <div>
        <table className='table table-striped table-hover table-scroll'>
          <thead>
            <tr>
              {results.length > 0 &&
                Object.keys(results[0]).map(key => {
                  if (key in resultConst) {
                    return (
                      <th style={formContentStyle} key={key}>
                        {resultConst[key]}
                      </th>
                    );
                  }
                })}
              {results.length > 0 &&
                juryIds.length > 0 &&
                Object.values(resultPartial).map(r => {
                  return Object.values(juryIds).map(id => {
                    return (
                      <th style={formContentStyle} key={`${id}_${r}`}>
                        {users.find(user => user.id === id).name.split(' ')[0]}{' '}
                        {r}
                      </th>
                    );
                  });
                })}
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => {
              return (
                <tr
                  key={index}
                  onClick={() => this.openResultModal(result, juryIds, users)}
                >
                  {Object.keys(result).map(key => {
                    if (key in resultConst) {
                      return (
                        <td style={formContentStyle} key={key}>
                          {result[key]}
                        </td>
                      );
                    }
                    return;
                  })}
                  {Object.keys(resultPartial).map((partial, index) => {
                    return juryIds.map(juryId => {
                      const s = `${juryId}_${partial}`;
                      if (s in result) {
                        var r =
                          typeof result[s] === 'boolean'
                            ? result[s]
                              ? 'E'
                              : 'H'
                            : result[s];
                        return (
                          <td
                            style={{
                              ...formContentStyle
                            }}
                            key={`${index}_${juryId}_${partial}`}
                          >
                            {r}
                          </td>
                        );
                      }
                      return (
                        <td
                          style={formContentStyle}
                          key={`${index}_${juryId}_${partial}`}
                        >
                          -
                        </td>
                      );
                    });
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        {this.state.modalData && (
          <Modal
            title='Detaylar'
            closeModal={() => this.setState({ modalData: null })}
          >
            <DisplayData data={this.state.modalData} useKeyValue />
          </Modal>
        )}
      </div>
    );
  }
}
