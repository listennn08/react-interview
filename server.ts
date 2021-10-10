import next from 'next'
import express from 'express'
import jwt from 'jsonwebtoken'
import { ApolloServer } from 'apollo-server-express'
import { typeDefs } from './apollo/type-defs'
import { resolvers } from './apollo/resolvers'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })

const PORT = parseInt(process.env.PORT || '3000')
const handler = app.getRequestHandler()


app.prepare()
  .then(async () => {
    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      context: async ({ req }) => {
        let token = req.headers.authorization as string
        const secret = process.env.SECRET!
        const context = { secret }
        if (token && token !== 'null') {
          try {
            token = token.replace('Bearer ', '')
            const user = jwt.verify(token, secret)
            return { ...context, user }
          } catch (e) {
            throw new Error('Your session expired. Sign in again.')
          }
        }

        return context
      }
    })

    const server = express()
    await apolloServer.start()
    apolloServer.applyMiddleware({ app: server })
    server.all('*', (req, res) => {
      return handler(req, res)
    })

    server.listen(PORT, () => {
      console.log(`> Ready on http://localhost:${PORT}`)
      console.log(`> Apollo ready on http://localhost:${PORT}${apolloServer.graphqlPath}`)
    })
  })