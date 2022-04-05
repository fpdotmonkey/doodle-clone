CLIENT_SOURCE_FILES=$(shell find client -iregex '.*\.[tj]sx?')
PUBLIC_BUNDLE=./public/bundle.js

.PHONY: up
up: lint client server
	bundle exec ruby ./server/main.rb

.PHONY: lint
lint:
	npx eslint client
	rubocop server

.PHONY: client
client: node_modules $(PUBLIC_BUNDLE)

$(PUBLIC_BUNDLE): package-lock.json $(CLIENT_SOURCE_FILES)
	npm run build

.PHONY: node_modules
node_modules:
	npm install

.PHONY: watch
watch:
	npm run watch

.PHONY: server
server:
	bundle install

.PHONY: clean
clean:
	rm -rf node_modules/
