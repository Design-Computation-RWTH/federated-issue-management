# Proof-of-concept for Federated Interoperable Issue Management
Welcome! This repository contains a proof-of-concept for federated, interoperable Issue Management in the Architecture, Engineering, Construction and Operations (AECO) industry. It is part of the research conducted in the following publication: ``` ```

The proof-of-concept consists of a storage layer ('[/vault](/vault)') and a service layer ('[/solid-bcf-middleware](/solid-bcf-middleware)').

## Vault
The storage layer is implemented using 3 [Solid Pods](https://solidproject.org/), based on an extension of the [Solid Community Server](https://solidcommunity.be/community-solid-server/) which mirrors all RDF-based resources as named graphs to a [Fuseki] triple store. The extension and internal (meta)data patterns are part of the [ConSolid project](https://github.com/consolidproject). 

The following pods have been created:
* architect (http://localhost:3000/architect/profile/card#me)
* mep-engineer (http://localhost:3000/mep-engineer/profile/card#me)
* project-manager (http://localhost:3000/project-manager/profile/card#me)

Each pod contains a "project access point" in the form of a recursive DCAT Catalog: every access point "contains" the other two, allowing discovery of the other project participants. The data has been preloaded in the Fuseki instance and Solid Server included in this repository

Run the vault configuration in 2 separate terminals:
* /vault/fuseki: ./fuseki-server (see [here](https://github.com/Design-Computation-RWTH/HowTo-Fuseki)) for instructions. You might need to trust the folder to be able to run this as an application.
* /vault/solid: 
  * npm install (you need to have npm and NodeJS installed)
  * npm run start:file


## BCF API
The ExpressJS server in ('[/solid-bcf-middleware](/solid-bcf-middleware)') exposes a route to get a federated BCF topic (id: 8424cd01-b779-4927-ae23-b16e335b265) in a federated project (id: 9ea20d1d-387b-4fb5-8962-f014a79e9d44). This route follows the BCF API specification ```GET /bcf/{version}/projects/{project_id}/topics```, with BCF API version 3.0.

Run the middleware with the following commands
* /solid-bcf-middleware (port 3080):
  * npm install
  * npm run start


Test it out in Postman to see how it works! The response is a JSON-LD document which contains the specified keys for a BCF Topic, but also the context that keeps track of the original semantics in bcfOWL. This repository contains a [Postman](https://www.postman.com/) Collection and Environment to get you started with authentication to a Solid Community Server. Note that the Web version of Postman will not support requests to localhost (i.e., you need to have the Desktop application installed and running).

```
GET http://localhost:3080/bcf/3.0/projects/9ea20d1d-387b-4fb5-8962-f014a79e9d44/topics/8424cd01-b779-4927-ae23-b16e335b265

Response (JSON-LD): 
{
    "assigned_to": "http://localhost:3000/architect/profile/card#me",
    "creation_author": "http://localhost:3000/mep-engineer/profile#me",
    "title": "Please check this opening",
    "topic_status": "http://localhost:3000/project-manager/287a7161-2aa0-4256-bc5a-19ed86711f98#ExtensionStatusOpen",
    "topic_type": "http://localhost:3000/project-manager/287a7161-2aa0-4256-bc5a-19ed86711f98#OpeningsAndRecesses",
    "creation_date": "2022-12-11T11:29:43.792Z",
    "type": "http://lbd.arch.rwth-aachen.de/bcfOWL#TopicState",
    "modified_author": "http://localhost:3000/architect/profile#me",
    "modified_date": "2022-12-15T11:29:43.792Z",
    "guid": "8424cd01-b779-4927-ae23-b16e335b265",
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
        "type": {
            "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
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
```

The /scripts folder contains references to create accounts on the Pod and upload datasets conforming the the ConSolid data structure. It is not needed to carry out this proof-of-concept.