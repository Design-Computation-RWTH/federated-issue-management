const users = require('../config/accounts.json')
const {fetch} = require('cross-fetch')
const {generateSession, Catalog, CONSOLID} = require('consolid-daapi')
const {ReferenceRegistry} = require('consolid-raapi')
const {v4} = require('uuid')
const {RDF, DCAT, DCTERMS, RDFS} = require('@inrupt/vocab-common-rdf')
const mime = require('mime-types')
const path = require('path')
const fs = require('fs')

function getRoot(webId) {
    return webId.replace('profile/card#me', '')
}

async function createProject(user, p) {
    const session = await generateSession(user)
    const root = getRoot(user.webId)

    // 1. Create a catalog for the project
    const projectUrl = root + user.catalogId
    const project = new Catalog(session, projectUrl)

    var date = new Date();
    var formatted = date.toISOString();
    const created = {
        predicate: DCTERMS.created,
        object: formatted
    }
    const metadata = [{
        predicate: RDF.type,
        object: CONSOLID.Project
    }, {
        predicate: DCTERMS.identifier,
        object: p["http://purl.org/dc/terms/identifier"]
    }, created]

    for (const item of Object.keys(p)) {
        metadata.push({
            predicate: item,
            object: p[item]
        })
    }

    await project.create(true, metadata)

    // 2. Add other stakeholders' partial projects to the project
    for (const u of Object.keys(users.users)) {
        if (users.users[u].webId !== user.webId) {
            const r = await getRoot(users.users[u].webId)
            project.addDataset(r + users.users[u].catalogId)
        }
    }

    // // 3. create the reference registry of the local project
    // const refRegUrl = root + v4()
    // const referenceRegistry = new ReferenceRegistry(session, refRegUrl)
    // await referenceRegistry.create(project, true)

    // 4. upload the intended datasets
    for (const item of user.resources) {
        const dsUrl = root + v4()
        const distUrl = root + item.id

        const p = path.join(__dirname, item.path);

        let mediaType = mime.lookup(p)
        const dsMetadata = [created]

        if (item.datasetMetadata) {
            for (const prop of Object.keys(item.datasetMetadata)) {
                dsMetadata.push({
                    predicate: prop,
                    object: item.datasetMetadata[prop]
                })
            }
        }

        if (!mediaType) mediaType = "text/plain"
        const distMetadata = [{
            predicate: DCAT.mediaType,
            object: `https://www.iana.org/assignments/media-types/${mediaType}`
        }, created]

        if (item.distributionMetadata) {
            for (const prop of Object.keys(item.distributionMetadata)) {
                distMetadata.push({
                    predicate: prop,
                    object: item.distributionMetadata[prop]
                })
            }
        }
    
        const ds = new Catalog(session, dsUrl)
        await ds.create(true, dsMetadata)
        await project.addDataset(dsUrl)
        await ds.addDistribution(distUrl, distMetadata)
        const buff = fs.readFileSync(p);
        await ds.dataService.writeFileToPod(buff, distUrl, true, mediaType)    
    }    
}

async function run() {
  for (const user of Object.keys(users.users)) {
    await createProject(users.users[user], users.project)
  }
}

const now = new Date()
run().then(() => {
    console.log('duration: ', new Date() - now)
})