"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _orderingApiSdk = require("ordering-api-sdk");

const ApiProvider = () => {
  // const token = accessToken()
  return new _orderingApiSdk.Ordering({
    url: 'https://apiv4.ordering.co',
    version: 'v400',
    project: 'dragonteam1',
    language: 'en',
    accessToken: '',
    apiKey: ''
  });
};

var _default = ApiProvider;
exports.default = _default;
//# sourceMappingURL=ApiProvider.js.map