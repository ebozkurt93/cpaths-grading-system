// const { hasPermission } = require('../utils');

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
    // if (!ctx.request.userId) {
    //   return new Error('Please login');
    // }
    // hasPermission(ctx.request.user, ['ADMIN']);
    return ctx.db.query.initialForms({}, info);
  }
};

module.exports = Query;
