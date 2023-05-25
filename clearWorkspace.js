require('dotenv').config()

const connectDB = require('./db/connect')

const Workspace = require('./models/Workspace')


const start = async () => {
    try{
        await connectDB(process.env.MONGO_URI)
        await Workspace.deleteMany();
        console.log('Success!!!');
        process.exit(0)
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

start()