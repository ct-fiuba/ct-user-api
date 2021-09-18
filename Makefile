HEROKU_APP_NAME := ct-user-api

.PHONY: install
install:
	npm install;

.PHONY: run
run: install
	npm start;

.PHONY: run-development
run-development: install
	npm run start-development;

.PHONY: test
test:
	npm run test:integration

.PHONY: ping
ping:
	curl -vvv "localhost:5000/ping"

# -- Heroku related commands
# You need to be logged in Heroku CLI before doing this
#   heroku login
#   heroku container:login
.PHONY: heroku-push
heroku-push:
	heroku container:push web --recursive --app=$(HEROKU_APP_NAME) --verbose

.PHONY: heroku-release
heroku-release:
	heroku container:release web --app $(HEROKU_APP_NAME) --verbose

.PHONY: help
help:
	@echo 'Usage: make <target>'
	@echo ''
	@echo 'Available targets are:'
	@echo ''
	@grep -E '^\.PHONY: *' $(MAKEFILE_LIST) | cut -d' ' -f2- | sort
