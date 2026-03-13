---
id: events
title: Update Events
sidebar_label: Events
---

### Transport Order Update Events

As the FMS processes the given transport orders to completion, updates on the transport order are given over a separate topic. These update events
can be generated beacuse an order in the `orders` array was completed and the next order is going to be executed. Another reason could be the status of the transport order changed. For receiving the updates the following topic can be used. The `currentOrderIndex` will provide the current order in `orders` array that is being actively executed by the task manager. The `currentOrder` field containts the order that is sent to the vehicle for executed. This is according to the VDA5050 order message structure.

**MQTT Topic:** `transport_orders/events/updated`

**Message:**

```JSON
{
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
        "updateTimestamp": "2024-12-15T04:51:43.508536498Z",
        "status": "PROCESSING",
        "currentOrderIndex": 0,
        "currentOrder": {
          "headerId": 398,
          "timestamp": "2025-06-04T10:43:27.849876950Z",
          "version": "v2.0.0",
          "manufacturer": "ANSCER",
          "serialNumber": "AR001",
          "orderId": "43dd0f67-18ca-484c-bdde-5c8c4a0d302c-39",
          "orderUpdateId": 2,
          "zoneSetId": "",
          "nodes": [
            {
              "nodeId": "7",
              "sequenceId": 1415,
              "nodeDescription": "",
              "released": true,
              "nodePosition": {
                "x": 51.2111,
                "y": 13.7395,
                "theta": 3.141592653589793,
                "allowedDeviationXY": 1,
                "allowedDeviationTheta": 3.141592653589793,
                "mapId": "map",
                "mapDescription": ""
              },
              "actions": []
            },
            {
              "nodeId": "10",
              "sequenceId": 1416,
              "nodeDescription": "",
              "released": true,
              "nodePosition": {
                "x": 51.2111,
                "y": 14.0395,
                "theta": 1.5707963267948963,
                "allowedDeviationXY": 1,
                "allowedDeviationTheta": 3.141592653589793,
                "mapId": "map",
                "mapDescription": ""
              },
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
          ],
          "edges": [
            {
              "edgeId": "7---10",
              "sequenceId": 1,
              "edgeDescription": "",
              "released": true,
              "startNodeId": "7",
              "endNodeId": "10",
              "maxSpeed": 0,
              "maxHeight": 0,
              "minHeight": 0,
              "orientation": 0,
              "orientationType": "",
              "direction": "",
              "rotationAllowed": false,
              "maxRotationSpeed": "",
              "trajectory": {
                "degree": 0,
                "knotVector": [],
                "controlPoints": []
              },
              "length": 0,
              "actions": []
            }
          ]
        },
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
  ]
}
```
In the above example for an event topic, the status of the order changed from `QUEUED` to `PROCESSING`.

### Connection Update Events

The connection update from individual vehicles are collected into a single array for ease of data access. This contains information about which all vehicles are connected to the FMS and `ONLINE`. This uses the same message structure as defined in VDA5050. Below is an example JSON payload for the connection array messags from different vehicles under the array field `connectionArray`.

**MQTT Topic:** `vehicle_connection_array/events/updated`

**Message:**

```JSON
{
  "connectionArray": [
    {
      "headerId": 1,
      "timestamp": "2025-06-04T11:09:55.719358306Z",
      "version": "v2.0.0",
      "manufacturer": "ANSCER",
      "serialNumber": "AR001",
      "connectionState": "ONLINE"
    },
    {
      "headerId": 1,
      "timestamp": "2025-06-04T11:09:55.719358306Z",
      "version": "v2.0.0",
      "manufacturer": "ANSCER",
      "serialNumber": "AR002",
      "connectionState": "OFFLINE"
    },
    {
      "headerId": 1,
      "timestamp": "2025-06-04T11:09:55.719358306Z",
      "version": "v2.0.0",
      "manufacturer": "ANSCER",
      "serialNumber": "AR003",
      "connectionState": "CONNECTIONBROKEN"
    }
  ]
}
```

