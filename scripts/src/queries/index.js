function getRoot(webId) {
    return webId.replace('profile/card#me', '')
}

const PREFIXES = `
PREFIX bcfowl: <http://lbd.arch.rwth-aachen.de/bcfOWL#>
PREFIX consolid: <https://w3id.org/consolid#>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX void: <http://rdfs.org/ns/void#>

`

const projectTriples = (identifier) => `
    ?catalog a consolid:Project ;
        dcterms:identifier "${identifier}" ;
        dcat:dataset ?dataset .
`

const datasetTriples = () => `
    ?dataset dcat:distribution ?dist ;
        dcterms:created ?date .

    ?dist void:vocabulary <http://lbd.arch.rwth-aachen.de/bcfOWL#> ;
        dcat:downloadURL ?url .
`

const makeQuery = (identifier, pattern) => PREFIXES + `SELECT DISTINCT ?s ?p ?o ?date WHERE {
    ${projectTriples(identifier)}
    ${datasetTriples()}
    GRAPH ?url {
        ${pattern}
    }
}`

const makeConstructQuery = (identifier, pattern) => PREFIXES + `
CONSTRUCT {?s ?p ?o ;
    dcterms:created ?date .
} 
WHERE {
    ${projectTriples(identifier)}
    ${datasetTriples()}
    GRAPH ?url {
        ${pattern}
    }
}`

const getOneProjectWithStakeholders = (webId, identifier) => PREFIXES + `SELECT DISTINCT ?dataset WHERE {
    ${projectTriples(identifier)}
        
    # keep only those access points that are located on other vaults
    FILTER regex(str(?dataset), '^((?!${getRoot(webId)}).)*$')
}`

const getAllProjectsWithStakeholders = () => PREFIXES + `SELECT * WHERE {
    ?catalog a consolid:Project ;
        dcat:dataset ?accessPoint .
        
    # keep only those access points that are located on other vaults
    FILTER regex(str(?accessPoint), '^((?!${getRoot(webId)}).)*$')
}`

const getAllBcfTopicsInProject = (identifier) => makeQuery(identifier, `
?s a bcfowl:Topic ;
    ?p ?o .
`)

const getAllTopicStatesOfTopic = (identifier, topic) => makeQuery(identifier, `
    ?s a bcfowl:TopicState ;
        bcfowl:hasTopic <${topic}> ;
        ?p ?o .
`)

module.exports = {
    getOneProjectWithStakeholders,
    getAllProjectsWithStakeholders,
    getAllBcfTopicsInProject,
    getAllTopicStatesOfTopic
}