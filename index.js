const express = require('express')
const app = express()
const port = process.emit.PORT || 5000
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config()

app.use(express.json())
app.use(cors())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tuenp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db("car-shop").collection("allProduct")

        app.get('/product', async (req, res) => {
            const products = await productCollection.find().toArray()
            res.send(products)
        })
        app.get('/product/:id', async (req, res) => {
            const { id } = req.params
            const query = { _id: ObjectId(id) }
            const productDetails = await productCollection.findOne(query)
            res.send(productDetails)
        })

        app.put('/update/:id', async (req, res) => {
            const { id } = req.params;
            const updatedInfo = req.body;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity: updatedInfo.quantity
                }
            }
            const result = await productCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })
    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})