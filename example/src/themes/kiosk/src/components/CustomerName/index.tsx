import React, { useEffect } from 'react';
import { useLanguage, ToastType, useToast } from 'ordering-components/native';
import { _setStoreData } from '../../../../../providers/StoreUtil';

import { OButton, OInput, OText } from '../shared';
import { useForm, Controller } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { Container } from '../../layouts/Container';
import NavBar from '../NavBar';
import { OSActions } from '../OrderDetails/styles';
import { LANDSCAPE, PORTRAIT, useDeviceOrientation } from '../../../../../hooks/DeviceOrientation';
import { useTheme } from 'styled-components/native';

const CustomerName = (props: Props): React.ReactElement => {
  const {
    navigation,
    onProceedToPay
  } = props;

  const theme = useTheme()
  const [, t] = useLanguage();
  const { control, handleSubmit, errors } = useForm();
  const {showToast} = useToast();
  const [orientationState] = useDeviceOrientation();

  const onSubmit = (values: any) => {
    _setStoreData('customer_name', values.name);
    onProceedToPay()
  };

  const styles = StyleSheet.create({
    inputStyle: {
      borderRadius: 4,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.colors.disabled,
      height: 44
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

  const submitButton  = (<OButton
    text={t('PROCEED_TO_PAY', 'Proceed to Pay')}
    onClick={handleSubmit(onSubmit)}
    parentStyle={{
      height: orientationState?.orientation === PORTRAIT
         ? 50 : 100
    }}
    style={{
      width: orientationState?.orientation === PORTRAIT
        ? orientationState?.dimensions.width - 40
        : orientationState?.dimensions.width * 0.5,
    }}
  />);

  return (
    <>
      <Container>
        <NavBar
          title={t('YOUR_NAME', 'Your name')}
          onActionLeft={goToBack}
        />

        <View style={{ marginVertical: orientationState?.dimensions?.height * 0.03 }}>
          <OText
            size={orientationState?.dimensions?.width * 0.05}
          >
            {t('WHOM_MIGHT_THIS', 'Whom might this')} {'\n'}
            <OText
              size={orientationState?.dimensions?.width * 0.05}
              weight={'700'}
            >
              {`${t('ORDER_BE_FOR', 'order be for?')}?`}
            </OText>
          </OText>
        </View>

        <Controller
          control={control}
          render={({ onChange, value }: any) => (
            <OInput
              placeholder={t('WHITE_YOUR_NAME', 'White your name')}
              style={{
                ...styles.inputStyle,
                width: orientationState?.orientation === PORTRAIT
                  ? orientationState?.dimensions.width - 40
                  : orientationState?.dimensions.width * 0.5,
              }}
              value={value}
              autoCapitalize="words"
              autoCorrect={false}
              onChange={(val: any) => onChange(val)}
            />
          )}
          name="name"
          rules={{
            required: t(
              'VALIDATION_ERROR_CUSTOMER_NAME_REQUIRED',
              'The field Customer Name is required',
            ).replace('_attribute_', t('CUSTOMER_NAME', 'Customer Name')),
            pattern: {
              value: /^[a-zA-Z áéíóúüñçÁÉÍÓÚÜÑÇ]+$/i,
              message: t(
                'INVALID_ERROR_NAME',
                'Invalid name',
              ).replace('_attribute_', t('NAME', 'Name')),
            }
          
          }}
          defaultValue=""
        />

        {orientationState?.orientation === LANDSCAPE && submitButton}
      </Container>
      
      {(orientationState?.orientation === PORTRAIT) && (
        <OSActions>
          {submitButton}
        </OSActions>
      )}
    </>
  );
};

interface Props {
  navigation: any;
  onProceedToPay: any;
}

export default CustomerName;
