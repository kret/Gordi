class GordiController < ApplicationController
  def index
  end

  def train
    classifier = Classifier.new(params[:classifier])
    session[:classifier] = classifier
    classifier.train
    @training_history = classifier.training_history
  end

  def classify
  	point = [params[:x].to_f, params[:y].to_f]
    @classification = session[:classifier].classify(point)
  end
end
