import React, { useState } from 'react';
import { BusinessList as BusinessesListingController, useLanguage, useSession, useOrder, useConfig, useUtils } from 'ordering-components/native';
import { BusinessTypeFilter } from '../BusinessTypeFilter';
import { BusinessController } from '../BusinessController';
import { SearchBar } from '../SearchBar';
import { NotFoundSource } from '../NotFoundSource';
import { WelcomeTitle, Search, OrderControlContainer, AddressInput, WrapMomentOption } from './styles';
import { OText } from '../shared';
import { colors } from '../../theme';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, StyleSheet, ScrollView } from 'react-native';
import NavBar from '../NavBar';
import { OrderTypeSelector } from '../OrderTypeSelector';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
const PIXELS_TO_SCROLL = 1000;

const BusinessesListingUI = props => {
  var _configs$order_types_, _orderState$options, _orderState$options2, _configs$format_time, _orderState$options4, _orderState$options4$, _businessesList$busin;

  const {
    navigation,
    businessesList,
    searchValue,
    getBusinesses,
    handleChangeBusinessType,
    handleBusinessClick,
    paginationProps,
    handleChangeSearch
  } = props;
  const [, t] = useLanguage();
  const [{
    user,
    auth
  }] = useSession();
  const [orderState] = useOrder();
  const [{
    configs
  }] = useConfig();
  const [{
    parseDate
  }] = useUtils();
  const [isOpenAddressForm, setIsOpenAddressForm] = useState(false);
  const configTypes = (configs === null || configs === void 0 ? void 0 : (_configs$order_types_ = configs.order_types_allowed) === null || _configs$order_types_ === void 0 ? void 0 : _configs$order_types_.value.split('|').map(value => Number(value))) || [];

  const handleScroll = ({
    nativeEvent
  }) => {
    const y = nativeEvent.contentOffset.y;
    const height = nativeEvent.contentSize.height;
    const hasMore = !(paginationProps.totalPages === paginationProps.currentPage);

    if (y + PIXELS_TO_SCROLL > height && !businessesList.loading && hasMore) {
      getBusinesses();
    }
  };

  const handleCloseAddressForm = () => {
    setIsOpenAddressForm(false);
  };

  return /*#__PURE__*/React.createElement(ScrollView, {
    style: styles.container,
    onScroll: e => handleScroll(e)
  }, !auth && /*#__PURE__*/React.createElement(NavBar, {
    onActionLeft: () => navigation.goBack(),
    showCall: false,
    btnStyle: {
      paddingLeft: 0
    }
  }), auth && /*#__PURE__*/React.createElement(WelcomeTitle, null, /*#__PURE__*/React.createElement(View, {
    style: styles.welcome
  }, /*#__PURE__*/React.createElement(OText, {
    style: {
      fontWeight: 'bold'
    },
    size: 28
  }, t('WELCOME_TITLE_APP', 'Hello there, ')), /*#__PURE__*/React.createElement(OText, {
    style: {
      fontWeight: 'bold'
    },
    size: 28,
    color: colors.primary
  }, user === null || user === void 0 ? void 0 : user.name))), /*#__PURE__*/React.createElement(Search, null, /*#__PURE__*/React.createElement(SearchBar, {
    onSearch: handleChangeSearch,
    searchValue: searchValue,
    lazyLoad: true,
    isCancelXButtonShow: !!searchValue,
    borderStyle: styles.borderStyle,
    onCancel: () => handleChangeSearch(''),
    placeholder: t('FIND_BUSINESS', 'Find a Business')
  })), /*#__PURE__*/React.createElement(OrderControlContainer, null, /*#__PURE__*/React.createElement(View, {
    style: styles.wrapperOrderOptions
  }, /*#__PURE__*/React.createElement(OrderTypeSelector, {
    configTypes: configTypes
  }), /*#__PURE__*/React.createElement(WrapMomentOption, {
    onPress: () => navigation.navigate('MomentOption')
  }, /*#__PURE__*/React.createElement(OText, {
    size: 14,
    numberOfLines: 1,
    ellipsizeMode: "tail"
  }, (_orderState$options = orderState.options) !== null && _orderState$options !== void 0 && _orderState$options.moment ? parseDate((_orderState$options2 = orderState.options) === null || _orderState$options2 === void 0 ? void 0 : _orderState$options2.moment, {
    outputFormat: (configs === null || configs === void 0 ? void 0 : (_configs$format_time = configs.format_time) === null || _configs$format_time === void 0 ? void 0 : _configs$format_time.value) === '12' ? 'MM/DD hh:mma' : 'MM/DD HH:mm'
  }) : t('ASAP_ABBREVIATION', 'ASAP')))), /*#__PURE__*/React.createElement(AddressInput, {
    onPress: () => {
      var _orderState$options3;

      return auth ? navigation.navigate('AddressList', {
        isFromBusinesses: true
      }) : navigation.navigate('AddressForm', {
        address: (_orderState$options3 = orderState.options) === null || _orderState$options3 === void 0 ? void 0 : _orderState$options3.address,
        isFromBusinesses: true
      });
    }
  }, /*#__PURE__*/React.createElement(MaterialComIcon, {
    name: "home-outline",
    color: colors.primary,
    size: 20,
    style: {
      marginRight: 10
    }
  }), /*#__PURE__*/React.createElement(OText, {
    size: 16,
    style: styles.inputStyle,
    numberOfLines: 1
  }, orderState === null || orderState === void 0 ? void 0 : (_orderState$options4 = orderState.options) === null || _orderState$options4 === void 0 ? void 0 : (_orderState$options4$ = _orderState$options4.address) === null || _orderState$options4$ === void 0 ? void 0 : _orderState$options4$.address))), /*#__PURE__*/React.createElement(BusinessTypeFilter, {
    handleChangeBusinessType: handleChangeBusinessType
  }), !businessesList.loading && businessesList.businesses.length === 0 && /*#__PURE__*/React.createElement(NotFoundSource, {
    content: t('NOT_FOUND_BUSINESSES', 'No businesses to delivery / pick up at this address, please change filters or change address.')
  }), businessesList.loading && /*#__PURE__*/React.createElement(React.Fragment, null, [...Array(paginationProps.nextPageItems ? paginationProps.nextPageItems : 8).keys()].map((item, i) => /*#__PURE__*/React.createElement(Placeholder, {
    Animation: Fade,
    key: i,
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement(View, {
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(PlaceholderLine, {
    height: 200,
    style: {
      marginBottom: 20,
      borderRadius: 25
    }
  }), /*#__PURE__*/React.createElement(View, {
    style: {
      paddingHorizontal: 10
    }
  }, /*#__PURE__*/React.createElement(View, {
    style: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(PlaceholderLine, {
    height: 25,
    width: 40,
    style: {
      marginBottom: 10
    }
  }), /*#__PURE__*/React.createElement(PlaceholderLine, {
    height: 25,
    width: 20,
    style: {
      marginBottom: 10
    }
  })), /*#__PURE__*/React.createElement(PlaceholderLine, {
    height: 20,
    width: 30,
    style: {
      marginBottom: 10
    }
  }), /*#__PURE__*/React.createElement(PlaceholderLine, {
    height: 20,
    width: 80,
    style: {
      marginBottom: 10
    }
  })))))), !businessesList.loading && ((_businessesList$busin = businessesList.businesses) === null || _businessesList$busin === void 0 ? void 0 : _businessesList$busin.map(business => {
    var _orderState$options5;

    return /*#__PURE__*/React.createElement(BusinessController, {
      key: business.id,
      business: business,
      handleCustomClick: handleBusinessClick,
      orderType: orderState === null || orderState === void 0 ? void 0 : (_orderState$options5 = orderState.options) === null || _orderState$options5 === void 0 ? void 0 : _orderState$options5.type
    });
  })));
};

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  welcome: {
    flex: 1,
    flexDirection: 'row'
  },
  inputStyle: {
    backgroundColor: colors.inputDisabled,
    flex: 1
  },
  wrapperOrderOptions: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  borderStyle: {
    borderColor: colors.backgroundGray,
    borderWidth: 1,
    borderRadius: 10
  }
});
export const BusinessesListing = props => {
  const BusinessesListingProps = { ...props,
    UIComponent: BusinessesListingUI
  };
  return /*#__PURE__*/React.createElement(BusinessesListingController, BusinessesListingProps);
};
//# sourceMappingURL=index.js.map