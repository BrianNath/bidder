migrate((db) => {
  const collection = new Collection({
    "id": "1q5h32uguonbv8t",
    "created": "2023-02-16 08:43:09.600Z",
    "updated": "2023-02-16 08:43:09.600Z",
    "name": "categories",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "w0jsb965",
        "name": "categoryName",
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
  const collection = dao.findCollectionByNameOrId("1q5h32uguonbv8t");

  return dao.deleteCollection(collection);
})
