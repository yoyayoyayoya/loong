import Pubsub from '../src/pubsub'

describe('pubsub tests', () => {
  it('should pass the test', () => {
    Pubsub.subscribe('t', function() {})
    expect(Object.keys(Pubsub.getSubscribers())).toHaveLength(1)
  })
})
