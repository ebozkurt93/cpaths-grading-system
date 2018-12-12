import Link from 'next/link';
import React from 'react';
import Router from 'next/router';
import NProgress from 'nprogress';

Router.onRouteChangeStart = () => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => {
  NProgress.done();
};
Router.onRouteChangeError = () => {
  NProgress.done();
};

const Nav = () => (
  <header>
    <section className='navbar-section'>
      <Link href='/'>
        <a className='btn btn-link'>Anasayfa</a>
      </Link>
      <Link href='/admin'>
        <a className='btn btn-link'>Bütün Formlar</a>
      </Link>
    </section>
  </header>
);

export default Nav;
