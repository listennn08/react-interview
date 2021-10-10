import gql from 'graphql-tag'

export const typeDefs = gql`
  type User {
    id: ID!
    workId: String!
    password: String!
    name: String!
    manager: ID
    position: String!
  }

  type Task {
    id: ID!
    title: String!
    createdBy: User!
    viewers: [ID]!
    editors: [ID]!
    status: String!
    content: String!
  }

  type Status {
    status: Boolean
    msg: String
  }

  type Token {
    token: String!
  }

  type Login {
    status: Boolean
    msg: String
    data: LoginData
  }

  type LoginUser {
    id: ID!
    workId: String!
    name: String!
    manager: ID
    position: String!
  }

  type LoginData {
    token: String!
    user: LoginUser!
  }

  type getTask {
    status: Boolean
    msg: String
    data: Task
  }

  type AllTasks {
    total: Int!
    tasks: [Task]
  }

  type getAllTasks {
    status: Boolean
    msg: String
    data: AllTasks
  }

  type allUsers {
    status: Boolean
    msg: String
    data: [User]
  }

  type Query {
    allTasks(id: ID!, page: Int, limit: Int): getAllTasks
    specificTask(id: ID!, userId: ID!): getTask
    allUsers: allUsers
    allInfluencer: allUsers
  }

  type Signup {
    status: Boolean!
    msg: String!
    data: String
  }

  type Mutation {
    createTask(title: String!, createdBy: ID!, viewers: [ID]!, editors: [ID]!, status: String!, content: String): Status
    updateTask(id: ID!, title: String!, viewers: [ID]!, editors: [ID]!, status: String!, content: String): Status
    signup(name: String!, password: String!, manager: String): Signup
    login(workId: String!, password: String!): Login
    logout(token: String!): Token
  }
`
