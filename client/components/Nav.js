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
          {me && ['ADMIN', 'JURY'].some(p => me.permissions.includes(p)) && (
            <Link href='/applications'>
              <a className='btn btn-link'>Başvurular</a>
            </Link>
          )}
          {!me && (
            <a className='btn btn-link' href={`${endpoint}/auth/google`}>
              Giriş
            </a>
          )}
          {me && (
            <>
              {me.permissions.includes('ADMIN') && (
                <Link href='/permissions'>
                  <a className='btn btn-link'>Kullanıcı Yetkileri</a>
                </Link>
              )}
              {['ADMIN', 'RESULTS'].some(p => me.permissions.includes(p)) && (
                <Link href='/results'>
                  <a className='btn btn-link'>Sonuçlar</a>
                </Link>
              )}
              <Mutation
                mutation={LOGOUT_MUTATION}
                refetchQueries={[{ query: CURRENT_USER_QUERY }]}
              >
                {logout => (
                  <a className='btn btn-link' onClick={logout}>
                    Çıkış
                  </a>
                )}
              </Mutation>
              <Link href='/test'>
                <a
                  className='btn btn-link'
                  style={{ color: 'red', fontWeight: 'bold' }}
                >
                  Test
                </a>
              </Link>
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
