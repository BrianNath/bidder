migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qn1tdah34tk5lui")

  // add
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "usxsfvqg",
    "name": "condition",
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

  // remove
  collection.schema.removeField("jzlflcfp")

  // remove
  collection.schema.removeField("usxsfvqg")

  return dao.saveCollection(collection)
})
