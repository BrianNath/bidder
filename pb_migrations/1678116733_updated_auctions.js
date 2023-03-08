migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gkffvnie9gx7ouw")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gzzgviie",
    "name": "operatorid",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "1q5h32uguonbv8t",
      "cascadeDelete": false,
      "maxSelect": 1,
      "displayFields": [
        "categoryName"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gkffvnie9gx7ouw")

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
      "maxSelect": 1,
      "displayFields": [
        "categoryName"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
