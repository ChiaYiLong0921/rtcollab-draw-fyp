const {StatusCodes} = require('http-status-codes')
const path = require('path')
const CustomError = require('../errors')
// const cloudinary = require('cloudinary').v2
// const fs = require('fs')

const uploadWorkspaceImage = async(req, res) =>{
    console.log(req.files);
    if(!req.files){
        throw new CustomError.BadRequestError('No file uploaded')
    }


    const WorkspaceImage = req.files.image;

    if(!WorkspaceImage.mimetype.startsWith('image')){
        throw new CustomError.BadRequestError('Please Upload Image');
    }

    const maxSize = 1024 * 1024

    if(WorkspaceImage.size > maxSize) {
        throw new CustomError.BadRequestError(`Cannot upload image more than ${maxSize/1024}KB`)
    }

    const imagePath = path.join(__dirname, '../public/upload/'+`${WorkspaceImage.name}` 
    );
    await WorkspaceImage.mv(imagePath)

    return res
        .status(StatusCodes.OK)
        .json({image:{src:`/upload/${WorkspaceImage.name}`}})
};



// const uploadProductImage = async(req, res) =>{

//     const result = await cloudinary.uploader.upload(req.files.image.tempFilePath,{
//         use_filename:true,
//         folder:'file-upload',
//     })
//     fs.unlinkSync(req.files.image.tempFilePath)
//     return res.status(StatusCodes.OK).json({image:{src:result.secure_url}})

    
// };

module.exports = {
    uploadWorkspaceImage
}