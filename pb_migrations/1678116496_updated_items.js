migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qn1tdah34tk5lui")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jzlflcfp",
    "name": "quantity",
    "type": "number",
    "required": true,
    "unique": false,
    "options": {
      "min": 1,
      "max": 100
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qn1tdah34tk5lui")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jzlflcfp",
    "name": "quantity",
    "type": "number",
    "required": true,
    "unique": false,
    "options": {
      "min": 1,
      "max": null
    }
  }))

  return dao.saveCollection(collection)
})
