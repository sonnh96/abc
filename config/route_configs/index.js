class RouteGroup {

  constructor(options) {
    this.children = [];
    this.prefix = options.prefix;
  }

  _verb(action, route, options) {
    this.children.push({action: action, route: route, target: options});
  }

  any(route, options) {
    this._verb('*', route, options);
  }

  get(route, options) {
    this._verb('GET', route, options);
  }

  post(route, options) {
    this._verb('POST', route, options);
  }

  put(route, options) {
    this._verb('PUT', route, options);
  }

  patch(route, options) {
    this._verb('PATCH', route, options);
  }

  delete(route, options) {
    this._verb('DELETE', route, options);
  }

  group(options, fn) {
    const child = new RouteGroup(options);
    this.children.push({action: '*', subRoute: child});
    fn(child);
  }

  toRouteConfig() {
    const routeConfigs = {};
    _compile(this, routeConfigs);
    return routeConfigs;
  }
}

module.exports.RouteGroup = RouteGroup;

function _compile(route, routeConfigs) {
  route.children.forEach(function (child) {





  });
}
