# See: http://clarkgrubb.com/makefile-style-guide
SHELL             := bash
.SHELLFLAGS       := -eu -o pipefail -c
.DEFAULT_GOAL     := default
.DELETE_ON_ERROR:
.SUFFIXES:

# Constants, these can be overwritten in your Makefile.local
CONTAINER := magneticio/buildserver:0.3

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
		$(CONTAINER) \
			make build


.PHONY: build
build:
	npm install gulp gulp-cli
	npm install
	bower install
	./environment.sh
	gulp build


.PHONY: clean
clean:
	rm -rf $(CURDIR)/src/app/environment.js


.PHONY: clean-cache
clean-cache:
	rm -rf $(CURDIR)/node_modules
	rm -rf $(CURDIR)/bower_components
