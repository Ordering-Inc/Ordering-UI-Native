import React from 'react';
import { useLanguage } from 'ordering-components/native';

import {OInput, OText} from '../shared';
import {StyledContent} from './styles';
import {Controller, useForm} from "react-hook-form";
import {FormSide} from "../LoginForm/styles";
import {StyleSheet} from "react-native";
import {colors} from "../../theme.json";

const CustomerName = (props: Props): React.ReactElement => {

	const [, t] = useLanguage();
  const {control, handleSubmit, formState: {errors}} = useForm();

	return (
		<>
      <StyledContent>
        <OText size={28}>
          Whom might this
        </OText>
        <OText size={28} weight={'bold'}>
          order be for?
        </OText>

        <Controller
          control={control}
          render={(p: any) => (
            <OInput
              placeholder={t('WHITE_YOUR_NAME', 'White your name')}
              style={styles.inputStyle}
              value={p.field.value}
              autoCapitalize="none"
              autoCorrect={false}
              type="email-address"
              onChange={(val: any) => p.field.onChange(val)}
            />
          )}
          name="email"
          rules={{
            required: t(
              'VALIDATION_ERROR_EMAIL_REQUIRED',
              'The field Email is required',
            ).replace('_attribute_', t('EMAIL', 'Email')),
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: t(
                'INVALID_ERROR_EMAIL',
                'Invalid email address',
              ).replace('_attribute_', t('EMAIL', 'Email')),
            },
          }}
          defaultValue=""
        />
      </StyledContent>
		</>
	);
};

const styles = StyleSheet.create({
  inputStyle: {
    marginTop: 36,
    borderRadius: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.disabled,
    height: 44
  },
});

interface Props {
	refRBSheet: React.RefObject<any>;
	children: any;
}

export default CustomerName;
