migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qn1tdah34tk5lui")

  collection.createRule = "createdBy = @request.auth.id"

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "yzuwq3l2",
    "name": "createdBy",
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
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qn1tdah34tk5lui")

  collection.createRule = null

  // remove
  collection.schema.removeField("yzuwq3l2")

  return dao.saveCollection(collection)
})
