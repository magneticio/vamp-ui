import { Component } from 'angular2/core'
import { Pipe , PipeTransform } from 'angular2/core'
import { Store } from '../lib/store'
// import 'rxjs/add/operator'

@Pipe({ name: 'values',  pure: false })
export class ValuesPipe implements PipeTransform {
  transform(value: any, args: any[] = null): any {
    return Object.keys(value).map(key => value[key]);
  }
}

@Component({
  pipes: [ValuesPipe],
  providers: [Store],

  selector: 'vamp-console',
  templateUrl: 'app/templates/console.html'
})

export class ConsoleComponent {
  constructor( private _store: Store ) {}
}
