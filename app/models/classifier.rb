class Classifier
  include ActiveModel::Validations
  include ActiveModel::Conversion
  extend ActiveModel::Naming

  attr_accessor :training_set, :hidden_layers_params, :learning_rate, :momentum, :disable_bias, :network, :training_history

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
      training_history << { :train_point => datum[0], :train_output => datum[1], :network_state => current_state }
    end
  end

  def classify(point)
    network.eval(point)
  end

  def current_state
    state = { :classifications => [] }
    training_set.each do |group|
      group[:points].each do |point|
        raw_decision = network.eval(point)
        state[:classifications] << { :point => point, :decision => training_set[raw_decision.each_with_index.max[1]][:color], :raw => raw_decision }
      end
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
        group[:points].each do |point|
          normalized << [point, Array.new(training_set.size) { |index| index == group_number ? 1 : 0 }]
        end
      end
      normalized
    end
end
