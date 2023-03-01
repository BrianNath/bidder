migrate((db) => {
  const collection = new Collection({
    "id": "jmfbvjpmou1kpud",
    "created": "2023-02-17 01:55:40.863Z",
    "updated": "2023-02-17 01:55:40.863Z",
    "name": "roles",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "uv5rk3hm",
        "name": "roleName",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "vrzwwvyc",
        "name": "tasks",
        "type": "json",
        "required": false,
        "unique": false,
        "options": {}
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
  const collection = dao.findCollectionByNameOrId("jmfbvjpmou1kpud");

  return dao.deleteCollection(collection);
})
