const queries = require('./queries')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const getProjectEndpoints= async (webId, identifier) => {
    var raw = "";
    var requestOptions = {
        method: 'POST',
        body: raw,
        redirect: 'follow'
    };

    const endpoint = await getSparqlEndpoint(webId)
    const query = queries.getOneProjectWithStakeholders(webId, identifier)
    const stakeholders = await fetch(`${endpoint}?query=${encodeURIComponent(query)}`, requestOptions)
        .then(response => response.json())
        .then(result => result.results.bindings.map(i => i.dataset.value))
        .catch(error => console.log('error', error));
    
    const endpoints = []
    for (const catalog of [...stakeholders, webId]) {
            const sparql = await getSparqlEndpoint(catalog)
            endpoints.push({catalog, sparql})
        }
    return endpoints
}

// very clumsy, i know - temporary fix
async function getSparqlEndpoint(resource) {
    let sparql = resource.split('/').slice(0,4)
    sparql = sparql.join('/')
    sparql = sparql.replace('localhost:3000', 'localhost:3030') + '/sparql'

    return sparql
}

async function getTopics(endpoints, identifier) {
    var raw = "";
    var requestOptions = {
        method: 'POST',
        body: raw,
        redirect: 'follow'
    };

    const endpoint = await getSparqlEndpoint(webId)
    const query = queries.getAllBcfTopicsInProject(identifier)

    const results = []
    for (const endpoint of endpoints) {
        const topics = await fetch(`${endpoint.sparql}?query=${encodeURIComponent(query)}`, requestOptions)
        .then(response => response.json())
        .then(result => result.results.bindings.map(i => i.s.value))
        .catch(error => console.log('error', error));
results.push(topics)
    }
    return results.flat()

}

async function getAllTopicStates(endpoints, identifier, topic) {
    var raw = "";
    var requestOptions = {
        method: 'POST',
        body: raw,
        redirect: 'follow'
    };

    const endpoint = await getSparqlEndpoint(webId)
    const query = queries.getAllTopicStatesOfTopic(identifier, topic)
    const results = []
    for (const endpoint of endpoints) {
        await fetch(`${endpoint.sparql}?query=${encodeURIComponent(query)}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.results.bindings.length) {
                results.push(result.results.bindings)
            }
        })
        .catch(error => console.log('error', error));
    }
    return results.flat()
}

const webId = "http://localhost:3000/architect/profile/card#me"
const identifier = "9ea20d1d-387b-4fb5-8962-f014a79e9d44"

async function run() {  
    const endpoints = await getProjectEndpoints(webId, identifier)
    const topics = await getTopics(endpoints, identifier)
    if (topics.length) {
        const topic = topics[0]
        console.log('topic', topic)
        const topicStates = await getAllTopicStates(endpoints, identifier, topic)
        console.log('topicStates', JSON.stringify(topicStates, undefined, 4))
    }
}

const now = new Date()
run().then(() => {
    console.log('duration: ', new Date() - now)
})