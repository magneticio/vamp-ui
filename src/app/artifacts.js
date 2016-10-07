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
      kind: "blueprints",
      deployable: false
    },
    {
      kind: "breeds",
      deployable: false
    },
    {
      kind: "scales",
      deployable: false
    }
  ];
};
