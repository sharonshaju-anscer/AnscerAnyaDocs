---
id: introduction
title: Introduction
sidebar_label: Introduction
slug: /
---

This document contains basic documentation of the MQTT API for interacting and interfacing with the ANSCER Fleet software. Since MQTT does not have services, the request and response is split over two topics. The document is subject to change as the API evolves to meet real world and internal requirements. The API requires an MQTT client to be connected to the broker. To connect it, the IP address and port of it is required. Only the JSON body of the request message and the response message is discussed in this document. 