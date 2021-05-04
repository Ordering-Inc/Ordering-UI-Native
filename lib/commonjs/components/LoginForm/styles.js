"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LineSeparator = exports.OrSeparator = exports.SocialButtons = exports.ButtonsWrapper = exports.FormInput = exports.LoginWith = exports.OTab = exports.OTabs = exports.FormSide = exports.Container = void 0;

var _native = _interopRequireWildcard(require("styled-components/native"));

var _theme = require("../../theme");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const Container = _native.default.View`
  padding-bottom: 40px;
`;
exports.Container = Container;
const FormSide = _native.default.View`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  margin: auto;
`;
exports.FormSide = FormSide;
const OTabs = _native.default.View`
  display: flex;
  flex-direction: row;
`;
exports.OTabs = OTabs;
const OTab = _native.default.View`
  padding: 0px 15px;
`;
exports.OTab = OTab;
const LoginWith = _native.default.View`
  font-size: 14px;
`;
exports.LoginWith = LoginWith;
const FormInput = _native.default.View`
  display: flex;
  flex-direction: column;
  width: 90%;
  padding: 25px 0px 15px;
`;
exports.FormInput = FormInput;
const ButtonsWrapper = _native.default.View`
  margin: 10px 0px 0px;
  width: 90%;
  display: flex;
  flex-direction: column;

  ${props => props.mBottom && (0, _native.css)`
    margin-bottom: ${props.mBottom}px;
  `}
`;
exports.ButtonsWrapper = ButtonsWrapper;
const SocialButtons = _native.default.View`
  width: 100%;
  margin: 0px auto 20px;
`;
exports.SocialButtons = SocialButtons;
const OrSeparator = _native.default.View`
  width: 90%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;
exports.OrSeparator = OrSeparator;
const LineSeparator = _native.default.View`
  width: 40%;
  height: 1px;
  background-color: ${_theme.colors.disabled};
`;
exports.LineSeparator = LineSeparator;
//# sourceMappingURL=styles.js.map