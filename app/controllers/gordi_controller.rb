class GordiController < ApplicationController
  def index
  end

  def init
  	classifier = Classifier.new(params[:classifier])
    session[:classifier] = classifier
    @classifier = classifier
    @current_state = classifier.current_state
  end

  def step
    session[:classifier].train() unless params[:number]
    @current_state = classifier.current_state
  end

  def classify
  	point = [params[:x], params[:y]]
    session[:classifier].classify(point)
  end
end
