import React, { Component } from 'react';
import { injectGlobal } from 'styled-components';
import Meta from './Meta';

injectGlobal`
html, body {
  height: 100%;
  font-family: Muli,apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",sans-serif !important;
}
.btn {
  border-radius: 5px !important;
}
.div {border-radius: 5px !important;}
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
