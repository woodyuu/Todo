const express = require('express')
const User = require('../models/User') 
const expressAsyncHandler = require('express-async-handler')
const { generateToken, isAuth } = require('../../auth') 

const router = express.Router() //하위 url 로직을 처리하는 라우터 모듈

router.post('/register', expressAsyncHandler(async(req, res, next) => { // /api/users/register
    console.log(req.body)
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        userId: req.body.userId,
        password: req.body.password,
    })
    const newUser = await user.save() // DB에 User 생성
    if(!newUser){
        res.status(401).json({code: 401, message: 'Invalid User Date'})
    }else{
        const {name, email, userId, isAdmin, createdAt} = newUser
        res.json({
            code: 200,
            token: generateToken(newUser),
            name, email, userId, isAdmin, createdAt
        })
    }
}))

router.post('/login', expressAsyncHandler(async(req, res, next) => { // /api/users/login
    console.log(req.body)
    const loginUser = await User.findOne({
        email: req.body.email,
        password: req.body.password,
    })
    if(!loginUser){
        res.status(401).json({code: 401, message: 'Invalid Email or Password'})
    }else{
        const {name, email, userId, isAdmin, createdAt} = loginUser
        res.json({
            code: 200,
            token: generateToken(loginUser),
            name, email, userId, isAdmin, createdAt
        })
    }
}))

router.post('/logout', (req, res, next) => { // /api/users/logout
    res.json("로그아웃")
})

//isAuth; 사용자를 수정할 권한이 있는지 검사하는 미들웨어
router.put('/:id', isAuth, expressAsyncHandler(async(req, res, next) => { // /api/users/{id}
    const user = await User.findById(req.params.id)
    if(!User){
        res.status(404).json({code: 404, message: 'User Not Founded'})
    }else{
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.password = req.body.password || user.password
        user.isAdmin = req.body.isAdmin || user.isAdmin
        user.lastModifiedAt = new Date() // 수정시각 업데이트

        const updatedUser = await user.save() // DB에 사용자정보 업데이트
        const {name, email, userId, isAdmin, createdAt} = updatedUser
        res.json({
            code: 200,
            token: generateToken(updatedUser),
            name, email, userId, isAdmin, createdAt
        })
    }
}))

router.delete('/:id', isAuth, expressAsyncHandler(async(req, res, next) => { // /api/users/{id}
    const user =await User.findByIdAndDelete(req.params.id)
    if(!User){
        res.status(404).json({code: 404, message: 'User Not Founded'})
    }else{
        res.status(204).json({code: 204, message: 'User deleted successfully!'})
    }
}))

module.exports = router