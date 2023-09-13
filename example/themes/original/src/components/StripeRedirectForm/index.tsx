import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { StripeRedirectForm as StripeRedirectFormController, useSession, useLanguage, ToastType, useToast } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
// import stripe from 'tipsi-stripe';

import {
	FormRedirect,
	FormGroup,
	ErrorMessage
} from './styles';

import { OButton, ODropDown, OInput, OText } from '../shared';

const StripeRedirectFormUI = (props: any) => {
	const {
		paymethods,
		publicKey,
		handleSubmitPaymentMethod
	} = props;

	const theme = useTheme();

	// stripe.setOptions({
	//   publishableKey: publicKey,
	//   // androidPayMode: 'test', // Android only
	// })

	const [, { showToast }] = useToast();
	const { control, handleSubmit, errors } = useForm();

	const [{ user }] = useSession();
	const [, t] = useLanguage();

	const [paymentValue, setPaymentValue] = useState('-1');

	const onSubmit = (values: any) => {
		console.log('onSubmit', values);
		// handleSubmitPaymentMethod && handleSubmitPaymentMethod();
	}

	const handleChangeBankOption = (option: any) => {
		console.log('option', option);
		// setPaymentValue(option.value)
	}

	useEffect(() => {
		if (Object.keys(errors).length > 0) {
			const list = Object.values(errors)
			let stringError = ''
			list.map((item: any, i: number) => {
				stringError += (i + 1) === list.length ? `- ${item.message}` : `- ${item.message}\n`
			})
			showToast(ToastType.Error, stringError)
		}
	}, [errors])

	const handleCreateSource = async () => {
		// try {
		//   // this.setState({ loading: true, source: null })
		//   const source = await stripe.createSourceWithParams({
		//     type: 'alipay',
		//     amount: 50,
		//     currency: 'USD',
		//     returnURL: 'https://www.google.com/',
		//   })
		//   // this.setState({ loading: false, source })
		//   console.log('source', source);
		// } catch (error) {
		//   // this.setState({ loading: false })
		//   console.log(error);
		// }
	}

	return (
		<FormRedirect>
			<FormGroup>
				<OText size={24}>{t('SELECT_A_PAYMENT_METHOD', 'Select a payment method')}</OText>
				<ODropDown
					options={paymethods}
					defaultValue={paymentValue}
					onSelect={(option: any) => handleChangeBankOption(option)}
				/>
				{/* {errors.type && errors.type.type === 'required' && (
          <ErrorMessage>{t('FIELD_REQUIRED', 'This field is required')}</ErrorMessage>
        )} */}
				{/* {errors && (
          <OText>
            {JSON.stringify(errors)}
          </OText>
        )} */}
			</FormGroup>

			{/* <FormGroup>
        <Controller
          control={control}
          render={({ onChange, value }) => (
            <OInput
              placeholder={t('TYPE_ACCOUNT_HOLDER', 'Type an Account holder')}
              // style={styles.inputStyle}
              icon={IMAGES.user}
              value={value}
              onChange={(val: any) => onChange(val)}
            />
          )}
          name="name"
          rules={{
            required: t(`VALIDATION_ERROR_NAME_REQUIRED`, 'Name is required'),
          }}
          defaultValue={user?.name}
        />
      </FormGroup>

      <FormGroup>
        <Controller
          control={control}
          render={({ onChange, value }) => (
            <OInput
              placeholder={t('TYPE_AN_EMAIL', 'Type an email')}
              icon={IMAGES.email}
              value={value}
              onChange={(val: any) => onChange(val)}
              autoCapitalize='none'
            />
          )}
          name="email"
          rules={{
            required: t('VALIDATION_ERROR_EMAIL_REQUIRED', 'The field Email is required').replace('_attribute_', t('EMAIL', 'Email')),
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: t('INVALID_ERROR_EMAIL', 'Invalid email address').replace('_attribute_', t('EMAIL', 'Email'))
            }
          }}
          defaultValue={user?.email}
        />
      </FormGroup> */}

			<OButton
				// text={formState.isSubmitting ? t('LOADING', 'Loading...') : t('OK', 'OK')}
				text={t('OK', 'OK')}
				imgRightSrc={null}
				// isDisabled={formState.isSubmitting}
				// onClick={() => handleSubmit(onSubmit)}
				onClick={() => handleCreateSource()}
			/>
		</FormRedirect>
	)
}

export const StripeRedirectForm = (props: any) => {
	const stripeRedirectFormProps = {
		...props,
		UIComponent: StripeRedirectFormUI
	}
	return <StripeRedirectFormController {...stripeRedirectFormProps} />
}
