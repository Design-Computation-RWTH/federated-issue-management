# Proof-of-concept for Federated Interoperable Issue Management
Welcome! This repository contains a proof-of-concept for federated, interoperable Issue Management in the Architecture, Engineering, Construction and Operations (AECO) industry. It is part of the research conducted in the following publication: ``` ```

The proof-of-concept consists of a storage layer ('[/vault](/vault)') and a service layer ('[/solid-bcf-middleware](/solid-bcf-middleware)').

## Vault
The storage layer is implemented using 3 [Solid Pods](https://solidproject.org/), based on an extension of the [Solid Community Server](https://solidcommunity.be/community-solid-server/) which mirrors all RDF-based resources as named graphs to a [Fuseki] triple store. The extension and internal (meta)data patterns are part of the [ConSolid project](https://github.com/consolidproject). 

The following pods have been created:
* architect (http://localhost:3000/architect/profile/card#me)
* mep-engineer (http://localhost:3000/mep-engineer/profile/card#me)
* project-manager (http://localhost:3000/project-manager/profile/card#me)

Each pod contains a "project access point" in the form of a recursive DCAT Catalog: every access point "contains" the other two, allowing discovery of the other project participants.

Run the vault configuration in 2 separate terminals:
* /vault/fuseki: ./fuseki-server (see [here](https://github.com/Design-Computation-RWTH/HowTo-Fuseki)) for instructions.
* /vault/solid: 
  * npm install (you need to have npm and NodeJS installed)
  * npm run start:file


## BCF API
The ExpressJS server in ('[/solid-bcf-middleware](/solid-bcf-middleware)') exposes a route to get a federated BCF topic (id: 8424cd01-b779-4927-ae23-b16e335b265) in a federated project (id: 9ea20d1d-387b-4fb5-8962-f014a79e9d44). This route follows the BCF API specification ```GET /bcf/{version}/projects/{project_id}/topics```, with BCF API version 3.0.

Run the middleware with the following commands
* /solid-bcf-middleware:
  * npm install
  * npm run start


Test it out in Postman to see how it works!

Internal notes: 
- postman request must be authenticated to solid (see /postman folder in the middleware)

