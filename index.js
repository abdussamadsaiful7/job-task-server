const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5080;


//middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('job task server is running');
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nrvy6gz.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        //await client.connect();
        
        const allDataCollection = client.db('jobTaskDB').collection('allData');

        app.get('/allData', async (req, res) => {
            const cursor = allDataCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/allData', async (req, res) => {
            const newData = req.body;
            const result = await allDataCollection.insertOne(newData);
            res.send(result);
        })

        app.get('/allData/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await allDataCollection.findOne(query);
            res.send(result);

        })

         //update
         app.put('/allData/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true }
            const  updateData = req.body;
            const Data = {
                $set: {
                    name: updateData.name,
                    category: updateData.category,
                }
            }
            const result = await  allDataCollection.updateOne(filter, Data, options)
            res.send(result);
        })

        
        






        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
       // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`job task server is sitting on port ${port}`);
})