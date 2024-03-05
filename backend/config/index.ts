import dotenv from 'dotenv'
import configProd from './prod.js'
import configDev from './dev.js'
dotenv.config()

interface Config {
    dbURL: string
    dbName: string
    isGuestMode?: boolean
}

let config: Config

if (process.env.NODE_ENV === 'production') config = configProd
else config = configDev

config.isGuestMode = true

export { config }

// import dotenv from 'dotenv'
// dotenv.config()

// import configProd from './prod.js'
// import configDev from './dev.js'

// export let config

// if (process.env.NODE_ENV === 'production') {
//     config = configProd
// } else {
//     config = configDev
// }

// config.isGuestMode = true