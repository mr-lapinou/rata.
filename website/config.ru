require './app'

run Rack::Cascade.new [RataApi, RataApp]