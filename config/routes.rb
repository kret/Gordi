Gordi::Application.routes.draw do
  post '/simulation', :to => 'gordi#init'
  get '/train/:number', :to => 'gordi#train'
  get '/classify/:x,:y', :to => 'gordi#classify', :constraints => { :x => /-?\d+(\.\d+)?/, :y => /-?\d+(\.\d+)?/ }
  root :to => 'gordi#index'
end
