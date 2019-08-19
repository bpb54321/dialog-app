const {getUserId} = require("../utils");

exports.dialog = async function(root, args, context, info) {
  return await context.prisma.dialog({id: args.id});
};

exports.dialogs = async function(root, args, context, info) {
  const userId = getUserId(context);
  return await context.prisma.user({id: userId}).dialogs();
};

exports.users = function(root, args, context, info) {
  return context.prisma.users();
};
