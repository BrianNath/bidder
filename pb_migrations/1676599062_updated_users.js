migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "zubaqsdt",
    "name": "roleId",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "jmfbvjpmou1kpud",
      "cascadeDelete": false,
      "maxSelect": null,
      "displayFields": [
        "roleName"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  // remove
  collection.schema.removeField("zubaqsdt")

  return dao.saveCollection(collection)
})
