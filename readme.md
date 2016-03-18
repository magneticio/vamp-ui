# VAMP OSS UI Architecture

The Vamp OSS UI provides an interface to all artefacts accessible via the REST API. Since most of the artefacts share the same capabilities, we opted for an approach which lets us define endpoints and entities following a generic template so that the UI is consistent across artefacts.

## Overview of Artifacts

- `GET|POST|PUT|DELETE /breeds`
- `GET|POST|PUT|DELETE /blueprints`
- `GET|POST|PUT|DELETE /deployments`
	- `GET|POST|PUT /deployments/:id/clusters/:name/routing`
	- `GET|POST|PUT /deployments/:id/clusters/:name/scale`
	- `GET|POST|PUT|DELETE  /deployments/:id/clusters/:name/sla`
- `GET|POST|PUT|DELETE /escalations`
- `POST /events/get | /events`
	- `GET|POST /events/stream` (SSE)
- `GET|POST|PUT|DELETE /filters`
- `GET|POST|PUT|DELETE /gateways`
- `GET|POST|PUT|DELETE /scales`
- `GET|POST|PUT|DELETE /slas`
- `GET|POST|PUT|DELETE /workflows`
	- `GET|POST|PUT|DELETE /scheduled-workflows`

- Debug
	- `/sync` Force sync
	- `/sla` Force SLA check
	- `/escalation` Force escalation
	- `/haproxy` Haproxy Conf.
	- `/reset` Hard reset

## Service architecture

Almost every artefact can be mocked up as a CRUD service. This allows us to define Angular2 routes to all of the artefacts referencing a generic CRUD service. The CRUD service makes sure the correct functions are coupled to the corresponding API endpoints. The payload of any of the requests must be specified by the user in a text-area with YAML/JSON code formatting.

The only exceptions to this service-architecture are the cluster-specific routes, scales & sla's, and the VAMP event-system. A custom service needs to be coded to deal with these artefacts. The SSE coupling specifically needs to be integrated in a responsive metric/chart interface.

## Event service coupling between SSE & other artefacts

## SSE Service?

## Service architecture megastore?
