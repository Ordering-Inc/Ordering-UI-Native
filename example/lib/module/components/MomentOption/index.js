import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { MomentOption as MomentOptionController, useLanguage, useConfig, useUtils, useOrder } from 'ordering-components/native';
import Spinner from 'react-native-loading-spinner-overlay';
import { StyleSheet } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import NavBar from '../NavBar';
import { OText } from '../shared';
import { colors } from '../../theme';
import { Container } from '../../layouts/Container';
import { HeaderTitle, WrapSelectOption, Days, Day, WrapHours, Hours, Hour, WrapDelveryTime } from './styles';

const MomentOptionUI = props => {
  var _orderState$options2;

  const {
    navigation,
    nopadding,
    datesList,
    hoursList,
    dateSelected,
    timeSelected,
    handleAsap,
    handleChangeDate,
    handleChangeTime
  } = props;
  const [, t] = useLanguage();
  const [{
    configs
  }] = useConfig();
  const [{
    parseTime
  }] = useUtils();
  const [orderState] = useOrder();
  const [optionSelected, setOptionSelected] = useState({
    isAsap: false,
    isSchedule: false
  });

  const goToBack = () => navigation.goBack();

  const _handleAsap = () => {
    handleAsap();
    setOptionSelected({
      isAsap: true,
      isSchedule: false
    });
  };

  useEffect(() => {
    var _orderState$options;

    if ((_orderState$options = orderState.options) !== null && _orderState$options !== void 0 && _orderState$options.moment) {
      setOptionSelected({
        isAsap: false,
        isSchedule: true
      });
    } else {
      setOptionSelected({
        isAsap: true,
        isSchedule: false
      });
    }
  }, [(_orderState$options2 = orderState.options) === null || _orderState$options2 === void 0 ? void 0 : _orderState$options2.moment]);
  return /*#__PURE__*/React.createElement(Container, {
    nopadding: nopadding
  }, /*#__PURE__*/React.createElement(NavBar, {
    onActionLeft: () => goToBack(),
    btnStyle: {
      paddingLeft: 0
    },
    paddingTop: 0
  }), /*#__PURE__*/React.createElement(HeaderTitle, null, /*#__PURE__*/React.createElement(OText, {
    size: 28,
    weight: "bold"
  }, t('DELIVERY_TIME', 'Delivery time')), /*#__PURE__*/React.createElement(OText, {
    color: colors.textSecondary
  }, t('SELECT_A_DELIVERY_DATE', 'Select a Delivery Date'))), /*#__PURE__*/React.createElement(WrapSelectOption, {
    onPress: () => _handleAsap()
  }, optionSelected.isAsap ? /*#__PURE__*/React.createElement(MaterialIcon, {
    name: "radiobox-marked",
    size: 32,
    color: colors.primary,
    style: styles.icon
  }) : /*#__PURE__*/React.createElement(MaterialIcon, {
    name: "radiobox-blank",
    size: 32,
    color: colors.textSecondary,
    style: styles.icon
  }), /*#__PURE__*/React.createElement(OText, null, t('ASAP_ABBREVIATION', 'ASAP'))), /*#__PURE__*/React.createElement(WrapSelectOption, {
    onPress: () => setOptionSelected({
      isAsap: false,
      isSchedule: true
    })
  }, optionSelected.isSchedule ? /*#__PURE__*/React.createElement(MaterialIcon, {
    name: "radiobox-marked",
    size: 32,
    color: colors.primary,
    style: styles.icon
  }) : /*#__PURE__*/React.createElement(MaterialIcon, {
    name: "radiobox-blank",
    size: 32,
    color: colors.textSecondary,
    style: styles.icon
  }), /*#__PURE__*/React.createElement(OText, null, t('SCHEDULE_FOR_LATER', 'Schedule for later'))), /*#__PURE__*/React.createElement(WrapDelveryTime, {
    pointerEvents: optionSelected.isAsap ? 'none' : 'auto'
  }, datesList.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(OText, {
    color: colors.textSecondary
  }, t('DELIVERY_DATE', 'Delivery Date')), /*#__PURE__*/React.createElement(Days, null, datesList.slice(0, 6).map((date, i) => {
    const dateParts = date.split('-');

    const _date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);

    const dayName = t('DAY' + (_date.getDay() >= 1 ? _date.getDay() : 7)).substring(0, 3).toUpperCase();

    const dayNumber = (_date.getDate() < 10 ? '0' : '') + _date.getDate();

    return /*#__PURE__*/React.createElement(Day, {
      key: dayNumber,
      borderLeftShow: i === 0 || i === 4,
      onPress: () => handleChangeDate(date)
    }, /*#__PURE__*/React.createElement(OText, {
      style: styles.dayNameStyle,
      color: dateSelected === date && optionSelected.isSchedule ? colors.primary : colors.textSecondary
    }, dayName), /*#__PURE__*/React.createElement(OText, {
      size: 28,
      color: dateSelected === date && optionSelected.isSchedule ? colors.primary : colors.textSecondary
    }, dayNumber));
  }))), hoursList.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(OText, {
    color: colors.textSecondary
  }, t('DELIVERY_TIME', 'Delivery Time')), optionSelected.isSchedule && /*#__PURE__*/React.createElement(WrapHours, null, /*#__PURE__*/React.createElement(Hours, {
    name: "hours"
  }, hoursList.map((hour, i) => {
    var _configs$format_time;

    return /*#__PURE__*/React.createElement(Hour, {
      key: i,
      onPress: () => handleChangeTime(hour.startTime)
    }, /*#__PURE__*/React.createElement(OText, {
      color: timeSelected === hour.startTime ? colors.primary : colors.textSecondary
    }, (configs === null || configs === void 0 ? void 0 : (_configs$format_time = configs.format_time) === null || _configs$format_time === void 0 ? void 0 : _configs$format_time.value) === '12' ? hour.startTime.includes('12') ? `${hour.startTime}PM` : parseTime(moment(hour.startTime, 'HH:mm'), {
      outputFormat: 'hh:mma'
    }) : parseTime(moment(hour.startTime, 'HH:mm'), {
      outputFormat: 'HH:mm'
    })));
  }))))), /*#__PURE__*/React.createElement(Spinner, {
    visible: orderState.loading
  }));
};

const styles = StyleSheet.create({
  icon: {
    marginRight: 10
  },
  dayNameStyle: {
    textTransform: 'uppercase'
  },
  selectStyle: {
    zIndex: 10
  }
});
export const MomentOption = props => {
  const momentOptionProps = { ...props,
    UIComponent: MomentOptionUI
  };
  return /*#__PURE__*/React.createElement(MomentOptionController, momentOptionProps);
};
//# sourceMappingURL=index.js.map