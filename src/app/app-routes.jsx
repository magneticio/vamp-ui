
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var Redirect = Router.Redirect;
var DefaultRoute = Router.DefaultRoute;

var Master = require('./components/master.jsx');
var Breeds = require('./components/breeds.jsx');

var AppRoutes = (
  <Route name="root" path="/" handler={Master}>
    <DefaultRoute handler={Breeds} />
  </Route>
);

module.exports = AppRoutes;
