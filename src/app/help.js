function Help() {
}

Help.prototype.entries = function () {
  return {
    default: {
      description: "Vamp works with a few basic entities or artifacts.",
      links: [
        {
          title: 'Deployments',
          url: 'http://vamp.io/documentation/using-vamp/deployments/'
        },
        {
          title: 'Gateways',
          url: 'http://vamp.io/documentation/using-vamp/gateways/'
        },
        {
          title: 'Workflows',
          url: 'http://vamp.io/documentation/using-vamp/workflows/'
        },
        {
          title: 'Blueprints',
          url: 'http://vamp.io/documentation/using-vamp/blueprints/'
        },
        {
          title: 'Breeds',
          url: 'http://vamp.io/documentation/using-vamp/breeds/'
        },
        {
          title: 'Scales',
          url: 'http://vamp.io/documentation/using-vamp/blueprints/#scale'
        },
        {
          title: 'Tutorials home',
          url: 'http://vamp.io/documentation/tutorials/'
        },
        {
          title: 'Documentation home',
          url: 'http://vamp.io/documentation/'
        }
      ]
    },
    deployments: {
      description: "Deployments are running blueprints. You can track the health of deployed clusters and their services here and adjust their scale.",
      links: [
        {
          title: 'Using deployments',
          url: 'http://vamp.io/documentation/using-vamp/deployments/'
        },
        {
          title: 'Tutorial: Deploy your first Blueprint',
          url: 'http://vamp.io/documentation/tutorials/deploy-your-first-blueprint/'
        },
        {
          title: 'Tutorial: Deploy Wordpress with mySQL',
          url: 'http://vamp.io/documentation/tutorials/deploy-wordpress-and-mysql/'
        }
      ]
    },
    gateways: {
      description: "Gateways are the stable routing endpoints defined by a port (incoming) and routes (outgoing). You can monitor incoming traffic here and manage traffic distribution using weights and conditions.",
      links: [
        {
          title: 'Using gateways',
          url: 'http://vamp.io/documentation/using-vamp/gateways/'
        },
        {
          title: 'Using conditions',
          url: 'http://vamp.io/documentation/using-vamp/conditions/'
        },
        {
          title: 'Using virtual hosts',
          url: 'http://vamp.io/documentation/using-vamp/virtual-hosts/'
        },
        {
          title: 'Tutorial: Deploy Wordpress with mySQL',
          url: 'http://vamp.io/documentation/tutorials/deploy-wordpress-and-mysql/'
        }
      ]
    },
    workflows: {
      description: "Workflows are apps (services) deployed on cluster, used for dynamically changing the runtime configuration (e.g. SLA, scaling, condition weight update). use this page to deploy and update workflows.",
      links: [
        {
          title: 'Using workflows',
          url: 'http://vamp.io/documentation/using-vamp/workflows/'
        },
        {
          title: 'Tutorial: Automate a canary release',
          url: 'http://vamp.io/documentation/tutorials/automate-a-canary-release/ '
        }
      ]
    },
    blueprints: {
      description: "Blueprints are static artifacts that describe how breeds work in runtime and what properties they should have. Create and store blueprints here ready for deployment.",
      links: [
        {
          title: 'Using blueprints',
          url: 'http://vamp.io/documentation/using-vamp/blueprints/'
        },
        {
          title: 'Merging a blueprint with a running deployment',
          url: 'http://vamp.io/documentation/using-vamp/blueprints/'
        },
        {
          title: 'Tutorial: Deploy your first Blueprint',
          url: 'http://vamp.io/documentation/tutorials/deploy-your-first-blueprint/'
        },
        {
          title: 'Tutorial: Deploy Wordpress with mySQL',
          url: 'http://vamp.io/documentation/tutorials/deploy-wordpress-and-mysql/'
        }
      ]
    },
    breeds: {
      description: "Breeds describe single services and their dependencies. Breeds stored here can be referenced by blueprints and/or workflows as part of a deployment.",
      links: [
        {
          title: 'Using breeds',
          url: 'http://vamp.io/documentation/using-vamp/breeds/'
        },
        {
          title: 'Tutorial: Deploy your first Blueprint',
          url: 'http://vamp.io/documentation/tutorials/deploy-your-first-blueprint/'
        },
        {
          title: 'Tutorial: Deploy Wordpress with mySQL',
          url: 'http://vamp.io/documentation/tutorials/deploy-wordpress-and-mysql/'
        }
      ]
    },
    scales: {
      description: "Scales define the size of a deployed service. Scales stored here can be referenced by blueprints and/or workflows to apply to a deployment.",
      links: [
        {
          title: 'Using scales',
          url: 'http://vamp.io/documentation/using-vamp/blueprints/#scale'
        },
        {
          title: 'Tutorial: Deploy your first Blueprint',
          url: 'http://vamp.io/documentation/tutorials/deploy-your-first-blueprint/'
        },
        {
          title: 'Tutorial: Deploy Wordpress with mySQL',
          url: 'http://vamp.io/documentation/tutorials/deploy-wordpress-and-mysql/'
        }
      ]
    }
  };
};
