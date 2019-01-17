import Link from 'next/link';
import React from 'react';
import Router from 'next/router';
import NProgress from 'nprogress';
import { endpoint } from '../config';
import User, { CURRENT_USER_QUERY } from './User';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

Router.onRouteChangeStart = () => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => {
  NProgress.done();
};
Router.onRouteChangeError = () => {
  NProgress.done();
};

const LOGOUT_MUTATION = gql`
  mutation LOGOUT_MUTATION {
    logout {
      message
    }
  }
`;

const Nav = () => (
  <User>
    {({ data: { me } }) => (
      <header className='navbar'>
        <section className='navbar-section'>
          <Link href='/'>
            <a className='btn btn-link'>Anasayfa</a>
          </Link>
          <Link href='/admin'>
            <a className='btn btn-link'>Bütün Formlar</a>
          </Link>
          {!me && (
            <a className='btn btn-link' href={`${endpoint}/auth/google`}>
              Login
            </a>
          )}
          {me && (
            <>
              {me.permissions.includes('ADMIN') && (
                <Link href='/permissions'>
                  <a className='btn btn-link'>Kullanıcı Yetkileri</a>
                </Link>
              )}
              <Mutation
                mutation={LOGOUT_MUTATION}
                refetchQueries={[{ query: CURRENT_USER_QUERY }]}
              >
                {logout => (
                  <a className='btn btn-link' onClick={logout}>
                    Logout
                  </a>
                )}
              </Mutation>
            </>
          )}
        </section>
        {me && (
          <section className='navbar-section' style={{ marginRight: '.5rem' }}>
            <span style={{ verticalAlign: 'middle' }} className=''>
              {me.name} ― {me.email}
            </span>
          </section>
        )}
      </header>
    )}
  </User>
);

export default Nav;
