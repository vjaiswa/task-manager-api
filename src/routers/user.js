const ObjectId = require('mongoose').Types.ObjectId
const multer = require('multer')
const sharp = require('sharp')
const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post("/users", async (req,res)=>{
    const user = new User(req.body)
    try{
        const token = await user.generateAuthToken()
        await user.save()
        res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e)
    }
    
})

router.post('/user/login', async (req,res) =>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user,token})
    }catch(e){
        res.status(400).send({error:'Please authenticate'})
    }
})

router.get('/users/me',auth, async (req,res) =>{
    try{
      const user = req.user
      res.send(user)
    }catch(e){
        res.status(500).send()
    }

})

router.post('/users/logout',auth, async (req,res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) =>{
            return token.token != req.token
        }) 
        await req.user.save()
        res.send()
    }catch(e){
        res.status('500').send()
    }
})

router.post('/users/logoutAll',auth, async (req,res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        res.status('500').send()
    }
})



router.patch('/user/me',auth, async (req,res) =>{
    try{
        const updates = Object.keys(req.body)
        const allowedUpdates = ['name','email','password','age']
        const isvalidOperation = updates.every((update) => allowedUpdates.includes(update))

        if(!isvalidOperation){
            return res.status(400).send({error:'Invalid columns provided!'})
        }        
        
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})


router.delete('/user/me',auth, async (req,res) =>{
    try{
        await req.user.remove()
        res.send(req.user)
    }catch(e){
        res.status(500).send({error:'Server Error Occured!'})
    }

})

const upload = multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image'))
        }
        cb(undefined,true)
    }
})


router.post('/users/me/avatar', auth,upload.single('avatar'), async (req,res) =>{
    const buffer = await sharp(req.file.buffer).png().resize({width:250,height:250}).toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send('File Uploaded Successfully!')
}, (error, req, res, next) =>[
    res.status(400).send({error:error.message})
])

router.delete('/users/me/avatar', auth, async (req,res) =>{
    req.user.avatar = undefined
    await req.user.save()
    res.send('File Deleted Successfully!')
}, (error, req, res, next) =>[
    res.status(400).send({error:error.message})
])

router.get('/users/:id/avatar', async (req,res) => {
    try{
        const user = await User.findById(req.params.id)
        
        if(!user || !user.avatar){
            return new Error()
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar)

    }catch(error){
        res.status(400).send()
    }
})

module.exports = router
