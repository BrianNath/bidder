migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gkffvnie9gx7ouw")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jtpm12ic",
    "name": "itemId",
    "type": "relation",
    "required": true,
    "unique": true,
    "options": {
      "collectionId": "qn1tdah34tk5lui",
      "cascadeDelete": true,
      "maxSelect": 1,
      "displayFields": [
        "itemName"
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
    "id": "jtpm12ic",
    "name": "itemId",
    "type": "relation",
    "required": true,
    "unique": true,
    "options": {
      "collectionId": "qn1tdah34tk5lui",
      "cascadeDelete": false,
      "maxSelect": 1,
      "displayFields": [
        "itemName"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
