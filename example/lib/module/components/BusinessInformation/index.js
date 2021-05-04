import React from 'react';
import { BusinessInformation as BusinessInformationController, useLanguage } from 'ordering-components/native';
import { OText } from '../shared';
import { BusinessInformationContainer, WrapMainContent, GrayBackground, WrapScheduleBlock, ScheduleBlock, WrapBusinessMap, InnerContent } from './styles';
import { StyleSheet } from 'react-native';
import { BusinessBasicInformation } from '../BusinessBasicInformation';
import { GoogleMap } from '../GoogleMap';

const BusinessInformationUI = props => {
  var _businessState$busine, _businessState$busine2, _businessState$busine3, _businessState$busine4, _businessState$busine5, _businessState$busine6, _businessState$busine7;

  const {
    businessState,
    businessSchedule,
    businessLocation
  } = props;
  const [, t] = useLanguage();
  const daysOfWeek = [t('SUNDAY_ABBREVIATION', 'Sun'), t('MONDAY_ABBREVIATION', 'Mon'), t('TUESDAY_ABBREVIATION', 'Tues'), t('WEDNESDAY_ABBREVIATION', 'Wed'), t('THURSDAY_ABBREVIATION', 'Thur'), t('FRIDAY_ABBREVIATION', 'Fri'), t('SATURDAY_ABBREVIATION', 'Sat')];

  const scheduleFormatted = ({
    hour,
    minute
  }) => {
    const checkTime = val => val < 10 ? `0${val}` : val;

    return `${checkTime(hour)}:${checkTime(minute)}`;
  };

  const businessCoordinate = {
    lat: businessState === null || businessState === void 0 ? void 0 : (_businessState$busine = businessState.business) === null || _businessState$busine === void 0 ? void 0 : (_businessState$busine2 = _businessState$busine.location) === null || _businessState$busine2 === void 0 ? void 0 : _businessState$busine2.lat,
    lng: businessState === null || businessState === void 0 ? void 0 : (_businessState$busine3 = businessState.business) === null || _businessState$busine3 === void 0 ? void 0 : (_businessState$busine4 = _businessState$busine3.location) === null || _businessState$busine4 === void 0 ? void 0 : _businessState$busine4.lng
  };
  const businessImage = {
    uri: businessState === null || businessState === void 0 ? void 0 : (_businessState$busine5 = businessState.business) === null || _businessState$busine5 === void 0 ? void 0 : _businessState$busine5.logo
  };
  const businessMarker = {
    latlng: businessCoordinate,
    image: businessImage
  };
  return /*#__PURE__*/React.createElement(BusinessInformationContainer, null, /*#__PURE__*/React.createElement(BusinessBasicInformation, {
    isBusinessInfoShow: true,
    businessState: businessState
  }), /*#__PURE__*/React.createElement(WrapMainContent, null, /*#__PURE__*/React.createElement(InnerContent, null, /*#__PURE__*/React.createElement(GrayBackground, null, /*#__PURE__*/React.createElement(OText, {
    size: 16,
    weight: "bold"
  }, t('BUSINESS_LOCATION', 'Business Location'))), businessLocation.location && /*#__PURE__*/React.createElement(WrapBusinessMap, {
    style: styles.wrapMapStyle
  }, /*#__PURE__*/React.createElement(GoogleMap, {
    readOnly: true,
    location: businessLocation.location,
    markerTitle: businessState === null || businessState === void 0 ? void 0 : (_businessState$busine6 = businessState.business) === null || _businessState$busine6 === void 0 ? void 0 : _businessState$busine6.name
  })), /*#__PURE__*/React.createElement(OText, {
    mBottom: 20
  }, businessState === null || businessState === void 0 ? void 0 : (_businessState$busine7 = businessState.business) === null || _businessState$busine7 === void 0 ? void 0 : _businessState$busine7.address), /*#__PURE__*/React.createElement(GrayBackground, null, /*#__PURE__*/React.createElement(OText, {
    size: 16,
    weight: "bold"
  }, t('BUSINESS_OPENING_TIME', 'Business Opening Time'))), businessSchedule && (businessSchedule === null || businessSchedule === void 0 ? void 0 : businessSchedule.length) > 0 && /*#__PURE__*/React.createElement(WrapScheduleBlock, {
    horizontal: true
  }, businessSchedule.map((schedule, i) => /*#__PURE__*/React.createElement(ScheduleBlock, {
    key: i
  }, /*#__PURE__*/React.createElement(OText, {
    size: 20
  }, daysOfWeek[i]), /*#__PURE__*/React.createElement(OText, null, scheduleFormatted(schedule.lapses[0].open)), /*#__PURE__*/React.createElement(OText, null, scheduleFormatted(schedule.lapses[0].close))))))));
};

const styles = StyleSheet.create({
  wrapMapStyle: {
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 20,
    marginBottom: 10
  }
});
export const BusinessInformation = props => {
  const BusinessInformationProps = { ...props,
    UIComponent: BusinessInformationUI
  };
  return /*#__PURE__*/React.createElement(BusinessInformationController, BusinessInformationProps);
};
//# sourceMappingURL=index.js.map