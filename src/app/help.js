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
          title: 'Tutorial: Deploy your first blueprint',
          url: 'http://vamp.io/documentation/tutorials/deploy-your-first-blueprint/'
        },
        {
          title: 'Tutorial: Deploy Wordpress with mySQL',
          url: 'http://vamp.io/documentation/tutorials/deploy-wordpress-and-mysql/'
        }
      ]
    },
    gateways: {
      description: "Gateways are stable routing endpoints defined by a port (incoming) and routes (outgoing). You can monitor incoming traffic here and manage traffic distribution.",
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
      description: "Workflows are apps (services) deployed on cluster to measure activity and dynamically change the runtime configuration. You can use this page to create your own workflows. Note that the Health and Metrics workflows are required by the Vamp UI.",
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
      description: "Blueprints are static artifacts. They describe how breeds work in runtime and what properties they should have. You can create, edit and deploy blueprints from here.",
      links: [
        {
          title: 'Using blueprints',
          url: 'http://vamp.io/documentation/using-vamp/blueprints/'
        },
        {
          title: 'Merging a blueprint with a running deployment',
          url: 'http://vamp.io/documentation/using-vamp/deployments/#deployment-scenarios'
        },
        {
          title: 'Tutorial: Deploy your first blueprint',
          url: 'http://vamp.io/documentation/tutorials/deploy-your-first-blueprint/'
        },
        {
          title: 'Tutorial: Deploy Wordpress with mySQL',
          url: 'http://vamp.io/documentation/tutorials/deploy-wordpress-and-mysql/'
        }
      ]
    },
    breeds: {
      description: "Breeds are static artifacts that describe single services and their dependencies. Breeds stored here can be referenced in blueprints as part of a deployment or used as a workflow.",
      links: [
        {
          title: 'Using breeds',
          url: 'http://vamp.io/documentation/using-vamp/breeds/'
        },
        {
          title: 'Tutorial: Deploy your first blueprint',
          url: 'http://vamp.io/documentation/tutorials/deploy-your-first-blueprint/'
        },
        {
          title: 'Tutorial: Deploy Wordpress with mySQL',
          url: 'http://vamp.io/documentation/tutorials/deploy-wordpress-and-mysql/'
        }
      ]
    },
    scales: {
      description: "Scales are static artifacts that define the size of a deployed service. Scales stored here can be referenced in blueprints as part of a deployment or applied to a workflow.",
      links: [
        {
          title: 'Using scales',
          url: 'http://vamp.io/documentation/using-vamp/blueprints/#scale'
        },
        {
          title: 'Tutorial: Deploy your first blueprint',
          url: 'http://vamp.io/documentation/tutorials/deploy-your-first-blueprint/'
        },
        {
          title: 'Tutorial: Deploy Wordpress with mySQL',
          url: 'http://vamp.io/documentation/tutorials/deploy-wordpress-and-mysql/'
        }
      ]
    },
    conditions: {
      description: "Conditions are static artifacts that define filters for incoming traffic. They can be stored here, then referenced and applied to gateways to target specific traffic for routing between services.",
      links: [
        {
          title: 'Using conditions',
          url: 'http://vamp.io/documentation/using-vamp/conditions/'
        },
        {
          title: 'Using gateways',
          url: 'http://vamp.io/documentation/using-vamp/gateways/'
        },    
        {
          title: 'Tutorial: Run a canary release',
          url: 'http://vamp.io/documentation/tutorials/run-a-canary-release/'
        }
      ]
    },
    configuration: {
      description: "The current, applied Vamp configuration can be reviewed and updated here. Updates are stored in the key value store.",
      links: [
        {
          title: 'How to configure Vamp',
          url: 'http://vamp.io/documentation/installation/configure-vamp/'
        },
        {
          title: 'Vamp configuration reference',
          url: 'http://vamp.io/documentation/installation/configuration-reference/'
        },
        {
          title: 'Vamp troubleshooting',
          url: 'http://vamp.io/documentation/troubleshoot/'
        }
      ]
    },
    vga: {
      description: "Vamp Gateway Agent (VGA) configuration is generated based on defined templates. View the generated VGA configuration for each configured gateway marshaller here and edit the associated templates.",
      links: [
        {
          title: 'How to configure Vamp',
          url: 'http://vamp.io/documentation/installation/configure-vamp/'
        },
        {
          title: 'Vamp configuration reference',
          url: 'http://vamp.io/documentation/installation/configuration-reference/'
        },
        {
          title: 'Vamp troubleshooting',
          url: 'http://vamp.io/documentation/troubleshoot/'
        }
      ]
    },
    info: {
      description: "Extended info on the running Vamp installation.",
      links: [
        {
          title: 'Vamp troubleshooting',
          url: 'http://vamp.io/documentation/troubleshoot/'
        }
      ]
    },
    log: {
      description: "Track the Vamp log. Trace level logging is useful for troubleshooting purposes.",
      links: [
        {
          title: 'Vamp troubleshooting',
          url: 'http://vamp.io/documentation/troubleshoot/'
        }
      ]
    }
  };
};
