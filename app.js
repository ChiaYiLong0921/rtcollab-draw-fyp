require('dotenv').config()
require('express-async-errors');

const express = require('express')
const app = express()

const fileUpload = require('express-fileupload')

// database
const connectDB = require('./db/connect')

const authenticateUser = require('./middleware/authentication')

// routers
const authRouter = require('./routes/auth')
const workspaceRouter = require('./routes/workspaces')

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.static('./public'))
app.use(express.json());
app.use(fileUpload())

app.get('/',(req,res)=>{
  res.render('./public/login')
})

// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/workspace', authenticateUser, workspaceRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);




const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();