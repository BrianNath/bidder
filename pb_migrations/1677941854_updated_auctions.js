migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gkffvnie9gx7ouw")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jrfmth7k",
    "name": "status",
    "type": "select",
    "required": true,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "Done",
        "Ongoing",
        "Waiting",
        "Draft",
        "Canceled"
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
    "id": "jrfmth7k",
    "name": "status",
    "type": "select",
    "required": true,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "Done",
        "Ongoing",
        "Waiting",
        "Draft"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
