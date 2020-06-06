import elasticsearch from 'elasticsearch'

let client = new elasticsearch.Client({
  host:
    process.env.NODE_ENV !== 'PROD' ? 'localhost:9200' : 'elasticsearch:9200',
  //log: 'trace',
  apiVersion: '7.2', // use the same version of your Elasticsearch instance
})

client.ping((error) => {
  if (error) {
    console.trace('elasticsearch cluster is down!')
  }
  console.log('found elasticsearch')
})

function indexExists(key) {
  return client.indices.exists({
    index: key,
  })
}

function deleteIndex(key) {
  return client.indices.delete({
    index: key,
  })
}

function initIndex(key) {
  return client.indices.create({
    index: key,
    body: {
      mappings: {
        properties: {
          id: { type: 'integer' },
          reviews: { type: 'text', index: true },
        },
      },
    },
  })
}

export { client, indexExists, deleteIndex, initIndex }
