migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gkffvnie9gx7ouw")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "3w1zayvz",
    "name": "closePrice",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gkffvnie9gx7ouw")

  // remove
  collection.schema.removeField("3w1zayvz")

  return dao.saveCollection(collection)
})
