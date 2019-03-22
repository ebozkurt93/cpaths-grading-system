const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const createServer = require('./createServer');
const db = require('./db');
const server = createServer();
const express = require('express');
const passport = require('passport');
const { generateJWTToken } = require('./utils');

server.express.use(cookieParser());
// decode the JWT so we can get the user Id on each request
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(
      token,
      process.env.APP_SECRET,
      (err, result) => {
        // if token is expired or invalid return error, clear cookie from client
        if (err) {
          res.status(400).clearCookie('token');
        }
        // if token is correct, continue
        return result;
      }
    );
    // put the userId onto the req for future requests to access
    req.userId = userId;
  }
  next();
});

// Create a middleware that populates the user on each request

server.express.use(async (req, res, next) => {
  // if they aren't logged in, skip this
  if (!req.userId) return next();
  const user = await db.query.user(
    { where: { id: req.userId } },
    '{ id, email, name, permissions}'
  );
  req.user = user;
  next();
});

server.express.use(passport.initialize());
require('./passport');
server.express.use('/files', express.static('files'));

/* GET Google Authentication API. */
server.express.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
server.express.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: process.env.FRONTEND_URL,
    session: false
  }),
  async (req, res) => {
    const userInfo = req.user;
    // if we cannot get proper user info, return to client
    if (!userInfo) {
      res.redirect(process.env.FRONTEND_URL);
    }
    // we have userinfo, check if user is already registered
    const user = await db.query.user({ where: { email: userInfo.email } });
    var dbUser = null;
    //if user is not registered create new user
    if (!user) {
      const createdUser = await db.mutation.createUser({
        data: {
          name: userInfo.name,
          email: userInfo.email
          // permissions: { set: ['USER'] }
        }
      });
      dbUser = createdUser;
    }
    // get the existing user from db
    else {
      dbUser = user;
    }
    //create token and add it to response cookie
    generateJWTToken(dbUser.id, res);
    // send response w/ cookie to client
    res.redirect(`${process.env.FRONTEND_URL}/applications`);
  }
);

server.start(
  {
    playground: '/playground',
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  },
  ({ port }) => {
    console.log(`Server is now running on port http://localhost:${port}`);
  }
);
