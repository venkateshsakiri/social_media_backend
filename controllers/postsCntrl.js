const Posts = require('../models/Posts');
const Users = require('../models/Users');

module.exports = {
    createPost: createPost,
    updatePost: updatePost,
    deletePost: deletePost,
    likePost: likePost,
    getPost: getPost,
    getTimeLinePosts: getTimeLinePosts,
    getUserAllPosts:getUserAllPosts,
    uploadImage:uploadImage
}



function createPost(req, res) {
    async function createPost() {
        try {
            const newPost = new Posts(req.body);
            const savedPost = await newPost.save();
            if (savedPost) {
                res.json({
                    code: 200,
                    data: savedPost,
                    message: 'Your post uploaded successfully'
                })
            } else {
                res.json({
                    code: 401,
                    data: null,
                    message: 'Bad request'
                })
            }
        } catch (err) {
            console.log(err)
            res.json({
                code: 500,
                data: null,
                message: 'Exception error occurred'
            })
        }
    } createPost().then(function () { })
}

function updatePost(req, res) {
    async function updatePost() {
        try {
            const post = await Posts.findById(req.params.id);
            if (post.userId === req.body.userId) {
                await post.updateOne({ $set: req.body });
                res.json({
                    code: 200,
                    data: post,
                    message: 'Your posted updated successfully'
                })
            } else {
                res.json({
                    code: 403,
                    data: null,
                    message: "You can update your posts only"
                })
            }
        } catch (err) {
            console.log(err)
            res.json({
                code: 500,
                data: null,
                message: 'Exception error occurred'
            })
        }
    } updatePost().then(function () { })
}


function deletePost(req, res) {
    async function deletePost() {
        try {
            const post = await Posts.findById(req.params.id);
            if (post) {
                if (post.userId === req.body.userId) {
                    await post.deleteOne();
                    res.json({
                        code: 200,
                        data: post,
                        message: 'Your posted has been deleted!'
                    })
                } else {
                    res.json({
                        code: 403,
                        data: null,
                        message: "You can delete your posts only"
                    })
                }
            } else {
                res.json({
                    code: 403,
                    data: null,
                    message: "user id not found"
                })
            }

        } catch (err) {
            console.log(err)
            res.json({
                code: 400,
                data: null,
                message: 'Exception error occurred'
            })
        }
    } deletePost().then(function () { })
}

function likePost(req, res) {
    async function likePost() {
        try {
            const post = await Posts.findById(req.params.id);
            if (!post.likes?.includes(req.body.userId)) {
                await post.updateOne({ $push: { likes: req.body.userId } });
                res.json({
                    code: 200,
                    message: 'The post has been liked'
                })
            } else {
                await post.updateOne({ $pull: { likes: req.body.userId } });
                res.json({
                    code: 200,
                    message: 'The post has been disliked'
                })
            }

        } catch (err) {
            console.log(err)
            res.json({
                code: 400,
                data: null,
                message: 'Exception error occurred'
            })
        }
    } likePost().then(function () { })
}

function getPost(req, res) {
    async function getPost() {
        try {
            const post = await Posts.findById(req.params.id);
            if (post) {
                res.json({
                    code: 200,
                    data: post,
                    message: 'Post fetched successfully'
                })
            } else {
                res.json({
                    code: 403,
                    data: null,
                    message: "user id not found"
                })
            }
        } catch (err) {
            console.log(err)
            res.json({
                code: 400,
                data: null,
                message: 'Exception error occurred'
            })
        }
    } getPost().then(function () { })
}

function getTimeLinePosts(req, res) {
    async function getTimeLinePosts() {
        try{
        const currentUser = await Users.findById(req.params.userId);
        const userPosts = await Posts.find({userId:currentUser._id});
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId)=>{
                return Posts.find({userId:friendId});
            })
        );
        res.json({
            code:200,
            data: (userPosts.concat(...friendPosts)),
            message:'Posts fetched successfully'
        })

        }catch(err){
            console.log(err)
            res.json({
                code: 400,
                data: null,
                message: 'Exception error occurred'
            })
        }
    } getTimeLinePosts().then(function () { })
}
function getUserAllPosts(req, res) {
    async function getUserAllPosts() {
        try{
            const user = await Users.findOne({username:req.params.username});
            const posts = await Posts.find({userId:user._id});
            res.json({
                code:200,
                data:posts,
                message:"Posts fetched successfully"
            })

        }catch(err){
            console.log(err)
            res.json({
                code: 400,
                data: null,
                message: 'Exception error occurred'
            })
        }
    } getUserAllPosts().then(function () { })
}
function uploadImage(req, res) {
    async function uploadImage() {
        console.log(req.file)
        try{
            return res.status(200).json("file uploaded successfully");
        }catch(err){
            console.log(err)
            res.json({
                code: 400,
                data: null,
                message: 'Exception error occurred'
            })
        }
    }
    uploadImage().then(function () { })
}
