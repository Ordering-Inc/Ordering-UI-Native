import React, { useEffect } from 'react';
import { FlatList, TouchableOpacity } from 'react-native'
// import Skeleton from 'react-loading-skeleton'
// import IosCash from '@meronex/icons/ios/IosCash'
// import IosCard from '@meronex/icons/ios/IosCard'
// import IosRadioButtonOn from '@meronex/icons/ios/IosRadioButtonOn'
// import FaStripe from '@meronex/icons/fa/FaStripe'
// import FaCcStripe from '@meronex/icons/fa/FaCcStripe'
// import FaStripeS from '@meronex/icons/fa/FaStripeS'
// import GrStripe from '@meronex/icons/gr/GrStripe'
// import EnPaypal from '@meronex/icons/en/EnPaypal'
import {
  PaymentOptions as PaymentOptionsController,
  useLanguage,
  useSession
} from 'ordering-components/native';

// import { Modal } from '../Modal'
// import { PaymentOptionCash } from '../PaymentOptionCash'
// import { PaymentOptionStripe } from '../PaymentOptionStripe'
// import { PaymentOptionPaypal } from '../PaymentOptionPaypal'
// import { StripeElementsForm } from '../StripeElementsForm'
// import { StripeRedirectForm } from '../StripeRedirectForm'
// import { NotFoundSource } from '../NotFoundSource'

// import { getIconCard } from '../../utils'

import { IMAGES, PAYMENT_IMAGES } from '../../config/constants';
import { OText, OButton, OIcon } from '../shared';

import {
  PMContainer,
  PMItem,
  PayCardSelected,
  CardItemContent
} from './styles'

const stripeOptions = ['stripe_direct', 'stripe', 'stripe_connect']
const stripeRedirectOptions = [
  { name: 'Bancontact', value: 'bancontact' },
  { name: 'Alipay', value: 'alipay' },
  { name: 'Giropay', value: 'giropay' },
  { name: 'iDEAL', value: 'ideal' }
]

const getPayIcon = (method: string) => {
  switch (method) {
    case 'cash':
      return PAYMENT_IMAGES.cash
    case 'card_delivery':
      return PAYMENT_IMAGES.carddelivery
    case 'paypal':
      return PAYMENT_IMAGES.paypal
    case 'stripe':
      return PAYMENT_IMAGES.stripe
    case 'stripe_direct':
      return PAYMENT_IMAGES.stripecc
    case 'stripe_connect':
      return PAYMENT_IMAGES.stripes
    case 'stripe_redirect':
      return PAYMENT_IMAGES.stripesb
    default:
      return PAYMENT_IMAGES.creditCard
  }
}

const paypalBtnStyle = {
  color: 'gold',
  shape: 'pill',
  label: 'paypal',
  size: 'responsive'
}

