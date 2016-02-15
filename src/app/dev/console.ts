import { Component } from 'angular2/core'
import { Api } from '../lib/api'
import { Observable } from 'rxjs/Rx'
import { Pipe , PipeTransform } from 'angular2/core'
// import 'rxjs/add/operator'

@Pipe({ name: 'values',  pure: false })
export class ValuesPipe implements PipeTransform {
  transform(value: any, args: any[] = null): any {
    return Object.keys(value).map(key => value[key]);
  }
}

@Component({
  pipes: [ValuesPipe],
  providers: [Api],

  selector: 'vamp-console',
  templateUrl: 'src/app/templates/console.html'
})

export class ConsoleComponent {
  gateways    : Observable<Array<string>>;
  deployments : Observable<Array<string>>;

  constructor( private api: Api ) {}

  initPolling( type: string ) {
    return Observable.interval( 1000 )
      .flatMap( () => {
        return this.api.get( type )
      })
      .subscribe(
        data  => this[ type ] = data,
        error => console.log( 'Errorred with' , error )
      );
  }

  ngOnInit() {
    this.initPolling( 'gateways' );
    this.initPolling( 'deployments' );
  }
}
