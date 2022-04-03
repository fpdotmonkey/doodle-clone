.PHONY: up
up: client server
	bundle exec ruby ./server/main.rb

.PHONY: client
client:
	npm install
	npm run build

.PHONY: server
server:
	bundle install
