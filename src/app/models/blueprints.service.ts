import {Inject , Injectable} from '@angular/core';

import {ApiService} from '../shared/api.service';
import {EventsService} from '../shared/events.service';
import {NotificationService} from '../shared/notifications.service';
import {StoreService} from '../shared/store.service';

@Injectable()
export class Blueprints extends StoreService {
  // Add requirements specific to Blueprints here.
  constructor(
    @Inject( ApiService ) public _api,
    @Inject( EventsService ) private _events,
    @Inject( NotificationService ) private _notifier
  ) {
    super( 'blueprints' , _api , [ 'GET' , 'POST' , 'PUT' , 'DELETE' ] );

    // this._events.listen( 'event' , [this._artifact,'archive:create'] , data => {
    //   this.load();
    // } )

    this._events.listen( 'event' , ['deployments','synchronization:deployed'] , data => {
      this._notifier.addNotification( { message: data.value['_1'].name + ' is deployed' , type: 'info' } );
    } )
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
      .subscribe();
  }

  // This could add a cluster by providing a name and a JSON object.
  addCluster( name:string , data:Object ) {}
}
