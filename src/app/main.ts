// Needed because https://github.com/angular/angular/issues/4902
///<reference path="../../node_modules/angular2/typings/browser.d.ts"/>

import { bootstrap } from 'angular2/platform/browser'
import { Component } from 'angular2/core'
import { HTTP_PROVIDERS } from 'angular2/http'

import { ConsoleComponent } from './dev/console'

@Component({
    directives: [ConsoleComponent],

    selector: 'vamp-app',
    template:`<h1>Vamp console</h1>
    <vamp-console></vamp-console>
    `
})

export class AppComponent { }

bootstrap(
  AppComponent,
  [ HTTP_PROVIDERS ]
)
