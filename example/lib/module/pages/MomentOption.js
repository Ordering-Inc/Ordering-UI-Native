import React from 'react';
import { useConfig } from 'ordering-components/native';
import { MomentOption as MomentOptionController } from '../components/MomentOption';

const MomentOption = ({
  navigation,
  props
}) => {
  var _configs$max_days_pre;

  const [{
    configs
  }] = useConfig();
  const limitDays = configs === null || configs === void 0 ? void 0 : (_configs$max_days_pre = configs.max_days_preorder) === null || _configs$max_days_pre === void 0 ? void 0 : _configs$max_days_pre.value;
  const currentDate = new Date();
  const time = limitDays > 1 ? currentDate.getTime() + (limitDays - 1) * 24 * 60 * 60 * 1000 : limitDays === 1 ? currentDate.getTime() : currentDate.getTime() + 6 * 24 * 60 * 60 * 1000;
  currentDate.setTime(time);
  currentDate.setHours(23);
  currentDate.setMinutes(59);
  const momentOptionProps = { ...props,
    navigation: navigation,
    maxDate: currentDate
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, currentDate && /*#__PURE__*/React.createElement(MomentOptionController, momentOptionProps));
};

export default MomentOption;
//# sourceMappingURL=MomentOption.js.map