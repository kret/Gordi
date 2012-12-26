class GordiController < ApplicationController
  def index
  end

  def init
  	classifier = Classifier.new(params[:classifier])
    session[:classifier] = classifier
    @classifier = classifier
  end

  def step
    session[:classifier].train() unless params[:number]
  end

  def classify
  	point = [params[:x], params[:y]]
    session[:classifier].classify(point)
  end
end
