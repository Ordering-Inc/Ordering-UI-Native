import React from 'react';
import { BusinessTypeFilter as BusinessTypeFilterController, useLanguage } from 'ordering-components/native';
import { BusinessCategoriesTitle, BusinessCategories, Category, IconContainer } from './styles';
import { OText } from '../shared';
import { StyleSheet } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../theme';
export const BusinessTypeFilterUI = props => {
  const {
    businessTypes,
    handleChangeBusinessType,
    currentTypeSelected
  } = props;
  const [, t] = useLanguage();

  const categoryIcons = category => {
    switch (category.key) {
      case 'All':
        return /*#__PURE__*/React.createElement(MaterialIcon, {
          name: "view-grid-plus-outline",
          size: 40,
          style: { ...styles.icons,
            color: currentTypeSelected === category.value ? colors.primaryContrast : colors.backgroundGray
          },
          onPress: () => handleChangeBusinessType(category.value)
        });

      case 'Food':
        return /*#__PURE__*/React.createElement(Ionicons, {
          name: "fast-food-outline",
          size: 40,
          style: { ...styles.icons,
            color: currentTypeSelected === category.value ? colors.primaryContrast : colors.backgroundGray
          },
          onPress: () => handleChangeBusinessType(category.value)
        });

      case 'Groceries':
        return /*#__PURE__*/React.createElement(MaterialIcon, {
          name: "baguette",
          size: 40,
          style: { ...styles.icons,
            color: currentTypeSelected === category.value ? colors.primaryContrast : colors.backgroundGray
          },
          onPress: () => handleChangeBusinessType(category.value)
        });

      case 'Laundry':
        return /*#__PURE__*/React.createElement(MaterialIcon, {
          name: "washing-machine",
          size: 40,
          style: { ...styles.icons,
            color: currentTypeSelected === category.value ? colors.primaryContrast : colors.backgroundGray
          },
          onPress: () => handleChangeBusinessType(category.value)
        });

      case 'Alcohol':
        return /*#__PURE__*/React.createElement(MaterialIcon, {
          name: "glass-wine",
          size: 40,
          style: { ...styles.icons,
            color: currentTypeSelected === category.value ? colors.primaryContrast : colors.backgroundGray
          },
          onPress: () => handleChangeBusinessType(category.value)
        });
    }
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(BusinessCategoriesTitle, null, /*#__PURE__*/React.createElement(OText, {
    size: 16,
    color: colors.textSecondary
  }, t('BUSINESS_CATEGORIES', 'Business Categories'))), /*#__PURE__*/React.createElement(BusinessCategories, null, businessTypes === null || businessTypes === void 0 ? void 0 : businessTypes.map(category => /*#__PURE__*/React.createElement(Category, {
    key: category.key
  }, /*#__PURE__*/React.createElement(IconContainer, {
    style: {
      backgroundColor: currentTypeSelected === category.value ? colors.primary : colors.primaryContrast
    }
  }, categoryIcons(category)), /*#__PURE__*/React.createElement(OText, {
    style: {
      textAlign: 'center'
    },
    color: currentTypeSelected === category.value ? colors.btnFont : colors.textSecondary
  }, t(`BUSINESS_TYPE_${category.value ? category.value.toUpperCase() : 'ALL'}`, category.key))))));
};
const styles = StyleSheet.create({
  icons: {
    padding: 10
  }
});
export const BusinessTypeFilter = props => {
  const businessTypeFilterProps = { ...props,
    UIComponent: BusinessTypeFilterUI,
    businessTypes: props.businessTypes || [{
      key: 'All',
      value: null
    }, {
      key: 'Food',
      value: 'food'
    }, {
      key: 'Groceries',
      value: 'groceries'
    }, {
      key: 'Laundry',
      value: 'laundry'
    }, {
      key: 'Alcohol',
      value: 'alcohol'
    }],
    defaultBusinessType: props.defaultBusinessType || null,
    onChangeBusinessType: props.handleChangeBusinessType
  };
  return /*#__PURE__*/React.createElement(BusinessTypeFilterController, businessTypeFilterProps);
};
//# sourceMappingURL=index.js.map