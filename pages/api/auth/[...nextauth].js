import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const options = {
  site: "http://localhost:3000",
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    })
  ],
  // The 'database' option should be a connection string or TypeORM
  // configuration object https://typeorm.io/#/connection-options
  //
  // Notes:
  // * You need to install an appropriate node_module for your database!
  // * The email sign in provider requires a database but OAuth providers do not
  database: process.env.DATABASE_URL,

  // JSON Web Token options
  jwt: {
    // The JWT secret is used to encrypt and sign the JWT.
    // It is auto-generated at startup if not specified.
    // secret: 'my-secret-123',
      
    // Custom encode/decode functions for signing + encryption can be specified.
    // if you want to override what is in the JWT or how it is signed.
    // encode: async ({ secret, key, token, maxAge }) => {},
    // decode: async ({ secret, key, token, maxAge }) => {},
  
    // Easily add custom to the JWT. It is updated every time it is accessed.
    // This encrypted and signed by default and may contain sensitive information
    // as long as a reasonable secret is defined.
    /*
    set: async (token) => { 
      token.customJwtProperty = "ABC123"
      return token
    }
    */
  },

  // Control which users / accounts can sign in
  // You can use this option in conjuction with OAuth and JWT to control which
  // accounts can sign in without having to use a database.
  allowSignin: async (user, account) => {
    // Return true if user / account is allowed to sign in.
    // Return false to display an access denied message.
    return true
  },

  // You can define custom pages to override the built-in pages
  // The routes shown here are the default URLs that will be used.
  pages: {
    // signin: '/api/auth/signin',  // Displays signin buttons
    // signout: '/api/auth/signout', // Displays form with sign out button
    // error: '/api/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/api/auth/verify-request', // Used for check email page
    // newUser: null // If set, new users will be directed here on first sign in
  },

  // Use this option to enable debug messages in the console
  // debug: true, 
}

export default (req, res) => NextAuth(req, res, options)
