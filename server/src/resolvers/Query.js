const { hasPermission } = require('../utils');

var cachedResults = null;

const Query = {
  me(parent, args, ctx, info) {
    // check if there is a current user ID
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId }
      },
      info
    );
  },
  async forms(parent, args, ctx, info) {
    hasPermission(ctx.request.user, ['ADMIN', 'JURY']);
    const params = ctx.request.user.permissions.includes('ADMIN')
      ? {}
      : { where: { invalid: false } };
    const i = ctx.request.user.permissions.includes('ADMIN')
      ? info
      : '{id, university, universityYear, universityDept, gpa, cvAnon, transcriptAnon, internshipCountry, internshipType, companyName, internshipPeriod, internshipPosition, economicSupport, longQuestion1, longQuestion2, longQuestion3, ourPrograms, aboutUs}';
    return ctx.db.query.initialForms(params, i);
  },
  async form(parent, args, ctx, info) {
    hasPermission(ctx.request.user, ['ADMIN', 'JURY']);
    const form = await ctx.db.query.initialForm(
      {
        where: { id: args.id }
      },
      info
    );
    if (!ctx.request.user.permissions.includes('ADMIN')) {
      delete form.invalid;
      delete form.name;
      delete form.lastname;
      delete form.cv;
      delete form.transcript;
      delete form.acceptanceLetter;
      delete form.acceptanceEmail;
      delete form.notes;
    }
    return form;
  },
  async formByToken(parent, args, ctx, info) {
    const [form] = await ctx.db.query.initialForms(
      {
        where: {
          formEditToken: args.token,
          formEditTokenExpiry_gte: Date.now() - 3600000
        }
      },
      info
    );
    if (!form) {
      throw new Error('This token is either invalid or expired!');
    }
    /*  prevent invalid field being asked, could have done this differently like
        creating another type at schema, but not worth for 1 method */
    return form;
  },
  formGrades(parent, args, ctx, info) {
    hasPermission(ctx.request.user, ['ADMIN', 'JURY']);
    const permissions = ctx.request.user.permissions;
    if (permissions.includes('ADMIN')) {
      return ctx.db.query.formGrades({}, info);
    } else
      return ctx.db.query.formGrades(
        {
          where: { jury: { id: ctx.request.user.id } }
        },
        info
      );
  },
  async formGradeForInitialForm(parent, args, ctx, info) {
    hasPermission(ctx.request.user, ['JURY']);
    const temp = await ctx.db.query.formGrades(
      {
        where: {
          jury: { id: ctx.request.user.id },
          form: { id: args.initialFormId }
        }
      },
      info
    );
    return temp[0] || [];
  },
  users(parent, args, ctx, info) {
    hasPermission(ctx.request.user, ['ADMIN', 'RESULTS']);
    return ctx.db.query.users({}, info);
  },
  async results(parent, args, ctx, info) {
    hasPermission(ctx.request.user, ['ADMIN', 'RESULTS']);
    if (cachedResults != null) {
      return cachedResults;
    }
    // TODO add caching for result of this function, and a way to reset cache
    // const userData = await ctx.db.query.users();
    const gradeData = await ctx.db.query.formGrades(
      { where: { form: { invalid: false } } },
      '{id, jury { id }, form { id }, score1, score2, score3, boolean, notes}'
    );
    const applicantData = await ctx.db.query.initialForms(
      { where: { invalid: false } },
      '{id, email, name, lastname}'
    );
    var results = [];
    var lst = {};
    applicantData.map((applicant, index) => {
      var temp = { ...applicant };
      temp['total_score'] = 0;
      results.push(temp);
      lst[applicant.id] = index;
    });
    gradeData.map(grade => {
      var index = lst[grade['form']['id']];
      if (index != null || index < results.length) {
        var temp = results[index];
        const scores = grade['score1'] + grade['score2'] + grade['score3'];
        temp['total_score'] += scores;
        temp[`${grade['jury']['id']}_score`] = scores;
        temp[`${grade['jury']['id']}_yn`] = grade['boolean'];
        temp[`${grade['jury']['id']}_notes`] = grade['notes'];
        results[index] = temp;
      }
    });

    //todo: uncomment for caching
    // cachedResults = JSON.stringify(results);
    return JSON.stringify(results);
  }
};

module.exports = Query;