### State Update Events

The state updates from individual vehicle are collected into one array structure. This can also be utilized to make control flow decisions based upto date state information coming from the vehicles. This adheres to the VDA5050 state message structure, but each vehicle's updates is appended to an array with field name `stateArray`. Please not that multiple state updates from the same vehicle can be present in a single message. For brevity some of the fields ignored. 

The message structure example given below contains a state update coming from a single vehicle. In this, a `actionStates` array field contains the action to be executed at node with ID `10`. The status of the action is currently waiting but on the vehicle has reached the node or when the `lastNodeId` field is `10` the action status field will change from `WAITING` to `RUNNING` while executing the pick operation and finally to `FINISHED` once the pick operation is completed.

**MQTT Topic:** `vehicle_state_array/events/updated`

**Message:**

```JSON
{
  "stateArray":[
    {
      "headerId": 233,
      "timestamp": "2025-06-04T11:10:08.419598408Z",
      "version": "v2.0.0",
      "manufacturer": "ANSCER",
      "serialNumber": "AR001",
      "orderId": "86bc7a1f-cf50-460d-8834-c9fdd1036e34-12",
      "orderUpdateId": 13,
      "lastNodeId": "738",
      "lastNodeSequenceId": 149,
      "nodeStates": [
        {
          "nodeId": "741",
          "sequenceId": 150,
          "nodePosition": {
            "x": 47.4451,
            "y": 17.5333,
            "allowedDeviationXY": 1,
            "allowedDeviationTheta": 3.141592653589793,
            "mapId": "map"
          },
          "released": true
        },
        {
          "nodeId": "126",
          "sequenceId": 151,
          "nodePosition": {
            "x": 47.6561,
            "y": 17.5333,
            "allowedDeviationXY": 1,
            "allowedDeviationTheta": 3.141592653589793,
            "mapId": "map"
          },
          "released": true
        },
        {
          "nodeId": "7",
          "sequenceId": 152,
          "nodePosition": {
            "x": 47.856100000000005,
            "y": 17.5333,
            "allowedDeviationXY": 1,
            "allowedDeviationTheta": 3.141592653589793,
            "mapId": "map"
          },
          "released": true
        },
        {
          "nodeId": "10",
          "sequenceId": 153,
          "nodePosition": {
            "x": 47.9561,
            "y": 17.5333,
            "allowedDeviationXY": 1,
            "allowedDeviationTheta": 3.141592653589793,
            "mapId": "map"
          },
          "released": true
        }
      ],
      "edgeStates": [
        {
          "edgeId": "738---741",
          "sequenceId": 6,
          "released": true,
          "trajectory": {}
        },
        {
          "edgeId": "741---126",
          "sequenceId": 7,
          "released": true,
          "trajectory": {}
        },
        {
          "edgeId": "126---2669",
          "sequenceId": 8,
          "released": true,
          "trajectory": {}
        },
        {
          "edgeId": "7---10",
          "sequenceId": 9,
          "released": true,
          "trajectory": {}
        }
      ],
       "actionStates": [
        {
          "actionId": "ACT-0001",
          "actionType": "pick",
          "actionDescription": "Pick up load from station with node ID 10",
          "actionStatus": "WAITING"
        }
      ],
      "agvPosition": {
        "positionInitialized": true,
        "localizationScore": 1,
        "x": 47.1451,
        "y": 17.5333,
        "mapId": "map"
      },
      "velocity": {},
      "paused": false,
      "driving": true,
      "newBaseRequest": true,
      "batteryState": {
        "batteryCharge": 100,
        "batteryVoltage": 48,
        "batteryHealth": 100,
        "reach": 10000
      },
      "operatingMode": "AUTOMATIC",
      "safetyState": {
        "eStop": "NONE",
        "fieldBreach": false
      }
    }
  ]
}
```
