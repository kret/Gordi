Gordi::Application.routes.draw do
  post '/simulation', :to => 'gordi#init'
  get '/step/:number', :to => 'gordi#step'
  get '/classify/:x,:y', :to => 'gordi#classify', :constraints => { :x => /-?\d+(\.\d+)?/, :y => /-?\d+(\.\d+)?/ }
  root :to => 'gordi#index'
end
