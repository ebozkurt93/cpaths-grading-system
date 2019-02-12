const { transport, acceptedApplicationContent } = require('../mail');
const { hasPermission } = require('../utils');
const fs = require('fs');
const uuid = require('uuid');

const fileCheck = async (filePromise, fileType) => {
  const { createReadStream, filename, mimetype } = await filePromise;
  const stream = createReadStream();
  if (mimetype.split('/')[1] !== fileType) {
    throw new Error(`${filename} isn't a valid ${fileType} document.`);
  }
  const finalFileName = await storeUploadedFile({ stream, filename }, 'pdf');
  return [finalFileName, filename];
};

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
    [cvFileName, cvOldFileName] = await fileCheck(args.cv, 'pdf');
    [transcriptFileName, transcriptOldFileName] = await fileCheck(
      args.transcript,
      'pdf'
    );
    const isInvalid = args.gpa < 3 || args.universityYear === 'Son Sınıf';
    const data = {
      ...Object.keys(args)
        .filter(key => !['cv', 'transcript'].includes(key))
        .reduce((obj, key) => {
          obj[key] = args[key];
          return obj;
        }, {}),
      cv: cvFileName,
      transcript: transcriptFileName,
      invalid: isInvalid
    };
    const application = await ctx.db.mutation.createInitialForm({
      data
    });

    const mailOptions = {
      to: data.email,
      subject: 'Kariyer Koçum Başvurunuz',
      html: acceptedApplicationContent({
        ...data,
        cv: await cvOldFileName,
        transcript: await transcriptOldFileName
      })
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
  }
  // async updatePermissions(parent, args, ctx, info) {
  //   // 1. Check if they are logged in
  //   if (!ctx.request.userId) {
  //     throw new Error('You must be logged in!');
  //   }
  //   // 2. Query the current user
  //   const currentUser = await ctx.db.query.user(
  //     { where: { id: ctx.request.userId } },
  //     info
  //   );
  //   // 3. Check if they have the permissions to do this
  //   hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE']);
  //   // 4. Update the permissions
  //   return ctx.db.mutation.updateUser(
  //     {
  //       data: {
  //         permissions: { set: args.permissions }
  //       },
  //       where: { id: args.userId }
  //     },
  //     info
  //   );
  // },
};

module.exports = Mutation;
