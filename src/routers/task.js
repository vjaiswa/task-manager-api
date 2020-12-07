const express = require('express')
const Task = require('../models/task')
const ObjectId = require('mongoose').Types.ObjectId
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks',auth,async (req,res) =>{
    //const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner:req.user._id
    })
    
    try{
        await task.save()
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
    
})


router.get('/tasks',auth, async (req,res) =>{
    const match={}
    const sort={}
    if(req.query.completed){
        match.completed = req.query.completed == 'true'
    }

    if(req.query.sortBy){
        parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    

    try{
        //const tasks = await Task.find({owner:req.user._id})
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    }catch(e){
        res.status(500).send(e)
    }
})

router.get('/task/:id',auth, async (req,res) =>{
    const _id = req.params.id
    try{
        if(!ObjectId.isValid(_id)){
            return res.status(404).send()
        }
        
        const task = await Task.findOne({_id:_id,owner:req.user._id})

        if(!task){
            return res.status(404).send()
        }
        res.send(task) 
    }catch(e){
        res.status(500).send(e)
    }

})

router.patch('/task/:id',auth, async (req,res) =>{
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description','completed']
    const isvalidOperation = updates.every((update) => allowedUpdates.includes(update))

    try{
        if(!isvalidOperation){
            return res.status(400).send({error:'Invalid column provided in request body'})
        }

        if(!ObjectId.isValid(_id)){
            return res.status(400).send({error:'Invalid Id provided'})
        }

        const task = await Task.findOne({_id,owner:req.user._id})
        
        if(!task){
            return res.status(404).send()
        }
        
        updates.forEach((update) =>{
            task[update] = req.body[update]
        })
        
        await task.save()

        res.send(task)
    }catch(e){
        res.status(500).send({error:'Server error occured!'})
    }

})


router.delete('/task/:id',auth, async (req,res) =>{
    const _id = req.params.id

    if(!ObjectId.isValid(_id)){
        return res.status(400).send({error:'Invalid Id provided'})
    }

    try{
        const task = await Task.findOneAndDelete({_id,owner:req.user._id})
        
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send({error:'Server Error Occured!'})
    }

})

module.exports = router