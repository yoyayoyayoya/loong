import Pubsub from '../src/pubsub'

describe('pubsub tests', () => {
  const EVENT_TYPE = 't'
  const NEW_EVENT_TYPE = 't'
  const ASYNC_EVENT_TYPE = 'a'
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

    it('should handle the async listener', done => {
      const pubData = 'data'
      const newData = 'new async data'
      const asyncListener = data => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(newData)
          }, 10)
        })
      }
      const subscriber = Pubsub.subscribe(ASYNC_EVENT_TYPE, asyncListener)
      Pubsub.addHooks({
        afterPublish: data => {
          expect(data).toBe(newData)
          Pubsub.removeHooks()
          done()
        }
      })
      Pubsub.publish(ASYNC_EVENT_TYPE, pubData)
      subscriber.unsubscribeAll()
    })

    it('should throw error if the subscriber is not existed', () => {
      expect(() => {
        Pubsub.publish('unkown_type', null)
      }).toThrow()
    })
  })

  describe('when adding hooks', () => {
    it('should trigger beforeSubscribe hook', done => {
      const fn = () => {}
      Pubsub.addHooks({
        beforeSubscribe: (p, eventType, handler) => {
          expect(p).toBe(Pubsub)
          expect(eventType).toBe(EVENT_TYPE)
          expect(handler).toBe(fn)
          done()
        }
      })
      const subscriber = Pubsub.subscribe(EVENT_TYPE, fn)

      subscriber.unsubscribeAll()
      Pubsub.removeHooks()
    })
    it('should cancel the subscription if beforeSubscribe hook return false', () => {
      Pubsub.addHooks({
        beforeSubscribe: (p, eventType, handler) => {
          return false
        }
      })
      const subscriber = Pubsub.subscribe(EVENT_TYPE, null)
      expect(subscriber).toBeNull()
      Pubsub.removeHooks()
    })

    it('should trigger afterSubscribe hook', done => {
      const fn = () => {}

      Pubsub.addHooks({
        afterSubscribe: (p, eventType, handler) => {
          expect(p).toBe(Pubsub)
          expect(eventType).toBe(EVENT_TYPE)
          expect(handler).toBe(fn)
          done()
        }
      })
      const subscriber = Pubsub.subscribe(EVENT_TYPE, fn)
      subscriber.unsubscribeAll()
      Pubsub.removeHooks()
    })

    it('should trigger beforePublish hook', done => {
      const subscriber = Pubsub.subscribe(EVENT_TYPE, d => d)
      const expectedData = 'data'
      Pubsub.addHooks({
        beforePublish: (p, eventType, data) => {
          expect(p).toBe(Pubsub)
          expect(eventType).toBe(EVENT_TYPE)
          expect(data).toBe(expectedData)
          done()
        }
      })
      Pubsub.publish(EVENT_TYPE, expectedData)
      subscriber.unsubscribeAll()
      Pubsub.removeHooks()
    })

    it('should trigger afterPublish hook', done => {
      const subscriber = Pubsub.subscribe(EVENT_TYPE, d => d)
      const expectedData = 'data'
      Pubsub.addHooks({
        afterPublish: data => {
          expect(data).toBe(expectedData)
          done()
        }
      })
      Pubsub.publish(EVENT_TYPE, expectedData)
      subscriber.unsubscribeAll()
      Pubsub.removeHooks()
    })
  })
})
