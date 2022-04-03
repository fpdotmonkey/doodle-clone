.PHONY: up
up: client server
	bundle exec ruby ./server/main.rb

.PHONY: client
client:
	npm install
	npm run build
	npm run build-server
	cp ./dist/bundle.js ./public/

.PHONY: server
server:
	bundle install
