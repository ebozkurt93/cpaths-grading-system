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
  forms(parent, args, ctx, info) {
    hasPermission(ctx.request.user, ['ADMIN', 'JURY']);
    const params = ctx.request.user.permissions.includes('ADMIN')
      ? {}
      : { where: { invalid: false } };
    return ctx.db.query.initialForms(params, info);
  },
  form(parent, args, ctx, info) {
    hasPermission(ctx.request.user, ['ADMIN', 'JURY']);
    return ctx.db.query.initialForm(
      {
        where: { id: args.id }
      },
      info
    );
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
