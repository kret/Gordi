class Classifier
  include ActiveModel::Validations
  include ActiveModel::Conversion
  extend ActiveModel::Naming

  attr_reader :step
  attr_accessor :training_set, :hidden_layers_params, :learning_rate, :momentum, :disable_bias, :network, :training_history
  # attr_accessible :training_set, :hidden_layers_params, :learning_rate, :momentum, :disable_bias

  # validates_presence_of :name
  # validates_format_of :email, :with => /^[-a-z0-9_+\.]+\@([-a-z0-9]+\.)+[a-z0-9]{2,4}$/i
  # validates_length_of :content, :maximum => 500

  def initialize(attributes = {})
    @training_set = []
    @hidden_layers_params = []
    @learning_rate = 0.25
    @momentum = 0.1
    @disable_bias = false
    attributes.each do |name, value|
      send("#{name}=", value)
    end

    @network = Ai4r::NeuralNetwork::Backpropagation.new([2] + @hidden_layers_params + [@training_set.size])
    @network.set_parameters({
      :learning_rate => @learning_rate,
      :momentum => @momentum,
      :disable_bias => @disable_bias
    })
    @training_history = []
  end

  def train
    normalized_training_data.each do |datum|
      network.train(*datum)
      training_history << [datum[0], current_state]
    end
  end

  def classify(point)
    network.eval(point)
  end

  def current_state
    state = []
    training_set.each do |group|
      group_state = []
      group.each do |point|
        group_state << [point, network.eval(point)]
      end
      state << group_state
    end
    state
  end

  def persisted?
    false
  end

  private
    def normalized_training_data
      normalized = []
      training_set.each_with_index do |group, group_number|
        group.each do |point|
          normalized << [point, Array.new(training_set.size) { |index| index == group_number ? 1 : 0 }]
        end
      end
      normalized
    end
end
