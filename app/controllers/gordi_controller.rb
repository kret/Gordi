class GordiController < ApplicationController
  def index
  end

  def init
  	classifier = Classifier.new(params[:classifier])
    session[:classifier] = classifier
    @initial_state = classifier.current_state
  end

  def train
    classifier = session[:classifier]
    no = params[:number]
    classifier.train(no.to_i) unless no.nil?
    @current_state = classifier.current_state
  end

  def classify
  	point = [params[:x], params[:y]]
    @point = session[:classifier].classify(point)
  end
end
