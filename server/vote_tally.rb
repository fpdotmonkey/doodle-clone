# frozen_string_literal: true

require 'json'

##
# A single vote for a set of available times or maybe-available times
class Vote
  def initialize(vote)
    @available = Set.new(vote['availableTimes'])
    @maybe = Set.new(vote['maybeTimes'])
  end

  def available
    @available - @maybe
  end

  attr_reader :maybe

  def empty?
    @available.empty? and @maybe.empty?
  end
end

##
# A machine to tally up how many votes there are for each time
class VoteTally
  def initialize
    @quantity = 0
    @available = {}
    @maybe = Set[]
  end

  attr_reader :quantity

  def cast(vote)
    return if vote.empty?

    @quantity += 1
    @maybe |= vote.maybe
    (vote.available | vote.maybe).each do |time|
      if @available.include?(time.to_s.to_sym)
        @available[time.to_s.to_sym] += 1
      else
        @available[time.to_s.to_sym] = 1
      end
    end
  end

  def result
    {
      'availableTimes' => @available,
      'maybeTimes' => @maybe.to_a,
      'quantity' => @quantity
    }
  end
end
