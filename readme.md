# VAMP OSS UI Architecture

The Vamp OSS UI provides an interface to all artifacts accessible via the REST API. Since most of the artifacts share the same capabilities, we opted for an approach which lets us define endpoints and entities following a generic template so that the UI is consistent across artifacts.

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

Almost every artefact can be mocked up as a CRUD service. This allows us to define Angular2 routes to all of the artifacts referencing a generic CRUD service. The CRUD service makes sure the correct functions are coupled to the corresponding API endpoints. The payload of any of the requests must be specified by the user in a text-area with YAML/JSON code formatting.

The only exceptions to this service-architecture are the cluster-specific routes, scales & SLA's, and the VAMP event-system. A custom service needs to be coded to deal with these artifacts. The SSE coupling specifically needs to be integrated in a responsive metric/chart interface.

## Event service coupling between SSE & other artifacts

This might act as an interface between Server Side Events and the Stores discussed below.

## Service architecture stores

The VAMP OS UI has a generic Store service which provides an interface to all default artifact methods (e.g. `GET|POST|PUT|DELETE`) which are consumed by the API service. For each of the artifacts the generic Store is extended with per-artifact custom functionality. E.g. in the case of Blueprints the Store might be extended with `addCluster()` or similar methods. These methods provide mappings (with optional payloads) to generic API calls via the API service.

## Reading material:

- https://coryrylan.com/blog/angular-2-observable-data-services
- http://blog.jhades.org/how-to-build-angular2-apps-using-rxjs-observable-data-services-pitfalls-to-avoid/
- http://blog.jhades.org/functional-reactive-programming-for-angular-2-developers-rxjs-and-observables/
