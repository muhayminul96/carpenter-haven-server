const express = require("express");
const app = express();
require("dotenv").config();
var cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@carpenter-haven.3lfjr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    console.log("connect");
    // for database connection

    const productCollection = client.db("carpenter").collection("products");
    const orderCollection = client.db("carpenter").collection("order");
    const reviewCollection = client.db("carpenter").collection("review");

    // get all product

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });
    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = await productCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.put("/product/:id", async (req, res) => {
      const id = req.params.id;
      const quantity = req.body.quantity;

      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateItem = {
        $set: {
          quantit,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        updateItem,
        options
      );
      res.send(result);
    });

    // order part

    app.post("/order", async (req, res) => {
      const newItem = req.body;
      const result = await orderCollection.insertOne(newItem);
      res.send(result);
    });

    app.delete("/order/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await orderCollection.deleteOne(query);
        res.send(result)
        
      });

    app.get("/myorders", async (req, res) => {
      const email = req.query.email;
      console.log(email);
      const query = { email: email };
      const cursor = await orderCollection.find(query);
      const myOrders = await cursor.toArray();
      console.log(myOrders);
      res.send(myOrders);
    });

    //   review part

    app.post("/review", async (req, res) => {
      const newItem = req.body;
      const result = await reviewCollection.insertOne(newItem);
      res.send(result);
    });

    app.get("/review", async (req, res) => {
      const query = {};
      const cursor = await reviewCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello man");
});

app.listen(port, () => {
  console.log("running curd");
});
