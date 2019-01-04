// const bcrypt = require('bcryptjs');
// const { randomBytes } = require('crypto');
// const { promisify } = require('util');
// const { hasPermission, generateJWTToken } = require('../utils');
// const { transport, createMail } = require('../mail');
const fs = require('fs');
const uuid = require('uuid');

async function fileCheck(filePromise, fileType) {
  const { stream, filename, mimetype } = await filePromise;
  if (mimetype.split('/')[1] !== fileType) {
    throw new Error(`${filename} isn't a valid ${fileType} document.`);
  }
  const finalFileName = await storeUploadedFile({ stream, filename }, 'pdf');
  return finalFileName;
}

const storeUploadedFile = ({ stream, filename }, filetype) => {
  const f = `${uuid.v4()}.${filetype}`;
  new Promise((resolve, reject) =>
    stream
      .pipe(fs.createWriteStream(`files/${f}`))
      .on('finish', () => resolve())
      .on('error', reject)
  );
  return f;
};

const Mutation = {
  /*
  async signup(parent, args, ctx, info) {
    // lowercase their email
    args.email = args.email.toLowerCase();
    // hash their password
    const password = await bcrypt.hash(args.password, 10);
    // create the user in the database
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ['USER'] }
        }
      },
      info
    );
    // create the JWT token for them
    generateJWTToken(user.id, ctx);
    // return the user to the browser
    return user;
  },
  async login(parent, { email, password }, ctx, info) {
    // 1. check if there is a user with that email
    const user = await ctx.db.query.user({ where: { email } });
    // 2. Check if their password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!user || !valid) {
      throw new Error('Invalid email/password');
    }
    // 3. generate the JWT Token
    generateJWTToken(user.id, ctx);
    // 4. Return the user
    return user;
  },
  logout(parent, args, ctx, info) {
    ctx.response.clearCookie('token');
    return { message: 'Goodbye!' };
  },
  async requestPasswordReset(parent, args, ctx, info) {
    // 1. Check if this is a real user
    const user = await ctx.db.query.user({ where: { email: args.email } });
    if (!user) {
      throw new Error(`No such user found for email ${args.email}`);
    }
    // 2. Set a reset token and expiry on that user
    const randomBytesPromisified = promisify(randomBytes);
    const resetToken = (await randomBytesPromisified(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry }
    });
    // 3. Email them that reset token
    const mailRes = await transport.sendMail({
      from: 'demo@example.com',
      to: user.email,
      subject: 'Your Password Reset Token',
      html: createMail(`Your Password Reset Token is here!
      \n\n
      <a href="${
        process.env.FRONTEND_URL
      }/reset?resetToken=${resetToken}">Click Here to Reset</a>`)
    });

    // 4. Return the message
    return { message: 'Thanks!' };
  },
  async resetPassword(parent, args, ctx, info) {
    // 1. check if the passwords match
    if (args.password !== args.confirmPassword) {
      throw new Error("Passwords don't match!");
    }
    // 2. check if its a legit reset token
    // 3. Check if its expired
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000
      }
    });
    if (!user) {
      throw new Error('This token is either invalid or expired!');
    }
    // 4. Hash their new password
    const password = await bcrypt.hash(args.password, 10);
    // 5. Save the new password to the user and remove old resetToken fields
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null
      }
    });
    // 6. Generate JWT
    // 7. Set the JWT cookie
    generateJWTToken(user.id, ctx);
    // 8. return the new user
    return updatedUser;
  },
  */

  async editYourPermissions(parent, args, ctx, info) {
    // hasPermission(ctx.request.user, ["ADMIN"]);
    if (!ctx.request.user) {
      throw new Error('--');
    }
    return ctx.db.mutation.updateUser({
      data: { permissions: args.permissions },
      where: { id: ctx.request.user.id }
    });
  },
  logout(parent, args, ctx, info) {
    ctx.response.clearCookie('token');
    return { message: 'Goodbye!' };
  },
  async registerApplication(parent, args, ctx, info) {
    // const { stream, filename, mimetype } = await args.cv;
    // if (mimetype.split('/')[1] !== 'pdf') {
    //   throw new Error(`${filename} isn't a valid pdf document.`);
    // }
    // const cvFileName = await storeUploadedFile({ stream, filename }, 'pdf');

    cvFileName = await fileCheck(args.cv, 'pdf');
    transcriptFileName = await fileCheck(args.transcript, 'pdf');

    const application = await ctx.db.mutation.createInitialForm({
      data: {
        ...Object.keys(args)
          .filter(key => !['cv', 'transcript'].includes(key))
          .reduce((obj, key) => {
            obj[key] = args[key];
            return obj;
          }, {}),
        cv: cvFileName,
        transcript: transcriptFileName
      }
    });
    return { message: 'Success' };
  }
};

module.exports = Mutation;
