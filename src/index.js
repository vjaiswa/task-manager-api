require('./db/mongoose')
const express = require('express')
const app = express()
const port = process.env.PORT||PORT
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

app.listen(port,() =>{
    console.log('Server is up and listening on port '+port)
})
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

