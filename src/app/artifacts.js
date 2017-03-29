/* global VAMP */

VAMP.Artifacts = function () {
};

VAMP.Artifacts.prototype.all = function () {
  return [
    {
      kind: "deployments",
      mainController: 'DeploymentsController',
      deployable: true,
      artifactViewController: 'DeploymentController',
      artifactViewTemplate: 'app/deployments/deployment.html',
      gridViewController: "DeploymentCtrl",
      artifactGridView: 'app/deployments/templates/deploymentGridView.html',
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
      mainController: 'GatewaysController',
      deployable: true,
      artifactViewController: 'GatewayController',
      artifactViewTemplate: 'app/gateways/gateway.html',
      artifactGridView: 'app/gateways/templates/gridView.html',
      artifactInfo: [
        {
          title: "",
          type: "tags",
          tags: [
            {
              value: "artifact.deployed ? 'port : ' + artifact.port : 'deploying'",
              hasProgress: true,
              success: "artifact.deployed",
              inProgress: "!artifact.deployed"
            },
            {
              value: "artifact.internal ? 'internal' : 'external'",
              hasProgress: false
            }
          ]
        },
        {
          title: "Virtual Hosts",
          arrayPath: "virtual_hosts",
          valuePath: "",
          type: "array"

        },
        {
          title: "Routes",
          arrayPath: "routes",
          valuePath: "name",
          type: "array"
        }
      ]
    },
    {
      kind: "workflows",
      mainController: 'WorkflowsController',
      listViewRightPanel: {
        controller: 'workflowWebPortViewController',
        templateUrl: 'app/workflows/templates/webPort.html'
      },
      deployable: true,
      gridViewController: "WorkflowController",
      artifactGridView: 'app/workflows/templates/workflowGridView.html',
      artifactInfo: [
        {
          title: "",
          type: "tags",
          tags: [
            {
              value: "artifact.status",
              hasProgress: true,
              success: "artifact.status === 'running'",
              inProgress: "updating()",
              paused: "artifact.status === 'suspended'"
            },
            {
              value: "'breed: ' + artifact.breed.name",
              hasProgress: false,
              visible: "artifact.breed.name !== undefined"
            },
            {
              value: "'breed: ' + artifact.breed.reference",
              hasProgress: false,
              visible: "artifact.breed.reference !== undefined"
            },
            {
              value: "'schedule : daemon'",
              hasProgress: false,
              visible: "artifact.schedule === 'daemon'"
            },
            {
              value: "'schedule : event'",
              hasProgress: false,
              visible: "!(artifact.schedule.event | isEmpty)"
            },
            {
              value: "'schedule : time'",
              hasProgress: false,
              visible: "!(artifact.schedule.time | isEmpty)"
            }
          ]
        }
      ],
      actions: [
        {
          name: "suspend",
          title: "Suspend",
          action: "suspend",
          active: "artifact.status === 'running'",
          class: "btn-primary"
        },
        {
          name: "restart",
          title: "Restart",
          action: "restart",
          active: "artifact.status !== 'suspended'",
          class: "btn-primary"
        },
        {
          name: "start",
          title: "Start",
          action: "start",
          active: "artifact.status === 'suspended'",
          class: "btn-success"
        }
      ]
    },
    {
      kind: "blueprints",
      mainController: "BlueprintsController",
      artifactGridView: 'app/blueprints/templates/blueprintGridView.html',
      gridViewController: "BlueprintController",
      artifactInfo: [
      ],
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
      mainController: 'BreedsController',
      artifactGridView: 'app/breeds/templates/breedGridView.html',
      artifactInfo: [
        {
          title: "Deployable",
          valuePath: "deployable.type",
          type: "string"
        },
        {
          title: "Ports",
          arrayPath: "ports",
          type: "array",
          expression: "item.name + ' : ' + item.value"
        }
      ]
    },
    {
      kind: "scales",
      mainController: 'ArtifactsController',
      artifactGridView: 'app/scales/templates/scaleGridView.html',
      artifactInfo: [
        {
          title: "CPU",
          valuePath: "cpu",
          type: "string"
        },
        {
          title: "Memory",
          valuePath: "memory",
          type: "string",
          expression: "(artifact.memory | asNumber:0) + ' MB'"
        },
        {
          title: "Instances",
          valuePath: "instances",
          type: "string"
        }
      ]
    },
    {
      kind: "conditions",
      mainController: 'ArtifactsController',
      artifactGridView: 'app/conditions/templates/gridView.html',
      artifactInfo: [
        {
          title: "Condition",
          valuePath: "condition",
          type: "string"
        }
      ]
    }
  ];
};
