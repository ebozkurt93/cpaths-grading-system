import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import User from './User';
import Logout from './Logout';

const StyledDiv = styled.div`
  border: 1px solid blue;
  padding: 10px;
  margin-bottom: 5px;
`;

const Nav = () => (
  <User>
    {({ data: { me } }) => (
      <StyledDiv>
        <h3>
          <Link href="/">
            <a>Home</a>
          </Link>
        </h3>
        {me && (
          <>
            <p>
              Logged In User → {me.name} - {me.email} - Permissions:{' '}
              {me.permissions.join(' / ')}
            </p>
            <Link href="/">
              <a>
                <Logout />
              </a>
            </Link>
          </>
        )}
        {!me && (
          <h3>
            <Link href="/login">
              <a>Login</a>
            </Link>
          </h3>
        )}
        <h3>
          <Link href="/register">
            <a>Apply</a>
          </Link>
        </h3>
        {me &&
          me.permissions.includes('ADMIN') && (
            <h3>
              <Link href="/admin">
                <a>Admin Panel</a>
              </Link>
            </h3>
          )}
      </StyledDiv>
    )}
  </User>
);

export default Nav;
