function Artifacts() {
}

Artifacts.prototype.all = function () {
  return [
    {
      kind: "deployments",
      deployable: true,
      artifactViewTemplate: 'app/deployments/deployment.html',
      artifactController: "DeploymentCtrl",
      artifactGridView: 'app/deployments/templates/deploymentGridView.html',
      artifactInfo: [
        {
          title: "Name",
          valuePath: "name",
          type: "string"
        },
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
      deployable: true,
      artifactViewTemplate: 'app/gateways/gateway.html',
      artifactGridView: 'app/gateways/templates/gridView.html',
      artifactInfo: [
        {
          title: "Name",
          valuePath: "name",
          type: "string"
        },
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
      deployable: true,
      artifactController: "WorkflowController",
      artifactGridView: 'app/workflows/templates/workflowGridView.html',
      artifactInfo: [
        {
          title: "Name",
          valuePath: "name",
          type: "string"
        },
        {
          title: "",
          type: "tags",
          tags: [
            {
              value: "artifact.status",
              hasProgress: true,
              success: "artifact.status === 'running'",
              inProgress: "$ctrl.updating()",
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
      artifactGridView: 'app/blueprints/templates/blueprintGridView.html',
      artifactController: "BlueprintController",
      artifactInfo: [
        {
          title: "Name",
          valuePath: "name",
          type: "string"
        }
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
          active: "!($ctrl.mergeWith | isEmpty)",
          class: "btn-primary"
        },
        {
          name: "removeFrom",
          title: "Remove from",
          action: "remove",
          class: "btn-danger",
          active: "!($ctrl.removeFrom | isEmpty)"
        }
      ]
    },
    {
      kind: "breeds",
      artifactGridView: 'app/breeds/templates/breedGridView.html',
      artifactInfo: [
        {
          title: "Name",
          valuePath: "name",
          type: "string"
        },
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
      artifactGridView: 'app/scales/templates/scaleGridView.html',
      artifactInfo: [
        {
          title: "Name",
          valuePath: "name",
          type: "string"
        },
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
      artifactGridView: 'app/conditions/templates/gridView.html',
      artifactInfo: [
        {
          title: "Name",
          valuePath: "name",
          type: "string"
        },
        {
          title: "Condition",
          valuePath: "condition",
          type: "string"
        }
      ]
    }
  ];
};
