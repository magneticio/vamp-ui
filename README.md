# Vamp-UI

This is the UI for [Vamp](https://github.com/magneticio/vamp) build with ReactJS.

## Running it

You need to have NPM installed. Then...

    $ npm install
    $ npm start

## Seeds

To get you up to speed there's some seeds included. It relies httpie so check if you have that installed

	$ http --version

With httpie installed just navigate to the assets > seeds folder and execute 
	
	$ sh seed.sh

This will add a handful of breeds, blueprints and deployments to VAMP.

## Preparing for Deployment

Running a build with minification and optimized assets for deployment.

    $ npm install
    $ gulp dist

You can inspect the live build in the browser by running `$ gulp serve`, which will spawn a local webserver on port 3000. It will not 'watch' and live-reload, it'll serve your production build served from the 'build/' folder of the project.

## Tips

during development, start Chrome with disables web security to allow CORS requests.

`open /Applications/Google\ Chrome.app --args --disable-web-security`