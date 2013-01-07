Gordi::Application.routes.draw do
  post '/train', :to => 'gordi#train'
  get '/classify/:x,:y', :to => 'gordi#classify', :constraints => { :x => /-?\d+(\.\d+)?/, :y => /-?\d+(\.\d+)?/ }
  root :to => 'gordi#index'
end
