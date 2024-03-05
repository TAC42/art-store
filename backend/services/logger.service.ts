import fs from 'fs'

// Define a type for the log level to restrict it to specific strings
type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'

const logsDir = './logs'
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir)
}

// This function doesn't need modification, but TypeScript knows its return type is string
function getTime(): string {
    let now = new Date()
    return now.toLocaleString('he')
}

// This function benefits from a type guard, ensuring it is only true for error objects
function isError(e: any): e is Error {
    return e && e.stack && e.message
}

// Use rest parameters with type any[] to allow any type of arguments
function doLog(level: LogLevel, ...args: any[]): void {
    const strs = args.map(arg => (typeof arg === 'string' ||
        isError(arg)) ? arg : JSON.stringify(arg))

    let line = strs.join(' | ')
    line = `${getTime()} - ${level} - ${line}\n`
    fs.appendFile('./logs/backend.log', line, (err) => {
        if (err) console.log('FATAL: cannot write to log file')
    })
}

export const loggerService = {
    debug(...args: any[]) {
        doLog('DEBUG', ...args)
    },
    info(...args: any[]) {
        doLog('INFO', ...args)
    },
    warn(...args: any[]) {
        doLog('WARN', ...args)
    },
    error(...args: any[]) {
        doLog('ERROR', ...args)
    }
}

// import fs from 'fs'

// export const loggerService = {
//     debug(...args) {
//         doLog('DEBUG', ...args)
//     },
//     info(...args) {
//         doLog('INFO', ...args)
//     },
//     warn(...args) {
//         doLog('WARN', ...args)
//     },
//     error(...args) {
//         doLog('ERROR', ...args)
//     }
// }

// const logsDir = './logs'
// if (!fs.existsSync(logsDir)) {
//     fs.mkdirSync(logsDir)
// }

// //define the time format
// function getTime() {
//     let now = new Date()
//     return now.toLocaleString('he')
// }

// function isError(e) {
//     return e && e.stack && e.message
// }

// function doLog(level, ...args) {

//     const strs = args.map(arg =>
//         (typeof arg === 'string' || isError(arg)) ? arg : JSON.stringify(arg)
//     )
//     let line = strs.join(' | ')
//     line = `${getTime()} - ${level} - ${line}\n`
//     fs.appendFile('./logs/backend.log', line, (err) => {
//         if (err) console.log('FATAL: cannot write to log file')
//     })
// }