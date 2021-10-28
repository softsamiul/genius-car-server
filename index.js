const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PRT || 5000;
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zsjgq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(cors());
app.use(express.json())

async function run(){
    try{
        await client.connect();
        const database = client.db('geniusCar');
        const servicesCollection = database.collection('services');

        // GET API
        app.get('/services', async(req, res)=>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();

            res.json(services)
        })

        // GET Single Service
        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id;
            const query = ({_id: ObjectId(id)});
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        // POST API
        app.post('/services', async(req, res)=> {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.send(result)
        })

        // DELETE API
        app.delete('/services/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await servicesCollection.deleteOne(query)

            res.json(result)
        })
    }finally{
        // await client.close()
    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Works')
})

app.listen(port, ()=>{
    console.log("Running", port)
})

