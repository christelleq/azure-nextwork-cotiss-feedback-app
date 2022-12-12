// Use express
import express, { json, urlencoded } from 'express'
const app = express()
app.use(json())
app.use(urlencoded({ extended: true }))
import path from 'path'
const __dirname = path.resolve()

// Read .env file and set environment variables
// require('dotenv').config()
const random = Math.floor(Math.random() * 100)

// Use official mongodb driver to connect to the server
import { MongoClient, ObjectId } from 'mongodb'

// New instance of MongoClient with connection string
// for Cosmos DB
const url = process.env.REACT_APP_COSMOS_CONNECTION_STRING
const client = new MongoClient(url)

// Database reference with creation if it does not already exist
const db = client.db(`anonymous-feedback-app-db`)
console.log(`Database:\t${db.databaseName}\n`)

// Collection reference with creation if it does not already exist
const collection = db.collection('feedback')
console.log(`Collection:\t${collection.collectionName}\n`)

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: path.join(__dirname) })
})

app.post('/', async function (req, res) {
  console.log('post', req.body.feedback)
  const newFeedback = {
    date: new Date(),
    feedback: req.body.feedback,
  }
  console.log(new Date())
  await client.connect()
  const newfb = await collection.insertOne(newFeedback)
  console.log(JSON.stringify(newfb))
})

async function main() {
  // The remaining operations are added here
  // in the main function

  // Use connect method to connect to the server
  await client.connect()

  // Point read doc from collection:
  // - without sharding, should use {_id}
  // - with sharding,    should use {_id, partitionKey }, ex: {_id, category}
  const feedbackPiece = await collection.findOne({
    _id: ObjectId('6396d6a0f4945cb5ac7438e8'),
  })
  console.log(`feedbackPiece: ${JSON.stringify(feedbackPiece)}\n`)
}

main()
  .then(console.log('main'))
  .catch(console.error)
  .finally(() => client.close())

app.listen(3000)
