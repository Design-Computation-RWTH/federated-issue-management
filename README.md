# Proof-of-concept for Federated Interoperable Issue Management
Welcome! This repository contains a proof-of-concept for federated, interoperable Issue Management in the Architecture, Engineering, Construction and Operations (AECO) industry. This repository contains sub-repositories for the Solid Server and the Middleware. To clone these, use the following command: `git clone https://github.com/Design-Computation-RWTH/federated-issue-management.git --recurse-submodules`

This setup has been tested on Windows.


## Setup of the Storage Layer
The storage layer is implemented using 3 [Solid Pods](https://solidproject.org/), based on an extension of the [Solid Community Server](https://solidcommunity.be/community-solid-server/) which mirrors all RDF-based resources as named graphs to a [Fuseki] triple store. The extension and internal (meta)data patterns are part of the [ConSolid project](https://github.com/consolidproject). 

### Solid Pods
The Solid Pods take the role of the vaults in the ecosystem. You may run the Solid Server using the following commands:
  * `cd ./SolidCommunity_Fuseki` (navigate to the correct subfolder)
  * `npm i -g env-cmd`
  * check if a `.env` file is present in the SolidCommunity_Fuseki folder. If there isn't, create one and add the following line: `SPARQL_STORE_ENDPOINT=http://localhost:3030`
  * `npm install` (install the required packages - you need to have [npm and NodeJS](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm))
  * `npm run start:file` (run the Solid Server in a file-based configuration)

### Apache Fuseki
To provide a SPARQL endpoint for the entire Pod, a Fuseki triple store needs to be set up. The Solid Server will create databases for every Pod it hosts, and will forward any RDF-resources and -updates to this database. You can download Fuseki [here](https://dlcdn.apache.org/jena/binaries/apache-jena-fuseki-4.6.1.zip). To enable the default graph as the union of all named graphs, the following settings need to be adapted:

  * Run the server a first time with `./fuseki-server`. This will create the `./run` folder. Aftwards, the process can be terminated.
  * Navigate to the following directory: `./{your-fuseki-download-folder}/run/templates`. This directory contains configurations for the different triple store setups supported by Fuseki. This should take place in another terminal than the one running the Solid Server.
  * Every configuration contains a commented-out triple `<dataset> # tdb2:unionDefaultGraph true . `Remove the `#` sign to activate this triple in the configurations.
  * Run the server with `./fuseki-server`.

## Running the demo
### Create the data
The folder `./scripts` contains scripts to bootstrap the demo onto the vaults. Make sure the Solid server and a Fuseki instance are running. To run the scripts, however, an initial account needs to be created manually. Go to `http://localhost:3000/setup/` (3000 is the default port for the Solid Server) and tick the following checkboxes: 

  * "Sign me up for an account"
  * Create a new Pod with my WebID as owner "...in its own namespace". You can choose a Pod name, email and password (e.g. "dummy", "dummy@example.org", "demo" ) - we will not need this Pod as its purpose is just to configure the Solid Server. 

Now navigate in a terminal to `./scripts/` and execute the following commands: 

  * `npm install`
  * `node src/createAccounts.js`
  * `node src/createProject.js`

The following pods will be created (password: "demo"):

  * architect@example.org (http://localhost:3000/architect/profile/card#me)
  * mep-engineer@example.org (http://localhost:3000/mep-engineer/profile/card#me)
  * project-manager@example.org (http://localhost:3000/project-manager/profile/card#me)

Each of the Pods hosts a number of resources related to the demo project. These resources are RDF-based and will hence be mirrored the the triple store.

### Run the middleware
The ExpressJS server in ('[/solid-bcf-middleware](/solid-bcf-middleware)') exposes a route to get a federated BCF topic in a federated project. This route follows the BCF API specification ```GET /bcf/{version}/projects/{project_id}/topics```, with BCF API version 3.0.

Run the middleware with the following commands
* /solid-bcf-middleware (port 3080):
  * npm install
  * npm run start

Test it out in Postman to see how it works! The response is a JSON-LD document which contains the specified keys for a BCF Topic, but also the context that keeps track of the original semantics in bcfOWL. This repository contains a [Postman](https://www.postman.com/) Collection and Environment to get you started with authentication to a Solid Community Server. Note that the Web version of Postman will not support requests to localhost (i.e., you need to have the Desktop application installed and running).

The following route exposes a Topic (id: 8424cd01-b779-4927-ae23-b16e335b265) of a specific Project (id: 9ea20d1d-387b-4fb5-8962-f014a79e9d44):

```GET http://localhost:3080/bcf/3.0/projects/9ea20d1d-387b-4fb5-8962-f014a79e9d44/topics/8424cd01-b779-4927-ae23-b16e335b265```

If authenticated well, the server responds with the following JSON-LD document:

```
{
    "guid": "8424cd01-b779-4927-ae23-b16e335b265",
    "assigned_to": "http://localhost:3000/architect/profile/card#me",
    "creation_author": "http://localhost:3000/mep-engineer/profile#me",
    "title": "Please check this opening",
    "topic_status": "http://localhost:3000/project-manager/287a7161-2aa0-4256-bc5a-19ed86711f98#ExtensionStatusOpen",
    "topic_type": "http://localhost:3000/project-manager/287a7161-2aa0-4256-bc5a-19ed86711f98#OpeningsAndRecesses",
    "creation_date": "2022-12-11T11:29:43.792Z",
    "modified_author": "http://localhost:3000/architect/profile#me",
    "modified_date": "2022-12-15T11:29:43.792Z",
    "@context": {
        "guid": "http://purl.org/dc/terms/identifier",
        "creation_author": {
            "@id": "http://lbd.arch.rwth-aachen.de/bcfOWL#hasCreationAuthor",
            "@type": "@id"
        },
        "modified_author": {
            "@id": "http://lbd.arch.rwth-aachen.de/bcfOWL#hasTopicModifiedAuthor",
            "@type": "@id"
        },
        "topic_status": {
            "@id": "http://lbd.arch.rwth-aachen.de/bcfOWL#hasTopicStatus",
            "@type": "@id"
        },
        "topic": {
            "@id": "http://lbd.arch.rwth-aachen.de/bcfOWL#hasTopic",
            "@type": "@id"
        },
        "assigned_to": {
            "@id": "http://lbd.arch.rwth-aachen.de/bcfOWL#hasAssignedTo",
            "@type": "@id"
        },
        "title": "http://lbd.arch.rwth-aachen.de/bcfOWL#hasTitle",
        "topic_type": {
            "@id": "http://lbd.arch.rwth-aachen.de/bcfOWL#hasTopicType",
            "@type": "@id"
        },
        "labels": "http://www.w3.org/2000/01/rdf-schema#label",
        "creation_date": "http://purl.org/dc/terms/created",
        "modified_date": "http://purl.org/dc/terms/modified"
    }
}
```

If referring to this work, please cite the following publication: 
```
@misc {werbrouckEnabling2022,
    title = {A Generic Framework for Federated CDEs applied to Issue Management},
    year = {2022},
    author = {Werbrouck, Jeroen and Schulz, Oliver and Oraskari, Jyrki and Mannens, Erik and Pauwels, Pieter and Beetz, Jakob},
    note = {Under review},
}
``` 