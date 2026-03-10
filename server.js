const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://akpanvictor848_db_user:NAWI-EMPIRE@nawi-empire.3qj9wnj.mongodb.net/?appName=NAWI-EMPIRE";

// Create a MongoClient with a NAWI-EMPIRE ClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationgood: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/good 
    Colin await 
  }
}
run().catch(console.dir); 7 pillars 
