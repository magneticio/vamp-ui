import {Inject , Injectable} from '@angular/core';

import {ApiService} from '../../shared/api.service';
import {EventsService} from '../../shared/events.service';
import {NotificationsService} from '../../shared/notifications.service';
import {StoreService} from '../../shared/store.service';

@Injectable()
export class Blueprints extends StoreService {
  // Add requirements specific to Blueprints here.
  constructor(
    @Inject( ApiService ) public _api,
    @Inject( EventsService ) private _events,
    @Inject( NotificationsService ) private _notifier
  ) {
    super( 'blueprints' , _api , [ 'GET' , 'POST' , 'PUT' , 'DELETE' ] );
  }

  get blueprints() {
    return this.items;
  }

  // Deploy method calls the api to create a deployment from the corresponding
  // blueprint.
  // TODO: Use the generated Deploymentstore to add the blueprint as deployment
  // instead of injecting the API service here.
  deploy( item ) {
    return this._api.put( 'deployments' , item.name , item )
      .subscribe(
        res => {
          let name = item.name; //res.name || res.map( val => val.name ).join(', ');

          this._notifier.addNotification( {
            message: `Succesfully deployed ${ name }`,
            type: 'info'
          } )
        },
        err => {
          this._notifier.addNotification( {
            message: `Could not deploy ${ item.name }: ${ err }`,
            type: 'error'
          } )
        }
      );
  }

  // This could add a cluster by providing a name and a JSON object.
  addCluster( name:string , data:Object ) {}
}
