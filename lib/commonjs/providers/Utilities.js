"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.accessToken = exports.parsePrice = exports.getStatusColor = exports.getOrderStatus = void 0;

var _constants = require("../config/constants");

var _StoreUtil = require("./StoreUtil");

const getOrderStatus = status_num => {
  if (status_num == _constants.ORDER_STATUS.PENDING) {
    return "Pending";
  } else if (status_num == _constants.ORDER_STATUS.COMPLETED) {
    return "Complete";
  } else if (status_num == _constants.ORDER_STATUS.REJECTED) {
    return "Rejected";
  } else if (status_num == _constants.ORDER_STATUS.DRIVER_ARRIVED_BUSINESS) {
    return "Driver arrived to business";
  } else if (status_num == _constants.ORDER_STATUS.READY_FOR_PICKUP) {
    return "Ready for pickup";
  } else if (status_num == _constants.ORDER_STATUS.REJECTED_BY_BUSINESS) {
    return "Rejected by business";
  } else if (status_num == _constants.ORDER_STATUS.CANCELLED_BY_DRIVER) {
    return "Cancelled by driver";
  } else if (status_num == _constants.ORDER_STATUS.ACCEPTED_BY_BUSINESS) {
    return "Accepted by business";
  } else if (status_num == _constants.ORDER_STATUS.ACCEPTED_BY_DRIVER) {
    return "Accepted by driver";
  } else if (status_num == _constants.ORDER_STATUS.PICKUP_COMPLETED_BY_DRIVER) {
    return "Pickup completed by driver";
  } else if (status_num == _constants.ORDER_STATUS.PICKUP_FAILED_BY_DRIVER) {
    return "Pickup failed by driver";
  } else if (status_num == _constants.ORDER_STATUS.DELIVERY_COMPLETED_BY_DRIVER) {
    return "Delivery completed by driver";
  } else if (status_num == _constants.ORDER_STATUS.DELIVERY_FAILED_BY_DRIVER) {
    return "Delivery failed by driver";
  } else {
    return "None";
  }
};

exports.getOrderStatus = getOrderStatus;

const getStatusColor = status_num => {
  if (status_num == _constants.ORDER_STATUS.PENDING) {
    return '#194690';
  } else if (status_num == _constants.ORDER_STATUS.COMPLETED) {
    return '#238938';
  } else if (status_num == _constants.ORDER_STATUS.REJECTED) {
    return '#610619';
  } else if (status_num == _constants.ORDER_STATUS.DRIVER_ARRIVED_BUSINESS) {
    return '#530973';
  } else if (status_num == _constants.ORDER_STATUS.READY_FOR_PICKUP) {
    return '#438053';
  } else if (status_num == _constants.ORDER_STATUS.REJECTED_BY_BUSINESS) {
    return '#110619';
  } else if (status_num == _constants.ORDER_STATUS.CANCELLED_BY_DRIVER) {
    return '#000000';
  } else if (status_num == _constants.ORDER_STATUS.ACCEPTED_BY_BUSINESS) {
    return '#119469';
  } else if (status_num == _constants.ORDER_STATUS.ACCEPTED_BY_DRIVER) {
    return '#146018';
  } else if (status_num == _constants.ORDER_STATUS.PICKUP_COMPLETED_BY_DRIVER) {
    return '#199115';
  } else if (status_num == _constants.ORDER_STATUS.PICKUP_FAILED_BY_DRIVER) {
    return '#323009';
  } else if (status_num == _constants.ORDER_STATUS.DELIVERY_COMPLETED_BY_DRIVER) {
    return '#349557';
  } else if (status_num == _constants.ORDER_STATUS.DELIVERY_FAILED_BY_DRIVER) {
    return '#615044';
  } else {
    return "white";
  }
};

exports.getStatusColor = getStatusColor;

const parsePrice = (number, currency) => {
  var rate = 10 ** _constants.DECIMAL.length;
  var l = Math.floor(number);
  var r = Math.floor((number - l) * rate);
  return `${currency ? currency : _constants.DECIMAL.currency}${l}${_constants.DECIMAL.separator}${r == 0 ? '00' : r}`;
};

exports.parsePrice = parsePrice;

const accessToken = async () => {
  try {
    const user = await (0, _StoreUtil._retrieveStoreData)(_constants.STORAGE_KEY.USER);
    return user ? JSON.parse(user).session.access_token : '';
  } catch (err) {
    return '';
  }
};

exports.accessToken = accessToken;
//# sourceMappingURL=Utilities.js.map