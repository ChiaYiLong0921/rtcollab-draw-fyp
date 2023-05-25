const mongoose = require('mongoose')

const WorkspaceSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please provide workspace name'],
        maxlength:50
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        require:[true, 'Please provide user']
    },
    image:{
        type: String,
    },
},{timestamps:true})

module.exports = mongoose.model('Workspace', WorkspaceSchema)