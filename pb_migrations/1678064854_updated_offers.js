migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zpwl9jxzulxmc29")

  // remove
  collection.schema.removeField("wguicjpy")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zpwl9jxzulxmc29")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wguicjpy",
    "name": "isWin",
    "type": "bool",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
})
