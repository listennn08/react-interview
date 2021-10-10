import {
  queries as taskQueries,
  mutations as taskMutations
} from './taskResolvers'
import { mutations as authMutations } from './authResolvers'
import { queries as userQueries } from './userResolvers'

export const resolvers = {
  Query: {
    ...taskQueries,
    ...userQueries,
  },

  Mutation: {
    ...taskMutations,
    ...authMutations,
  }
}
