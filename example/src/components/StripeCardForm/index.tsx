import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLanguage } from 'ordering-components/native';
// import { CreditCardInput } from 'react-native-credit-card-input';
import { StripeCardForm as CardForm } from './naked';
import {
  CardField,
  CardFieldInput,
  useStripe
} from '@stripe/stripe-react-native';

import {
  FormStripe,
  FormRow,
  ErrorMessage,
  FormActions
} from './styles';

import { OButton, OText } from '../shared';
import { colors } from '../../theme.json';

const StripeCardFormUI = (props:  any) => {
  const {
    stateCardForm,
    handleCancel,
    publicKey
  } = props;

  // const { error, loading } = stateCardForm;

  const [card, setCard] = useState<CardFieldInput.Details | null>(null);
  // const stripe = useStripe();

  const [, t] = useLanguage();
  const [cardState, setCardState] = useState<any>(null)

  const handleChange = (values: any) => setCardState(values);

  const handleSubmit = () => props.handleSubmit && props.handleSubmit(cardState)

  // return (
  //   <FormStripe>
  //     <FormRow style={{ marginTop: 30 }}>
  //       <CreditCardInput
  //         autoFocus
  //         requiresCVC
  //         labelStyle={styles.label}
  //         inputStyle={styles.input}
  //         validColor={'#000000'}
  //         invalidColor={colors.cancelColor}
  //         placeholderColor={colors.backgroundGray}
  //         onChange={handleChange}
  //       />
  //       <ErrorMessage>
  //         <OText color={colors.error} style={{ textAlign: 'center' }}>
  //           {error}
  //         </OText>
  //       </ErrorMessage>
  //     </FormRow>
  //     <FormActions>
  //       <View style={{ width: '49%' }}>
  //         <OButton
  //           text={t('CANCEL', 'Cancel')}
  //           bgColor={colors.backgroundGray}
  //           borderColor={colors.backgroundGray}
  //           textStyle={{color: 'white'}}
  //           imgRightSrc={null}
  //           onClick={() => handleCancel()}
  //         />
  //       </View>
  //       <View style={{ width: '49%' }}>
  //         <OButton
  //           text={loading ? t('LOADING', 'Loading...') : t('ADD', 'Add')}
  //           isDisabled={!cardState?.valid || loading}
  //           bgColor={colors.primary}
  //           borderColor={colors.primary}
  //           textStyle={{color: 'white'}}
  //           imgRightSrc={null}
  //           onClick={handleSubmit}
  //         />
  //       </View>
  //     </FormActions>
  //   </FormStripe>
  // )

  // useEffect(() => {
  //   // console.log(publicKey);
  //   initStripe({
  //     publishableKey: publicKey.toString(),
  //     // merchantIdentifier: 'merchant.identifier',
  //   });
  // }, []);

  return (
    <View style={{ backgroundColor: '#000000' }}>
      <CardField
        postalCodeEnabled={true}
        placeholder={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={{
          backgroundColor: '#FFFFFF',
          textColor: '#000000',
        }}
        style={{
          width: '100%',
          height: 50,
          marginVertical: 30,
        }}
        onCardChange={(cardDetails) => {
          setCard(cardDetails);
          console.log('cardDetails', cardDetails);
        }}
        onFocus={(focusedField) => {
          console.log('focusField', focusedField);
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  label: {
    color: '#000',
    fontSize: 14,
  },
  input: {
    fontSize: 18,
    color: '#000'
  },
})

export const StripeCardForm = (props: any) => {
  const cardFormProps = {
    ...props,
    UIComponent: StripeCardFormUI
  }
  return <CardForm {...cardFormProps} />
}
