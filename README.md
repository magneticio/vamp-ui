# Vamp Open Source Frontend
## How to start up Vamp frontend
First clone the frontend with git. Master branch should be checked out.

##### In development:
1) Install all the dependecies using bower and npm
```sh
$ npm install
$ bower install
```

2) First set the enviorment variables. [baseURL] should be the url that the frontend is running on.
```sh
$ setEnv.sh [baseUrl]

#example
$ setEnv.sh 192.168.99.100:8080
```
3) Then serve the frontend with gulp. Gulp will set up a webserver with all the goodies like browsersync etc.
```sh
$ gulp serve
```
##### In Production
1) Install all the dependecies using bower and npm
```sh
$ npm install
$ bower install
```

2) First set the enviorment variables. If you use the production option it will put the enviorment on the url itself.
```sh
$ setEnv.sh production
```
3) Then buil the frontend with gulp. Gulp will make a "build" map and all the files can be found there.
```sh
gulp build
```
