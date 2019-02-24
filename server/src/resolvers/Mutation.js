const {
  transport,
  acceptedApplicationContent,
  updateApplicationContent
} = require('../mail');
const { hasPermission } = require('../utils');
const fs = require('fs');
const uuid = require('uuid');
const { randomBytes } = require('crypto');
const promisesAll = require('promises-all');

const fileCheck = async (filePromise, fileType) => {
  const { createReadStream, filename, mimetype } = await filePromise;
  const stream = createReadStream();
  if (mimetype.split('/')[1] !== fileType) {
    throw new Error(`${filename} isn't a valid ${fileType} document.`);
  }
  const finalFileName = await storeUploadedFile({ stream, filename }, 'pdf');
  return finalFileName;
};

const storeUploadedFile = async ({ stream }, filetype) => {
  const f = `${uuid.v4()}.${filetype}`;
  const path = `files/${f}`;
  new Promise((resolve, reject) =>
    stream
      .on('error', error => {
        if (stream.truncated)
          // Delete the truncated file.
          fs.unlinkSync(path);
        reject(error);
      })
      .pipe(fs.createWriteStream(path))
      .on('finish', () => resolve())
      .on('error', reject)
  );
  return f;
};

const Mutation = {
  async editYourPermissions(parent, args, ctx, info) {
    hasPermission(ctx.request.user, []);
    return ctx.db.mutation.updateUser({
      data: { permissions: { set: args.permissions } },
      where: { id: ctx.request.user.id }
    });
  },
  logout(parent, args, ctx, info) {
    ctx.response.clearCookie('token');
    return { message: 'Goodbye!' };
  },
  async registerApplication(parent, args, ctx, info) {
    const data = {
      ...Object.keys(args)
        .filter(key => !['cv', 'transcript'].includes(key))
        .reduce((obj, key) => {
          obj[key] = args[key];
          return obj;
        }, {})
    };
    // previously applied, just updating application
    if (args.token) {
      // check token validity
      const [form] = await ctx.db.query.initialForms(
        {
          where: {
            formEditToken: args.token,
            formEditTokenExpiry_gte: Date.now() - 3600000
          }
        },
        '{id, email, cv, transcript}'
      );
      if (!form) {
        throw new Error('This token is either invalid or expired!');
      }
      data['cv'] = form['cv'];
      data['transcript'] = form['transcript'];

      var toUpload = [];
      var toUploadNames = [];

      if (args.cv) {
        toUpload.push(args.cv);
        toUploadNames.push('cv');
      }
      if (args.transcript) {
        toUpload.push(args.transcript);
        toUploadNames.push('transcript');
      }
      if (toUpload.length > 0) {
        await promisesAll.all(
          toUpload.map(async (p, i) => {
            const name = await fileCheck(p, 'pdf');
            data[toUploadNames[i]] = name;
            fs.unlinkSync(`files/${form[toUploadNames[i]]}`);
          })
        );
      }

      data['email'] = form['email'];
    }
    // new application
    else {
      // check for cv and transcript
      if (args.cv == null || args.transcript == null) {
        throw new Error('CV or Transcript missing!');
      }
      const toUpload = [args.cv, args.transcript];
      const toUploadNames = ['cv', 'transcript'];
      await promisesAll.all(
        toUpload.map(async (p, i) => {
          const name = await fileCheck(p, 'pdf');
          data[toUploadNames[i]] = name;
        })
      );
    }

    const isInvalid = args.gpa < 3 || args.universityYear === 'Son Sınıf';
    data['invalid'] = isInvalid;
    delete data['token']; // if token exists just remove
    const isNew = args.token == null;
    if (isNew) {
      const application = await ctx.db.mutation.createInitialForm({
        data
      });
    } else {
      const application = await ctx.db.mutation.updateInitialForm({
        where: { email: data['email'] },
        data: { ...data, formEditToken: null, formEditTokenExpiry: null }
      });
    }
    const mailOptions = {
      to: data.email,
      subject: `Staj 2019 Başvuru${isNew ? 'nuzu Aldık' : 'nuz Güncellendi'}`,
      html: acceptedApplicationContent(data, isNew)
    };
    transport.sendMail(mailOptions);
    return { message: 'Success' };
  },
  async submitFormGrade(parent, args, ctx, info) {
    hasPermission(ctx.request.user, ['JURY']);
    // check if this user has submitted grade for this form before
    const potentialGrades = await ctx.db.query.formGrades({
      where: {
        jury: { id: ctx.request.userId },
        form: { id: args.initialFormId }
      }
    });
    // if he/she has, edit the form
    if (potentialGrades.length > 0) {
      var potentialGrade = potentialGrades[0];
      const updates = { ...args };
      delete updates.initialFormId;
      const formGrade = await ctx.db.mutation.updateFormGrade({
        data: updates,
        where: { id: potentialGrade.id }
      });
    }
    // else create a new form and save to db
    else {
      const formGrade = await ctx.db.mutation.createFormGrade({
        data: {
          score1: args.score1,
          score2: args.score2,
          score3: args.score3,
          boolean: args.boolean,
          notes: args.notes,
          jury: { connect: { id: ctx.request.userId } },
          form: { connect: { id: args.initialFormId } }
        }
      });
    }
    return { message: 'Success' };
  },
  async updateInvalidState(parent, args, ctx, info) {
    hasPermission(ctx.request.user, ['ADMIN']);
    // turning string to json object
    const value = JSON.parse(args.value);
    var idTrue = [];
    var idFalse = [];
    for (var key in value) {
      if (value[key] == true) {
        idTrue.push(key);
      }
      // checking value[key] again to prevent potential errors
      else if (value[key] == false) {
        idFalse.push(key);
      }
    }
    // do it in 2 steps:
    // select the id's which have data as true, update them
    const updateBatchTrue = await ctx.db.mutation.updateManyInitialForms({
      where: {
        id_in: idTrue
      },
      data: {
        invalid: true
      }
    });
    // select the id's which have data as false, update them
    const updateBatchFalse = await ctx.db.mutation.updateManyInitialForms({
      where: {
        id_in: idFalse
      },
      data: {
        invalid: false
      }
    });
    return { message: 'Success' };
  },
  async updateUserPermissions(parent, args, ctx, info) {
    hasPermission(ctx.request.user, ['ADMIN']);
    return await ctx.db.mutation.updateUser(
      {
        data: {
          permissions: { set: args.permissions }
        },
        where: { id: args.userId }
      },
      info
    );
  },
  async requestInitialFormEdit(parent, { email }, ctx, info) {
    // get application with that email address
    const application = await ctx.db.query.initialForm(
      { where: { email } },
      '{name}'
    );
    // if email is correct, therefore application exists, create the token and save it to db
    if (application) {
      const formEditToken = randomBytes(20).toString('hex'); // TODO: maybe make this async with promisify
      const formEditTokenExpiry = Date.now() + 3600000; // 1 hour from now
      const res = await ctx.db.mutation.updateInitialForm({
        where: { email },
        data: { formEditToken, formEditTokenExpiry }
      });
      // console.log(`${process.env.FRONTEND_URL}/apply?token=${formEditToken}`);
      const mailOptions = {
        to: email,
        subject: `Staj 2019 Başvuru Güncelleme`,
        html: updateApplicationContent({
          name: application.name,
          url: `${process.env.FRONTEND_URL}/apply?token=${formEditToken}`
        })
      };
      transport.sendMail(mailOptions);
    }
    return { message: 'Success' };
    // in any case send success message
  }
};

module.exports = Mutation;
