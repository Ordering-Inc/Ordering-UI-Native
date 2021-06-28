import React, { useEffect } from 'react';
import { useLanguage } from 'ordering-components/native';
import { _setStoreData } from '../../providers/StoreUtil';

import { OButton, OInput, OText } from '../shared';
import { Controller, useForm } from 'react-hook-form';
import { Dimensions, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { colors } from '../../theme.json';
import { ToastType, useToast } from '../../providers/ToastProvider';
import { STORAGE_KEY } from '../../config/constants';
import { Container } from '../../layouts/Container';
import NavBar from '../NavBar';
import { OSActions } from '../OrderDetails/styles';

const _dim = Dimensions.get('window');

const CustomerName = (props: Props): React.ReactElement => {
  const {
    navigation,
    onProceedToPay
  } = props;

  const [, t] = useLanguage();
  const {control, handleSubmit, formState: {errors}} = useForm();
  const {showToast} = useToast();

  const onSubmit = (values: any) => {
    _setStoreData(STORAGE_KEY.CUSTOMER_NAME, values.name);
    onProceedToPay()
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      // Convert all errors in one string to show in toast provider
      const list = Object.values(errors);
      let stringError = '';
      list.map((item: any, i: number) => {
        stringError += (i + 1) === list.length ? `- ${item.message}` : `- ${item.message}\n`
      });
      showToast(ToastType.Error, stringError);
    }
  }, [errors]);

  const goToBack = () => navigation?.goBack();

  return (
    <>
      <Container>
        <NavBar
          title={t('YOUR_NAME', 'Your name')}
          onActionLeft={goToBack}
        />

        <View style={{ marginVertical: _dim.height * 0.03 }}>
          <OText
            size={_dim.width * 0.05}
          >
            {t('WHOM_MIGHT_THIS', 'Whom might this')} {'\n'}
            <OText
              size={_dim.width * 0.05}
              weight={'700'}
            >
              {`${t('ORDER_BE_FOR', 'order be for?')}?`}
            </OText>
          </OText>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS == 'ios' ? 0 : 0}
          enabled={Platform.OS === 'ios' ? true : false}
        >
          <Controller
            control={control}
            render={(p: any) => (
              <OInput
                placeholder={t('WHITE_YOUR_NAME', 'White your name')}
                style={styles.inputStyle}
                value={p.field.value}
                autoCapitalize="words"
                autoCorrect={false}
                onChange={(val: any) => p.field.onChange(val)}
              />
            )}
            name="name"
            rules={{
              required: t(
                'VALIDATION_ERROR_CUSTOMER_NAME_REQUIRED',
                'The field Customer Name is required',
              ).replace('_attribute_', t('CUSTOMER_NAME', 'Customer Name'))
            }}
            defaultValue=""
          />
        </KeyboardAvoidingView>

      </Container>

      <OSActions>
        <OButton
          text={t('PROCEED_TO_PAY', 'Proceed to Pay')}
          onClick={handleSubmit(onSubmit)}
        />
      </OSActions>
    </>
  );
};

const styles = StyleSheet.create({
  inputStyle: {
    borderRadius: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.disabled,
    height: 44
  },
});

interface Props {
  navigation: any;
  onProceedToPay: any;
}

export default CustomerName;
