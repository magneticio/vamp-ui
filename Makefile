# See: http://clarkgrubb.com/makefile-style-guide
SHELL             := bash
.SHELLFLAGS       := -eu -o pipefail -c
.DEFAULT_GOAL     := default
.DELETE_ON_ERROR:
.SUFFIXES:

# Constants, these can be overwritten in your Makefile.local
PACKER       ?= packer
BUILD_SERVER := magneticio/buildserver
DIR_NPM	     := $(HOME)/.npm
DIR_GYP	     := $(HOME)/.node-gyp
DIR_BOWER	 := $(HOME)/.cache/bower

# if Makefile.local exists, include it.
ifneq ("$(wildcard Makefile.local)", "")
	include Makefile.local
endif

VERSION := $(shell git describe --tags)
PROJECT := vamp-ui

# Targets
.PHONY: all
all: default

# Using our buildserver which contains all the necessary dependencies
.PHONY: default
default:
	docker pull $(BUILD_SERVER)
	docker run \
		--rm \
		--volume $(CURDIR):/srv/src \
		--volume $(DIR_NPM):/home/vamp/.npm \
		--volume $(DIR_GYP):/home/vamp/.node-gyp \
		--volume $(DIR_BOWER):/home/vamp/.cache/bower \
		--workdir=/srv/src \
		--env BUILD_UID=$(shell id -u) \
		--env BUILD_GID=$(shell id -g) \
		$(BUILD_SERVER) \
			make build


.PHONY: build
build:
	npm rebuild node-sass
	npm install
	npm update
	npm prune
	npm run bower install
	npm run bower update
	npm run bower prune
	./environment.sh
	npm run build


.PHONY: pack
pack: default
	docker volume create $(PACKER)
	docker run \
		--rm \
    		--volume $(CURDIR)/dist:/usr/local/src \
    		--volume $(PACKER):/usr/local/stash \
    		$(BUILD_SERVER) \
      			push $(PROJECT) $(VERSION)

.PHONY: pack-local
pack-local: build
	docker volume create $(PACKER)
	docker run \
		--rm \
    		--volume $(CURDIR)/dist:/usr/local/src \
    		--volume $(PACKER):/usr/local/stash \
    		$(BUILD_SERVER) \
      			push $(PROJECT) $(VERSION)

.PHONY: clean
clean:
	rm -rf $(CURDIR)/src/app/environment.js
	rm -rf $(CURDIR)/.tmp
	rm -rf $(CURDIR)/dist
	rm -rf $(CURDIR)/ui
	rm -rf $(CURDIR)/ui.tar.bz2


.PHONY: clean-cache
clean-cache:
	rm -rf $(CURDIR)/node_modules
	rm -rf $(CURDIR)/bower_components
