import {Component} from 'angular2/core';
import {ApiService} from '../../services/api/api';

@Component({
  selector: 'info',
  templateUrl: 'app/components/info/info.html',
  providers: [ApiService],
  directives: [],
  pipes: []
})
export class Info {

  public info:any;
  public endpoint:any;

  constructor(
    private _service: ApiService
  ) {}

  ngOnInit() {
      this.endpoint = this._service._endpoint;
      this.info = this._service.getInfo()
        .subscribe(
          data => {
            this.info = data;
          }
        );
  }

}
