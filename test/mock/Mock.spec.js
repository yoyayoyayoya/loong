import MockServer from './MockServer'
import RestRequest from './RestRequest'
import { GET, POST, PUT, DELETE } from './HttpMethods'

describe('Mocking remote request and response functionalities', () => {
  const app = new MockServer()
  const userApi = '/api/user/:id'
  const request = new RestRequest(userApi, app)
  const USER_ERRORS = {
    NOT_FOUND: 'could not find the user',
    NOT_CREATED: 'Did not create any user yet'
  }
  // this.db is provided by server. the controller method will be rebinded to
  // server instance
  const controllers = {
    user: {
      find(req, res) {
        let user = null
        if (this.db.users) {
          user = this.db.users[req.params.id]
        }
        const error = user ? false : `${USER_ERRORS.NOT_FOUND} ${req.params.id}`
        res.send({
          error,
          data: user
        })
      },
      create(req, res) {
        if (!this.db.users) {
          this.db.users = {}
          this.db.users.idCount = 0
        }
        ++this.db.users.idCount
        const user = req.data
        const users = this.db.users
        user.id = this.db.users.idCount
        users[user.id] = req.data
        res.send({
          error: false,
          data: user
        })
      },
      modify(req, res) {
        let error = false
        const id = req.params.id
        const newUser = req.data
        if (!this.db.users) {
          error = USER_ERRORS.NOT_CREATED
        } else {
          if (!this.db.users[id]) {
            error = `${USER_ERRORS.NOT_FOUND} ${id}`
          } else {
            let user = this.db.users[id]
            this.db.users[id] = Object.assign(user, newUser)
          }
        }
        res.send({
          error,
          data: this.db.users[id]
        })
      },
      remove(req, res) {
        let error = false
        let isDeleted = true
        const id = req.params.id
        if (!this.db.users) {
          error = USER_ERRORS.NOT_CREATED
        } else {
          delete this.db.users[id]
          isDeleted = this.db.users[id] ? false : true
        }
        res.send({
          error,
          data: {
            isDeleted
          }
        })
      }
    }
  }
  app.get(userApi, controllers.user.find)
  app.post(userApi, controllers.user.create)
  app.put(userApi, controllers.user.modify)
  app.del(userApi, controllers.user.remove)

  describe('Using the User app ', () => {
    it('should create user and get user id equls 1', () => {
      // create user
      let res = null
      let user_nancy = { name: 'Nancy', age: '26' }
      request.send(
        {
          data: user_nancy,
          httpMethod: POST
        },
        response => {
          res = response
          user_nancy.id = response.data.id
        }
      )
      expect(res.error).toEqual(false)
      expect(res.data.id).toEqual(1)
    })
    it('should find the user by id 1', () => {
      let error, user
      // fetch user
      request.send(
        {
          params: {
            id: 1
          },
          httpMethod: GET
        },
        response => {
          error = response.error
          user = response.data
        }
      )
      expect(error).toEqual(false)
      expect(user.id).toEqual(1)
      expect(user.name).toEqual('Nancy')
      expect(+user.age).toEqual(26)
    })
    it('should update the user by id 1', () => {
      const id = 1
      let error, user
      request.send(
        {
          params: {
            id
          },
          data: {
            age: 25
          },
          httpMethod: PUT
        },
        response => {
          error = response.error
          user = response.data
        }
      )
      expect(error).toEqual(false)
      expect(+user.age).toEqual(25)
    })
    it('should remove the user by id 1', () => {
      const id = 1
      let error, isDeleted
      request.send(
        {
          params: { id },
          httpMethod: DELETE
        },
        response => {
          error = response.error
          isDeleted = response.data.isDeleted
        }
      )
      expect(error).toEqual(false)
      expect(isDeleted).toEqual(true)
    })
  })
})
