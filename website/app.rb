require 'rubygems'
require 'sinatra'
require 'grape'
require './ratamodel'





class RataApi < Grape::API
	use Rack::Session::Cookie
	version 'v1', :using => :param
	format :json

	helpers do
		def session
	        env['rack.session']
	    end
	    def current_user
	        return nil if session[:user_id].nil?
	        return true
	    end   

      	def authenticate!
        error!('401 Unauthorized', 401) unless current_user
      	end
    end

	resources :recipes do 
		desc "return list of recipes"
		get 'list/:type' do 
			header 'Cache-Control', 'private, max-age=3600'
			list = []
			n = params[:type].to_i
			for counter in 1..(n-1)*2
				list.push(counter.to_s => 'recette'+counter.to_s)
			end
			list
		end

		get 'detail/:id' do
			{:content =>'NOM NOM NOM'}
		end
	end

	resources :tags do

		get 'list/:term' do
			{:tags =>[{:value =>"carotte"}]}
		end
	end

	resources :user do
		get 'login' do
			if(params[:username]=="toto" && params[:password]=='tata')
				session[:user_id] = params[:username]
				"logged in "
			else
				"failed"
			end

		end


		get 'logout' do

		end

		post 'signin' do

		end

		get 'protected' do
			authenticate!
			'protected'
		end

	end

end




class RataApp < Sinatra::Base

	set :layout_engine => :erb, :layout => :layout





	get '/' do 
		erb :home

	end

	get '/recipes/:type' do
		
	end


end