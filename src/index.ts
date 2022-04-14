import { buildSchema } from "graphql"
import express from "express"
import { graphqlHTTP } from "express-graphql"

// Dummy data
const users = [
  {id: 1, name: "John Doe", email: "johndoe@gmail.com"},
  {id: 2, name: "Jane Doe", email: "janedoe@gmail.com"},
  {id: 3, name: "Mike Doe", email: "mikedoe@gmail.com"}
]

// GraphQL schema
const schema = buildSchema(`
  input UserInput {
    email: String!
    name: String!
  }

  type User {
    id: Int!
    name: String!
    email: String!
  }

  type Mutation {
    createUser(input: UserInput): User
    updateUser(id: Int!, input: UserInput): User
  }

  type Query {
    getUser(id: Int): User
    getUsers: [User]
  }
`)

// Ts Types
type User = {
  id: number
  name: string
  email: string
}
type UserInput = Pick<User, "email" | "name">

// Resolvers
const getUser = (args: {id: number}): User | undefined => users.find(u => u.id === args.id)
const getUsers = (): User[] => users
const createUser = (args: {input: UserInput}): User => {
  const newUser:User = {...args.input, id: users.length}
  users.push(newUser)
  return newUser
}
const updateUser = (args: {id: number, input: UserInput}): User | undefined => {
  users.map(u => u.id === args.id ? {...u, ...args.input} : u)
  return users.find(u => u.id === args.id)
}

const root = {
  getUser,
  getUsers,
  createUser,
  updateUser
}

const app = express()
app.use('/graphql',  graphqlHTTP({schema, rootValue: root, graphiql: true}))

const PORT = 8000
app.listen(PORT, () => {
  console.log(`Running a GraphQL API server at http://localhost:${PORT}`);
  
})

