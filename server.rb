require "sinatra"
Tilt.register Tilt::ERBTemplate, 'erb'
set :public_folder, File.dirname(__FILE__)
require "debugger"
require "json"

get "/" do 
  erb :simple
end

__END__
notes
http://chimera.labs.oreilly.com/books/1234000001552/ch05.html
18:18 ecmabot: wolfram74: Avoid setInterval; use setTimeout instead. http://zetafleet.com/blog/why-i-consider-setinterval-harmful
