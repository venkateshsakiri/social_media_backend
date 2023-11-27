const Users = require('../models/Users');

module.exports = {
    registerUser: registerUser,
    loginUser: loginUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    getUser: getUser,
    followUser: followUser,
    unFollowUser:unFollowUser,
    getFriends:getFriends

}

function registerUser(req, res) {
    async function registerUser() {
        try {
            const user = new Users({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            })

            let existingEmail = await Users.findOne({ email: req.body.email, username: req.body.username });
            if (existingEmail) {
                res.json({
                    code: 200,
                    data: null,
                    message: 'Email already exist'
                })
            } else {
                let results = await Users.insertMany(user);
                if (results) {
                    res.json({
                        code: 200,
                        data: results,
                        message: 'user registered successfully'
                    })
                } else {
                    res.json({
                        code: 200,
                        data: null,
                        message: 'Required fields are missing'
                    })
                }
            }

        } catch (err) {
            console.log(err)
            res.json({
                code: 400,
                data: null,
                message: 'Exception error occurred'
            })
        }
    } registerUser().then(function () { })
}

function loginUser(req, res) {
    async function loginUser() {
        try {
            const user = await Users.findOne({ email: req.body.email });
            if (!user && res.status(404)) {
                res.json({
                    data: null,
                    message: 'user not found'
                })
            } else if (user.password !== req.body.password) {
                res.json({
                    data: null,
                    message: 'wrong password'
                })
            } else {
                res.json({
                    code: 200,
                    data: user,
                    message: 'User login successfully'
                })
            }
        } catch (err) {
            res.json({
                code: 400,
                data: null,
                message: 'Exception error occurred'
            })
        }
    } loginUser().then(function () { })
}

function updateUser(req, res) {
    async function updateUser() {
        try {
            if (req.body.userId === req.params.id || req.body.isAdmin) {
                const user = await Users.findByIdAndUpdate(req.params.id, {
                    $set: req.body
                })
                if (user) {
                    res.json({
                        code: 200,
                        data: await Users.findById(req.body.userId),
                        message: 'Account has been updated'
                    })
                }
            } else {
                res.json({
                    code: 403,
                    data: null,
                    message: "You can update your account only"
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
    } updateUser().then(function () { })
}
function deleteUser(req, res) {
    async function deleteUser() {
        try {
            if (req.body.userId === req.params.id || req.body.isAdmin) {
                const user = await Users.deleteOne({ _id: req.params.id })
                if (user) {
                    res.json({
                        code: 200,
                        data: user,
                        message: 'Account has been deleted'
                    })
                }
            } else {
                res.json({
                    code: 403,
                    data: null,
                    message: "You can delete only your account!"
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
    } deleteUser().then(function () { })
}

function getUser(req, res) {
    async function getUser() {
        const userId = req.query.userId;
        const username = req.query.username;
        try {
            const user =userId? await Users.findById(userId) : await Users.findOne({username:username});
            const { updatedAt, password, ...other } = user._doc
            if (user) {
                res.json({
                    code: 200,
                    data: other,
                    message: "User details fetched successfully"
                })
            } else {
                res.json({
                    code: 200,
                    data: null,
                    message: "User not found"
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
    } getUser().then(function () { })
}

function followUser(req,res) {
    async function followUser() {
        try {
            if(req.body.userId !== req.params.id){
                const user = await Users.findById(req.params.id);
                const currentUser = await Users.findById(req.body.userId);
                if(!user.followers.includes(req.body.userId)){
                    await user.updateOne({$push:{ followers: req.body.userId}});
                    await currentUser.updateOne({$push:{ followings: req.params.id}});
                    res.json({
                        code:200,
                        message:'User has been followed'
                    })
                }else{
                    res.json({
                        code:403,
                        message: 'You already follow this user'

                    })
                }
            }else{
                res.json({
                    code:403,
                    message: 'You cant follow yourself'

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
    } followUser().then(function () { })
}
function unFollowUser(req,res) {
    async function unFollowUser() {
        try {
            if(req.body.userId !== req.params.id){
                const user = await Users.findById(req.params.id);
                const currentUser = await Users.findById(req.body.userId);
                if(user.followers.includes(req.body.userId)){
                    await user.updateOne({$pull:{ followers: req.body.userId}});
                    await currentUser.updateOne({$pull:{ followings: req.params.id}});
                    res.json({
                        code:200,
                        message:'User has been unfollowed'
                    })
                }else{
                    res.json({
                        code:403,
                        message: 'You dont unfollow this user'

                    })
                }
            }else{
                res.json({
                    code:403,
                    message: 'You cant unfollow yourself'

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
    } unFollowUser().then(function () { })
}

function getFriends(req,res){
    async function getFriends(){
        try{
            const user = await Users.findById(req.params.userId);
            const friends = await Promise.all(
                user.followings.map(friendId=>{
                    return Users.findById(friendId)
                })
            )
            let friendList = [];
            friends.map(friend=>{
                const {_id,username,profilePicture} = friend
                friendList.push({_id,username,profilePicture})
            })
            res.json({
                code: 200,
                data: friendList,
                message: "Friends fetched successfully"
            })
        }catch(err){
            console.log(err)
            res.json({
                code: 400,
                data: null,
                message: 'Exception error occurred'
            })
        }
    }getFriends().then(function(){})
}
