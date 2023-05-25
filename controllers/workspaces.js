const Workspace = require('../models/Workspace')
const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')
const { rawListeners } = require('../models/User')

const getAllWorkspaces = async (req, res) =>{
    const workspaces = await User.find({_id:req.user.userId})
    console.log('check: ',workspaces[0].workspaces.length);
    let allWorkspaces = []
    for (const workspace of workspaces[0].workspaces) {
        // console.log(`${i++}: ${workspace}`);
        const currentWorkspace = await Workspace.findById(workspace)
        allWorkspaces.push(currentWorkspace)
        
    }
    // console.log("All workspaces:", allWorkspaces);
//     const jobs = await Job.find({createdBy:req.user.userId})
    res.status(StatusCodes.OK).json({allWorkspace:allWorkspaces, count:allWorkspaces.length})
// }
}

const getWorkspace = async (req, res) =>{
  const workspace = await Workspace.findOne({
    _id: req.params.id,
  });
  if (!workspace) {
    throw new NotFoundError(`No workspace with id ${req.params.id}`);
  }
    res.status(StatusCodes.OK).json({workspace})
  //     const {user:{userId}, params:{id:jobId}} = req

  //     const job = await Job.findOne({
  //         _id:jobId,createdBy:userId
  //     })
  //     if(!job){
  //         throw new NotFoundError(`No job with id ${jobId}`)
  //     }
  //     res.status(StatusCodes.OK).json({job})
}

const createWorkspace = async (req, res) =>{
    console.log('creating workspace');
    req.body.createdBy = req.user.userId
    // console.log(req.body.createdBy);
    console.log(req.user);
    const workspace = await Workspace.create(req.body)
    console.log(workspace.id);
    const user = await User.findOneAndUpdate(
        {_id:req.user.userId}, 
        { $push: { workspaces: workspace.id  } },
        
    )
    console.log(user);
    res.status(StatusCodes.CREATED).json({workspace})
}

const inviteToWorkspace = async (req, res) =>{
    console.log('req.body: ',req.body);
    console.log('req.params: ',req.params);
    console.log(req.user);
    if (!req.body.email) {
      throw new BadRequestError("Please provide email to invite");
    }

    const userInvited = await User.find(req.body)
    console.log('result from db: ',userInvited);
    if(userInvited.length < 1){
            throw new NotFoundError(`No user with email ${req.body.email}`)
        }
    console.log("UserInvited: ",userInvited);

    console.log("Workspace id to check:", req.params.id);

    const workspaceInvite = await Workspace.findById(req.params.id)
    if(!workspaceInvite){
        throw new NotFoundError(`No workspace with id ${req.params.id}`)
    }
    console.log("Workspace found: ",workspaceInvite);

    for (const workspace of userInvited[0].workspaces) {
        console.log("Compare: ", workspace);
        console.log("Request: ", req.params.id);
        if (req.params.id === workspace) {
            throw new BadRequestError('Invited user already exist in workspace')
        }
    }


    const invite = await User.findOneAndUpdate(
        {_id:userInvited[0].id}, 
        { $push: { workspaces: req.params.id  } },
        
    )
    console.log(invite);

    res.status(StatusCodes.CREATED).json({invite, status:'succeed'})
    
}

const updateWorkspace = async (req, res) =>{
    console.log("Body: ", req.body);
    console.log("User: ", req.user);
    console.log("Params: ", req.params);

    const workspace = await Workspace.findOneAndUpdate(
        {_id:req.params.id}, 
        req.body, 
        {new:true, runValidators:true})
    if (!workspace) {
      throw new NotFoundError(`No workspace with id ${req.params.id}`);
    }
    console.log("Workspace found: ", workspace);

    res.status(StatusCodes.CREATED).json({ workspace });
    // const {
    //     body:{company, position},
    //     user:{userId},
    //     params:{id:jobId}
    // } = req

    // if(company === '' || position ===''){
    //     throw new BadRequestError('Company or Position fields cannot be empty')
    // }
    // const job = await Job.findOneAndUpdate(
    //     {_id:jobId, createdBy:userId}, 
    //     req.body, 
    //     {new:true, runValidators:true})

    // if(!job){
    //     throw new NotFoundError(`No job with id ${jobId}`)
    // }
    // res.status(StatusCodes.OK).json({job})
}

const deleteWorkspace = async (req, res) =>{
    res.send('delete workspace')
    // const {user:{userId}, params:{id:jobId}} = req

    // const job = await Job.findByIdAndDelete({
    //     _id:jobId,
    //     createdBy:userId
    // })

    // if(!job){
    //     throw new NotFoundError(`No job with id ${jobId}`)
    // }
    // res.status(StatusCodes.OK).send()
}



module.exports = {
    getAllWorkspaces,
    getWorkspace,
    createWorkspace,
    inviteToWorkspace,
    updateWorkspace,
    deleteWorkspace
}