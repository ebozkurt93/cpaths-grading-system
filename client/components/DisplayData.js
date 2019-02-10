import React, { Component } from 'react';
import { endpoint } from '../config';
import { initialForm, isAFile, resultConst, resultJuryPattern } from '../data';

class DisplayData extends Component {
  render() {
    // useKeyValue uses key value pairs in the given data object as title & content
    const { data, useKeyValue } = this.props;

    const all = (
      <div>
        {data &&
          useKeyValue &&
          Object.keys(data).map((key, index) => {
            return (
              <React.Fragment key={`${key}_${index}`}>
                <h6>{key.trim()}</h6>
                <p>{data[key]}</p>
              </React.Fragment>
            );
          })}
        {data &&
          !useKeyValue &&
          Object.keys(data).map(key => {
            if (key in initialForm) {
              var content = '';
              if (isAFile.includes(key)) {
                content = (
                  <p key={key}>
                    <a href={`${endpoint}/files/${data[key]}`} target='_blank'>
                      <button className='btn btn-primary'>
                        {initialForm[key]}
                      </button>
                    </a>
                  </p>
                );
              } else {
                content = (
                  <React.Fragment key={key}>
                    <h6>{initialForm[key]}</h6>
                    <p>{data[key]}</p>
                  </React.Fragment>
                );
              }
              return content;
            }
          })}
      </div>
    );
    return data ? all : null;
  }
}
export default DisplayData;
