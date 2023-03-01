migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gkffvnie9gx7ouw")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dzd7wc6v",
    "name": "winnerId",
    "type": "relation",
    "required": false,
    "unique": true,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "maxSelect": 1,
      "displayFields": [
        "name"
      ]
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "foqrkmzm",
    "name": "bidderId",
    "type": "relation",
    "required": true,
    "unique": true,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": true,
      "maxSelect": 1,
      "displayFields": [
        "name"
      ]
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gzzgviie",
    "name": "categoryId",
    "type": "relation",
    "required": false,
    "unique": true,
    "options": {
      "collectionId": "1q5h32uguonbv8t",
      "cascadeDelete": false,
      "maxSelect": null,
      "displayFields": [
        "categoryName"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gkffvnie9gx7ouw")

  // remove
  collection.schema.removeField("dzd7wc6v")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "foqrkmzm",
    "name": "userId",
    "type": "relation",
    "required": true,
    "unique": true,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": true,
      "maxSelect": 1,
      "displayFields": [
        "name"
      ]
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gzzgviie",
    "name": "categoryId",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "1q5h32uguonbv8t",
      "cascadeDelete": false,
      "maxSelect": null,
      "displayFields": [
        "categoryName"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
