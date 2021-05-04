import React, { useState, useEffect } from 'react';
import { OrderReview as ReviewOrderController, useLanguage } from 'ordering-components/native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useForm, Controller } from 'react-hook-form';
import { ReviewOrderContainer, BusinessLogo, FormReviews, Category, Stars } from './styles';
import { OButton, OIcon, OInput, OText } from '../shared';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme';
import { useToast, ToastType } from '../../providers/ToastProvider';
import NavBar from '../NavBar';
import Spinner from 'react-native-loading-spinner-overlay';
export const ReviewOrderUI = props => {
  const {
    order,
    stars,
    handleChangeInput,
    handleChangeRating,
    handleSendReview,
    formState,
    navigation
  } = props;
  const [, t] = useLanguage();
  const {
    showToast
  } = useToast();
  const {
    handleSubmit,
    control,
    errors
  } = useForm();
  const [alertState, setAlertState] = useState({
    open: false,
    content: [],
    success: false
  });
  const categories = {
    quality: {
      name: 'quality',
      show: t('QUALITY', 'Quality of Product')
    },
    punctuality: {
      name: 'punctiality',
      show: t('PUNCTUALITY', 'Punctuality')
    },
    service: {
      name: 'service',
      show: t('SERVICE', 'Service')
    },
    packaging: {
      name: 'packaging',
      show: t('PRODUCT_PACKAGING', 'Product Packaging')
    }
  };

  const onSubmit = () => {
    if (Object.values(stars).some(value => value === 0)) {
      setAlertState({
        open: true,
        content: Object.values(categories).map((category, i) => stars[category.name] === 0 ? `- ${t('CATEGORY_ATLEAST_ONE', `${category.show} must be at least one point`).replace('CATEGORY', category.name.toUpperCase())} ${i !== 3 && '\n'}` : ' ')
      });
      return;
    }

    handleSendReview();
    setAlertState({ ...alertState,
      success: true
    });
  };

  const getStarArr = rating => {
    switch (rating) {
      case 0:
        return [0, 0, 0, 0, 0];

      case 1:
        return [1, 0, 0, 0, 0];

      case 2:
        return [1, 1, 0, 0, 0];

      case 3:
        return [1, 1, 1, 0, 0];

      case 4:
        return [1, 1, 1, 1, 0];

      case 5:
        return [1, 1, 1, 1, 1];

      default:
        return [0, 0, 0, 0, 0];
    }
  };

  useEffect(() => {
    if (formState.error && !(formState !== null && formState !== void 0 && formState.loading)) {
      showToast(ToastType.Error, formState.result);
    }

    if (!formState.loading && !formState.error && alertState.success) {
      showToast(ToastType.Success, t('REVIEW_SUCCESS_CONTENT', 'Thank you, Review successfully submitted!'));
      navigation.goBack();
    }
  }, [formState.result]);
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      // Convert all errors in one string to show in toast provider
      const list = Object.values(errors);
      let stringError = '';
      list.map((item, i) => {
        stringError += i + 1 === list.length ? `- ${item.message}` : `- ${item.message}\n`;
      });
      showToast(ToastType.Error, stringError);
    }
  }, [errors]);
  useEffect(() => {
    if (alertState.open) {
      alertState.content && showToast(ToastType.Error, alertState.content);
    }
  }, [alertState.content]);

  const getStar = (star, index, category) => {
    switch (star) {
      case 0:
        return /*#__PURE__*/React.createElement(TouchableOpacity, {
          key: index,
          onPress: () => handleChangeRating({
            target: {
              name: category,
              value: index + 1
            }
          })
        }, /*#__PURE__*/React.createElement(MaterialCommunityIcon, {
          name: "star-outline",
          size: 24,
          color: colors.backgroundDark
        }));

      case 1:
        return /*#__PURE__*/React.createElement(TouchableOpacity, {
          key: index,
          onPress: () => handleChangeRating({
            target: {
              name: category,
              value: index + 1
            }
          })
        }, /*#__PURE__*/React.createElement(MaterialCommunityIcon, {
          name: "star",
          size: 24,
          color: colors.primary
        }));
    }
  };

  return /*#__PURE__*/React.createElement(ReviewOrderContainer, null, /*#__PURE__*/React.createElement(NavBar, {
    title: t('REVIEW_ORDER', 'Review your Order'),
    titleAlign: 'center',
    onActionLeft: () => navigation.goBack(),
    showCall: false,
    btnStyle: {
      paddingLeft: 0
    },
    paddingTop: 0
  }), /*#__PURE__*/React.createElement(BusinessLogo, null, /*#__PURE__*/React.createElement(OIcon, {
    url: order === null || order === void 0 ? void 0 : order.logo,
    width: 100,
    height: 100
  })), /*#__PURE__*/React.createElement(FormReviews, null, Object.values(categories).map(category => /*#__PURE__*/React.createElement(Category, {
    key: category.name
  }, /*#__PURE__*/React.createElement(OText, null, category.show), /*#__PURE__*/React.createElement(Stars, null, getStarArr(stars[category === null || category === void 0 ? void 0 : category.name]).map((star, index) => getStar(star, index, category.name))))), /*#__PURE__*/React.createElement(Controller, {
    control: control,
    defaultValue: "",
    name: "comments",
    render: ({
      onChange
    }) => /*#__PURE__*/React.createElement(OInput, {
      name: "comments",
      placeholder: t('COMMENTS', 'Comments'),
      onChange: val => {
        onChange(val);
        handleChangeInput(val);
      },
      style: styles.inputTextArea,
      multiline: true,
      bgColor: colors.inputDisabled
    }),
    rules: {
      required: t('FIELD_COMMENT_REQUIRED', 'The field comments is required')
    }
  })), /*#__PURE__*/React.createElement(OButton, {
    textStyle: {
      color: colors.white
    },
    style: {
      marginTop: 20
    },
    text: t('SAVE', 'Save'),
    imgRightSrc: "",
    onClick: handleSubmit(onSubmit)
  }), /*#__PURE__*/React.createElement(Spinner, {
    visible: formState.loading
  }));
};
const styles = StyleSheet.create({
  inputTextArea: {
    borderColor: colors.secundaryContrast,
    borderRadius: 10,
    marginVertical: 20,
    height: 150,
    alignItems: 'flex-start'
  }
});
export const ReviewOrder = props => {
  const reviewOrderProps = { ...props,
    UIComponent: ReviewOrderUI
  };
  return /*#__PURE__*/React.createElement(ReviewOrderController, reviewOrderProps);
};
//# sourceMappingURL=index.js.map