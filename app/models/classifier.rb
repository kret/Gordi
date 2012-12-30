class Classifier
  include ActiveModel::Validations
  include ActiveModel::Conversion
  extend ActiveModel::Naming

  attr_reader :step
  attr_accessor :training_set, :hidden_layers_params, :learning_rate, :momentum, :disable_bias, :network
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

    @step = 0
  end

  def train(number)
    @step += 1
    tr_data = training_data(number)
    network.train(*tr_data) unless tr_data.nil?
  end

  def classify(point)
    network.eval(point)
  end

  def current_state
    state = []
    training_set.each do |group|
      group_state = []
      group.each do |point|
        group_state << network.eval(point)
      end
      state << group_state
    end
    state
  end

  def persisted?
    false
  end

  private
    def training_data(number)
      number %= training_set.flatten.size / 2
      total_no = 0
      output = Array.new(training_set.size) { 0 }
      training_set.each_with_index do |group, gno|
        group.each do |point|
          total_no += 1
          if total_no == number
            output[gno] = 1
            return [point, output]
          end
        end
      end
      nil
    end
end
