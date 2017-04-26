/* global VAMP */
VAMP.Artifacts = function () {
};

VAMP.Artifacts.prototype.all = function () {
  return [
    {
      kind: "deployments",
      artifactsMainView: {
        templateUrl: 'app/deployments/deployments.html',
        controller: 'deploymentsController',
        gridItem: {
          templateUrl: 'app/deployments/templates/deploymentGridView.html',
          controller: 'DeploymentCtrl'
        },
        tableView: {
          columns: ['name', 'scale', null, null],
          rowTemplateUrl: 'app/deployments/templates/row.html'
        }
      },
      oneMainView: {
        controller: 'DeploymentController',
        templateUrl: 'app/deployments/deployment.html'
      },
      deployable: true,
      artifactInfo: [
        {
          title: "",
          type: "tags",
          tags: [
            {
              value: "artifact.status",
              hasProgress: true,
              success: "artifact.status === 'deployed'",
              inProgress: "artifact.status === 'updating' || artifact.status === 'deploying' || artifact.status === 'undeploying'",
              error: "artifact.status === 'failed'"
            }
          ]
        },
        {
          title: "Scale",
          valuePath: "scale",
          type: "object",
          properties: [
            {
              title: "CPU",
              value: "cpu"
            },
            {
              title: "Memory",
              value: "memory",
              expression: "(artifact.scale.memory | asNumber:0) + ' MB'"
            },
            {
              title: "Instances",
              value: "instances"
            }
          ]
        }
      ],
      actions: [
        {
          name: "export",
          title: "Export as a blueprint",
          action: "exportDeployment",
          class: "btn-primary"
        }
      ]
    },
    {
      kind: "gateways",
      artifactsMainView: {
        templateUrl: 'app/gateways/gateways.html',
        controller: 'gatewaysController',
        gridItem: {
          templateUrl: 'app/gateways/templates/gridView.html'
        },
        tableView: {
          columns: ['name', 'Virtual Hosts', 'Routes', null],
          rowTemplateUrl: 'app/gateways/templates/row.html'
        }
      },
      oneMainView: {
        controller: 'GatewayController',
        templateUrl: 'app/gateways/gateway.html'
      },
      deployable: true
    },
    {
      kind: "workflows",
      artifactsMainView: {
        templateUrl: 'app/workflows/workflows.html',
        controller: 'workflowsController',
        gridItem: {
          templateUrl: 'app/workflows/templates/workflowGridView.html',
          controller: 'WorkflowController'
        },
        tableView: {
          columns: ['name', 'ports', null, null],
          rowTemplateUrl: 'app/workflows/templates/row.html'
        }
      },
      artifactsRightPanel: {
        controller: 'workflowWebPortViewController',
        templateUrl: 'app/workflows/templates/webPort.html'
      },
      deployable: true,
      actions: [
        {
          name: "suspend",
          title: "Suspend",
          action: "suspend",
          active: "item.status === 'running'",
          class: "btn-primary"
        },
        {
          name: "restart",
          title: "Restart",
          action: "restart",
          active: "item.status !== 'suspended'",
          class: "btn-primary"
        },
        {
          name: "start",
          title: "Start",
          action: "start",
          active: "item.status === 'suspended'",
          class: "btn-success"
        }
      ]
    },
    {
      kind: "blueprints",
      artifactsMainView: {
        templateUrl: 'app/blueprints/blueprints.html',
        controller: 'blueprintsController',
        gridItem: {
          templateUrl: 'app/blueprints/templates/blueprintGridView.html',
          controller: 'BlueprintController'
        },
        tableView: {
          columns: ['name', null],
          rowTemplateUrl: 'app/blueprints/templates/row.html'
        }
      },
      actions: [
        {
          name: "deployAs",
          title: "Deploy as",
          action: "deploy",
          class: "btn-primary"
        },
        {
          name: "mergeTo",
          title: "Merge to",
          action: "merge",
          active: "!($artifactCtrl.mergeWith | isEmpty)",
          class: "btn-primary"
        },
        {
          name: "removeFrom",
          title: "Remove from",
          action: "remove",
          class: "btn-danger",
          active: "!($artifactCtrl.removeFrom | isEmpty)"
        }
      ]
    },
    {
      kind: "breeds",
      artifactsMainView: {
        templateUrl: 'app/breeds/breeds.html',
        controller: 'breedsController',
        gridItem: {
          templateUrl: 'app/breeds/templates/breedGridView.html'
        },
        tableView: {
          columns: ['name', 'deployable', 'ports'],
          rowTemplateUrl: 'app/breeds/templates/row.html'
        }
      }
    },
    {
      kind: "scales",
      artifactsMainView: {
        templateUrl: 'app/scales/scales.html',
        controller: 'scalesController',
        gridItem: {
          templateUrl: 'app/scales/templates/scaleGridView.html'
        },
        tableView: {
          columns: ['name', 'cpu', 'memory', 'instances'],
          rowTemplateUrl: 'app/scales/templates/row.html'
        }
      }
    },
    {
      kind: "conditions",
      artifactsMainView: {
        templateUrl: 'app/conditions/conditions.html',
        controller: 'conditionsController',
        gridItem: {
          templateUrl: 'app/conditions/templates/gridView.html'
        },
        tableView: {
          columns: ['name'],
          rowTemplateUrl: 'app/conditions/templates/row.html'
        }
      }
    }
  ];
};
