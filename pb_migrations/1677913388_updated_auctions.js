migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gkffvnie9gx7ouw")

  collection.createRule = ""
  collection.deleteRule = ""

  // remove
  collection.schema.removeField("foqrkmzm")

  // remove
  collection.schema.removeField("pt4lqi3w")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gkffvnie9gx7ouw")

  collection.createRule = null
  collection.deleteRule = null

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "foqrkmzm",
    "name": "bidderId",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": true,
      "maxSelect": 1,
      "displayFields": [
        "name"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "pt4lqi3w",
    "name": "currentPrice",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  return dao.saveCollection(collection)
})
