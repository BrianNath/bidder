migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gkffvnie9gx7ouw")

  collection.listRule = ""
  collection.viewRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("gkffvnie9gx7ouw")

  collection.listRule = null
  collection.viewRule = null

  return dao.saveCollection(collection)
})
