import React, { useEffect } from 'react';
import { useLanguage } from 'ordering-components/native';
import { _setStoreData } from '../../providers/StoreUtil';

import { OButton, OInput, OText } from '../shared';
import { StyledContent } from './styles';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { colors } from '../../theme.json';
import { ToastType, useToast } from '../../providers/ToastProvider';
import { STORAGE_KEY } from '../../config/constants';

const CustomerName = (props: Props): React.ReactElement => {
  const {
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

  return (
    <View style={styles.container}>
      <StyledContent>
        <OText size={28}>
          {t('WHOM_MIGHT_THIS', 'Whom might this')}
        </OText>
        <OText size={28} weight={'bold'}>
          {t('ORDER_BE_FOR', 'order be for?')}
        </OText>

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

      </StyledContent>

      <OButton
        style={styles.buttonStyle}
        text={t('PROCEED_TO_PAY', 'Proceed to Pay')}
        onClick={handleSubmit(onSubmit)}/>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inputStyle: {
    marginTop: 36,
    borderRadius: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.disabled,
    height: 44
  },
  buttonStyle: {
    height: 44,
    margin: 16
  },
});

interface Props {
  onProceedToPay: any;
}

export default CustomerName;
