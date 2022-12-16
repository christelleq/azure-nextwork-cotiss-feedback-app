module.exports = async function (context, req) {
  try {
    context.log('JavaScript HTTP trigger function processed a request.')

    // Read incoming data
    const feedback = req.query.feedback || (req.body && req.body.feedback)
    const date = new Date()

    // Send to CosmosDB
    if (feedback) {
      context.bindings.outputDocument = JSON.stringify({
        feedback: feedback,
        date: date,
      })
    }
    const responseJSON = {
      feedback: feedback,
      date: date,
    }

    context.res = {
      // status: 200, /* Defaults to 200 */
      body: responseJSON,
    }
  } catch (err) {
    context.res = {
      status: 500,
    }
  }
}
