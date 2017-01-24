# See: http://clarkgrubb.com/makefile-style-guide
SHELL             := bash
.SHELLFLAGS       := -eu -o pipefail -c
.DEFAULT_GOAL     := default
.DELETE_ON_ERROR:
.SUFFIXES:

# Constants, these can be overwritten in your Makefile.local
BUILD_SERVER := magneticio/buildserver
BUILD_PACKER := magneticio/packer

# if Makefile.local exists, include it.
ifneq ("$(wildcard Makefile.local)", "")
	include Makefile.local
endif

# Targets
.PHONY: all
all: default

# Using our buildserver which contains all the necessary dependencies
.PHONY: default
default:
	docker run \
		--interactive \
		--rm \
		--volume $(CURDIR):/srv/src \
		--workdir=/srv/src \
		--env BUILD_UID=$(shell id -u) \
		--env BUILD_GID=$(shell id -g) \
		$(BUILD_SERVER) \
			make build dist


.PHONY: build
build:
	npm install gulp gulp-cli bower

	node --version
	npm --version
	bower --version
	gulp --version

	npm install
	bower install
	./environment.sh
	gulp build


.PHONY: dist
dist:
	mv $(CURDIR)/dist $(CURDIR)/ui
	tar -cvjSf ui.tar.bz2 ui/

.PHONY: pack
pack:
	export version="$$(git describe --tags)" && \
	docker volume create packer && \
	docker run \
    	--name packer \
    	--interactive \
    	--volume $(CURDIR)/dist:/usr/local/src \
    	--volume packer:/usr/local/stash \
    	$(BUILD_PACKER) \
      	vamp-ui $${version} && \
	docker rm packer

.PHONY: clean
clean:
	rm -rf $(CURDIR)/src/app/environment.js
	rm -rf $(CURDIR)/dist
	rm -rf $(CURDIR)/ui
	rm -rf $(CURDIR)/ui.tar.bz2


.PHONY: clean-cache
clean-cache:
	rm -rf $(CURDIR)/node_modules
	rm -rf $(CURDIR)/bower_components
