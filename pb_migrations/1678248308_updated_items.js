migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qn1tdah34tk5lui")

  // remove
  collection.schema.removeField("rmvcpduo")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qn1tdah34tk5lui")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "rmvcpduo",
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
})
