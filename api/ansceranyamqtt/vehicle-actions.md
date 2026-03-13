---
id: vehicles-actions
title: Vehicles & Actions
sidebar_label: Vehicles & Actions
---

## Vehicles

For the transport orders to be executed there should be vehicles that are be availble to the FMS. Vehicles in the FMS are identified by using the manufacturer and serial number. This ensures that no name collisions will happen between the vehicles with respect to the manufacturer or serial number. For additional topics and data pertaining to individual vehicles in the system, please refer to the VDA5050 v2.0.0 document. 

<!-- ### Get Vehicles

The get vehicles request topic can be used to get all the vehicles that are currently available to the system or it can be used to retrieve information about a list of vehicles that are currently available. The vehicle might be `ONLINE` or `OFFLINE`, this can also be specified to filter the result of the get vehicles operation.

**Request:**

**MQTT Topic:** `/vehicles/v1/get/request`

```JSON
{
  "retrieveVehiclesRequest": {
    "retrieveVehiclesWithIds": [
      {
        "manufacturer": "ANSCER",
        "serialNumber": "AR001"
      }   
    ],
    "retrieveVehiclesWithConnectionStatus": [
      "ONLINE",
      "OFFLINE"
    ],
    "retrieveAll": false
  }
}
```

**Response:**

**MQTT Topic:** `/vehicles/v1/get/response`

```JSON
{
  "retrievedVehiclesResponse": [
    {
      "manufacturer": "ANSCER",
      "serialNumber": "AR001",
      "type": "CARRIER",
      "connectionState": "ONLINE",
      "batteryPercentage": "100",
      "loaded": true,
      "paused": false,
      "e_stop": false
    }
  ],
  "success": true,
  "message": "Vehicles retrieved successfully"
}
```
In the above request, a list of vehicle IDs are given. In addition to this,  vehicle with connection statuses or all vehicle in the fleet can be retreived.

The response contains the list of vehicles that was retreived, each element containing basic information about the state of the vehicle.
The type of the vehicle can be `CARRIER`, `TUGGER`, `CONVEYOR` or `FORKLIFT`. Some addtional information about the current vehicle state is also provided. -->

### Pause Vehicles

The following topics can be used to pause vehicles. Vehicle IDs can be given to the request or all vehicles in the system can be paused.

**Request:**

**MQTT Topic:** `task_manager/vehicles/pause/request`

```JSON
{
  "pauseVehiclesRequest": {
    "vehicleIds": [
      {
        "manufacturer": "ANSCER",
        "serialNumber": "AR001"
      }
    ],
    "all": false
  }
}
```
**Response:**

**MQTT Topic:** `task_manager/vehicles/pause/response`

```JSON
{
  "pauseVehiclesResponse": {
    "vehicleIds": [
      {
        "manufacturer": "ANSCER",
        "serialNumber": "AR001"
      }
    ],
    "success": true,
    "message": "Successfully paused specified vehicles"
  }
}
```

The response contains the list of vehicles that were paused. Please note that even though the command to pause the vehicle is received, the vehicle will continue to move or completed an action that was previously initiated. This might be because the action cannot be interrupted and is under the vehicle's discretion as to when it should stop all movement. The transport order associated with the vehicle will reflect no changes with the status being set to `PROCESSING`. 

The pause request topic can be used when an emergency situation arises in the plant were all machines and vehicles needs to be paused or stopped for safety.

### Resume Vehicle

The following topics can be used to resume vehicles that were previously paused.

**Request:**

**MQTT Topic:** `task_manager/vehicles/resume/request`

```JSON
{
  "resumeVehiclesRequest": {
    "vehicleIds": [
      {
        "manufacturer": "ANSCER",
        "serialNumber": "AR001"
      }
    ],
    "all": false
  }
}
```
**Response:**

**MQTT Topic:** `task_manager/vehicles/resume/response`

```JSON
{
  "resumeVehiclesResponse": {
    "vehicleIds": [
      {
        "manufacturer": "ANSCER",
        "serialNumber": "AR001"
      }
    ],
    "success": true,
    "message": "Successfully resumed specified vehicles"
  }
}
```

The response contains the list of vehicles that were resumed and has started to execute the orders that was assigned to it. 

## Instant Actions

Instant actions are sent to the vehicle to be executed instantly. The instant action needs to be specified for a vehicle by  and will be executed only by that vehicle. The actions provided in the instant actions are not associated with any transport orders. These actions are executed independently.

**Request:** 

**MQTT Topic:** `task_manager/instant_actions_array/request`

```JSON
{
  "sendInstantActionsArrayRequest":[
    {
      "headerId": "0",
      "timestamp": "2025-05-01T12:00:00Z",
      "manufacturer": "ANSCER",
      "serialNumber": "AR001",
      "version": "v2.0.0",
      "actions": [
        {
          "actionId": "ACT-0003",
          "actionType": "remoteConfirmation",
          "blockingType": "SOFT",
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
```

**Response:**

**MQTT Topic:** `task_manager/instant_actions_array/response`

```JSON
{
  "sendInstantActionsArrayResponse": {
    "instantActionsArray": [
      {
        "headerId": 0,
        "timestamp": "2025-05-01T12:00:00Z",
        "version": "v2.0.0",
        "manufacturer": "ANSCER",
        "serialNumber": "AR001",
        "actions": [
          {
            "actionType": "remoteConfirmation",
            "actionId": "ACT-0003",
            "actionDescription": "",
            "blockingType": "SOFT",
            "actionParameters": [
              {
                "key": "triggerType",
                "value": "use"
              }
            ]
          }
        ]
      }
    ],
    "success": true,
    "message": "Given instant actions array sent successfully"
  }
}
```

In the above example, a remote confirmation is send to the vehicle to confirm some operation being executed at the vehicle level. Other instant actions include `stateRequest` and `factsheetRequest`.
For more information on actions please refer the VDA5050 document.

## Actions

Actions can be executed at a specific node or it can be executed as instant action by the vehicle.

The following actions can be executed only at specific node or location and can be used as part of the `orders` during the creation of transport orders.

| Action Type | Action Parameters with Default Values | Blocking Type | Remarks |
| --- | --- | --- | --- |
| `waitForTrigger` | `triggerType: remote` or `triggerType: user` | `HARD` | Can be used for user as well as remote confirmation |
| `pick` | `lhd: stroke` and `loadType: BIN` | `HARD` | For picking a load using a particular load handling device and load type |
| `drop` | `lhd: stroke` and `loadType: BIN` | `HARD` | For dropping a load using a particular load handling device and load type |
| `startCharging` | No parameters | `HARD`   | To command the vehicle to start charging (Automatically done by the FMS)
<!-- TODO: Stop charging should be also executable as part of the order -->

The following actions can be executed only as an instant actions. Please refer the instant actions section for how to structure the message.

| Action Type | Action Parameters with Default Values | Blocking Type | Remarks |
| --- | --- | --- | --- |
|`remoteConfirmation`| `triggerType: remote` or `triggerType: user` | `HARD` |  Can be used to confirm a `waitForTrigger` action being executed at the vehicle
| `stateRequest` | No parameters | `HARD` | For requesting the current state for the vehicle
| `factsheetRequest` | No parameters | `HARD` | For requesting the current factsheet for the vehicle
| `stopCharging` | No parameters | `HARD` | To command the vehicle to stop charging (Automatically done by the FMS)
