import {Component} from 'angular2/core';
import {Editor} from '../../components/editor/editor';
import {LineChart} from '../../components/chart/linechart';
import {ApiService} from '../../services/api/api';
import {EventStream} from '../../services/event-stream/event-stream';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'test',
  templateUrl: 'app///components/test/test.html',
  styleUrls: ['app///components/test/test.css'],
  providers: [ApiService, EventStream],
  directives: [Editor, LineChart],
  pipes: []
})
export class Test {

  data: any;
  welcome:any;

  public _events = [];
  public _metrics = [];

  constructor(
    private _service: ApiService,
    private _stream: EventStream
  ) {

    this.welcome = `name: sava:1.0
  gateways:
    '9050':
      sticky: none
      routes:
        sava/port:
          weight: null
          filters: []
          rewrites: []
  clusters:
    sava:
      services:
      - breed:
          name: sava:1.0.0
          deployable: docker://magneticio/sava:1.0.0
          ports:
            port: 80/http
          environment_variables: {}
          constants: {}
          arguments: []
          dependencies: {}
        environment_variables: {}
        scale:
          cpu: 0.5
          memory: 512.0MB
          instances: 1
        arguments: []
        dialects: {}
      routing: {}
      dialects: {}
  environment_variables: {}
  `;

    this.data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'My First dataset',
                    fillColor: 'rgba(52, 152, 219,0.2)',
                    strokeColor: 'rgba(52, 152, 219,1)',
                    pointColor: 'rgba(52, 152, 219,1)',
                    pointStrokeColor: '#fff',
                    pointHighlightFill: 'rgba(255, 64, 129,1)',
                    pointHighlightStroke: '#fff',
                    data: [65, 59, 80, 81, 56, 55, 40]
                }
            ]
        }
  }

  ngOnInit() {
    this._stream.listen();

    this._stream.events$
      .subscribe(updatedItems => this._events = updatedItems);

    this._stream.metrics$
      .subscribe(updatedItems => this._metrics = updatedItems);


  }

}
