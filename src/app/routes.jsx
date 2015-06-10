var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var Redirect = Router.Redirect;
var DefaultRoute = Router.DefaultRoute;

var Master = require('./components/Master.jsx');
var BreedsList = require('./components/breeds/BreedsList.jsx');
var BreedDetail = require('./components/breeds/BreedDetail.jsx');
var BlueprintsList = require('./components/blueprints/BlueprintsList.jsx');
var BlueprintDetail = require('./components/blueprints/BlueprintDetail.jsx');
var DeploymentsList = require('./components/deployments/DeploymentsList.jsx');
var DeploymentDetail = require('./components/deployments/DeploymentDetail.jsx');

var AppRoutes = (
  <Route name="root" path="/" handler={Master}>
    <Route name="breeds" handler={BreedsList}/>
    <Route name="breed" path="/breeds/:id" handler={BreedDetail}/>
    <Route name="blueprints" handler={BlueprintsList}/>
    <Route name="blueprint" path="/blueprints/:id" handler={BlueprintDetail}/>
    <Route name="deployments" handler={DeploymentsList} />
    <Route name="deployment" path="/deployments/:id" handler={DeploymentDetail} />
    <DefaultRoute handler={DeploymentsList} />
  </Route>
);

module.exports = AppRoutes;