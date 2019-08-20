module.exports = {
        typeDefs: // Code generated by Prisma (prisma@1.34.3). DO NOT EDIT.
  // Please don't change this file manually but run `prisma generate` to update it.
  // For more information, please read the docs: https://www.prisma.io/docs/prisma-client/

/* GraphQL */ `type AggregateDialog {
  count: Int!
}

type AggregateLine {
  count: Int!
}

type AggregateRole {
  count: Int!
}

type AggregateUser {
  count: Int!
}

type BatchPayload {
  count: Long!
}

type Dialog {
  id: ID!
  name: String!
  roles(where: RoleWhereInput, orderBy: RoleOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Role!]
  lines(where: LineWhereInput, orderBy: LineOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Line!]
  user: User!
  languageCode: String!
}

type DialogConnection {
  pageInfo: PageInfo!
  edges: [DialogEdge]!
  aggregate: AggregateDialog!
}

input DialogCreateInput {
  id: ID
  name: String!
  roles: RoleCreateManyWithoutDialogInput
  lines: LineCreateManyWithoutDialogInput
  user: UserCreateOneWithoutDialogsInput!
  languageCode: String!
}

input DialogCreateManyWithoutUserInput {
  create: [DialogCreateWithoutUserInput!]
  connect: [DialogWhereUniqueInput!]
}

input DialogCreateOneWithoutLinesInput {
  create: DialogCreateWithoutLinesInput
  connect: DialogWhereUniqueInput
}

input DialogCreateOneWithoutRolesInput {
  create: DialogCreateWithoutRolesInput
  connect: DialogWhereUniqueInput
}

input DialogCreateWithoutLinesInput {
  id: ID
  name: String!
  roles: RoleCreateManyWithoutDialogInput
  user: UserCreateOneWithoutDialogsInput!
  languageCode: String!
}

input DialogCreateWithoutRolesInput {
  id: ID
  name: String!
  lines: LineCreateManyWithoutDialogInput
  user: UserCreateOneWithoutDialogsInput!
  languageCode: String!
}

input DialogCreateWithoutUserInput {
  id: ID
  name: String!
  roles: RoleCreateManyWithoutDialogInput
  lines: LineCreateManyWithoutDialogInput
  languageCode: String!
}

type DialogEdge {
  node: Dialog!
  cursor: String!
}

enum DialogOrderByInput {
  id_ASC
  id_DESC
  name_ASC
  name_DESC
  languageCode_ASC
  languageCode_DESC
}

type DialogPreviousValues {
  id: ID!
  name: String!
  languageCode: String!
}

input DialogScalarWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  name: String
  name_not: String
  name_in: [String!]
  name_not_in: [String!]
  name_lt: String
  name_lte: String
  name_gt: String
  name_gte: String
  name_contains: String
  name_not_contains: String
  name_starts_with: String
  name_not_starts_with: String
  name_ends_with: String
  name_not_ends_with: String
  languageCode: String
  languageCode_not: String
  languageCode_in: [String!]
  languageCode_not_in: [String!]
  languageCode_lt: String
  languageCode_lte: String
  languageCode_gt: String
  languageCode_gte: String
  languageCode_contains: String
  languageCode_not_contains: String
  languageCode_starts_with: String
  languageCode_not_starts_with: String
  languageCode_ends_with: String
  languageCode_not_ends_with: String
  AND: [DialogScalarWhereInput!]
  OR: [DialogScalarWhereInput!]
  NOT: [DialogScalarWhereInput!]
}

type DialogSubscriptionPayload {
  mutation: MutationType!
  node: Dialog
  updatedFields: [String!]
  previousValues: DialogPreviousValues
}

input DialogSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: DialogWhereInput
  AND: [DialogSubscriptionWhereInput!]
  OR: [DialogSubscriptionWhereInput!]
  NOT: [DialogSubscriptionWhereInput!]
}

input DialogUpdateInput {
  name: String
  roles: RoleUpdateManyWithoutDialogInput
  lines: LineUpdateManyWithoutDialogInput
  user: UserUpdateOneRequiredWithoutDialogsInput
  languageCode: String
}

input DialogUpdateManyDataInput {
  name: String
  languageCode: String
}

input DialogUpdateManyMutationInput {
  name: String
  languageCode: String
}

input DialogUpdateManyWithoutUserInput {
  create: [DialogCreateWithoutUserInput!]
  delete: [DialogWhereUniqueInput!]
  connect: [DialogWhereUniqueInput!]
  set: [DialogWhereUniqueInput!]
  disconnect: [DialogWhereUniqueInput!]
  update: [DialogUpdateWithWhereUniqueWithoutUserInput!]
  upsert: [DialogUpsertWithWhereUniqueWithoutUserInput!]
  deleteMany: [DialogScalarWhereInput!]
  updateMany: [DialogUpdateManyWithWhereNestedInput!]
}

input DialogUpdateManyWithWhereNestedInput {
  where: DialogScalarWhereInput!
  data: DialogUpdateManyDataInput!
}

input DialogUpdateOneRequiredWithoutLinesInput {
  create: DialogCreateWithoutLinesInput
  update: DialogUpdateWithoutLinesDataInput
  upsert: DialogUpsertWithoutLinesInput
  connect: DialogWhereUniqueInput
}

input DialogUpdateOneRequiredWithoutRolesInput {
  create: DialogCreateWithoutRolesInput
  update: DialogUpdateWithoutRolesDataInput
  upsert: DialogUpsertWithoutRolesInput
  connect: DialogWhereUniqueInput
}

input DialogUpdateWithoutLinesDataInput {
  name: String
  roles: RoleUpdateManyWithoutDialogInput
  user: UserUpdateOneRequiredWithoutDialogsInput
  languageCode: String
}

input DialogUpdateWithoutRolesDataInput {
  name: String
  lines: LineUpdateManyWithoutDialogInput
  user: UserUpdateOneRequiredWithoutDialogsInput
  languageCode: String
}

input DialogUpdateWithoutUserDataInput {
  name: String
  roles: RoleUpdateManyWithoutDialogInput
  lines: LineUpdateManyWithoutDialogInput
  languageCode: String
}

input DialogUpdateWithWhereUniqueWithoutUserInput {
  where: DialogWhereUniqueInput!
  data: DialogUpdateWithoutUserDataInput!
}

input DialogUpsertWithoutLinesInput {
  update: DialogUpdateWithoutLinesDataInput!
  create: DialogCreateWithoutLinesInput!
}

input DialogUpsertWithoutRolesInput {
  update: DialogUpdateWithoutRolesDataInput!
  create: DialogCreateWithoutRolesInput!
}

input DialogUpsertWithWhereUniqueWithoutUserInput {
  where: DialogWhereUniqueInput!
  update: DialogUpdateWithoutUserDataInput!
  create: DialogCreateWithoutUserInput!
}

input DialogWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  name: String
  name_not: String
  name_in: [String!]
  name_not_in: [String!]
  name_lt: String
  name_lte: String
  name_gt: String
  name_gte: String
  name_contains: String
  name_not_contains: String
  name_starts_with: String
  name_not_starts_with: String
  name_ends_with: String
  name_not_ends_with: String
  roles_every: RoleWhereInput
  roles_some: RoleWhereInput
  roles_none: RoleWhereInput
  lines_every: LineWhereInput
  lines_some: LineWhereInput
  lines_none: LineWhereInput
  user: UserWhereInput
  languageCode: String
  languageCode_not: String
  languageCode_in: [String!]
  languageCode_not_in: [String!]
  languageCode_lt: String
  languageCode_lte: String
  languageCode_gt: String
  languageCode_gte: String
  languageCode_contains: String
  languageCode_not_contains: String
  languageCode_starts_with: String
  languageCode_not_starts_with: String
  languageCode_ends_with: String
  languageCode_not_ends_with: String
  AND: [DialogWhereInput!]
  OR: [DialogWhereInput!]
  NOT: [DialogWhereInput!]
}

input DialogWhereUniqueInput {
  id: ID
}

type Line {
  id: ID!
  text: String!
  role: Role
  number: Int!
  dialog: Dialog!
}

type LineConnection {
  pageInfo: PageInfo!
  edges: [LineEdge]!
  aggregate: AggregateLine!
}

input LineCreateInput {
  id: ID
  text: String!
  role: RoleCreateOneInput
  number: Int!
  dialog: DialogCreateOneWithoutLinesInput!
}

input LineCreateManyWithoutDialogInput {
  create: [LineCreateWithoutDialogInput!]
  connect: [LineWhereUniqueInput!]
}

input LineCreateWithoutDialogInput {
  id: ID
  text: String!
  role: RoleCreateOneInput
  number: Int!
}

type LineEdge {
  node: Line!
  cursor: String!
}

enum LineOrderByInput {
  id_ASC
  id_DESC
  text_ASC
  text_DESC
  number_ASC
  number_DESC
}

type LinePreviousValues {
  id: ID!
  text: String!
  number: Int!
}

input LineScalarWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  text: String
  text_not: String
  text_in: [String!]
  text_not_in: [String!]
  text_lt: String
  text_lte: String
  text_gt: String
  text_gte: String
  text_contains: String
  text_not_contains: String
  text_starts_with: String
  text_not_starts_with: String
  text_ends_with: String
  text_not_ends_with: String
  number: Int
  number_not: Int
  number_in: [Int!]
  number_not_in: [Int!]
  number_lt: Int
  number_lte: Int
  number_gt: Int
  number_gte: Int
  AND: [LineScalarWhereInput!]
  OR: [LineScalarWhereInput!]
  NOT: [LineScalarWhereInput!]
}

type LineSubscriptionPayload {
  mutation: MutationType!
  node: Line
  updatedFields: [String!]
  previousValues: LinePreviousValues
}

input LineSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: LineWhereInput
  AND: [LineSubscriptionWhereInput!]
  OR: [LineSubscriptionWhereInput!]
  NOT: [LineSubscriptionWhereInput!]
}

input LineUpdateInput {
  text: String
  role: RoleUpdateOneInput
  number: Int
  dialog: DialogUpdateOneRequiredWithoutLinesInput
}

input LineUpdateManyDataInput {
  text: String
  number: Int
}

input LineUpdateManyMutationInput {
  text: String
  number: Int
}

input LineUpdateManyWithoutDialogInput {
  create: [LineCreateWithoutDialogInput!]
  delete: [LineWhereUniqueInput!]
  connect: [LineWhereUniqueInput!]
  set: [LineWhereUniqueInput!]
  disconnect: [LineWhereUniqueInput!]
  update: [LineUpdateWithWhereUniqueWithoutDialogInput!]
  upsert: [LineUpsertWithWhereUniqueWithoutDialogInput!]
  deleteMany: [LineScalarWhereInput!]
  updateMany: [LineUpdateManyWithWhereNestedInput!]
}

input LineUpdateManyWithWhereNestedInput {
  where: LineScalarWhereInput!
  data: LineUpdateManyDataInput!
}

input LineUpdateWithoutDialogDataInput {
  text: String
  role: RoleUpdateOneInput
  number: Int
}

input LineUpdateWithWhereUniqueWithoutDialogInput {
  where: LineWhereUniqueInput!
  data: LineUpdateWithoutDialogDataInput!
}

input LineUpsertWithWhereUniqueWithoutDialogInput {
  where: LineWhereUniqueInput!
  update: LineUpdateWithoutDialogDataInput!
  create: LineCreateWithoutDialogInput!
}

input LineWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  text: String
  text_not: String
  text_in: [String!]
  text_not_in: [String!]
  text_lt: String
  text_lte: String
  text_gt: String
  text_gte: String
  text_contains: String
  text_not_contains: String
  text_starts_with: String
  text_not_starts_with: String
  text_ends_with: String
  text_not_ends_with: String
  role: RoleWhereInput
  number: Int
  number_not: Int
  number_in: [Int!]
  number_not_in: [Int!]
  number_lt: Int
  number_lte: Int
  number_gt: Int
  number_gte: Int
  dialog: DialogWhereInput
  AND: [LineWhereInput!]
  OR: [LineWhereInput!]
  NOT: [LineWhereInput!]
}

input LineWhereUniqueInput {
  id: ID
}

scalar Long

type Mutation {
  createDialog(data: DialogCreateInput!): Dialog!
  updateDialog(data: DialogUpdateInput!, where: DialogWhereUniqueInput!): Dialog
  updateManyDialogs(data: DialogUpdateManyMutationInput!, where: DialogWhereInput): BatchPayload!
  upsertDialog(where: DialogWhereUniqueInput!, create: DialogCreateInput!, update: DialogUpdateInput!): Dialog!
  deleteDialog(where: DialogWhereUniqueInput!): Dialog
  deleteManyDialogs(where: DialogWhereInput): BatchPayload!
  createLine(data: LineCreateInput!): Line!
  updateLine(data: LineUpdateInput!, where: LineWhereUniqueInput!): Line
  updateManyLines(data: LineUpdateManyMutationInput!, where: LineWhereInput): BatchPayload!
  upsertLine(where: LineWhereUniqueInput!, create: LineCreateInput!, update: LineUpdateInput!): Line!
  deleteLine(where: LineWhereUniqueInput!): Line
  deleteManyLines(where: LineWhereInput): BatchPayload!
  createRole(data: RoleCreateInput!): Role!
  updateRole(data: RoleUpdateInput!, where: RoleWhereUniqueInput!): Role
  updateManyRoles(data: RoleUpdateManyMutationInput!, where: RoleWhereInput): BatchPayload!
  upsertRole(where: RoleWhereUniqueInput!, create: RoleCreateInput!, update: RoleUpdateInput!): Role!
  deleteRole(where: RoleWhereUniqueInput!): Role
  deleteManyRoles(where: RoleWhereInput): BatchPayload!
  createUser(data: UserCreateInput!): User!
  updateUser(data: UserUpdateInput!, where: UserWhereUniqueInput!): User
  updateManyUsers(data: UserUpdateManyMutationInput!, where: UserWhereInput): BatchPayload!
  upsertUser(where: UserWhereUniqueInput!, create: UserCreateInput!, update: UserUpdateInput!): User!
  deleteUser(where: UserWhereUniqueInput!): User
  deleteManyUsers(where: UserWhereInput): BatchPayload!
}

enum MutationType {
  CREATED
  UPDATED
  DELETED
}

interface Node {
  id: ID!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type Query {
  dialog(where: DialogWhereUniqueInput!): Dialog
  dialogs(where: DialogWhereInput, orderBy: DialogOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Dialog]!
  dialogsConnection(where: DialogWhereInput, orderBy: DialogOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): DialogConnection!
  line(where: LineWhereUniqueInput!): Line
  lines(where: LineWhereInput, orderBy: LineOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Line]!
  linesConnection(where: LineWhereInput, orderBy: LineOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): LineConnection!
  role(where: RoleWhereUniqueInput!): Role
  roles(where: RoleWhereInput, orderBy: RoleOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Role]!
  rolesConnection(where: RoleWhereInput, orderBy: RoleOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): RoleConnection!
  user(where: UserWhereUniqueInput!): User
  users(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [User]!
  usersConnection(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): UserConnection!
  node(id: ID!): Node
}

type Role {
  id: ID!
  name: String!
  dialog: Dialog!
}

type RoleConnection {
  pageInfo: PageInfo!
  edges: [RoleEdge]!
  aggregate: AggregateRole!
}

input RoleCreateInput {
  id: ID
  name: String!
  dialog: DialogCreateOneWithoutRolesInput!
}

input RoleCreateManyWithoutDialogInput {
  create: [RoleCreateWithoutDialogInput!]
  connect: [RoleWhereUniqueInput!]
}

input RoleCreateOneInput {
  create: RoleCreateInput
  connect: RoleWhereUniqueInput
}

input RoleCreateWithoutDialogInput {
  id: ID
  name: String!
}

type RoleEdge {
  node: Role!
  cursor: String!
}

enum RoleOrderByInput {
  id_ASC
  id_DESC
  name_ASC
  name_DESC
}

type RolePreviousValues {
  id: ID!
  name: String!
}

input RoleScalarWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  name: String
  name_not: String
  name_in: [String!]
  name_not_in: [String!]
  name_lt: String
  name_lte: String
  name_gt: String
  name_gte: String
  name_contains: String
  name_not_contains: String
  name_starts_with: String
  name_not_starts_with: String
  name_ends_with: String
  name_not_ends_with: String
  AND: [RoleScalarWhereInput!]
  OR: [RoleScalarWhereInput!]
  NOT: [RoleScalarWhereInput!]
}

type RoleSubscriptionPayload {
  mutation: MutationType!
  node: Role
  updatedFields: [String!]
  previousValues: RolePreviousValues
}

input RoleSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: RoleWhereInput
  AND: [RoleSubscriptionWhereInput!]
  OR: [RoleSubscriptionWhereInput!]
  NOT: [RoleSubscriptionWhereInput!]
}

input RoleUpdateDataInput {
  name: String
  dialog: DialogUpdateOneRequiredWithoutRolesInput
}

input RoleUpdateInput {
  name: String
  dialog: DialogUpdateOneRequiredWithoutRolesInput
}

input RoleUpdateManyDataInput {
  name: String
}

input RoleUpdateManyMutationInput {
  name: String
}

input RoleUpdateManyWithoutDialogInput {
  create: [RoleCreateWithoutDialogInput!]
  delete: [RoleWhereUniqueInput!]
  connect: [RoleWhereUniqueInput!]
  set: [RoleWhereUniqueInput!]
  disconnect: [RoleWhereUniqueInput!]
  update: [RoleUpdateWithWhereUniqueWithoutDialogInput!]
  upsert: [RoleUpsertWithWhereUniqueWithoutDialogInput!]
  deleteMany: [RoleScalarWhereInput!]
  updateMany: [RoleUpdateManyWithWhereNestedInput!]
}

input RoleUpdateManyWithWhereNestedInput {
  where: RoleScalarWhereInput!
  data: RoleUpdateManyDataInput!
}

input RoleUpdateOneInput {
  create: RoleCreateInput
  update: RoleUpdateDataInput
  upsert: RoleUpsertNestedInput
  delete: Boolean
  disconnect: Boolean
  connect: RoleWhereUniqueInput
}

input RoleUpdateWithoutDialogDataInput {
  name: String
}

input RoleUpdateWithWhereUniqueWithoutDialogInput {
  where: RoleWhereUniqueInput!
  data: RoleUpdateWithoutDialogDataInput!
}

input RoleUpsertNestedInput {
  update: RoleUpdateDataInput!
  create: RoleCreateInput!
}

input RoleUpsertWithWhereUniqueWithoutDialogInput {
  where: RoleWhereUniqueInput!
  update: RoleUpdateWithoutDialogDataInput!
  create: RoleCreateWithoutDialogInput!
}

input RoleWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  name: String
  name_not: String
  name_in: [String!]
  name_not_in: [String!]
  name_lt: String
  name_lte: String
  name_gt: String
  name_gte: String
  name_contains: String
  name_not_contains: String
  name_starts_with: String
  name_not_starts_with: String
  name_ends_with: String
  name_not_ends_with: String
  dialog: DialogWhereInput
  AND: [RoleWhereInput!]
  OR: [RoleWhereInput!]
  NOT: [RoleWhereInput!]
}

input RoleWhereUniqueInput {
  id: ID
}

type Subscription {
  dialog(where: DialogSubscriptionWhereInput): DialogSubscriptionPayload
  line(where: LineSubscriptionWhereInput): LineSubscriptionPayload
  role(where: RoleSubscriptionWhereInput): RoleSubscriptionPayload
  user(where: UserSubscriptionWhereInput): UserSubscriptionPayload
}

type User {
  id: ID!
  name: String!
  email: String!
  password: String!
  dialogs(where: DialogWhereInput, orderBy: DialogOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Dialog!]
}

type UserConnection {
  pageInfo: PageInfo!
  edges: [UserEdge]!
  aggregate: AggregateUser!
}

input UserCreateInput {
  id: ID
  name: String!
  email: String!
  password: String!
  dialogs: DialogCreateManyWithoutUserInput
}

input UserCreateOneWithoutDialogsInput {
  create: UserCreateWithoutDialogsInput
  connect: UserWhereUniqueInput
}

input UserCreateWithoutDialogsInput {
  id: ID
  name: String!
  email: String!
  password: String!
}

type UserEdge {
  node: User!
  cursor: String!
}

enum UserOrderByInput {
  id_ASC
  id_DESC
  name_ASC
  name_DESC
  email_ASC
  email_DESC
  password_ASC
  password_DESC
}

type UserPreviousValues {
  id: ID!
  name: String!
  email: String!
  password: String!
}

type UserSubscriptionPayload {
  mutation: MutationType!
  node: User
  updatedFields: [String!]
  previousValues: UserPreviousValues
}

input UserSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: UserWhereInput
  AND: [UserSubscriptionWhereInput!]
  OR: [UserSubscriptionWhereInput!]
  NOT: [UserSubscriptionWhereInput!]
}

input UserUpdateInput {
  name: String
  email: String
  password: String
  dialogs: DialogUpdateManyWithoutUserInput
}

input UserUpdateManyMutationInput {
  name: String
  email: String
  password: String
}

input UserUpdateOneRequiredWithoutDialogsInput {
  create: UserCreateWithoutDialogsInput
  update: UserUpdateWithoutDialogsDataInput
  upsert: UserUpsertWithoutDialogsInput
  connect: UserWhereUniqueInput
}

input UserUpdateWithoutDialogsDataInput {
  name: String
  email: String
  password: String
}

input UserUpsertWithoutDialogsInput {
  update: UserUpdateWithoutDialogsDataInput!
  create: UserCreateWithoutDialogsInput!
}

input UserWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  name: String
  name_not: String
  name_in: [String!]
  name_not_in: [String!]
  name_lt: String
  name_lte: String
  name_gt: String
  name_gte: String
  name_contains: String
  name_not_contains: String
  name_starts_with: String
  name_not_starts_with: String
  name_ends_with: String
  name_not_ends_with: String
  email: String
  email_not: String
  email_in: [String!]
  email_not_in: [String!]
  email_lt: String
  email_lte: String
  email_gt: String
  email_gte: String
  email_contains: String
  email_not_contains: String
  email_starts_with: String
  email_not_starts_with: String
  email_ends_with: String
  email_not_ends_with: String
  password: String
  password_not: String
  password_in: [String!]
  password_not_in: [String!]
  password_lt: String
  password_lte: String
  password_gt: String
  password_gte: String
  password_contains: String
  password_not_contains: String
  password_starts_with: String
  password_not_starts_with: String
  password_ends_with: String
  password_not_ends_with: String
  dialogs_every: DialogWhereInput
  dialogs_some: DialogWhereInput
  dialogs_none: DialogWhereInput
  AND: [UserWhereInput!]
  OR: [UserWhereInput!]
  NOT: [UserWhereInput!]
}

input UserWhereUniqueInput {
  id: ID
  email: String
}
`
      }
    