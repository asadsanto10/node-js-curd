const express = require('express');
const bodyParser = require('body-parser');
const ObjetId = require('mongodb').ObjectID;

// db connect
// DB: organicProduct
// user: asadDB
// pass: BVSTpHAXUXJ5XcVI



// db user
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://asadDB:BVSTpHAXUXJ5XcVI@cluster0.ku1yj.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); //send file
})

// db client
client.connect(err => {
    const productCollection = client.db("organicdb").collection("products");
    // console.log('connected db');

    // read data
    app.get("/products", (req, res) => {
        productCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    // insert
    app.post('/addProduct', (req, res) => {
        const product = req.body;
        // console.log(product);
        productCollection.insertOne(product)
        .then(result => {
            // console.log('data added successfully');
            // res.send('success');
            res.redirect('./')
        })
    });

    // delete
    app.delete('/delete/:id', (req, res) => {
        // console.log(req.params.id);
        productCollection.deleteOne({ _id: ObjetId(req.params.id)})
        .then((result) => {
            // console.log(result);
            res.send(result.deletedCount > 0);
        })
    })

    // update
    app.get('/product/:id', (req, res) => {
        productCollection.find({ _id: ObjetId(req.params.id)})
        .toArray ( (err, documents) => {
            res.send(documents[0]);
        })
    })

    app.patch('/update/:id', (req, res) => {
        productCollection.updateOne({ _id: ObjetId(req.params.id)},
            {
                $set: {pName: req.body.name, pPrice: req.body.price, pQuantity: req.body.quantity}
            }
        )
        .then(result => {
            res.send(result.modifiedCount > 0)
        })
    })

    // client.close();
});

app.listen(3000)