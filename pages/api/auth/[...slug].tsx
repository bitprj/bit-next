import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import Adapters from 'next-auth/adapters'

// Database options - the default adapter is TypeORM
// See https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md
const database = {
  type: 'sqlite',
  database: ':memory:',
}

// NextAuth Options
const options = {
  site: process.env.SITE || 'http://localhost:3000',
  providers: [
    Providers.GitHub({
      clientId: "17ba8bd85a06575af057",
      clientSecret: "fdcb5239d089e6148566db59b86e23b0ec8a7ef8"
    })
  ],
  adapter: Adapters.Default(database)
}

export default (req, res) => NextAuth(req, res, options)