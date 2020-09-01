const { respond, checkRequiredFields } = require('../helpers/apiHelper');
const crypto = require('../helpers/crypto');
const userController = require('../controllers/userController');
const { ERROR_POST_NOT_FOUND } = require('../constants/errors');
const postController = require('../controllers/postController');

//finds user from param :userIdOrHandle and injects into params
exports.resolveParamPost = async (req, res, next) => {
    try {
        let postId = req.params.postId;
        let userId = req.user._id;

        let postData = await postController.getPost(postId, userId);
        if (!postData) {
            throw ERROR_POST_NOT_FOUND();
        }

        req.paramPost = postData;
        next();
    } catch (error) {
        respond(res, {}, error);
    }
}