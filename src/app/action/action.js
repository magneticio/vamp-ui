function Action() {
}

Action.prototype.create = function (text, onClick, icon) {
  var self = this;

  var action = {
    text: text,
    icon: icon || undefined,
    busy: false
  };

  action.onClick = function() {
    action.busy = true;
    onClick();
    action.busy = false;
  }

  return action;
};

angular
  .module('app')
  .service('Action', Action);

