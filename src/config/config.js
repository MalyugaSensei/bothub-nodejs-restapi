const configDev = require('./config.dev.ts')
const configProd = require('./config.prod.ts')

module.exports = process.env.NODE_ENV === 'production' ? configProd.config.database : configDev.config.database