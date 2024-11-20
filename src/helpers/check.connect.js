'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')
const _SECONDS = 5000
//count
const countConnect = () => {
    const numConnection = mongoose.connections.length
    console.log(`Number of connection::${numConnection}`)
    return numConnection
}
//check overload
const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length
        const numCores = os.cpus().length
        const memoryUsage = process.memoryUsage().rss
        //Example maximum number of connection based on number of cores
        const maxConnections = numCores * 5

        console.log(`Active connection: ${numConnection}`)
        console.log(`Memory usage:: ${memoryUsage / 1024 / 1024} MB`)

        if (numConnection > maxConnections) {
            console.log('Connection Overload detected!') //notifysend
        }


    }, _SECONDS) //Motior every 5s
}


module.exports = {
    countConnect,
    checkOverload
}
