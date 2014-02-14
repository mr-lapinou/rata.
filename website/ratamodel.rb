require 'data_mapper'
require 'dm-postgres-adapter'


module RataModel
	DataMapper::Logger.new($stdout, :debug)
	#DataMapper::setup(:default, 'sqlite:///Users/tperson/rata_git/website/rata.db')
 	DataMapper.setup(:default, 'postgres://nonghnqtvzgyia:MRUzn0Ipw5FZ_5tf62bUx-vROu@ec2-54-225-103-9.compute-1.amazonaws.com:5432/dblm4gio1egjda')

	class Recipe
		include DataMapper::Resource

		property :id, Serial, key: true
		property :title, String
		property :text, Text
		property :isAppetizer, Boolean
		property :isStarter, Boolean
		property :isCourse, Boolean
		property :isSideCourse, Boolean
		property :isDesert, Boolean
		property :privacy, Integer


		def self.listAppetizer(privacy)
			Recipe.all(:privacy => privacy) & Recipe.all(:isAppetizer =>true)
		end
		def self.listStarter(privacy)
			Recipe.all(:privacy => privacy) & Recipe.all(:isStarter =>true)
		end
		def self.listCourse(privacy)
			Recipe.all(:fields=>[:id], :privacy => privacy, :isCourse =>true)
			
		end
		def self.listSideCourse(privacy)
			Recipe.all(:privacy => privacy) & Recipe.all(:isSideCourse =>true)
		end
		def self.listDesert(privacy)
			Recipe.all(:privacy => privacy) & Recipe.all(:isDesert =>true)
		end

	end

	class User
		include DataMapper::Resource

		property :id, Serial, :key =>true
		property :login, String
		property :password, String
		property :email, String

		def self.avalaibleEmail(email)
			User.count(:email => email)
		end
		def self.avalaibleLogin(login)
			User.count(:login => login)
		end
		def self.login(login, pwd)
			User.count(:login => login)>0
		end
	end

	class Tag
		include DataMapper::Resource
		property :id, Serial , :key =>true
		property :text, String
	end	


	class Taglink
		include DataMapper::Resource
		property :id, Serial, :key =>true
		belongs_to :tag
		belongs_to :recipe
	end

	class Recipe
		has n, :taglink
		has n, :tags, :through => :taglink
	end

	class Tag
		has n, :taglink
		has n, :recipes, :through => :taglink
	end


	DataMapper.finalize
	DataMapper.auto_upgrade!
	#DataMapper.auto_migrate!
end