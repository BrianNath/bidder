migrate((db) => {
  const collection = new Collection({
    "id": "zpwl9jxzulxmc29",
    "created": "2023-03-04 06:43:09.384Z",
    "updated": "2023-03-04 06:43:09.384Z",
    "name": "offers",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ackkkf43",
        "name": "bidderId",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": true,
          "maxSelect": 1,
          "displayFields": [
            "username"
          ]
        }
      },
      {
        "system": false,
        "id": "of4itmbc",
        "name": "auctionId",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "gkffvnie9gx7ouw",
          "cascadeDelete": true,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "cclptb4m",
        "name": "priceOffered",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null
        }
      },
      {
        "system": false,
        "id": "wguicjpy",
        "name": "isWin",
        "type": "bool",
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
  const collection = dao.findCollectionByNameOrId("zpwl9jxzulxmc29");

  return dao.deleteCollection(collection);
})
