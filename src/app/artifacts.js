function Artifacts() {
}

Artifacts.prototype.all = function () {
  return [
    {
      kind: "deployments",
      deployable: true,
      artifactViewTemplate: 'app/deployments/deployment.html'
    },
    {
      kind: "gateways",
      deployable: true,
      artifactViewTemplate: 'app/gateways/gateway.html'
    },
    {
      kind: "workflows",
      deployable: true
    },
    {
      kind: "blueprints"
    },
    {
      kind: "breeds"
    },
    {
      kind: "scales"
    },
    {
      kind: "conditions"
    }
  ];
};
