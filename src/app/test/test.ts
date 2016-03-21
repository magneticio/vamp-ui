import {Component} from 'angular2/core';
import {Editor} from '../editor/editor';

@Component({
  selector: 'test',
  templateUrl: 'app///test/test.html',
  styleUrls: ['app///test/test.css'],
  providers: [],
  directives: [Editor],
  pipes: []
})
export class Test {

  welcome = `name: monarchs:1.5
gateways:
  '9090':
    sticky: none
    routes:
      frontend/port:
        weight: null
        filters: []
        rewrites: []
clusters:
  frontend:
    services:
    - breed:
        name: monarch_front:0.1
        deployable: docker://magneticio/monarch:0.1
        ports:
          port: 8080/http
        environment_variables:
          backend[BACKEND]: http://$backend.host:$backend.ports.port/api/message
        constants: {}
        arguments: []
        dependencies:
          backend: monarch_backend:0.1
      environment_variables: {}
      scale:
        cpu: 0.5
        memory: 128.0MB
        instances: 1
      arguments: []
      dialects: {}
    - breed:
        name: monarch_front:0.3
        deployable: docker://magneticio/monarch:0.1
        ports:
          port: 8080/http
        environment_variables:
          backend[BACKEND]: http://$backend.host:$backend.ports.port/api/message
        constants: {}
        arguments: []
        dependencies:
          backend: monarch_backend:0.1
      environment_variables: {}
      scale:
        cpu: 0.5
        memory: 128.0MB
        instances: 1
      arguments: []
      dialects: {}
    - breed:
        name: monarch_front:0.4
        deployable: docker://magneticio/monarch:0.1
        ports:
          port: 8080/http
        environment_variables:
          backend[BACKEND]: http://$backend.host:$backend.ports.port/api/message
        constants: {}
        arguments: []
        dependencies:
          backend: monarch_backend:0.1
      environment_variables: {}
      scale:
        cpu: 0.5
        memory: 128.0MB
        instances: 1
      arguments: []
      dialects: {}
    - breed:
        name: monarch_front:0.2
        deployable: docker://magneticio/monarch:0.2
        ports:
          port: 8080/http
        environment_variables: {}
        constants: {}
        arguments: []
        dependencies: {}
      environment_variables: {}
      scale:
        cpu: 0.5
        memory: 256.0MB
        instances: 1
      arguments: []
      dialects: {}
    routing:
      port:
        sticky: none
        routes:
          monarch_front:0.1:
            weight: 75%
            filters: []
            rewrites: []
          monarch_front:0.2:
            weight: 5%
            filters: []
            rewrites: []
          monarch_front:0.3:
            weight: 10%
            filters: []
            rewrites: []
          monarch_front:0.4:
            weight: 10%
            filters: []
            rewrites: []
    dialects: {}
  backend:
    services:
    - breed:
        name: monarch_backend:0.1
        deployable: docker://magneticio/monarch:0.2
        ports:
          port: 8080/http
        environment_variables: {}
        constants: {}
        arguments: []
        dependencies: {}
      environment_variables: {}
      arguments: []
      dialects: {}
    routing: {}
    dialects: {}
environment_variables: {}
`

  constructor() {}

}
