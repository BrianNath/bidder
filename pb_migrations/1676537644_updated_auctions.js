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
      "cascadeDelete": false,
      "maxSelect": null,
      "displayFields": [
        "itemName"
      ]
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mpji9apk",
    "name": "operatorUserId",
    "type": "relation",
    "required": true,
    "unique": true,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "maxSelect": 1,
      "displayFields": [
        "name"
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
      "maxSelect": null,
      "displayFields": []
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mpji9apk",
    "name": "operatorUserId",
    "type": "relation",
    "required": true,
    "unique": true,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
})
