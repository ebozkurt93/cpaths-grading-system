import gql from 'graphql-tag';
import React, { Component } from 'react';
import Link from 'next/link';
import { Query, Mutation } from 'react-apollo';
import Error from './ErrorMessage';
import { endpoint } from '../config';
import { formContentStyle, textToInnerHtml } from '../helper';
import { initialForm, isAFile, isADateTime, isVisibleInTable } from '../data';
import DisplayData from './DisplayData';
import Modal from './Modal';
import EditFirstFormNote from './EditFirstFormNote';

const GET_ALL_FORMS_ALL = gql`
  query GET_ALL_FORMS_ALL {
    forms {
      id
      email
      name
      lastname
      notes
      university
      universityYear
      universityDept
      gpa
      cv
      cvAnon
      transcript
      transcriptAnon
      internshipCountry
      internshipType
      companyName
      internshipPeriod
      internshipPosition
      acceptanceLetter
      acceptanceEmail
      economicSupport
      longQuestion1
      longQuestion2
      longQuestion3
      ourPrograms
      aboutUs
      invalid
      createdAt
      updatedAt
    }
  }
`;

const GET_ALL_FORMS_JURY = gql`
  query GET_ALL_FORMS_JURY {
    forms {
      id
      university
      universityYear
      universityDept
      gpa
      cvAnon
      transcriptAnon
      internshipCountry
      internshipType
      companyName
      internshipPeriod
      internshipPosition
      economicSupport
      longQuestion1
      longQuestion2
      longQuestion3
      ourPrograms
      aboutUs
    }
  }
`;

const UPDATE_INITIALFORM_INVALID_MUTATION = gql`
  mutation UPDATE_INITIALFORM_INVALID_MUTATION($value: String!) {
    updateInvalidState(value: $value) {
      message
    }
  }
`;

class Forms extends Component {
  state = {
    modalData: null,
    changedFormIds: {},
    updateNote: null
  };

  invalidToggle = (id, e) => {
    var updated = this.state.changedFormIds;
    // check if value is updated before
    if (Object.keys(updated).includes(id)) {
      //if yes remove the update
      delete updated[id];
    } else {
      //if no add
      updated[id] = e.target.checked;
    }
    //update state to reflect changes
    this.setState({ modalData: null, changedFormIds: updated });
  };

