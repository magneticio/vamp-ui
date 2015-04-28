var AppDispatcher = require('../dispatcher/AppDispatcher');
var _ = require('underscore');
var DeploymentConstants = require('../constants/DeploymentConstants');
var Api = require('./Api');
var PulseApi = require('./PulseApi');

var DeploymentActions = {

  getAllDeployments: function() {
    // Api.get('/deployments', null, DeploymentConstants.GET_ALL_DEPLOYMENTS)

    // mock response
    response = {}
    response.text = JSON.stringify(mockObj)

    payload = {actionType: DeploymentConstants.GET_ALL_DEPLOYMENTS + '_SUCCESS', response: response }
    console.log('dispatchng')
    AppDispatcher.dispatch(payload)

  },
  getDeployment: function(name) {
    // Api.get('/deployments/' + name, null, DeploymentConstants.GET_DEPLOYMENT)

    response = {}
    response.text = JSON.stringify(mockObj[0])

    payload = {actionType: DeploymentConstants.GET_DEPLOYMENT + '_SUCCESS', response: response }
    AppDispatcher.dispatch(payload)

  },
  getDeploymentAsBlueprint: function(deployment) {
    Api.get('/deployments/' + deployment.name, {as_blueprint: true}, DeploymentConstants.GET_DEPLOYMENT_AS_BLUEPRINT)
  },       
  deleteFullDeployment: function(deployment) {
    var deplAsBlueprint = {}
    var name = deployment.name
    deplAsBlueprint.name = name
    deplAsBlueprint.clusters = _.mapObject(deployment.clusters,function(val,key){ return {services: _.map(val.services,function(service){ return _.omit(service, ['state','servers','scale'])})}});
    Api.del('/deployments/' + name, deplAsBlueprint, DeploymentConstants.DELETE_FULL_DEPLOYMENT);
  },
  cleanUpCurrent: function(deployment) {
    var payload = {actionType: DeploymentConstants.CLEANUP_DEPLOYMENT , response: deployment };
    AppDispatcher.dispatch(payload);
  },
  getDeploymentMetrics: function(deployment, offsetInMinutes) {

    var req = {}
    var time = {}

    var MS_PER_MINUTE = 60000;
    var now = new Date()
    var interval = new Date(now - offsetInMinutes * MS_PER_MINUTE);

    time.from = interval.toISOString()
    time.to = now.toISOString()

    req.tags = []
    req.tags.push(deployment.name)

    req.time = time

    PulseApi.post('/event/get' + name, req, DeploymentConstants.GET_DEPLOYMENT_METRICS)
  }

};

var mockObj = [{
    "name": "f986d9a4-7740-4ffc-8902-cfd89d9853b7",
    "endpoints": {
        "sava.ports.port": 9050
    },
    "clusters": {
        "backend1": {
            "services": [
                {
                    "state": {
                        "name": "ReadyForDeployment",
                        "started_at": "2015-04-14T21:30:27.128Z"
                    },
                    "breed": {
                        "name": "sava_backend1_1_2",
                        "deployable": "magneticio/sava-1.2_backend:0.7.0",
                        "ports": [
                            {
                                "name": "port",
                                "value": "80/http",
                                "direction": "OUT"
                            }
                        ],
                        "environment_variables": [],
                        "dependencies": {}
                    },
                    "scale": {
                        "cpu": 1,
                        "memory": 1024,
                        "instances": 1
                    },
                    "routing": {
                        "weight": 100,
                        "filters": []
                    },
                    "servers": [],
                    "dependencies": {}
                }
            ],
            "routes": {
                "80": 33004
            }
        },
        "backend2": {
            "services": [
                {
                    "state": {
                        "name": "ReadyForDeployment",
                        "started_at": "2015-04-14T21:30:27.128Z"
                    },
                    "breed": {
                        "name": "sava_backend2_1_2",
                        "deployable": "magneticio/sava-1.2_backend:0.7.0",
                        "ports": [
                            {
                                "name": "port",
                                "value": "80/http",
                                "direction": "OUT"
                            }
                        ],
                        "environment_variables": [],
                        "dependencies": {}
                    },
                    "scale": {
                        "cpu": 1,
                        "memory": 1024,
                        "instances": 1
                    },
                    "routing": {
                        "weight": 100,
                        "filters": []
                    },
                    "servers": [],
                    "dependencies": {}
                }
            ],
            "routes": {
                "80": 33005
            }
        },
        "sava": {
            "services": [
                {
                    "state": {
                        "name": "ReadyForDeployment",
                        "started_at": "2015-04-14T21:30:27.128Z"
                    },
                    "breed": {
                        "name": "sava_frontend_1_2",
                        "deployable": "magneticio/sava-1.2_frontend:0.7.0",
                        "ports": [
                            {
                                "name": "port",
                                "value": "80/http",
                                "direction": "OUT"
                            }
                        ],
                        "environment_variables": [
                            {
                                "name": "backend1.host",
                                "alias": "BACKEND_1_HOST",
                                "direction": "IN"
                            },
                            {
                                "name": "backend1.ports.port",
                                "alias": "BACKEND_1_PORT",
                                "direction": "IN"
                            },
                            {
                                "name": "backend2.host",
                                "alias": "BACKEND_2_HOST",
                                "direction": "IN"
                            },
                            {
                                "name": "backend2.ports.port",
                                "alias": "BACKEND_2_PORT",
                                "direction": "IN"
                            }
                        ],
                        "dependencies": {
                            "backend1": {
                                "name": "sava_backend1_1_2"
                            },
                            "backend2": {
                                "name": "sava_backend2_1_2"
                            }
                        }
                    },
                    "scale": {
                        "cpu": 1,
                        "memory": 1024,
                        "instances": 1
                    },
                    "routing": {
                        "weight": 100,
                        "filters": []
                    },
                    "servers": [],
                    "dependencies": {
                        "backend1": "backend1",
                        "backend2": "backend2"
                    }
                }
            ],
            "routes": {
                "80": 33006
            }
        }
    },
    "environment_variables": {
        "backend1.ports.port": 80,
        "backend1.host": "localhost",
        "backend2.ports.port": 80,
        "sava.ports.port": 80,
        "sava.host": "localhost",
        "backend2.host": "localhost"
    }
}]

module.exports = DeploymentActions;