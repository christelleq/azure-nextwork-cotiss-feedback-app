// Read .env file and set environment variables
require('dotenv').config()
const random = Math.floor(Math.random() * 100)

// Use official mongodb driver to connect to the server
const { MongoClient, ObjectId } = require('mongodb')

// New instance of MongoClient with connection string
// for Cosmos DB
const url = process.env.COSMOS_CONNECTION_STRING
const client = new MongoClient(url)

// Database reference with creation if it does not already exist
const db = client.db(`anonymous-feedback-app-db`)
console.log(`Database:\t${db.databaseName}\n`)

// Collection reference with creation if it does not already exist
const collection = db.collection('feedback')
console.log(`Collection:\t${collection.collectionName}\n`)

async function main() {
  // The remaining operations are added here
  // in the main function

  // Use connect method to connect to the server
  await client.connect()

  // Point read doc from collection:
  // - without sharding, should use {_id}
  // - with sharding,    should use {_id, partitionKey }, ex: {_id, category}
  const feedbackPiece = await collection.findOne({
    _id: ObjectId('63967a2744f5570ce0e23e94'),
  })
  console.log(`feedbackPiece: ${JSON.stringify(feedbackPiece)}\n`)
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close())
