import React, { Component } from 'react';
import { injectGlobal } from 'styled-components';
import Meta from './Meta';

injectGlobal`
html, body {
  height: 100%;
}
`;
class Page extends Component {
  render() {
    return (
      <div className='bg-gray' style={{ minHeight: '100vh' }}>
        <Meta />
        {this.props.children}
      </div>
    );
  }
}

export default Page;
