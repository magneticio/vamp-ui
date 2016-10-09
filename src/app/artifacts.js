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
      deployable: true
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
    }
  ];
};
