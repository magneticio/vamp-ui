var  React = require('react/addons');
var  Router = require('react-router');
var  AppRoutes = require('./routes.jsx');

  window.React = React;


  Router
      .create({
        routes: AppRoutes,
        scrollBehavior: Router.ScrollToTopBehavior
      })
      // This is our callback function, whenever the url changes it will be called again. 
      // Handler: The ReactComponent class that will be rendered  
      .run(function (Handler) {
        React.render(<Handler/>, document.body);
      });