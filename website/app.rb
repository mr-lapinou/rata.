require 'rubygems'
require 'sinatra'
require 'grape'
require './ratamodel'





class RataApi < Grape::API
	use Rack::Session::Cookie, secret: "fc683cd9ed1990ca2ea10b84e5e6fba048c24929"
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
			header 'Cache-Control', 'private, max-age=300'
			out=""
			case params[:type].to_i
			when 1				
				out = RataModel::Recipe.listAppetizer(0)
			when 2				
				out = RataModel::Recipe.listStarter(0)
			when 3				
				out = RataModel::Recipe.listCourse(0)
			when 4				
				out = RataModel::Recipe.listSideCourse(0)
			when 5				
				out = RataModel::Recipe.listDesert(0)
			end
			output=[]
			out.each{|x| output.push({x.id => x.title})	}
			output
		end

		get 'create' do
			authenticate!
			RataModel::Recipe.create({
				:title => params[:title],
				:text => params[:text],
				:isAppetizer =>false,
				:isStarter => false,
				:isCourse =>true,
				:isSideCourse =>false,
				:isDesert =>false,
				:privacy => 0})
		end




		get 'detail/:id' do
			header 'Cache-Control', 'private, max-age=300'
			out = RataModel::Recipe.get(params[:id])
		end


		get 'fromuser/:user' do


		end


	end

	resources :tags do

		get 'list/:term' do
			{:tags =>[{:value =>"carotte"}]}
		end
	end

	resources :user do
		get 'login' do
			if(RataModel::User.login(params[:login], params[:password]))
				session[:user_id] = params[:login]
				"logged in "
			else
				"failed"
			end
		end


		get 'logout' do
			session[:user_id]=nil;


		end

		get 'signin' do
			
			if(RataModel::User.avalaibleEmail(params[:email])>0)
				return {:status=> "21"}
			end
			if(RataModel::User.avalaibleLogin(params[:login])>0)
				return {:status=> "22"}
			end
			usr = RataModel::User.create(
			  :login      => params[:login],
			  :email       => params[:email],
			  :password => params[:password]
			)
			if(usr!=nil)
				session[:user_id] = params[:login]
			end
			return  {:status=> "20"}
		end

		get 'protected' do
			authenticate!
			'protected'
		end

	end

end




class RataApp < Sinatra::Base

	set :layout_engine => :erb, :layout => :layout

	helpers do
		def timestamp
			rand(36**16).to_s(36)
		end
	end




	get '/' do 
		erb :home, :locals => {:timestamp =>timestamp}

	end

	get '/recipes/:type' do
		out=""
		case params[:type].to_i
		when 1				
			out = RataModel::Recipe.listAppetizer(0)
		when 2				
			out = RataModel::Recipe.listStarter(0)
		when 3				
			out = RataModel::Recipe.listCourse(0)
		when 4				
			out = RataModel::Recipe.listSideCourse(0)
		when 5				
			out = RataModel::Recipe.listDesert(0)
		end
		@upper=[]
		@middle=[]
		@lower=[]
		i=0
		out.each do |x|
			puts x
			if(i==0)
				@middle.push({x.id => x.title})
			elsif(i<=3)
				@upper.push({x.id => x.title})
			else
				@lower.push({x.id => x.title})
			
			end
			i+=1
		end

		
		erb :home, :locals => {:timestamp =>timestamp}
	end


end