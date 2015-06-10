var  React = require('react/addons');
var  Router = require('react-router');
var  AppRoutes = require('./routes.jsx');

window.React = React;

Router.create({
  routes: AppRoutes,
  scrollBehavior: Router.ScrollToTopBehavior
})
.run(function (Handler) {
  React.render(<Handler/>, document.body);
});