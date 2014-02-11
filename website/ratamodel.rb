require 'data_mapper'
require 'dm-postgres-adapter'


module RataModel
	DataMapper::Logger.new($stdout, :debug)
	DataMapper::setup(:default, 'sqlite::memory')

	class Recipe
		include DataMapper::Resource

		property :id, Serial
		property :title, String
		property :text, Text
		property :isAppetizer, Boolean
		property :isStarter, Boolean
		property :isCourse, Boolean
		property :isSideCourse, Boolean
		property :isDesert, Boolean
	end

	class User
		include DataMapper::Resource

		property :id, Serial
		property :login, String
		property :password, String
		property :email, String

		def self.get(u, p)
			if(u=="toto" && p=='tata')
				true
			else
				false
			end
		end

	end

	class Tag
		include DataMapper::Resource
		property :id, Serial 
		property :text, String
	end	

	DataMapper.finalize
	DataMapper.auto_migrate!
end