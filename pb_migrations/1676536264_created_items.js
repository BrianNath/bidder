migrate((db) => {
  const collection = new Collection({
    "id": "qn1tdah34tk5lui",
    "created": "2023-02-16 08:31:04.753Z",
    "updated": "2023-02-16 08:31:04.753Z",
    "name": "items",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "p9izoflq",
        "name": "itemName",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("qn1tdah34tk5lui");

  return dao.deleteCollection(collection);
})
