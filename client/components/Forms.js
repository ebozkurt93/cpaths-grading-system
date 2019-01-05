import gql from 'graphql-tag';
import React, { Component } from 'react';
import Link from 'next/link';
import { Query } from 'react-apollo';
import Error from './ErrorMessage';
import { endpoint } from '../config';
import { initialForm, isAFile } from '../data';
import DisplayData from './DisplayData';
import Modal from './Modal';

const GET_ALL_FORMS = gql`
  query GET_ALL_FORMS {
    forms {
      id
      email
      name
      lastname
      university
      universityYear
      universityDept
      gpa
      cv
      transcript
      longQuestion1
      longQuestion2
      longQuestion3
      longQuestion4
      aboutUs
    }
  }
`;

class Forms extends Component {
  state = {
    modalData: null,
    dataDumpVisible: false
  };
  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <Query query={GET_ALL_FORMS}>
        {({ data, loading, error }) => {
          if (loading) return <p>Yükleniyor...</p>;
          if (error) return <Error error={error} />;
          var table = (
            <div>
              <table className='table table-striped table-hover table-scroll'>
                <thead>
                  <tr>
                    <th
                      style={{
                        maxWidth: '10rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      Durum
                    </th>
                    {data.forms.length > 0 &&
                      Object.keys(data.forms[0]).map(key => {
                        if (key in initialForm) {
                          return (
                            <th
                              style={{
                                maxWidth: '10rem',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                              key={key}
                            >
                              {initialForm[key]}
                            </th>
                          );
                        }
                      })}
                  </tr>
                </thead>
                <tbody>
                  {data.forms.map((item, index) => (
                    <tr
                      key={index}
                      onClick={index => {
                        this.setState({ modalData: item });
                      }}
                    >
                      <td>
                        {
                          <Link
                            href={{
                              pathname: '/grade',
                              query: {
                                id: item.id,
                                edit: this.props.filledFormIds.has(item.id)
                              }
                            }}
                          >
                            <button className='btn btn-secondary'>
                              {this.props.filledFormIds.has(item.id)
                                ? 'Güncelle'
                                : 'Notlandır'}
                            </button>
                          </Link>
                        }
                      </td>
                      {Object.keys(item).map(key => {
                        if (key in initialForm) {
                          var content = '';
                          if (isAFile.includes(key)) {
                            content = (
                              <a
                                href={`${endpoint}/files/${item[key]}`}
                                target='_blank'
                              >
                                {initialForm[key]}
                              </a>
                            );
                          } else {
                            content = item[key];
                          }

                          return (
                            <td
                              style={{
                                maxWidth: '10rem',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                              key={key}
                            >
                              {content}
                            </td>
                          );
                        }
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          return (
            <>
              {data.forms.length < 1 && <h4>Gösterecek veri yok.</h4>}
              {data.forms && table}
              {this.state.modalData && (
                <Modal
                  title='Detaylar'
                  closeModal={() => this.setState({ modalData: null })}
                >
                  <DisplayData data={this.state.modalData} />
                </Modal>
              )}
              <button
                className='btn btn-primary'
                onClick={() =>
                  this.setState(({ dataDumpVisible }) => ({
                    dataDumpVisible: !dataDumpVisible
                  }))
                }
              >
                Bütün datayı göster
              </button>
              {this.state.dataDumpVisible && (
                <pre>{JSON.stringify(data, null, 4)}</pre>
              )}
            </>
          );
        }}
      </Query>
    );
  }
}

export default Forms;
