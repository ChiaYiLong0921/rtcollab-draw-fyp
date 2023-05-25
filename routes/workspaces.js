const express = require('express')
const router = express.Router()

const {
    getAllWorkspaces,
    getWorkspace,
    createWorkspace,
    inviteToWorkspace,
    updateWorkspace,
    deleteWorkspace
} = require('../controllers/workspaces')
const { uploadWorkspaceImage } = require("../controllers/uploadsController");

router.route('/').post(createWorkspace).get(getAllWorkspaces)
router.route('/:id').get(getWorkspace).delete(deleteWorkspace).patch(updateWorkspace)
router.route('/:id/invite').post(inviteToWorkspace)
router.route("/:id/upload").post(uploadWorkspaceImage);

module.exports = router