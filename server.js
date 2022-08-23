const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'symptoms'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/',(request, response)=>{
    db.collection('symptoms').find().toArray()
    .then(data => {
        response.render('index.ejs', { entries: data })
    })
    .catch(error => console.error(error))
})

app.post('/addEntry', (request, response) => {
    db.collection('symptoms').insertOne({
        date: request.body.date,
        painLevel: request.body.painLevel})
    .then(result => {
        console.log(`Entry added for ${request.body.date}`)
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.get('/editEntry/:id',(request, response)=>{
    const id = request.params.id;
    console.log(id)
    db.collection('symptoms').findOne({ _id: id })
    .then(data => {
        console.log(data)
        response.render('edit.ejs', { entry: data })
    })
    .catch(error => console.error(error))
})

//IGNORE THIS - JUST A LEGO BLOCK TO USE LATER
// app.put('/addOneLike', (request, response) => {
//     db.collection('symptoms').updateOne({stageName: request.body.stageNameS, birthName: request.body.birthNameS,likes: request.body.likesS},{
//         $set: {
//             likes:request.body.likesS + 1
//           }
//     },{
//         sort: {_id: -1},
//         upsert: true
//     })
//     .then(result => {
//         console.log('Added One Like')
//         response.json('Like Added')
//     })
//     .catch(error => console.error(error))

// })

app.delete('/deleteEntry', (request, response) => {
    db.collection('symptoms').deleteOne({date: request.body.date})
    .then(result => {
        console.log(request.body)
        console.log(`Entry deleted for ${request.body.date}`)
        response.json(`Entry deleted for ${request.body.date}`)
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})