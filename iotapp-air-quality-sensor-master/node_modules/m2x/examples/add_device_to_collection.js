#!/usr/bin/env node

/*
*
* This example demonstrates how to add device to collection
*
* API Documentation:
* https://m2x.att.com/developer/documentation/v2/collections#Add-device-to-collection
*
* Setup:
* Replace <M2X-API-KEY> with an M2X API Key
* Replace <M2X-DEVICE-ID> with a device id
* Replace <M2X-COLLECTION-ID> with a collection id
*
*/

var M2X = require("../");
var m2x_client = new M2X("<M2X-API-KEY>");

device_id = "<M2X-DEVICE-ID>";
collection_id = "<M2X-COLLECTION-ID>";

console.log("Adding device: %s to collection: %s ", device_id, collection_id);

m2x_client.collections.addDevice(collection_id, device_id, function(response) {
  if (response.isSuccess()) {
    console.log("Status Code: ".concat(response.status));
  } else {
    console.log(JSON.stringify(response.error()));
  }
});
