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

	DataMapper.finalize
	DataMapper.auto_migrate!
end