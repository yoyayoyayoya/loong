import { Model, Listen } from '../../src'
import { FETCH, FETCHING, FETCH_COMPLETED, FETCH_ERROR } from './RemoteEvents'

export default class Remoter extends Model {
  constructor(restUrl, server) {
    super()
    this.restUrl = restUrl
    this.server = server
  }

  @Listen(FETCH)
  send({ params = {}, data = {}, httpMethod }, callback) {
    const url = this.parseParamsToURL(params)
    const me = this
    this.publish(FETCHING, {})
    this.server.response({
      url,
      data,
      httpMethod,
      callback: response => {
        if (response.error) {
          me.publish(FETCH_ERROR, response)
        } else {
          me.publish(FETCH_COMPLETED, response)
        }
        callback(response)
      }
    })
  }
  parseParamsToURL(params) {
    let pKeys = Object.keys(params)
    let url = this.restUrl
    for (let name of pKeys) {
      url = url.replace(`:${name}`, params[name])
    }
    return url
  }
  publish() {}
}
