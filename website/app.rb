require 'rubygems'
require 'sinatra'
require 'grape'
require './ratamodel'



class RataApi < Grape::API
	version 'v1', :using => :param
	format :json

	resources :recipes do 
		desc "return list of recipes"
		get 'list/:type' do 
			list = []
			n = params[:type].to_i
			for counter in 2..n*2
				list.push(counter.to_s => 'recette'+counter.to_s)
			end
			list
		end

		get 'detail/:id' do
			{:content =>'NOM NOM NOM'}
		end
	end

	resources :tags do

		get 'list' do
			{"1"=>"carotte"}
		end
	end
end




class RataApp < Sinatra::Base
	enable :sessions
	set :layout_engine => :erb, :layout => :layout





	get '/' do 
		erb :home

	end

	get '/recipes/:type' do
		
	end


end