import React, { Component } from 'react';
import DisplayData from './DisplayData';
import Modal from './Modal';
import { resultConst, resultPartial } from '../data';
import { formContentStyle } from '../helper';

export default class Results extends Component {
  state = {
    modalData: null,
    changedFormIds: {}
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
                Object.values(juryIds).map(id => {
                  return Object.values(resultPartial).map(r => {
                    return (
                      <th style={formContentStyle} key={`${id}_${r}`}>
                        {users.find(user => user.id === id).name} {r}
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
                  onClick={index => {
                    this.setState({ modalData: result });
                  }}
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
                  {juryIds.map((juryId, index) => {
                    return Object.keys(resultPartial).map(partial => {
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
                            style={formContentStyle}
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
            <DisplayData data={this.state.modalData} />
          </Modal>
        )}
      </div>
    );
  }
}
