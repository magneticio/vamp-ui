function Artifacts() {
}

Artifacts.prototype.all = function () {
  return [
    {
      kind: "deployments",
      deployable: true
    },
    {
      kind: "gateways",
      deployable: true,
      artifactsTemplate: 'app/gateways/gateway.html'
    },
    {
      kind: "workflows",
      deployable: true
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
      deployable: false
    }
  ];
};
