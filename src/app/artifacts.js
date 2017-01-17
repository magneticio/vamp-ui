function Artifacts() {
}

Artifacts.prototype.all = function () {
  return [
    {
      kind: "deployments",
      deployable: true,
      artifactViewTemplate: 'app/deployments/deployment.html',
      artifactGridView: 'app/deployments/templates/deploymentGridView.html',
      artifactInfo: [
        {
          title: "Name",
          valuePath: "name",
          type: "string"
        },
        {
          title: "Tags",
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
              value: "memory"
            },
            {
              title: "Instances",
              value: "instances"
            }
          ]
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
          title: "Tags",
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
          title: "Tags",
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
          type: "string"
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
