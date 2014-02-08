require 'rubygems'
require 'sinatra'
require './ratamodel'


class RataApp < Sinatra::Base
	enable :sessions
	set :layout_engine => :erb, :layout => :layout





	get '/' do 
		erb :home

	end

	get '/recipes/:type' do
		
	end


end