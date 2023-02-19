const express = require('express')
const { userModel } = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userRouter = express.Router()

userRouter.post('/register', async (req, res) => {
    const { name, email, password } = req.body
    try {
        bcrypt.hash(password, 5, async (err, hash) => {
            // Store hash in your password DB.
            if (err) {
                res.send({ 'error': err.message })
            } else {
                const user = new userModel({ name, email, password: hash })
                await user.save()
                res.send({ 'msg': 'new user has been registered' })
            }
        });
    }
    catch (err) {
        res.send({ 'error': err.message })
    }
})

userRouter.post('/login', async (req, res) => {
    const { email,password } = req.body
    try {
        const user = await userModel.find({ email })
        if (user.length > 0) {
            bcrypt.compare(password, user[0].password, (err, hash) => {
                if (hash) {
                    let token = jwt.sign({userID:user[0]._id}, 'masai')
                    res.send({ 'msg': 'logged in', "token": token })
                } else {
                    res.send({ 'msg': 'wrong credentials' })
                }
            });
        } else {
            res.send({ 'msg': 'wrong credentials' })
        }
    }
    catch (err) {
        res.send({ 'error': err.message })
    }
})

module.exports = {
    userRouter
}