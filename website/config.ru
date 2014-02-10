require './app'

use Rack::Session::Cookie
run Rack::Cascade.new [RataApi, RataApp]