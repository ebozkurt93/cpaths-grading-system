const jwt = require('jsonwebtoken');

function hasPermission(user, permissionsNeeded) {
  const matchedPermissions = user.permissions.filter(permissionTheyHave =>
    permissionsNeeded.includes(permissionTheyHave)
  );
  if (!matchedPermissions.length) {
    throw new Error('You do not have sufficient permissions');
  }
}

exports.hasPermission = hasPermission;
exports.generateJWTToken = generateJWTToken;

function generateJWTToken(userId, ctx) {
  const token = jwt.sign({ userId }, process.env.APP_SECRET);
  // We set the jwt as a cookie on the response
  ctx.response.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
  });
}
