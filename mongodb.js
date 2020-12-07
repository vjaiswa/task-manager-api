const {MongoClient, ObjectID} = require('mongodb')
const connectionURL = 'mongodb://127.0.0.1/27017'
const databaseName = 'task-manager'


MongoClient.connect(connectionURL,{useNewUrlParser:true},(error,client) =>{
    if(error){
        return console.log('Error in database connection')
    }
    
    const db = client.db(databaseName)
    
    /*db.collection('users').insertOne({
        name:'Vijay',
        age:40
    },(error,result) =>{
        if(error){
            return console.log('Record could not be inserted')
        } 
        console.log(result.insertedCount + ' record inserted successfully')
    })*/

    // db.collection('tasks').insertMany([{
    //     description:'Create Shhet',
    //     completed:true
    // },{
    //     description:'Fill Data Sheet',
    //     completed:true
    // },{
    //     description:'Deliver Sheet',
    //     completed:false
    // }],(error,result) =>{
    //     if(error){
    //         return console.log('Records could not be inserted')
    //     }
    //     console.log(result.ops)
    // })

    // db.collection('users').findOne({_id: new ObjectID("5fa5e3c6086148b540e4f281")},(error,user) =>{
    //     console.log(user)
    // })
    
    // const taskPointer = db.collection("tasks").find({completed:true})
    // taskPointer.toArray((error,taskresults) =>{
    //     taskresults.forEach((element) => {
    //         console.log(element.description)
    //     });
    // })
    
    // taskPointer.count((error,count) =>{
    //     console.log(count)
    // })
    
    
    db.collection('users').deleteMany({name:'Vijay'},
    ).then((result) =>{
        console.log(result.deletedCount)
    }).catch((error) =>{
        console.log('Document could not be deleted')
    })


})
