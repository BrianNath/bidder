migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qn1tdah34tk5lui")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "6v0aw6j9",
    "name": "categoryId",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "1q5h32uguonbv8t",
      "cascadeDelete": false,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qn1tdah34tk5lui")

  // remove
  collection.schema.removeField("6v0aw6j9")

  return dao.saveCollection(collection)
})
