import env from 'dotenv'
env.config()

const Constants = {
  PATH_HTML: __dirname + './../views/',
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT || 1111,
  COLLECTION: {
    TEST: 'test'
  },
  EXPIRE: {
    ASSESS_TOKEN: 5,
    //REFRESH_TOKEN: 3
    REFRESH_TOKEN: 20160
  },
  SECRET_KEY: 'MY_SECRET_KEY',
  JSON_RESPONSE: {
    OK: {
      code: 200,
      message: 'Success'
    },
    CREATED: {
      code: 201,
      message: 'created'
    },
    BAD_REQUEST: {
      code: 400,
      message: 'Bad Request'
    },
    NOT_FOUND: {
      code: 404,
      message: 'Not Found'
    },
    ERROR: {
      code: 500,
      message: 'Internal Server Error'
    }
  }
}

module.exports = Constants
