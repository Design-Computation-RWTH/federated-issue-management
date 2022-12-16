const data = {
    "@context": {
        "guid": "http://purl.org/dc/terms/identifier",
        "creation_author": {
            "@id": "http://lbd.arch.rwth-aachen.de/bcfOWL#hasCreationAuthor",
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
        "creation_date": "http://purl.org/dc/terms/created"
    },
    "@graph": [
        {
            "@id": "http://localhost:3000/architect/82ee8d4a-5ba4-42a6-9811-a1dac4d5b862",
            "assigned_to": "http://localhost:3000/mep-engineer/profile/card#me",
            "creation_author": "http://localhost:3000/architect/profile#me",
            "topic": "http://localhost:3000/mep-engineer/8424cd01-b779-4927-ae23-b16e335b265f",
            "topic_status": "http://localhost:3000/project-manager/287a7161-2aa0-4256-bc5a-19ed86711f98#ExtensionStatusClosed",
            "creation_date": "2022-12-16T11:29:40.482Z",
            "type": "http://lbd.arch.rwth-aachen.de/bcfOWL#TopicState"
        },
        {
            "@id": "http://localhost:3000/mep-engineer/6184188d-85af-4813-9112-2db604348819",
            "assigned_to": "http://localhost:3000/architect/profile/card#me",
            "creation_author": "http://localhost:3000/mep-engineer/profile#me",
            "title": "Please check this opening",
            "topic": "http://localhost:3000/mep-engineer/8424cd01-b779-4927-ae23-b16e335b265f",
            "topic_status": "http://localhost:3000/project-manager/287a7161-2aa0-4256-bc5a-19ed86711f98#ExtensionStatusOpen",
            "topic_type": "http://localhost:3000/project-manager/287a7161-2aa0-4256-bc5a-19ed86711f98#OpeningsAndRecesses",
            "creation_date": "2022-12-16T11:29:43.792Z",
            "type": "http://lbd.arch.rwth-aachen.de/bcfOWL#TopicState"
        }
    ]
}



console.log(' main',  main)