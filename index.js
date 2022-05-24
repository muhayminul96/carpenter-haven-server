const express = require("express");
const app = express();
require("dotenv").config();
var cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

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

    // get all product

    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = await productCollection.find(query);
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
  console.log("runing curd");
});
