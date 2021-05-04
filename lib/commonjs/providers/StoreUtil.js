"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._setStoreData = exports._retrieveStoreData = exports.useLocalStorage = void 0;

var _asyncStorage = _interopRequireDefault(require("@react-native-community/async-storage"));

var _react = require("react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// localStorage Hook --------------------
const useLocalStorage = (key, defaultValue) => {
  const stored = window.localStorage.getItem(key);
  const initial = stored ? JSON.parse(stored) : defaultValue;
  const [value, setValue] = (0, _react.useState)(initial);
  (0, _react.useEffect)(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}; // End of LocalStorage Hook -------------


exports.useLocalStorage = useLocalStorage;

const _retrieveStoreData = async key => {
  try {
    const value = await _asyncStorage.default.getItem(key);

    if (value !== null) {
      // We have data!!
      return value;
    }
  } catch (error) {
    // Error retrieving data
    console.log('--------------- Occured Storage Fetching Data error --------------');
    console.log(error);
  }
};

exports._retrieveStoreData = _retrieveStoreData;

const _setStoreData = (key, val) => {
  try {
    _asyncStorage.default.setItem(key, typeof val === 'string' ? val : JSON.stringify(val));
  } catch (error) {
    // Error retrieving data
    console.log('--------------- Occured Storage Setting Data error --------------');
    console.log(error);
  }
};

exports._setStoreData = _setStoreData;
//# sourceMappingURL=StoreUtil.js.map