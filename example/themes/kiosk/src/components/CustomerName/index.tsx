import React, { useEffect } from 'react';
import { useLanguage, ToastType, useToast } from 'ordering-components/native';
import { _setStoreData, _removeStoreData } from '../../../../../src/providers/StoreUtil';

import { OButton, OInput, OText } from '../shared';
import { useForm, Controller } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { Container } from '../../layouts/Container';
import NavBar from '../NavBar';
import { OSActions } from '../OrderDetails/styles';
import { LANDSCAPE, PORTRAIT, useDeviceOrientation } from '../../../../../src/hooks/DeviceOrientation';
import { useTheme } from 'styled-components/native';

const CustomerName = (props: Props): React.ReactElement => {
  const {
    navigation,
    onProceedToPay
  } = props;

  const theme = useTheme()
  const [, t] = useLanguage();
  const { control, handleSubmit, errors } = useForm();
  const [, { showToast }] = useToast();
  const [orientationState] = useDeviceOrientation();

  const onSubmit = (values: any) => {
    _setStoreData('customer_name', { customerName: values.name });
    onProceedToPay()
  };

  const onSkip = () => {
    _removeStoreData('customer_name')
    onProceedToPay()
  }

  const styles = StyleSheet.create({
    inputStyle: {
      borderRadius: 4,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.colors.disabled,
      height: 50
    },
  });

  useEffect(() => {
    if (Object.keys(errors)?.length > 0) {
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

  const submitButton = (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <OButton
        text={t('PROCEED_TO_PAY', 'Proceed to Pay')}
        onClick={handleSubmit(onSubmit)}
        textStyle={{ color: theme.colors.primaryContrast, fontSize: 20 }}
        parentStyle={{
          height: orientationState?.orientation === PORTRAIT
            ? 50 : 100
        }}
        style={{
          width: orientationState?.orientation === PORTRAIT
            ? orientationState?.dimensions.width * 0.5
            : orientationState?.dimensions.width * 0.5
        }}
      />
    </View>
  );

  const skipButton = (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <OButton
        text={t('SKIP', 'Skip')}
        onClick={onSkip}
        textStyle={{ color: theme.colors.primary, fontSize: 18 }}
        parentStyle={{
          height: orientationState?.orientation === PORTRAIT
            ? 50 : 100
        }}
        style={{
          backgroundColor: theme.colors.white,
          width: orientationState?.orientation === PORTRAIT
            ? orientationState?.dimensions.width * 0.2
            : orientationState?.dimensions.width * 0.1,
        }}
      />
    </View>
  );

  return (
    <>
      <Container>
        <NavBar
          title={t('YOUR_NAME', 'Your name')}
          onActionLeft={goToBack}
          btnStyle={{ paddingLeft: 0 }}
        />
        <View style={{
          marginVertical: orientationState?.dimensions?.height * 0.08,
          alignItems: 'center'
        }}>
          <OText
            size={orientationState?.dimensions?.width * 0.05}
            style={{ bottom: 20 }}
          >
            {t('WHATS_YOUR_NAME', "What's your name?")}
          </OText>
          <Controller
            control={control}
            render={({ onChange, value }: any) => (
              <OInput
                placeholder={t('WRITE_YOUR_NAME', 'Write your name')}
                style={{
                  ...styles.inputStyle,
                  width: orientationState?.orientation === PORTRAIT
                    ? orientationState?.dimensions.width * 0.5
                    : orientationState?.dimensions.width * 0.5,
                }}
                value={value}
                autoCapitalize="words"
                autoCorrect={false}
                onChange={(val: any) => onChange(val)}
                onSubmitEditing={handleSubmit(onSubmit)}
              />
            )}
            name="name"
            rules={{
              required: t(
                'VALIDATION_ERROR_REQUIRED',
                'The field Customer Name is required',
              ).replace('_attribute_', t('REQUEST_COLLECTION_CUSTOMER_NAME', 'Customer Name')),
              pattern: {
                value: /^[a-zA-Z áéíóúüñçÁÉÍÓÚÜÑÇ]+$/i,
                message: t(
                  'INVALID_ERROR',
                  'Invalid name',
                ).replace('_attribute_', t('NAME', 'Name')),
              }
            }}
            defaultValue=""
          />

          {orientationState?.orientation === LANDSCAPE && submitButton}
          {orientationState?.orientation === LANDSCAPE && skipButton}
          {(orientationState?.orientation === PORTRAIT) && (
            <OSActions>
              {submitButton}
            </OSActions>
          )}
          {(orientationState?.orientation === PORTRAIT) && (
            <OSActions>
              {skipButton}
            </OSActions>
          )}
        </View>
      </Container>
    </>
  );
};

interface Props {
  navigation: any;
  onProceedToPay: any;
}

export default CustomerName;
