import * as dotenv from 'dotenv' // Get environment variables from .env
import { CosmosClient } from '@azure/cosmos' // Get Cosmos Client
import express from 'express'
import path from 'path'

dotenv.config()

const key = process.env.COSMOS_KEY // Provide required connection from environment variables
const endpoint = process.env.COSMOS_ENDPOINT // Endpoint format: https://YOUR-RESOURCE-NAME.documents.azure.com:443/
const databaseName = `anonymous-feedback-app-database`
const containerName = `feedback`
const partitionKeyPath = ['/feedbackPartition']
const cosmosClient = new CosmosClient({ endpoint, key }) // Authenticate to Azure Cosmos DB

// Create database if it doesn't exist
const { database } = await cosmosClient.databases.createIfNotExists({
  id: databaseName,
})
console.log(`${database.id} database ready`)

// Create container if it doesn't exist
const { container } = await database.containers.createIfNotExists({
  id: containerName,
  partitionKey: {
    paths: partitionKeyPath,
  },
})
console.log(`${container.id} container ready`)

async function addFeedback(req, res, next) {
  const feedback = req.body.feedback
  const date = new Date()
  const item = {
    feedback: feedback,
    date: date,
  }
  const { resource } = await container.items.create(item)
  console.log(`'${resource.feedback}' inserted`)
  // Read item by id and partitionKey - least expensive `find`
  await container.item(item.id, item.categoryName).read()
  console.log(`${resource.feedback} read`)
}

const app = express()
const __dirname = path.resolve()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'index.html')))
app.listen(3000)

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')))
app.post('/addfeedback', (req, res, next) => {
  addFeedback(req, res).catch(next)
  res.redirect('/')
})
