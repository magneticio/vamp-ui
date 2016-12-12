function Help() {
}

Help.prototype.entries = function () {
  return {
    default: {
      description: "Default help links:",
      links: [
        {
          title: 'Vamp documentation home',
          url: 'http://vamp.io/documentation/'
        }
      ]
    },
    deployments: {
      description: "Deployment help links:",
      links: [
        {
          title: 'Vamp documentation home',
          url: 'http://vamp.io/documentation/'
        },
        {
          title: 'Deployments',
          url: 'http://vamp.io/documentation/using-vamp/deployments/'
        }
      ]
    },
    gateways: {
      description: "",
      links: [
        {
          title: 'Vamp documentation home',
          url: 'http://vamp.io/documentation/'
        },
        {
          title: 'Gateways',
          url: 'http://vamp.io/documentation/using-vamp/gateways/'
        }
      ]
    },
    workflows: {
      description: "",
      links: [
        {
          title: 'Vamp documentation home',
          url: 'http://vamp.io/documentation/'
        },
        {
          title: 'Workflows',
          url: 'http://vamp.io/documentation/using-vamp/workflows/'
        }
      ]
    }
  };
};
