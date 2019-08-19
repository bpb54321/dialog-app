exports.role = function(parent, args, context) {
  return context.prisma.line({id: parent.id}).role();
};
