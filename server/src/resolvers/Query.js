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
    const user = ctx.request.user;
    if (!user) {
      throw new Error();
    }
    hasPermission(user, ['ADMIN', 'JURY']);
    const permissions = user.permissions;
    if (permissions.includes('ADMIN')) {
      return ctx.db.query.formGrades({}, info);
    } else
      return ctx.db.query.formGrades(
        {
          where: { jury: { id: user.id } }
        },
        info
      );
  }
};

module.exports = Query;
