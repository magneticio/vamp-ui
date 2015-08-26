var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

// App setup
var app = express();
var breeds = [{"name":"sava:1.0.0","deployable":"docker://magneticio/sava:1.0.0","ports":{"port":"80/http"},"environment_variables":{},"constants":{},"dependencies":{}}];
var blueprints = [{"name":"sava:1.0","endpoints":{"sava.port":"9050/http"},"clusters":{"sava":{"services":[{"breed":{"name":"sava:1.0.0","deployable":"docker://magneticio/sava:1.0.0","ports":{"port":"80/http"},"environment_variables":{},"constants":{},"dependencies":{}},"environment_variables":{},"scale":{"cpu":0.5,"memory":512.0,"instances":1},"dialects":{}}],"dialects":{}}},"environment_variables":{}}];
var deployments = [];

app.set('port', process.env.PORT || 4000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../build'))); 

// Routes
app.route('/').
  get(function(req, res) {
    res.sendfile(path.join(__dirname, '../build/index.html'));
  });
app.route('/api/v1/info')
    .get(function(req, res){
      res.send({"message":"Hi, I'm Vamp! How are you?","version":"0.7.9.1","jvm":{"operating_system":{"name":"Linux","architecture":"amd64","version":"4.0.7-boot2docker","available_processors":8.0,"system_load_average":0.06},"runtime":{"process":"218@boot2docker","virtual_machine_name":"Java HotSpot(TM) 64-Bit Server VM","virtual_machine_vendor":"Oracle Corporation","virtual_machine_version":"25.45-b02","start_time":1440412046144,"up_time":19314287},"memory":{"heap":{"init":33554432,"max":468189184,"committed":232783872,"used":178124416},"non_heap":{"init":2555904,"max":-1,"committed":113328128,"used":111723976}},"threads":{"count":88,"peak_count":88,"daemon_count":53,"total_started_count":90}},"persistence":{"type":"jdbc","url":"jdbc:h2:./vamp-core-db","database":{"name":"H2","version":"1.3.166 (2012-04-08)","schema_version":"V2 / 2015-08-24 10:27:27.956 [Up to date]"},"archive":true},"router":{"message":"Hi, I'm Vamp Router! How are you?","version":"0.7.9","status":{"ulimit-n":"8223","name":"HAProxy","hard_maxconn":"4096","maxconn":"4096","ssl_cache_lookups":"0","max_conn_rate":"0","max_ssl_rate":"0","run_queue":"1","nbproc":"1","ssl_frontend_key_rate":"0","max_sess_rate":"0","conn_rate":"0","compress_bps_in":"0","ssl_backend_max_key_rate":"0","ssl_frontend_max_key_rate":"0","max_zlib_mem_usage":"0","curr_conns":"0","sess_rate_limit":"0","ssl_rate":"0","zlib_mem_usage":"0","conn_rate_limit":"0","maxsock":"8223","version":"1.5.14","curr_ssl_conns":"0","compress_bps_out":"0","tasks":"5","pid":"2244","pipes_used":"0","sess_rate":"0","release_date":"2015/07/02","cum_req":"5656","ssl_backend_key_rate":"0","process_num":"1","ssl_frontend_session_reuse_pct":"0","idle_pct":"100","uptime":"0d 2h51m02s","cum_ssl_conns":"0","memmax__mb":"0","pipes_free":"0","maxpipes":"0","uptime_sec":"10262","cum_conns":"5656","max_ssl_conns":"0","ssl_cache_misses":"0","compress_bps_rate_lim":"0","ssl_rate_limit":"0"}},"pulse":{"elasticsearch":{"tagline":"You Know, for Search","cluster_name":"elasticsearch","name":"Max","version":{"number":"1.5.1","lucene_version":"4.10.4","build_snapshot":false,"build_timestamp":"2015-04-09T13:41:35Z","build_hash":"5e38401bc4e4388537a615569ac60925788e1cf4"},"status":200},"index":{"_shards":{"total":30,"successful":15,"failed":0},"_all":{"primaries":{"docs":{"count":692977,"deleted":0}},"total":{"docs":{"count":692977,"deleted":0}}},"indices":{"vamp-event-2015-08-24":{"primaries":{"docs":{"count":75,"deleted":0}},"total":{"docs":{"count":75,"deleted":0}}},"vamp-router-metric-2015-08-25":{"primaries":{"docs":{"count":6912,"deleted":0}},"total":{"docs":{"count":6912,"deleted":0}}},"vamp-router-metric-2015-08-24":{"primaries":{"docs":{"count":685990,"deleted":0}},"total":{"docs":{"count":685990,"deleted":0}}}}}},"container_driver":{"type":"docker","container":{"containers":28,"docker_root_dir":"/mnt/sda1/var/lib/docker","id":"RUGJ:Z3X7:LRQC:LPKH:VCXC:DAGO:QSYC:H22T:YG36:JZYF:CKAX:7CLU","images":46,"index_server_address":"https://index.docker.io/v1/","init_path":"/usr/local/bin/docker","kernel_version":"4.0.7-boot2docker","name":"boot2docker","operating_system":"Boot2Docker 1.7.1 (TCL 6.3); master : c202798 - Wed Jul 15 00:16:02 UTC 2015","system_time":"2015-08-25T07:14:49.298752068Z"}}});
    });
app.route('/api/v1/breeds')
    .get(function(req, res){
      res.send(JSON.stringify('breeds')); 
    });
app.route('/api/v1/deployments')
    .get(function(req, res){
      res.send('[]'); 
    });
app.route('/api/v1/blueprints')
    .get(function(req, res){
      res.send([{"name":"sava:1.0","endpoints":{"sava.port":"9050/http"},"clusters":{"sava":{"services":[{"breed":{"name":"sava:1.0.0","deployable":"docker://magneticio/sava:1.0.0","ports":{"port":"80/http"},"environment_variables":{},"constants":{},"dependencies":{}},"environment_variables":{},"scale":{"cpu":0.5,"memory":512.0,"instances":1},"dialects":{}}],"dialects":{}}},"environment_variables":{}}]);
    })
    .post(function(req, res){
      //global._blueprints.push({"name":"testBlueprint:1.2","endpoints":{"frontend.port":"9010/http"},"clusters":{"frontend":{"services":[{"breed":{"name":"monarch_front:0.1","deployable":"docker://magneticio/monarch:0.1","ports":{"port":"8080/http"},"environment_variables":{"backend[BACKEND]":"http://$backend.host:$backend.ports.port/api/message"},"constants":{},"dependencies":{"backend":"monarch_backend:0.1"}},"environment_variables":{},"scale":{"cpu":0.5,"memory":256.0,"instances":1},"routing":{"weight":50,"filters":[]},"dialects":{}},{"breed":{"name":"monarch_front:0.2","deployable":"docker://magneticio/monarch:0.2","ports":{"port":"8080/http"},"environment_variables":{},"constants":{},"dependencies":{}},"environment_variables":{},"scale":{"cpu":0.5,"memory":256.0,"instances":1},"routing":{"weight":50,"filters":[]},"dialects":{}}],"dialects":{}},"backend":{"services":[{"breed":{"name":"monarch_backend:0.1","deployable":"docker://magneticio/monarch:0.2","ports":{"port":"8080/http"},"environment_variables":{},"constants":{},"dependencies":{}},"environment_variables":{},"dialects":{}}],"dialects":{}}},"environment_variables":{}});
      res.send({"name":"testBlueprint:1.2","endpoints":{"frontend.port":"9010/http"},"clusters":{"frontend":{"services":[{"breed":{"name":"monarch_front:0.1","deployable":"docker://magneticio/monarch:0.1","ports":{"port":"8080/http"},"environment_variables":{"backend[BACKEND]":"http://$backend.host:$backend.ports.port/api/message"},"constants":{},"dependencies":{"backend":"monarch_backend:0.1"}},"environment_variables":{},"scale":{"cpu":0.5,"memory":256.0,"instances":1},"routing":{"weight":50,"filters":[]},"dialects":{}},{"breed":{"name":"monarch_front:0.2","deployable":"docker://magneticio/monarch:0.2","ports":{"port":"8080/http"},"environment_variables":{},"constants":{},"dependencies":{}},"environment_variables":{},"scale":{"cpu":0.5,"memory":256.0,"instances":1},"routing":{"weight":50,"filters":[]},"dialects":{}}],"dialects":{}},"backend":{"services":[{"breed":{"name":"monarch_backend:0.1","deployable":"docker://magneticio/monarch:0.2","ports":{"port":"8080/http"},"environment_variables":{},"constants":{},"dependencies":{}},"environment_variables":{},"dialects":{}}],"dialects":{}}},"environment_variables":{}});
    });

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

exports = module.exports = app;