  render() {
    const QUERY_TYPE = !this.props.filledFormIds
      ? GET_ALL_FORMS_ALL
      : GET_ALL_FORMS_JURY;
    return (
      <Query query={QUERY_TYPE} ssr={false}>
        {({ data, loading, error }) => {
          if (loading) return <p>Yükleniyor...</p>;
          if (error) return <Error error={error} />;
          var firstFormTable = (
            <div>
              <table className='table table-striped table-hover table-scroll'>
                <thead>
                  <tr>
                    {/* Visible only for ADMIN */}
                    {data.forms.length > 0 && !this.props.filledFormIds && (
                      <th style={formContentStyle}>Geçersiz</th>
                    )}
                    {/* Visible only for JURY */}
                    {data.forms.length > 0 && this.props.filledFormIds && (
                      <th style={formContentStyle}>Durum</th>
                    )}
                    {/* Visible only for ADMIN */}
                    {data.forms.length > 0 &&
                      !this.props.filledFormIds &&
                      Object.keys(data.forms[0]).map(key => {
                        if (isVisibleInTable.includes(key)) {
                          return (
                            <th style={formContentStyle} key={key}>
                              {textToInnerHtml(initialForm[key])}
                            </th>
                          );
                        }
                      })}
                    {/* Visible only for JURY */}
                    {data.forms.length > 0 &&
                      this.props.filledFormIds &&
                      Object.keys(data.forms[0]).map(key => {
                        if (key in initialForm) {
                          return (
                            <th style={formContentStyle} key={key}>
                              {textToInnerHtml(initialForm[key])}
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
                      {this.props.filledFormIds === undefined && (
                        <td>
                          <label className='form-checkbox'>
                            <input
                              type='checkbox'
                              checked={
                                Object.keys(this.state.changedFormIds).includes(
                                  item.id
                                )
                                  ? this.state.changedFormIds[item.id] // or just use !item.invalid
                                  : item.invalid
                              }
                              onChange={e => this.invalidToggle(item.id, e)}
                            />
                            <i className='form-icon' />
                          </label>
                        </td>
                      )}
                      {this.props.filledFormIds && (
                        <td>
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
                                : 'Değerlendir'}
                            </button>
                          </Link>
                        </td>
                      )}
                      {/* Visible only for ADMIN */}
                      {!this.props.filledFormIds &&
                        Object.keys(item).map(key => {
                          if (isVisibleInTable.includes(key)) {
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
                            } else if (isADateTime.includes(key)) {
                              content = new Date(item[key]).toLocaleString();
                            } else {
                              content = item[key];
                            }
                            return (
                              <td style={formContentStyle} key={key}>
                                {content}
                              </td>
                            );
                          }
                        })}
                      {/* Visible only for JURY */}
                      {this.props.filledFormIds &&
                        Object.keys(item).map(key => {
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
                            } else if (isADateTime.includes(key)) {
                              content = new Date(item[key]).toLocaleString();
                            } else {
                              content = item[key];
                            }
                            return (
                              <td style={formContentStyle} key={key}>
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
              {/* Visible only for ADMIN */}
              {data.forms.length > 0 && !this.props.filledFormIds && (
                <Mutation
                  mutation={UPDATE_INITIALFORM_INVALID_MUTATION}
                  variables={{
                    value: JSON.stringify(this.state.changedFormIds)
                  }}
                  refetchQueries={[{ query: QUERY_TYPE }]}
                >
                  {(updateInvalidValues, { error, loading }) => (
                    <button
                      className='btn btn-secondary'
                      onClick={async () => {
                        if (Object.keys(this.state.changedFormIds).length > 0) {
                          var resp = await updateInvalidValues();
                          if (
                            resp.data.updateInvalidState.message === 'Success'
                          ) {
                            this.setState({ changedFormIds: {} });
                          }
                        }
                      }}
                    >
                      {loading ? 'Güncelleniyor' : 'Geçersizleri Güncelle'}
                    </button>
                  )}
                </Mutation>
              )}
              {data.forms.length > 0 && (
                <span
                  style={
                    !this.props.filledFormIds
                      ? {
                          marginLeft: '1rem',
                          verticalAlign: 'middle'
                        }
                      : {}
                  }
                >
                  Toplam: <b>{data.forms.length}</b>
                  {data.forms[0].invalid !== undefined && (
                    <span>
                      {' - Geçerli: '}
                      <b>
                        {
                          data.forms.filter(form => form.invalid === false)
                            .length
                        }
                      </b>
                    </span>
                  )}
                  {this.props.filledFormIds && (
                    <span>
                      {' - Değerlendirmediklerim: '}
                      <b>{data.forms.length - this.props.filledFormIds.size}</b>
                    </span>
                  )}
                </span>
              )}
              {data.forms && firstFormTable}
              {this.state.modalData && (
                <Modal
                  title='Başvuru Detayları'
                  closeModal={() => this.setState({ modalData: null })}
                >
                  <DisplayData data={this.state.modalData}>
                    {data.forms.length > 0 && !this.props.filledFormIds && (
                      <button
                        className='btn'
                        onClick={() => {
                          this.setState({
                            modalData: null,
                            updateNote: this.state.modalData
                          });
                        }}
                      >
                        Not
                        {this.state.modalData.notes ? 'u Güncelle' : ' ekle'}
                      </button>
                    )}
                  </DisplayData>
                </Modal>
              )}
              {this.state.updateNote && (
                <Modal
                  title='Başvuru Notunu Güncelle'
                  closeModal={() => this.setState({ updateNote: null })}
                >
                  <EditFirstFormNote form={this.state.updateNote} />
                </Modal>
              )}
            </>
          );
        }}
      </Query>
    );
  }
}

export default Forms;
