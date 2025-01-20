import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { MongoClient } from 'npm:mongodb@6.3.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  let client: MongoClient | null = null

  try {
    const { database, collection, action, filter = {}, document, update } = await req.json()

    // Get MongoDB URI from environment variable
    const mongoUri = Deno.env.get('MONGODB_URI')
    if (!mongoUri) {
      throw new Error('MongoDB URI not configured')
    }

    // Connect to MongoDB
    client = new MongoClient(mongoUri)
    await client.connect()

    const db = client.db(database)
    const coll = db.collection(collection)

    let result
    switch (action) {
      case 'findOne':
        result = await coll.findOne(filter)
        break
      case 'find':
        result = await coll.find(filter).toArray()
        break
      case 'insertOne':
        if (!document) {
          throw new Error('Document is required for insertOne')
        }
        result = await coll.insertOne(document)
        break
      case 'updateOne':
        if (!filter || !update) {
          throw new Error('Filter and update are required for updateOne')
        }
        result = await coll.updateOne(filter, update)
        break
      default:
        throw new Error('Invalid action')
    }

    return new Response(
      JSON.stringify({ data: result }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('MongoDB Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        details: error.stack
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  } finally {
    if (client) {
      await client.close()
    }
  }
})