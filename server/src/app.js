const { prisma } = require('./generated/prisma-client');
const { GraphQLServer } = require('graphql-yoga');
const Dialog = require("./resolvers/Dialog");
const Line = require("./resolvers/Line");
const Mutation = require("./resolvers/Mutation");
const Query = require("./resolvers/Query");
const Role = require("./resolvers/Role");
const User = require("./resolvers/User");

const resolvers = {
  Dialog,
  Line,
  Mutation,
  Query,
  Role,
  User,
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: (request) => {
    return {
      ...request,
      prisma,
    };
  },
});

server.start({
  cors: {
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
},() => console.log(`Server is running on http://localhost:4000`));
