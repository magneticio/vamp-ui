function Action($timeout) {
}


Action.prototype.create = function (text, onClick, icon) {
  var action = {
    text: text,
    onClick: onClick,
    icon: icon || undefined
  };

  return action;
}

Action.prototype.createAsync = function (text, onClick, icon) {
  var self = this;

  var action = {
    text: text,
    onClick: onClick,
    icon: icon || undefined,
    busy: false,
    test: 'test'
  };

  console.log(action);

  action.onClick = function(data) {
    action.busy = true;

    setTimeout(function() {
      onClick(data);
      done();
    }, 1000);

    function done() {
      action.busy = false;
    }
  };
  return action;
};



angular
  .module('app')
  .service('Action', Action);

