migrate((db) => {
  const collection = new Collection({
    "id": "gkffvnie9gx7ouw",
    "created": "2023-02-16 08:34:13.357Z",
    "updated": "2023-02-16 08:34:13.357Z",
    "name": "auctions",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "foqrkmzm",
        "name": "userId",
        "type": "relation",
        "required": true,
        "unique": true,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": true,
          "maxSelect": 1,
          "displayFields": [
            "id",
            "name"
          ]
        }
      },
      {
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
      },
      {
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
      },
      {
        "system": false,
        "id": "g10k1wp2",
        "name": "timeStart",
        "type": "date",
        "required": true,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      },
      {
        "system": false,
        "id": "xpbrdkzh",
        "name": "timeEnd",
        "type": "date",
        "required": true,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      },
      {
        "system": false,
        "id": "w5a8dydz",
        "name": "title",
        "type": "text",
        "required": false,
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
  const collection = dao.findCollectionByNameOrId("gkffvnie9gx7ouw");

  return dao.deleteCollection(collection);
})
