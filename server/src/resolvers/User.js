function dialogs(parent, args, context) {
  return context.prisma.user({id: parent.id}).dialogs();
}

module.exports = {
  dialogs
};