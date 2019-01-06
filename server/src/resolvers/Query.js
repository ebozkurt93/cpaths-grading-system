const { hasPermission } = require('../utils');

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
    return ctx.db.query.initialForms({}, info);
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
  }
};

module.exports = Query;
