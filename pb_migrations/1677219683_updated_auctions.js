migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gkffvnie9gx7ouw")

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
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gkffvnie9gx7ouw")

  // remove
  collection.schema.removeField("pt4lqi3w")

  return dao.saveCollection(collection)
})
