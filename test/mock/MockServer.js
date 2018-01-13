import { GET, POST, PUT, DELETE } from './HttpMethods'

export default class Server {
  constructor() {
    this.tokenRegex = /:[a-z]*[^/]/g
    this.controllers = []
    this.db = {}
  }
  use(httpMethod, url, controller) {
    this.controllers.push({
      httpMethod,
      url,
      regex: this.makeUrlRegExp(url),
      fn: controller.bind(this)
    })
  }
  get(url, controller) {
    this.use(GET, url, controller)
  }
  post(url, controller) {
    this.use(POST, url, controller)
  }
  put(url, controller) {
    this.use(PUT, url, controller)
  }
  del(url, controller) {
    this.use(DELETE, url, controller)
  }
  makeUrlRegExp(url) {
    const tokens = url.split(this.tokenRegex)
    const urlRegExp = tokens.join('[^/]*')
    return new RegExp(urlRegExp)
  }
  parseParams(dataUrl, origUrl) {
    const vars = origUrl.match(this.tokenRegex).map(v => v.replace(':', ''))
    const reg = new RegExp(
      origUrl
        .split(this.tokenRegex)
        .filter(function(t) {
          return t
        })
        .join('|'),
      'g'
    )
    const values = dataUrl.split(reg).filter(t => t)
    const params = {}
    for (let i = 0, len = values.length; i < len; i++) {
      params[vars[i]] = values[i]
    }
    return params
  }
  response({ httpMethod, url, data, callback }) {
    const controller = this.controllers.find(
      c => c.regex.test(url) && c.httpMethod === httpMethod
    )
    if (controller) {
      const params = this.parseParams(url, controller.url)
      controller.fn({ params, data }, { send: callback })
    } else {
      throw new Error(`could not find the controller for url{${url}}`)
    }
  }
}
