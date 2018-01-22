import PubSubable from '../src/PubSubable'

const Pubsub = new PubSubable()
describe('pubsub tests', () => {
  const EVENT_TYPE = 't'
  const NEW_EVENT_TYPE = 't'

  describe(`when subscribe the EVENT_TYPE:${EVENT_TYPE}`, () => {
    it('should create the subscribeTotype, name, listener after subscription and could unsubscribe it', () => {
      const fn1 = () => {}
      const subscriber = Pubsub.subscribe(EVENT_TYPE, fn1)
      expect(subscriber.getListeners()).toHaveLength(1)
      expect(subscriber.name).toBe(`${EVENT_TYPE}:Subscriber`)
      expect(subscriber.subscribeTotype).toBe(EVENT_TYPE)
      subscriber.unsubscribe(fn1)
      expect(subscriber.getListeners()).toHaveLength(0)
    })

    it('should add multiple listeners and unsubscribeAll', () => {
      Pubsub.subscribe(EVENT_TYPE, () => {})
      Pubsub.subscribe(EVENT_TYPE, () => {})
      const subscriber = Pubsub.subscribe(EVENT_TYPE, () => {})
      // still hold the one subscriber only for TYPE
      expect(Object.keys(Pubsub.getSubscribers())).toHaveLength(1)
      expect(subscriber.getListeners()).toHaveLength(3)
      subscriber.unsubscribeAll()
      expect(subscriber.getListeners()).toHaveLength(0)
    })
  })

  describe(`when publishing the data to EVENT_TYPE:${EVENT_TYPE} and NEW_EVENT_TYPE:${NEW_EVENT_TYPE}`, () => {
    const helpers = {
      mockSubscriberListeners(eventType, listenersNum) {
        let subscriber = null
        let dataSet = []
        let fn = null

        for (let i = 0; i < listenersNum; i++) {
          fn = data => {
            dataSet.push(data)
          }
          subscriber = Pubsub.subscribe(eventType, fn)
        }
        return {
          subscriber,
          dataSet
        }
      },
      mockRandomDataSet(randomNum) {
        const dataSet = []
        for (let i = 0; i < randomNum; i++) {
          dataSet.push(Math.round(Math.random(5) * 5))
        }
        return dataSet
      },
      mockMultiplePub(eventType, pubNum) {
        const res = this.mockSubscriberListeners(eventType, pubNum)
        const expectedData = this.mockRandomDataSet(pubNum)
        expectedData.forEach(data => {
          Pubsub.publish(eventType, data)
        })
        return {
          expectedData,
          resultData: res.dataSet,
          subscriber: res.subscriber
        }
      }
    }
    it('should call all listeners of that types correctly', () => {
      const res1 = helpers.mockMultiplePub(EVENT_TYPE, 10)
      expect(res1.resultData).toEqual(expect.arrayContaining(res1.expectedData))
      const res2 = helpers.mockMultiplePub(NEW_EVENT_TYPE, 10)
      expect(res2.resultData).toEqual(expect.arrayContaining(res2.expectedData))

      res1.subscriber.unsubscribeAll()
      res2.subscriber.unsubscribeAll()
    })
  })
})
