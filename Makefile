# See: http://clarkgrubb.com/makefile-style-guide
SHELL             := bash
.SHELLFLAGS       := -eu -o pipefail -c
.DEFAULT_GOAL     := default
.DELETE_ON_ERROR  :
.SUFFIXES         :

STASH     := stash
PROJECT   := vamp-ui
FABRICATOR:= node:9.11.1

# if Makefile.local exists, include it.
ifneq ("$(wildcard Makefile.local)", "")
	include Makefile.local
endif

.PHONY: clean
clean:
	rm -rf "$(CURDIR)"/src/app/environment.js
	rm -rf "$(CURDIR)"/.tmp
	rm -rf "$(CURDIR)"/dist
	rm -rf "$(CURDIR)"/ui
	rm -rf "$(CURDIR)"/ui.tar.bz2

.PHONY: purge
purge: clean
	rm -rf "$(CURDIR)"/node_modules
	rm -rf "$(CURDIR)"/bower_components

.PHONY: update
update:
	yarn install
	yarn upgrade
	yarn run bower update
	yarn run bower prune

.PHONY: local
local:
	yarn install
	yarn run bower install --allow-root
	./environment.sh
	yarn run build
	rm -Rf "$(CURDIR)"/dist/maps
	rm -Rf "$(CURDIR)"/dist/scripts/app.js "$(CURDIR)"/dist/scripts/vendor.js
	rm -Rf "$(CURDIR)"/dist/styles/app.css "$(CURDIR)"/dist/styles/vendor.css

.PHONY: stash
stash:
	rm -Rf $$HOME/.stash/$(PROJECT) || true
	mkdir -p $$HOME/.stash
	cp -r $(CURDIR)/dist $$HOME/.stash/$(PROJECT)

.PHONY: build
build:
	docker run \
         --rm \
         --volume $(STASH):/root \
         --volume $(CURDIR):/$(PROJECT) \
         --workdir=/$(PROJECT) -it \
         $(FABRICATOR) make local stash

.PHONY: default
default: clean build
