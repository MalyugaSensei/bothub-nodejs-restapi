import { config as configDev } from './config.dev'
import { config as configProd } from './config.prod'

export default process.env.NODE_ENV === 'production' ? configProd.database : configDev.database