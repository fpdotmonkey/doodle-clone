# frozen_string_literal: true

require_relative '../vote_tally'

# rubocop:disable Metrics/BlockLength

RSpec.describe Vote do
  it 'can have its available times queried' do
    vote = Vote.new({ availableTimes: [1, 2, 3], maybeTimes: [] })

    expect(vote.available).to eq(Set[1, 2, 3])
  end

  it 'can have its maybe times queried' do
    vote = Vote.new({ availableTimes: [], maybeTimes: [3, 2, 1] })

    expect(vote.maybe).to eq(Set[3, 2, 1])
  end

  it 'is empty if it gets a vote with no data' do
    vote = Vote.new({ availableTimes: [], maybeTimes: [] })

    expect(vote).to be_empty
  end

  it 'is not empty if it get a vote with data' do
    vote = Vote.new({ availableTimes: [1, 2, 3], maybeTimes: [3, 2, 1] })

    expect(vote).not_to be_empty
  end

  it 'is not empty if it gets a vote with partial data' do
    vote0 = Vote.new({ availableTimes: [1, 2, 3], maybeTimes: [] })

    expect(vote0).not_to be_empty

    vote1 = Vote.new({ availableTimes: [], maybeTimes: [3, 2, 1] })

    expect(vote1).not_to be_empty
  end

  it 'only counts one instance of a time per vote' do
    vote = Vote.new({ availableTimes: [1, 1], maybeTimes: [] })

    expect(vote.available).to eq(Set[1])
    expect(vote.maybe).to eq(Set[])
  end

  it 'ignores an avilable vote if it is also in maybe' do
    vote = Vote.new({ availableTimes: [1], maybeTimes: [1] })

    expect(vote.available).to eq(Set[])
    expect(vote.maybe).to eq(Set[1])
  end
end

RSpec.describe VoteTally do
  it 'has quantity 0 votes when no votes have been added' do
    vote_tally = VoteTally.new

    expect(vote_tally.quantity).to eq(0)
  end

  it 'has quantity N votes when N votes have been cast' do
    vote_tally = VoteTally.new
    (1..10).each do |i|
      vote = Vote.new({ availableTimes: [1, 2, 3], maybeTimes: [3, 2, 1] })
      vote_tally.cast(vote)

      expect(vote_tally.quantity).to eq(i)
    end
  end

  it 'does not count empty votes toward the quantity' do
    vote = Vote.new({ availableTimes: [], maybeTimes: [] })
    vote_tally = VoteTally.new
    vote_tally.cast(vote)

    expect(vote_tally.quantity).to eq(0)
  end

  it 'gives a result of an empty hash when no votes have been cast' do
    vote_tally = VoteTally.new

    expect(vote_tally.result).to eq({ availableTimes: {}, maybeTimes: [], quantity: 0 })
  end

  it 'returns a mapping of minutes to votes as a result there are votes' do
    vote_tally = VoteTally.new

    vote0 = Vote.new({ availableTimes: [1, 2, 3], maybeTimes: [] })
    vote_tally.cast(vote0)
    expect(vote_tally.result).to eq(
      {
        availableTimes: { '1': 1, '2': 1, '3': 1 }, maybeTimes: [], quantity: 1
      }
    )

    vote1 = Vote.new({ availableTimes: [1, 2, 3], maybeTimes: [] })
    vote_tally.cast(vote1)
    expect(vote_tally.result).to eq(
      {
        availableTimes: { '1': 2, '2': 2, '3': 2 }, maybeTimes: [], quantity: 2
      }
    )

    vote2 = Vote.new({ availableTimes: [1, 2], maybeTimes: [] })
    vote_tally.cast(vote2)
    expect(vote_tally.result).to eq(
      {
        availableTimes: { '1': 3, '2': 3, '3': 2 }, maybeTimes: [], quantity: 3
      }
    )

    vote3 = Vote.new({ availableTimes: [4, 5, 6], maybeTimes: [] })
    vote_tally.cast(vote3)
    expect(vote_tally.result).to eq(
      {
        availableTimes: { '1': 3, '2': 3, '3': 2, '4': 1, '5': 1, '6': 1 },
        maybeTimes: [],
        quantity: 4
      }
    )
  end

  it 'counts maybe votes toward the vote while noting that time has maybes' do
    vote_tally = VoteTally.new

    vote0 = Vote.new({ availableTimes: [1, 2, 3], maybeTimes: [] })
    vote_tally.cast(vote0)
    expect(vote_tally.result).to eq(
      {
        availableTimes: { '1': 1, '2': 1, '3': 1 }, maybeTimes: [], quantity: 1
      }
    )

    vote1 = Vote.new({ availableTimes: [], maybeTimes: [1, 2, 3] })
    vote_tally.cast(vote1)
    expect(vote_tally.result).to eq(
      {
        availableTimes: { '1': 2, '2': 2, '3': 2 }, maybeTimes: [1, 2, 3],
        quantity: 2
      }
    )

    vote2 = Vote.new({ availableTimes: [], maybeTimes: [1, 2, 3] })
    vote_tally.cast(vote2)
    expect(vote_tally.result).to eq(
      {
        availableTimes: { '1': 3, '2': 3, '3': 3 },
        maybeTimes: [1, 2, 3],
        quantity: 3
      }
    )

    vote1 = Vote.new({ availableTimes: [1, 2, 4], maybeTimes: [3, 5, 6] })
    vote_tally.cast(vote1)
    expect(vote_tally.result).to eq(
      {
        availableTimes: { '1': 4, '2': 4, '3': 4, '4': 1, '5': 1, '6': 1 },
        maybeTimes: [1, 2, 3, 5, 6],
        quantity: 4
      }
    )
  end
end

# rubocop:enable Metrics/BlockLength
