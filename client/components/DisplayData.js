import React, { Component } from 'react';
import { endpoint } from '../config';
import { initialForm, isAFile, isADateTime } from '../data';
import { textToInnerHtml, formContentStyle } from '../helper';
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
                <h6>
                  <b>{key.trim()}</b>
                </h6>
                <p>{data[key] ? data[key] : '-'}</p>
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
                      <button
                        className='btn btn-primary'
                        style={formContentStyle}
                      >
                        {textToInnerHtml(initialForm[key])}
                      </button>
                    </a>
                  </p>
                );
              } else if (isADateTime.includes(key)) {
                content = (
                  <React.Fragment key={key}>
                    <h6>
                      <b>{textToInnerHtml(initialForm[key])}</b>
                    </h6>
                    <p key={key}>{new Date(data[key]).toLocaleString()}</p>
                  </React.Fragment>
                );
              } else {
                content = (
                  <React.Fragment key={key}>
                    {initialForm[key] !== 'Notlar' ? (
                      <>
                        <h6>
                          <b>{textToInnerHtml(initialForm[key])}</b>
                        </h6>
                        <p>{data[key] ? data[key] : '-'}</p>
                      </>
                    ) : (
                      <div className='text-error'>
                        <h6>
                          <b>Notlar</b>
                        </h6>
                        <p>{data[key] ? data[key] : '-'}</p>
                        {this.props.children}
                        <br />
                        <br />
                      </div>
                    )}
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
