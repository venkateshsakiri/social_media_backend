const express = require('express');
const routes = express.Router();
const multer = require('multer');
const path = require("path")
const usersCntrl = require('../controllers/usersCntrl');
const postsCntrl = require('../controllers/postsCntrl')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() +"_"+ path.extname(file.originalname));
    },
})
const upload = multer({storage:storage});

// user routes
routes.post("/auth/register",usersCntrl.registerUser);
routes.post("/auth/login",usersCntrl.loginUser);
routes.put("/users/:id",usersCntrl.updateUser);
routes.delete("/users/:id",usersCntrl.deleteUser);
routes.get("/users",usersCntrl.getUser);
routes.put("/users/:id/follow",usersCntrl.followUser);
routes.put("/users/:id/unfollow",usersCntrl.unFollowUser);
routes.get("/users/friends/:userId", usersCntrl.getFriends)
//  posts routes

routes.post("/posts",postsCntrl.createPost);
routes.put("/posts/:id",postsCntrl.updatePost);
routes.delete("/posts/:id",postsCntrl.deletePost);
routes.put("/posts/:id/like",postsCntrl.likePost);
routes.get("/posts/:id",postsCntrl.getPost);
routes.get("/posts/timeline/all/:userId",postsCntrl.getTimeLinePosts);
routes.get("/posts/profile/:username", postsCntrl.getUserAllPosts)
routes.post("/posts/upload", upload.single('file'), postsCntrl.uploadImage)



module.exports = routes;