const PaymentOptionsUI = (props: any) => {
  const {
    cart,
    errorCash,
    isLoading,
    isDisabled,
    paymethodSelected,
    paymethodData,
    paymethodsList,
    isPaymethodNull,
    handleOrderRedirect,
    handlePaymethodClick,
    handlePaymethodDataChange
  } = props
  const [, t] = useLanguage()
  // const [{ token }] = useSession()

  useEffect(() => {
    if (paymethodsList.paymethods.length === 1) {
      handlePaymethodClick && handlePaymethodClick(paymethodsList.paymethods[0])
    }
  }, [paymethodsList.paymethods])

  useEffect(() => {
    if (paymethodSelected?.gateway !== 'cash' && errorCash) {
      props.setErrorCash(false)
    }
  }, [paymethodSelected])

  useEffect(() => {
    !isPaymethodNull &&
    handlePaymethodClick &&
    handlePaymethodClick(isPaymethodNull)
  }, [isPaymethodNull])

  const renderPaymethods = ({ item }: any) => {
    return (
      <TouchableOpacity
        onPress={() => handlePaymethodClick(item)}
      >
        <PMItem
          key={item.id}
          isDisabled={isDisabled}
          isActive={paymethodSelected?.id === item.id}
        >
          <OIcon
            src={getPayIcon(item.gateway)}
            width={40}
            height={40}
            />
          <OText size={12} style={{ margin: 0 }}>
            {item.name}
          </OText>
        </PMItem>
      </TouchableOpacity>
    )
  }

  return (
    <PMContainer>
      {paymethodsList.paymethods.length > 0 && (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={paymethodsList.paymethods.sort((a: any, b: any) => a.id - b.id)}
          renderItem={renderPaymethods}
          keyExtractor={paymethod => paymethod.id.toString()}
        />
      )}

      {(paymethodsList.loading || isLoading) && (
        <OText size={12} style={{ margin: 0 }}>
          Loading...
        </OText>
      )}

      {paymethodsList.error && paymethodsList.error.length > 0 && (
        <OText size={12} style={{ margin: 0 }}>
          {paymethodsList?.error[0]?.message || paymethodsList?.error[0]}
        </OText>
      )}

      {!(paymethodsList.loading || isLoading) &&
        !paymethodsList.error &&
        (!paymethodsList?.paymethods || paymethodsList.paymethods.length === 0) &&
      (
        <OText size={12} style={{ margin: 0 }}>
          {t('NO_PAYMENT_METHODS', 'No payment methods!')}
        </OText>
      )}

      {/* {paymethodSelected?.gateway === 'cash' && (
        <PaymentOptionCash
          orderTotal={cart.total}
          onChangeData={handlePaymethodDataChange}
          setErrorCash={props.setErrorCash}
        />
      )} */}

      {/* {stripeOptions.includes(paymethodSelected?.gateway) && paymethodData?.card && (
        <PayCardSelected>
          <CardItemContent>
            <span className='checks'>
              <IosRadioButtonOn />
            </span>
            <span className='brand'>
              {getIconCard(paymethodData?.card?.brand)}
            </span>
            <span>
              XXXX-XXXX-XXXX-{paymethodData?.card?.last4}
            </span>
          </CardItemContent>
        </PayCardSelected>
      )} */}

      {/* Paypal */}
      {/* <Modal
        className='modal-info'
        open={paymethodSelected?.gateway === 'paypal' && !paymethodData.id}
        onClose={() => handlePaymethodClick(null)}
        title={t('PAY_WITH_PAYPAL', 'Pay with PayPal')}
      >
        {paymethodSelected?.gateway === 'paypal' && (
          <PaymentOptionPaypal
            clientId={paymethodSelected?.credentials?.client_id}
            body={{
              paymethod_id: paymethodSelected.id,
              amount: cart.total,
              delivery_zone_id: cart.delivery_zone_id,
              cartUuid: cart.uuid
            }}
            btnStyle={paypalBtnStyle}
            noAuthMessage={
              !token
                ? t('NEED_LOGIN_TO_USE', 'Sorry, you need to login to use this method')
                : null
            }
            handlerChangePaypal={(uuid) => handleOrderRedirect && handleOrderRedirect(uuid)}
          />
        )}
      </Modal> */}

      {/* Stripe */}
      {/* <Modal
        className='modal-info'
        open={paymethodSelected?.gateway === 'stripe' && !paymethodData.id}
        onClose={() => handlePaymethodClick(null)}
        title={t('SELECT_A_CARD', 'Select a card')}
      >
        {paymethodSelected?.gateway === 'stripe' && (
          <PaymentOptionStripe
            paymethod={paymethodSelected}
            businessId={props.businessId}
            publicKey={paymethodSelected.credentials.publishable}
            payType={paymethodsList?.name}
            onSelectCard={handlePaymethodDataChange}
            onCancel={() => handlePaymethodClick(null)}
          />
        )}
      </Modal> */}

      {/* Stripe Connect */}
      {/* <Modal
        title={t('SELECT_A_CARD', 'Select a card')}
        open={paymethodSelected?.gateway === 'stripe_connect' && !paymethodData.id}
        className='modal-info'
        onClose={() => handlePaymethodClick(null)}
      >
        {paymethodSelected?.gateway === 'stripe_connect' && (
          <PaymentOptionStripe
            paymethod={paymethodSelected}
            businessId={props.businessId}
            publicKey={paymethodSelected.credentials.stripe.publishable}
            clientSecret={paymethodSelected.credentials.publishable}
            payType={paymethodsList?.name}
            onSelectCard={handlePaymethodDataChange}
            onCancel={() => handlePaymethodClick(null)}
          />
        )}
      </Modal> */}

      {/* Stripe direct */}
      {/* <Modal
        title={t('ADD_CARD', 'Add card')}
        open={paymethodSelected?.gateway === 'stripe_direct' && !paymethodData.id}
        className='modal-info'
        onClose={() => handlePaymethodClick(null)}
      >
        {paymethodSelected?.gateway === 'stripe_direct' && (
          <StripeElementsForm
            businessId={props.businessId}
            publicKey={paymethodSelected.credentials.publishable}
            handleSource={handlePaymethodDataChange}
            onCancel={() => handlePaymethodClick(null)}
          />
        )}
      </Modal> */}

      {/* Stripe Redirect */}
      {/* <Modal
        title={t('STRIPE_REDIRECT', 'Stripe Redirect')}
        open={['stripe_redirect'].includes(paymethodSelected?.gateway) && !paymethodData.type}
        className='modal-info'
        onClose={() => handlePaymethodClick(null)}
      >
        <StripeRedirectForm
          businessId={props.businessId}
          currency={props.currency}
          paymethods={stripeRedirectOptions}
          handleStripeRedirect={handlePaymethodDataChange}
        />
      </Modal> */}
    </PMContainer>
  )
}

export const PaymentOptions = (props: any) => {
  const paymentOptions = {
    ...props,
    UIComponent: PaymentOptionsUI
  }
  return (
    <PaymentOptionsController {...paymentOptions} />
  )
}
