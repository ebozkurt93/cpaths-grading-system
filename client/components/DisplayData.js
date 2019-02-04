import React, { Component } from 'react';
import { endpoint } from '../config';
import { initialForm, isAFile, resultConst, resultJuryPattern } from '../data';

class DisplayData extends Component {
  render() {
    const { data } = this.props;

    const all = (
      <div>
        {data &&
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
            } else if (key in resultConst) {
              return (
                <React.Fragment key={key}>
                  <h6>{resultConst[key]}</h6>
                  <p>{data[key]}</p>
                </React.Fragment>
              );
            }
            {
              /* todo: continue here */
            }
            {
              /* else if(item in resultJuryPattern) {
              if (item.endsWith[key]) {
                <React.Fragment key={key}>
                  <h6>{resultConst[key]}</h6>
                  <p>{data[key]}</p>
                </React.Fragment>
              }
            }  */
            }
          })}
      </div>
    );
    return data ? all : null;
  }
}
export default DisplayData;
