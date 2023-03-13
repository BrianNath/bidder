migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gkffvnie9gx7ouw")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dzd7wc6v",
    "name": "winnerOffer",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "zpwl9jxzulxmc29",
      "cascadeDelete": true,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gkffvnie9gx7ouw")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dzd7wc6v",
    "name": "winnerOffer",
    "type": "relation",
    "required": false,
    "unique": true,
    "options": {
      "collectionId": "zpwl9jxzulxmc29",
      "cascadeDelete": true,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
})
