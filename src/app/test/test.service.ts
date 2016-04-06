import {Injectable} from 'angular2/core';

export class Test {
  constructor(public id: number, public name: string) { }
}

@Injectable()
export class TestService {
  getAll() { return promise; }
  get(id: number) {
    return promise.then(all => all.find(e => e.id === id));
  }
}

let mock = [
  new Test(1, 'one'),
  new Test(2, 'two'),
  new Test(3, 'three')
];

let promise = Promise.resolve(mock);
