const { hasPermission } = require('../utils');
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
    cvFileName = await fileCheck(args.cv, 'pdf');
    transcriptFileName = await fileCheck(args.transcript, 'pdf');
    const isInvalid = args.gpa < 3 || args.universityYear === 'Son Sınıf';
    const application = await ctx.db.mutation.createInitialForm({
      data: {
        ...Object.keys(args)
          .filter(key => !['cv', 'transcript'].includes(key))
          .reduce((obj, key) => {
            obj[key] = args[key];
            return obj;
          }, {}),
        cv: cvFileName,
        transcript: transcriptFileName,
        invalid: isInvalid
      }
    });
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
  }
};

module.exports = Mutation;
