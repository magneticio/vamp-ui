function Artifacts() {
}

Artifacts.prototype.all = function () {
  return [
    {
      kind: "deployments",
      deployable: true,
      artifactsTemplate: 'app/deployments/deployment.html'
    },
    {
      kind: "gateways",
      deployable: true,
      artifactsTemplate: 'app/gateways/gateway.html'
    },
    {
      kind: "workflows",
      deployable: true,
      artifactsTemplate: 'app/workflows/workflow.html'
    },
    {
      kind: "blueprints",
      deployable: false,
      artifactsTemplate: 'app/blueprints/blueprint.html'
    },
    {
      kind: "breeds",
      deployable: false,
      artifactsTemplate: 'app/breeds/breed.html'
    },
    {
      kind: "scales",
      deployable: false,
      artifactsTemplate: 'app/scales/scale.html'
    }
  ];
};
