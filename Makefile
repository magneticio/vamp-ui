# See: http://clarkgrubb.com/makefile-style-guide
SHELL             := bash
.SHELLFLAGS       := -eu -o pipefail -c
.DEFAULT_GOAL     := default
.DELETE_ON_ERROR:
.SUFFIXES:

# Constants, these can be overwritten in your Makefile.local
BUILD_SERVER := magneticio/buildserver

# if Makefile.local exists, include it.
ifneq ("$(wildcard Makefile.local)", "")
	include Makefile.local
endif

VERSION := $(shell git describe --tags)

# Targets
.PHONY: all
all: default

# Using our buildserver which contains all the necessary dependencies
.PHONY: default
default:
	docker pull $(BUILD_SERVER)
	docker run \
		--interactive \
		--tty \
		--rm \
		--volume $(CURDIR):/srv/src \
		--workdir=/srv/src \
		--env BUILD_UID=$(shell id -u) \
		--env BUILD_GID=$(shell id -g) \
		$(BUILD_SERVER) \
			make build


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


.PHONY: pack
pack: default
	docker volume create packer
	docker run \
		--interactive \
		--tty \
		--rm \
    		--volume $(CURDIR)/dist:/usr/local/src \
    		--volume packer:/usr/local/stash \
    		$(BUILD_SERVER) \
      			push vamp-ui $(VERSION)

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
