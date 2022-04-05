# frozen_string_literal: true

Bundler.require

register React::Sinatra

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

get '/' do
  'this is an example for react-sinatra'
end

get '/react-component' do
  haml react_component('Doodle', {}), layout: true
end
