migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qn1tdah34tk5lui")

  // remove
  collection.schema.removeField("ufqeobtr")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "m7qicemg",
    "name": "description",
    "type": "editor",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qn1tdah34tk5lui")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ufqeobtr",
    "name": "description",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // remove
  collection.schema.removeField("m7qicemg")

  return dao.saveCollection(collection)
})
