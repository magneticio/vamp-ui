/***********************************************************************************************
 * User Configuration.
 **********************************************************************************************/
/** Map relative paths to URLs. */
const map: any = {
  'ng2-ace' : 'vendor/ng2-ace/index.js',
  // 'ace/mode-yaml': 'vendor/ace-builds/src-noconflict/model-yaml.js'
  // 'ace'         : 'https://cdn.rawgit.com/ajaxorg/ace-builds/v1.2.0/src-noconflict/ace.js',
  // 'ace/ace'         : 'https://cdn.rawgit.com/ajaxorg/ace-builds/v1.2.0/src-noconflict/ace.js',
  // 'ace/mode-yaml'   : 'https://cdn.rawgit.com/ajaxorg/ace-builds/v1.2.0/src-noconflict/mode-yaml.js'
};

/** User packages configuration. */
const packages: any = {
  // 'ng2-ace': {
  //   main: 'index.js',
  //   defaultExtension: 'js',
  //   format: 'esm',
  //   map: {
  //     'ng2-ace': 'vendor/ng2-ace/index.js'
  //   }
  // }
};

/** Bundles configuration. */
// const bundles: any = {
//   'ace/ace-yaml': ['ace/ace', 'ace/mode-yaml']
// };

////////////////////////////////////////////////////////////////////////////////////////////////
/***********************************************************************************************
 * Everything underneath this line is managed by the CLI.
 **********************************************************************************************/
const barrels: string[] = [
  // Angular specific barrels.
  '@angular/core',
  '@angular/common',
  '@angular/compiler',
  '@angular/http',
  '@angular/router',
  '@angular/platform-browser',
  '@angular/platform-browser-dynamic',

  // Thirdparty barrels.
  'rxjs',

  // App specific barrels.
  'app',
  'app/shared',
  'app/artifacts',
  'app/artifacts/artifacts-list',
  'app/artifacts/artifacts-detail',
  'app/artifacts/artifacts-edit',
  /** @cli-barrel */
];

const _cliSystemConfig = {};
barrels.forEach((barrelName: string) => {
  _cliSystemConfig[barrelName] = { main: 'index' };
});

/** Type declaration for ambient System. */
declare var System: any;

// Apply the CLI SystemJS configuration.
System.config({
  map: {
    '@angular': 'vendor/@angular',
    'rxjs': 'vendor/rxjs',
    'main': 'main.js'
  },
  packages: _cliSystemConfig
});

// Apply the user's configuration.
System.config({ map, packages });
