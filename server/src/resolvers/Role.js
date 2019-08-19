exports.dialog = (parent, args, context) => {
  return context.prisma.role({id: parent.id}).dialog();
};
