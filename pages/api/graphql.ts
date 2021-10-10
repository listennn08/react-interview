import { Post } from './core'
import { DocumentNode, print } from 'graphql'
import gql from 'graphql-tag'

import type { ICreateTask, ICreateUser, IUpdateTask } from 'types'

const graphqlRequest = (node: DocumentNode, variables?: any) => Post({
  query: print(node),
  variables
}).then(({ data }) => {
  if (data) {
    return data.data
  }
})

const SIGNUP = gql`
  mutation signup($name: String!, $password: String!, $manager: String) {
    signup(name: $name, password: $password, manager: $manager) {
      status
      msg
    }
  }
`

export const signup = ({ name, password, manager }: ICreateUser) =>
  graphqlRequest(SIGNUP, { name, password, manager })

const LOGIN = gql`
  mutation login($workId: String!, $password: String!) {
    login(workId: $workId, password: $password) {
      status
      data {
        token
        user {
          id
          workId
          name
          position
        }
      }
    }
  }
`
export const login = (workId: string, password: string) =>
  graphqlRequest(LOGIN, {
    workId,
    password
  })

const GET_ALL_TASKS = gql`
  query Query($id: ID!, $page: Int, $limit: Int) {
    allTasks(id: $id, page: $page, limit: $limit) {
      status
      msg
      data {
        total
        tasks {
          title
          id
          createdBy {
            id
            workId
            name
          }
          viewers
          editors
          status
          content
        }
      }
    }
  }
`

export const getAllTasks = (id: string, page: number, limit: number = 10) =>
  graphqlRequest(GET_ALL_TASKS, { id, page, limit })

const ALL_USERS = gql`
  query Query {
    allUsers {
      status
      msg
      data {
        id
        workId
        password
        name
        manager
      }
    }
  }
`

export const getAllUsers = () => graphqlRequest(ALL_USERS)

const SELECT_USER = gql`
  query Query {
    allInfluencer {
      status
      msg
      data {
        id
        workId
        name
        manager
      }
    }
  }
`
export const getAllSelectUser = () => graphqlRequest(SELECT_USER)

const SPECIFIC_TASK = gql`
  query specificTask($id: ID!, $userId: ID!) {
    specificTask(id: $id, userId: $userId) {
      status
      msg
      data {
        id
        title
        createdBy {
          id
          workId
          name
        }
        viewers
        editors
        status
        content
      }
    }
  }
`

export const getSpecificTask = (id: string, userId: string) => graphqlRequest(SPECIFIC_TASK, {
  id: id,
  userId
})


const CREATE_TASK = gql`
  mutation CreateTaskMutation(
    $title: String!,
    $createdBy: ID!,
    $viewers: [ID]!,
    $editors: [ID]!,
    $status: String!,
    $content: String,
  ) {
    createTask(
      title: $title,
      createdBy: $createdBy,
      viewers: $viewers,
      editors: $editors,
      status: $status,
      content: $content,
    ) {
      status
      msg
    }
  }
`

export const createTask = ({
  title,
  createdBy,
  viewers,
  editors,
  status = 'start',
  content
}: ICreateTask) => graphqlRequest(CREATE_TASK, {
  title,
  createdBy,
  viewers,
  editors,
  status,
  content,
})

const UPDATE_TASK = gql`
  mutation UpdateTaskMutation(
    $id: ID!,
    $viewers: [ID]!,
    $editors: [ID]!,
    $status: String!,
    $title: String!,
    $content: String
  ) {
    updateTask(
      id: $id,
      viewers: $viewers,
      editors: $editors,
      status: $status,
      title: $title,
      content: $content
    ) {
      status
      msg
    }
  }
`

export const updateTask = ({
  id,
  title,
  viewers,
  editors,
  status,
  content
}: IUpdateTask) => graphqlRequest(UPDATE_TASK, {
  id,
  title,
  viewers,
  editors,
  status,
  content,
})