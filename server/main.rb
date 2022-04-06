# frozen_string_literal: true

require 'securerandom'

Bundler.require

require_relative './vote_tally'

register React::Sinatra
register Sinatra::Contrib

configure do
  React::Sinatra.configure do |config|
    config.use_bundled_react = true
    config.env = :development
    config.runtime      = :execjs
    config.pool_size    = 5
    config.pool_timeout = 10
  end

  React::Sinatra::Pool.pool.reset
end

set :views, File.join(__dir__, 'views')
set :public_folder, 'public'

db = {}

get '/' do
  id = SecureRandom.uuid
  db[id] = { metadata: { eventName: 'event name',
                         description: 'description',
                         location: 'location',
                         duration: 'duration',
                         default: true },
             data: VoteTally.new }
  redirect("/c/#{id}", 303)
end

get '/c/:id' do |id|
  not_found unless db.key?(id)
  haml react_component('Doodle', { id: id }), layout: true
end

get '/api/data/:id' do |id|
  not_found unless db.key?(id)

  status 200
  content_type :json
  body db[id].to_json
end

post '/api/data/:id' do |id|
  not_found unless db.key?(id)

  request.body.rewind
  data = JSON.parse(request.body.read)
  db[id][:metadata] = data['metadata']

  vote = Vote.new(data['data'])
  db[id][:data].cast(vote)
  vote_result = {
    metadata: db[id][:metadata], data: db[id][:data].result
  }.to_json

  status 200
  content_type :json
  body vote_result
end
