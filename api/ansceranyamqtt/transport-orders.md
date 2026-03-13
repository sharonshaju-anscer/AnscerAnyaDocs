---
id: transport-orders
title: Transport Orders
sidebar_label: Transport Orders
---

Transport order or internally refrenced as missions, is a list of orders containing locations (Nodes) and actions (Pick or Drop) to be executed to complete movement of the materials on the plant floor. Every transport order has a unique transport order ID which is used for tracking the progress of it in the fleet. It can also be used externally by third party Warehouse Management System (WMS) or Enterprise Resource Planning (ERP) systems.

### Creation of Transport Order

The following request and response is for creating a new transport order. Once the transport order is received the fleet will automatically assign it to a vehicle which is able to execute the actions that are specified under each node. The node ID can be alpha numeric, for example `Station-1` can be used for pick point and `Assembly-1` can be used for the drop point. The `constraints` field consists of the `vehicle` and `loads`. The `vehicle` field can be used to specify which vehicle should execute the transport order. While, the loads field can be used to tell the vehicle which load type the vehicle will need to handle. In this way an appropriate vehicle can be selected to execute the orders specified in the transport order. Either use the loads constraints or vehicle constraints.

**Request:**

**MQTT Topic:** `transport_orders/create/request`

```JSON
{
  "createTransportOrdersRequest": [
    {
      "header": {
        "headerId": 1,
        "transportOrderType": "TRANSPORT",
        "transportOrderId": "TO-0001",
        "tranportOrderInterface": "task_manager_interface_mqtt"
      },
      "status": {
        "startTimestamp": "2024-12-11T11:12:05.983658708Z",
        "updateTimestamp": "2024-12-11T11:12:05.983664365Z",
        "status": "QUEUED",
        "transportOrderDescription": "Creating new TO"
      },
      "constraints": {
        "vehicle": {
          "serialNumber": "AR001",
          "manufacturer": "ANSCER"
        },
        "loads": [
          {
            "type": "BIN",
            "count": 1
          }
        ]
      },
      "orders": [
        {
          "nodes": [
            {
              "nodeId": "10",
              "actions": [
                {
                  "actionType": "pick",
                  "blockingType": "HARD",
                  "actionParameters": [
                    {
                      "key": "lhd",
                      "value": "stroke"
                    },
                    {
                      "key": "loadType",
                      "value": "BIN"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "nodes": [
            {
              "nodeId": "20",
              "actions": [
                {
                  "actionType": "drop",
                  "blockingType": "HARD",
                  "actionParameters": [
                    {
                      "key": "lhd",
                      "value": "stroke"
                    },
                    {
                      "key": "loadType",
                      "value": "BIN"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

**Response:**

**MQTT Topic:** `transport_orders/create/response`

```JSON
{
  "createTransportOrdersResponse": [
    {
      "transportOrder": {
        "header": {
          "headerId": 1,
          "transportOrderType": "TRANSPORT",
          "transportOrderId": "TO-0001",
          "tranportOrderInterface": "task_manager_interface_mqtt"
        },
        "status": {
          "startTimestamp": "2024-12-15T04:49:58.508133576Z",
          "updateTimestamp": "2024-12-15T04:49:58.508133736Z",
          "status": "QUEUED",
          "currentOrderIndex": 0,
          "transportOrderDescription": "Creating new TO"
        },
        "constraints": {
          "vehicle": {
            "manufacturer": "ANSCER",
            "serialNumber": "AR001"
          },
          "loads": [
            {
              "type": "BIN",
              "count": 1
            }
          ]
        },
        "orders": [
          {
            "nodes": [
              {
                "nodeId": "10",
                "nodePosition": {},
                "actions": [
                  {
                    "actionType": "pick",
                    "blockingType": "HARD",
                    "actionParameters": [
                      {
                        "key": "lhd",
                        "value": "stroke"
                      },
                      {
                        "key": "loadType",
                        "value": "BIN"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "nodes": [
              {
                "nodeId": "20",
                "nodePosition": {},
                "actions": [
                  {
                    "actionType": "drop",
                    "blockingType": "HARD",
                    "actionParameters": [
                      {
                        "key": "lhd",
                        "value": "stroke"
                      },
                      {
                        "key": "loadType",
                        "value": "BIN"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        "properties": {}
      },
      "success": true,
      "message": "Successfully enqeued transport order"
    }
  ]
}
```
In the above request, a pick and drop action needs to be executed at the specified node or location. The response returns the same structure as the request but with modified content. Also the current status of the transport order is specified as `QUEUED` with some additional status. Possible value for the status include `PROCESSING`, `SUCCEEDED`, `CANCELLING`, `CANCELLED` and `INVALID`. The `INVALID` status is only set if the given transport order is formatted incorrectly or an operation that cannot be executed was given. The `currentOrderIndex` specifies the index of the current order under the `orders` array that is being executed by the FMS. For example if the `currentOrderIndex` is `0`, the FMS will plan for the vehicle to reach the destination with ID `10` and will execute the action with type `pick` with action parameters for load handling device `lhd` set to `stroke` and `loadType` as `BIN`. 

### Updation of Transport Order

A transport order can be updated while the status for it is either `QUEUED` or `PROCESSING`. There are a few points to note while updating a transport order.

- Use the latest updated transport order using the get transport order MQTT topic.
- The transport order to be updated should be retrieved using the transport order ID only. This can then be modified and updated using the update MQTT topic that is explained below.
- Only the `orders` array field and the `status` field should be updated. Updating other fields can lead to undefined behaviours. 
- Appending additional order to the `orders` array field is acceptable.
- Updating current processing order which is indicated by the `currentOrderIndex` is strictly prohibited and doing so can introduce undefined behaviours.
- Updating the constraints while the transport order is in the `PROCESSING` status will have no affect as the vehicle that satisfied the constraint was already selected previously.
- While the external system is still updating the structure of the transport order, the FMS is executing the transport order. The state of the transport order might have changed while the update is being computed. To mitigate this, the external system should compute the update first, get the latest transport order structure, update the structure and execute the update request. 

**Request:**

**MQTT Topic:** `transport_orders/update/request`

```JSON
{
  "updateTransportOrdersRequest": [
    {
      "header": {
        "headerId": 1,
        "transportOrderType": "TRANSPORT",
        "transportOrderId": "TO-0001",
        "tranportOrderInterface": "task_manager_interface_mqtt"
      },
      "status": {
        "startTimestamp": "2024-12-11T11:12:05.983658708Z",
        "updateTimestamp": "2024-12-11T11:12:05.983664365Z",
        "status": "QUEUED",
        "transportOrderDescription": "Creating new TO"
      },
      "constraints": {
        "vehicle": {
          "serialNumber": "AR001",
          "manufacturer": "ANSCER"
        },
        "loads": [
          {
            "type": "BIN",
            "count": 1
          }
        ]
      },
      "orders": [
        {
          "nodes": [
            {
              "nodeId": "10",
              "actions": [
                {
                  "actionType": "pick",
                  "blockingType": "HARD",
                  "actionParameters": [
                    {
                      "key": "lhd",
                      "value": "stroke"
                    },
                    {
                      "key": "loadType",
                      "value": "BIN"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "nodes": [
            {
              "nodeId": "20",
              "actions": [
                {
                  "actionType": "drop",
                  "blockingType": "HARD",
                  "actionParameters": [
                    {
                      "key": "lhd",
                      "value": "stroke"
                    },
                    {
                      "key": "loadType",
                      "value": "BIN"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "nodes": [
            {
              "nodeId": "30",
              "actions": [
                {
                  "actionType": "waitForTrigger",
                  "blockingType": "HARD",
                  "actionParameters": [
                    {
                      "key": "triggerType",
                      "value": "remote"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

**Response:**

**MQTT Topic:** `transport_orders/update/response`

```JSON
{
  "updateTransportOrdersResponse": [
    {
      "transportOrder": {
        "header": {
          "headerId": 1,
          "transportOrderType": "TRANSPORT",
          "transportOrderId": "TO-0001",
          "tranportOrderInterface": "task_manager_interface_mqtt"
        },
        "status": {
          "startTimestamp": "2024-12-15T04:49:58.508133576Z",
          "updateTimestamp": "2024-12-15T04:50:50.514333411Z",
          "status": "QUEUED",
          "currentOrderIndex": 0,
          "transportOrderDescription": "Creating new TO"
        },
        "constraints": {
          "vehicle": {
            "manufacturer": "ANSCER",
            "serialNumber": "AR001"
          },
          "loads": [
            {
              "type": "BIN",
              "count": 1
            }
          ]
        },
        "orders": [
          {
            "nodes": [
              {
                "nodeId": "10",
                "nodePosition": {},
                "actions": [
                  {
                    "actionType": "pick",
                    "blockingType": "HARD",
                    "actionParameters": [
                      {
                        "key": "lhd",
                        "value": "stroke"
                      },
                      {
                        "key": "loadType",
                        "value": "BIN"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "nodes": [
              {
                "nodeId": "20",
                "nodePosition": {},
                "actions": [
                  {
                    "actionType": "drop",
                    "blockingType": "HARD",
                    "actionParameters": [
                      {
                        "key": "lhd",
                        "value": "stroke"
                      },
                      {
                        "key": "loadType",
                        "value": "BIN"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
          "nodes": [
            {
              "nodeId": "30",
              "actions": [
                {
                  "actionType": "waitForTrigger",
                  "blockingType": "HARD",
                  "actionParameters": [
                    {
                      "key": "triggerType",
                      "value": "remote"
                    }
                  ]
                }
              ]
            }
          ]
        }
        ],
        "properties": {}
      },
      "success": true,
      "message": "Successfully updated transport order"
    }
  ]
}
```
In update request structure, after the `drop` action at node with ID `20`, another `waitForTrigger` action was added which is required to be executed at node with ID `30`. If the update was successfully executed then the response will publish the same structure with a new update time. 

### Cancelling a transport order

The following structure specifies the cancellation of a transport order. Once this is requested the vehicle that is associated with the transport order will be cancelled immediately. The following is the JSON request and response structure for cancellation. 

**Request:**

**MQTT Topic:** `transport_orders/cancel/request`

```JSON
{
  "cancelTransportOrdersRequest": {
    "withIds": ["TO-0001"],
    "withStatuses": ["PROCESSING", "QUEUED"],
    "all": false
  }
}
```

**Response:**

**MQTT Topic:** `transport_orders/cancel/response`

```JSON
{
  "cancelTransportOrdersResponse": {
    "transportOrders": [
      {
        "header": {
          "headerId": 1,
          "transportOrderType": "TRANSPORT",
          "transportOrderId": "TO-0001",
          "tranportOrderInterface": "task_manager_interface_mqtt"
        },
        "status": {
          "startTimestamp": "2024-12-15T04:49:58.508536408Z",
          "updateTimestamp": "2024-12-15T04:49:58.508536498Z",
          "status": "CANCELLED",
          "transportOrderDescription": "Creating new TO"
        },
        "constraints": {
          "vehicle": {
            "manufacturer": "ANSCER",
            "serialNumber": "AR001"
          },
          "loads": [
            {
              "type": "BIN",
              "count": 1
            }
          ]
        },
        "orders": [
          {
            "nodes": [
              {
                "nodeId": "10",
                "nodePosition": {},
                "actions": [
                  {
                    "actionType": "pick",
                    "blockingType": "HARD",
                    "actionParameters": [
                      {
                        "key": "lhd",
                        "value": "stroke"
                      },
                      {
                        "key": "loadType",
                        "value": "BIN"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "nodes": [
              {
                "nodeId": "20",
                "nodePosition": {},
                "actions": [
                  {
                    "actionType": "drop",
                    "blockingType": "HARD",
                    "actionParameters": [
                      {
                        "key": "lhd",
                        "value": "stroke"
                      },
                      {
                        "key": "loadType",
                        "value": "BIN"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        "properties": {}
      }
    ],
    "success": true,
    "message": "Cancelled transport orders successfully"
  }
}
```

In the above request for cancelling, an array of transport order IDs in the `withIds` field or all currently `PROCESSING` and `QUEUED` transport orders by specifying it in `withStatuses` field can be used. The response just contains the transport order structure at the time of cancelling and a message saying whether the cancellation was successful or not. It is important to note that even through the cancellation is communicated to the vehicle, the vehicle might not immediately cease all motion. For example, an action that might be running need to be completed before the vehicle is ready to accept any new orders. 

Normal status changes for `QUEUED` transport order will be from `QUEUED` to `CANCELLED`. For transport order with `PROCESSING` status, first the status will be set to `CANCELLING`. After this, an instant action will be sent to the vehicle that was processing the transport order to stop executing the current order. Once the vehicle has successfully stopped and is inactive, the status will be set to `CANCELLED`.

After the cancel instruction is successful the vehicle will be ready to accept new orders from the master control.



### Getting Transport Orders and Statuses

The following request and response structure is used to get the transport orders and their statuses.

**Request:**

**MQTT Topic:** `transport_orders/get/request`

```JSON
{
  "retrieveTransportOrdersRequest": {
    "withIds": ["TO-0001"],
    "withStatuses": ["QUEUED"],
    "all": false
  }
}

```

**Response:**

**MQTT Topic:** `transport_orders/get/response`

```JSON
{
  "retrieveTransportOrdersResponse": {
    "transportOrders": [
      {
        "header": {
          "headerId": 1,
          "transportOrderType": "TRANSPORT",
          "transportOrderId": "TO-0001",
          "tranportOrderInterface": "task_manager_interface_mqtt"
        },
        "status": {
          "startTimestamp": "2024-12-15T04:49:58.508536408Z",
          "updateTimestamp": "2024-12-15T04:49:58.508536498Z",
          "status": "QUEUED",
          "transportOrderDescription": "Creating new TO"
        },
        "constraints": {
          "vehicle": {
            "manufacturer": "ANSCER",
            "serialNumber": "AR001"
          },
          "loads": [
            {
              "type": "BIN",
              "count": 1
            }
          ]
        },
        "orders": [
          {
            "nodes": [
              {
                "nodeId": "STATION-1",
                "nodePosition": {},
                "actions": [
                  {
                    "actionType": "pick",
                    "actionId": "ACT-0001",
                    "blockingType": "HARD",
                    "actionParameters": [
                      {
                        "key": "lhd",
                        "value": "stroke"
                      },
                      {
                        "key": "loadType",
                        "value": "BIN"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "nodes": [
              {
                "nodeId": "STATION-2",
                "nodePosition": {},
                "actions": [
                  {
                    "actionType": "drop",
                    "actionId": "ACT-0002",
                    "blockingType": "HARD",
                    "actionParameters": [
                      {
                        "key": "lhd",
                        "value": "stroke"
                      },
                      {
                        "key": "loadType",
                        "value": "BIN"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        "properties": {}
      }
    ],
    "success": true,
    "message": "Retrieved transport orders successfully"
  }
}
```
In the above get request for the transport orders, multiple transport order IDs in the `withIds` field can be provided or with specific statuses like `QUEUED`, `PROCESSING` or `FINISHED` in the field `withStatuses`. Providing transport order IDs and statueses will retrieve all transport orders which satisfies the given query.
