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
			out=[]
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
			user=RataModel::User.first(:login => params[:login], :password =>params[:password])
			if(user)
				session[:user_id] = params[:login]
				{:name => user.login}
			else
				{:error=> "denied"}
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

	colorscheme= ["#D82900","#6e4c5a","#d15490","#a8ba42","#fc872e","#3a817d"]
    colorschemesecond= ["#871600","#4F3742","#9b4070","#8a9335","#c96928","#2e635f"]


	get '/' do 
		@pagename=""
		@pagenumber=0;
		@firstcolor=colorscheme[0]
		@secondcolor=colorschemesecond[0]
		erb :home, :locals => {:timestamp =>timestamp}

	end

	get '/recipes/:type' do


		out=""
		@pagename=""
		@pagenumber=params[:type].to_i
		case params[:type].to_i
		when 1				
			out = RataModel::Recipe.listAppetizer(0)
			@pagename="Amuse-bouches"
		when 2				
			out = RataModel::Recipe.listStarter(0)
			@pagename="Entrées"
		when 3				
			out = RataModel::Recipe.listCourse(0)
			@pagename="Plats"
		when 4				
			out = RataModel::Recipe.listSideCourse(0)
			@pagename="Accompagnements"
		when 5				
			out = RataModel::Recipe.listDesert(0)
			@pagename="Desserts"
		else
			redirect "/"
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
		@firstcolor=colorscheme[@pagenumber]
		@secondcolor=colorschemesecond[@pagenumber]
		
		erb :home, :locals => {:timestamp =>timestamp}
	end


end