---
id: graph-data
title: Graph Data
sidebar_label: Graph Data
---

The MQTT topic graph/data provides structured data about the stations in
the current layout. Below is the detailed structure of the message:

**MQTT Topic: graph/data**

```
uint32 number_of_vertices
graph_msgs/Vertex[] vertices
  uint8 NORMAL=0
  uint8 PARK=1
  uint8 CHARGE=2
  uint8 CONTROL=3
  uint8 REPORT=4
  uint32 id
  string name
  string alias
  uint8 type
geometry_msgs/Pose pose
  geometry_msgs/Point position
  float64 x
  float64 y
  float64 z
  geometry_msgs/Quaternion orientation
  float64 x
  float64 y
  float64 z
  float64 w
```

### Station Information

The topic provides the vertices IDs of stations that can be used as `nodeId` while
calling APIs (e.g., transport_orders/create/request). If the graph changes the `id` for the vertex might change for the same physical location. The `nodeId` in the transport order should be updated accordingly.
