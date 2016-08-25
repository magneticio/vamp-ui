function CappedArray(size) {
  var self = this;
  // Is variable filled in
  if (!size) {
    var exception = {
      message: 'No size was specified.',
      name: 'CappedArrayException'
    };

    throw exception;
  }

  // Variables
  self.size = size;
  self.theArray = [];

  self.getAll = function () {
    return self.theArray;
  };

  self.getOne = function (index) {
    return self.theArray[index];
  };

  self.push = function (data) {
    if (self.theArray.length >= size) {
      self.theArray.shift();
    }

    self.theArray.push(data);
  };

  self.isEmpty = function () {
    return self.theArray.length < 1;
  };

  self.getLast = function () {
    return self.theArray[self.theArray.length - 1];
  };
}

angular
  .module('app')
  .service('CappedArray', CappedArray);

