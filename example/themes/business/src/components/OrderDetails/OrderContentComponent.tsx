import React, { useState } from 'react'

import { Platform, StyleSheet, View } from 'react-native';

import { OButton, OText, OLink, OModal } from '../shared'
import {
  OrderContent,
  OrderBusiness,
  OrderCustomer,
  OrderProducts,
  Table,
  OrderBill,
  Total,
  OSRow,
} from './styles';

import { ProductItemAccordion } from '../ProductItemAccordion';

import { verifyDecimals } from '../../utils';

import {
  useLanguage,
  useUtils,
  useConfig,
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { ReviewCustomer } from '../ReviewCustomer'

import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'

interface OrderContent {
  order: any,
  logisticOrderStatus?: Array<number>,
  isOrderGroup?: boolean,
  lastOrder?: boolean
}

export const OrderContentComponent = (props: OrderContent) => {
  const [, t] = useLanguage();
  const theme = useTheme()

  const { order, logisticOrderStatus, isOrderGroup, lastOrder } = props;
  const [{ parsePrice, parseNumber }] = useUtils();
  const [{ configs }] = useConfig();
  const [openReviewModal, setOpenReviewModal] = useState(false)

  const pastOrderStatuses = [1, 2, 5, 6, 10, 11, 12, 16, 17]

  const walletName: any = {
    cash: {
      name: t('PAY_WITH_CASH_WALLET', 'Pay with Cash Wallet'),
    },
    credit_point: {
      name: t('PAY_WITH_CREDITS_POINTS_WALLET', 'Pay with Credit Points Wallet'),
    }
  }

  const styles = StyleSheet.create({
    linkWithIcons: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 5,
      flex: 1,
    },
    textBold: {
      fontWeight: '600',
    },
    textLink: {
      color: '#365CC7'
    },
    btnReview: {
      borderWidth: 0,
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
    }
  })

  const getIncludedTaxes = () => {
    if (!order?.taxes) return 0
    if (order?.taxes?.length === 0) {
      return order.tax_type === 1 ? order?.summary?.tax ?? 0 : 0
    } else {
      return order?.taxes.reduce((taxIncluded: number, tax: any) => {
        return taxIncluded + (tax.type === 1 ? tax.summary?.tax : 0)
      }, 0)
    }
  }

  const getIncludedTaxesDiscounts = () => {
    return order?.taxes?.filter((tax: any) => tax?.type === 1)?.reduce((carry: number, tax: any) => carry + (tax?.summary?.tax_after_discount ?? tax?.summary?.tax), 0)
  }

  return (
    <OrderContent isOrderGroup={isOrderGroup} lastOrder={lastOrder}>
      {isOrderGroup && (
        <OText size={18}>{t('ORDER', 'Order')} #{isOrderGroup ? order?.order_group_id : order?.id}</OText>
      )}

      {order?.metafields?.length > 0 && (
        <OrderBusiness>
          <OText style={{ marginBottom: 5 }} size={16} weight="600">
            {t('CUSTOM_FIELDS', 'Custom fields')}
          </OText>

          {order.metafields.map((field: any) => (
            <View
              key={field.id}
              style={{
                width: '100%',
                flexDirection: 'row',
                marginBottom: 5
              }}
            >
              <OText style={{ width: '50%' }}>
                {field.key}
              </OText>
              <OText style={{ width: '45%', textAlign: 'right' }}>
                {field.value}
              </OText>
            </View>
          ))}
        </OrderBusiness>
      )}

      <OrderBusiness>
        <OText style={{ marginBottom: 5 }} size={16} weight="600">
          {t('BUSINESS_DETAILS', 'Business details')}
        </OText>

        <OText numberOfLines={1} mBottom={4} ellipsizeMode="tail">
          {order?.business?.name}
        </OText>
        {(!order?.isLogistic || !logisticOrderStatus?.includes(order?.status)) && (
          <>
            {!!order?.business?.email && (
              <View style={styles.linkWithIcons}>
                <OLink
                  PressStyle={styles.linkWithIcons}
                  url={`mailto:${order?.business?.email}`}
                  shorcut={order?.business?.email}
                  TextStyle={styles.textLink}
                />
              </View>
            )}

            {!!order?.business?.cellphone && (
              <View style={styles.linkWithIcons}>
                <OLink
                  PressStyle={styles.linkWithIcons}
                  url={`tel:${order?.business?.cellphone}`}
                  shorcut={`${order?.business?.cellphone}`}
                  TextStyle={styles.textLink}
                />
              </View>
            )}

            {!!order?.business?.phone && (
              <View style={styles.linkWithIcons}>
                <OLink
                  PressStyle={styles.linkWithIcons}
                  url={`tel:${order?.business?.phone}`}
                  shorcut={order?.business?.phone}
                  TextStyle={styles.textLink}
                />
              </View>
            )}
          </>
        )}

        {!!order?.business?.address && (
          <View style={styles.linkWithIcons}>
            <OLink
              PressStyle={styles.linkWithIcons}
              url={Platform.select({
                ios: `maps:0,0?q=${order?.business?.address}`,
                android: `geo:0,0?q=${order?.business?.address}`,
              })}
              shorcut={order?.business?.address}
              TextStyle={styles.textLink}
            />
          </View>
        )}

        {!!order?.business?.address_notes && (
          <View style={styles.linkWithIcons}>
            <OLink
              PressStyle={styles.linkWithIcons}
              url={Platform.select({
                ios: `maps:0,0?q=${order?.business?.address_notes}`,
                android: `geo:0,0?q=${order?.business?.address_notes}`,
              })}
              shorcut={order?.business?.address_notes}
              TextStyle={styles.textLink}
            />
          </View>
        )}
      </OrderBusiness>

      <OrderCustomer>
        <OText style={{ marginBottom: 5 }} size={16} weight="600">
          {t('CUSTOMER_DETAILS', 'Customer details')}
        </OText>
        {
          (!!order?.customer?.name || !!order?.customer?.lastname) && (
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                <View style={{ flexDirection: 'row' }}>
                  {!!order?.customer?.name && (
                    <OText
                      numberOfLines={1}
                      mBottom={4}
                      ellipsizeMode="tail"
                      space>
                      {order?.customer?.name}
                    </OText>
                  )}
                  {!!order?.customer?.middle_name && (
                    <OText
                      numberOfLines={1}
                      mBottom={4}
                      ellipsizeMode="tail"
                      space>
                      {order?.customer?.middle_name}
                    </OText>
                  )}
                  {!!order?.customer?.lastname && (
                    <OText
                      numberOfLines={1}
                      mBottom={4}
                      ellipsizeMode="tail"
                      space>
                      {order?.customer?.lastname}
                    </OText>
                  )}
                  {
                    !!order?.customer?.second_lastname && (
                      <OText
                        numberOfLines={1}
                        mBottom={4}
                        ellipsizeMode="tail"
                        space>
                        {order?.customer?.second_lastname}
                      </OText>
                    )
                  }
                </View>
                {!!order?.user_review?.qualification && (
                  <View style={{ flexDirection: 'row' }}>
                    <MaterialIcon style={{ bottom: 2 }} name='star' size={24} color={theme.colors.arrowColor} />
                    <OText mLeft={5}>
                      {order?.user_review?.qualification}
                    </OText>
                  </View>
                )}
              </View>
            </View>
          )
        }

        {!!order?.customer?.email && (
          <View style={styles.linkWithIcons}>
            <OLink
              PressStyle={styles.linkWithIcons}
              url={`mailto:${order?.customer?.email}`}
              shorcut={order?.customer?.email}
              TextStyle={styles.textLink}

            />
          </View>
        )}

        {!!order?.customer?.cellphone && (
          <View style={styles.linkWithIcons}>
            <OLink
              PressStyle={styles.linkWithIcons}
              url={`tel:${!!order?.customer?.country_phone_code ? '+' + order?.customer?.country_phone_code : ''} ${order?.customer?.cellphone}`}
              shorcut={`${!!order?.customer?.country_phone_code ? '+' + order?.customer?.country_phone_code : ''} ${order?.customer?.cellphone}`}
              TextStyle={styles.textLink}
            />
          </View>
        )}

        {!!order?.customer?.phone && (
          <View style={styles.linkWithIcons}>
            <OLink
              PressStyle={styles.linkWithIcons}
              url={`tel:${order?.customer?.phone}`}
              shorcut={order?.customer?.phone}
              TextStyle={styles.textLink}
            />
          </View>
        )}

        {!!order?.customer?.address && (
          <View style={styles.linkWithIcons}>
            <OLink
              PressStyle={styles.linkWithIcons}
              url={Platform.select({
                ios: `maps:0,0?q=${order?.customer?.address}`,
                android: `geo:0,0?q=${order?.customer?.address}`,
              })}
              shorcut={order?.customer?.address}
              TextStyle={styles.textLink}
            />
          </View>
        )}

        {!!order?.customer?.internal_number && (
          <OText numberOfLines={1} mBottom={4} ellipsizeMode="tail">
            {order?.customer?.internal_number}
          </OText>
        )}

        {!!order?.customer?.address_notes && (
          <OText numberOfLines={1} mBottom={4} ellipsizeMode="tail">
            {order?.customer?.address_notes}
          </OText>
        )}

        {!!order?.customer?.zipcode && (
          <OText numberOfLines={1} mBottom={4} ellipsizeMode="tail">
            {order?.customer?.zipcode}
          </OText>
        )}

        {!!order?.on_behalf_of && (
          <OText numberOfLines={1} mBottom={4} ellipsizeMode="tail">
            {t('ON_BEHALF_OF', 'On behalf of')}{': '} {order?.on_behalf_of}
          </OText>
        )}
        {((order?.delivery_option !== undefined && order?.delivery_type === 1) || !!order?.comment) && (
          <View style={{ marginTop: 10 }}>
            {order?.delivery_option !== undefined && order?.delivery_type === 1 && (
              <OText>
                {t(order?.delivery_option?.name?.toUpperCase()?.replace(/ /g, '_'), order?.delivery_option?.name)}
              </OText>
            )}
            {!!order?.comment && (
              <>
                <OText weight='500' style={{ marginBottom: 5 }}>
                  {t('ORDER_COMMENT', 'Order Comment')}
                </OText>
                <OText style={{ fontStyle: 'italic', opacity: 0.6, marginBottom: 20 }}>
                  {order?.comment}
                </OText>
              </>
            )}
          </View>
        )}
        {!order?.user_review && pastOrderStatuses.includes(order?.status) && (
          <OButton
            style={styles.btnReview}
            textStyle={{ color: theme.colors.white }}
            text={t('REVIEW_CUSTOMER', 'Review customer')}
            imgRightSrc={false}
            onClick={() => setOpenReviewModal(true)}
          />
        )}
      </OrderCustomer>

      <OrderProducts>
        <OText style={{ marginBottom: 5 }} size={16} weight="600">
          {t('ORDER_DETAILS', 'Order Details')}
        </OText>

        {order?.products?.length > 0 &&
          order?.products.map((product: any, i: number) => (
            <ProductItemAccordion
              key={product?.id || i}
              product={product}
              currency={order?.currency}
            />
          ))}
      </OrderProducts>

      <OrderBill>
        <Table>
          <OText mBottom={4}>{t('SUBTOTAL', 'Subtotal')}</OText>
          <OText mBottom={4}>
            {parsePrice(((order?.summary?.subtotal ?? order?.subtotal) + getIncludedTaxes()), { currency: order?.currency })}
          </OText>
        </Table>
        {(order?.summary?.discount > 0 ?? order?.discount > 0) && order?.offers?.length === 0 && (
          <Table>
            {order?.offer_type === 1 ? (
              <OText mBottom={4}>
                {t('DISCOUNT', theme?.defaultLanguages?.DISCOUNT || 'Discount')}{' '}
                <OText>{`(${verifyDecimals(order?.offer_rate, parsePrice)}%)`}</OText>
              </OText>
            ) : (
              <OText mBottom={4}>{t('DISCOUNT', theme?.defaultLanguages?.DISCOUNT || 'Discount')}</OText>
            )}
            <OText>- {parsePrice(order?.summary?.discount ?? order?.discount, { currency: order?.currency })}</OText>
          </Table>
        )}
        {
          order?.offers?.length > 0 && order?.offers?.filter((offer: any) => offer?.target === 1)?.map((offer: any) => (
            <Table key={offer.id}>
              <OSRow>
                <OText mBottom={4}>
                  {t(offer.name?.toUpperCase()?.replace(/ /g, '_'), offer.name)}
                  {offer.rate_type === 1 && (
                    <OText>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</OText>
                  )}
                </OText>
              </OSRow>
              <OText mBottom={4}>- {parsePrice(offer?.summary?.discount, { currency: order?.currency })}</OText>
            </Table>
          ))
        }
        {order?.summary?.subtotal_with_discount > 0 && order?.summary?.discount > 0 && order?.summary?.total >= 0 && (
          <Table>
            <OText mBottom={4}>{t('SUBTOTAL_WITH_DISCOUNT', 'Subtotal with discount')}</OText>
            {order?.tax_type === 1 ? (
              <OText mBottom={4}>{parsePrice((order?.summary?.subtotal_with_discount + getIncludedTaxesDiscounts() ?? 0), { currency: order?.currency })}</OText>
            ) : (
              <OText mBottom={4}>{parsePrice(order?.summary?.subtotal_with_discount ?? 0, { currency: order?.currency })}</OText>
            )}
          </Table>
        )}
        {order?.taxes?.length === 0 && order?.tax_type === 2 && order?.summary?.tax > 0 && (
          <Table>
            <OText mBottom={4}>
              {t('TAX', 'Tax')} {`(${verifyDecimals(order?.tax, parseNumber)}%)`}
            </OText>
            <OText mBottom={4}>
              {parsePrice(order?.summary?.tax ?? 0, { currency: order?.currency })}
            </OText>
          </Table>
        )}
        {
          order?.fees?.length === 0 && order?.summary?.service_fee > 0 && (
            <Table>
              <OText mBottom={4}>
                {t('SERVICE_FEE', 'Service fee')}
                {`(${verifyDecimals(order?.service_fee, parseNumber)}%)`}
              </OText>
              <OText mBottom={4}>{parsePrice(order?.summary?.service_fee ?? 0, { currency: order?.currency })}</OText>
            </Table>
          )
        }
        {
          order?.taxes?.length > 0 && order?.taxes?.filter((tax: any) => tax?.type === 2 && tax?.rate !== 0).map((tax: any) => (
            <Table key={tax.id}>
              <OSRow>
                <OText mBottom={4}>
                  {t(tax?.name?.toUpperCase()?.replace(/ /g, '_'), tax?.name) || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}
                  {`(${verifyDecimals(tax?.rate, parseNumber)}%)`}{' '}
                </OText>
              </OSRow>
              <OText mBottom={4}>{parsePrice(tax?.summary?.tax_after_discount ?? tax?.summary?.tax ?? 0, { currency: order?.currency })}</OText>
            </Table>
          ))
        }
        {
          order?.fees?.length > 0 && order?.fees?.filter((fee: any) => !(fee.fixed === 0 && fee.percentage === 0))?.map((fee: any) => (
            <Table key={fee.id}>
              <OSRow>
                <OText mBottom={4}>
                  {t(fee?.name?.toUpperCase()?.replace(/ /g, '_'), fee?.name) || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}
                  ({fee?.fixed > 0 && `${parsePrice(fee?.fixed, { currency: order?.currency })} + `}{fee.percentage}%){' '}
                </OText>
              </OSRow>
              <OText mBottom={4}>{parsePrice(fee?.summary?.fixed + (fee?.summary?.percentage_after_discount ?? fee?.summary?.percentage) ?? 0, { currency: order?.currency })}</OText>
            </Table>
          ))
        }
        {
          order?.offers?.length > 0 && order?.offers?.filter((offer: any) => offer?.target === 3)?.map((offer: any) => (
            <Table key={offer.id}>
              <OSRow>
                <OText mBottom={4}>
                  {t(offer.name?.toUpperCase()?.replace(/ /g, '_'), offer.name)}
                  {offer.rate_type === 1 && (
                    <OText>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</OText>
                  )}
                </OText>
              </OSRow>
              <OText mBottom={4}>- {parsePrice(offer?.summary?.discount, { currency: order?.currency })}</OText>
            </Table>
          ))
        }
        {
          order?.summary?.delivery_price > 0 && (
            <Table>
              <OText mBottom={4}>
                {t('DELIVERY_FEE', 'Delivery Fee')}
              </OText>

              <OText mBottom={4}>
                {parsePrice(order?.summary?.delivery_price, { currency: order?.currency })}
              </OText>
            </Table>
          )
        }
        {
          order?.offers?.length > 0 && order?.offers?.filter((offer: any) => offer?.target === 2)?.map((offer: any) => (
            <Table key={offer.id}>
              <OSRow>
                <OText mBottom={4}>
                  {t(offer.name?.toUpperCase()?.replace(/ /g, '_'), offer.name)}
                  {offer.rate_type === 1 && (
                    <OText>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</OText>
                  )}
                </OText>
              </OSRow>
              <OText mBottom={4}>- {parsePrice(offer?.summary?.discount, { currency: order?.currency })}</OText>
            </Table>
          ))
        }
        {order?.summary?.driver_tip > 0 && (
          <Table>
            <OText mBottom={4}>
              {t('DRIVER_TIP', 'Driver tip')}
              {order?.summary?.driver_tip > 0 &&
                parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
                !parseInt(configs?.driver_tip_use_custom?.value, 10) &&
                (
                  `(${verifyDecimals(order?.summary?.driver_tip, parseNumber)}%)`
                )}
            </OText>
            <OText mBottom={4}>{parsePrice(order?.summary?.driver_tip ?? order?.totalDriverTip, { currency: order?.currency })}</OText>
          </Table>
        )}

        <Total style={{ paddingBottom: 10 }}>
          <Table>
            <OText mBottom={4} style={styles.textBold}>
              {t('TOTAL', 'Total')}
            </OText>

            <OText
              mBottom={4}
              style={styles.textBold}
              color={theme.colors.primary}>
              {parsePrice(order?.summary?.total ?? order?.total, { currency: order?.currency })}
            </OText>
          </Table>
        </Total>

        {order?.payment_events?.length > 0 && (
          <View>
            <OText size={14} color={theme.colors.textNormal}>{t('PAYMENTS', 'Payments')}</OText>
            <View
              style={{
                width: '100%',
                marginTop: 5
              }}
            >
              {order?.payment_events?.map((event: any) => (
                <View
                  key={event.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 10
                  }}
                >
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <OText>
                      {event?.wallet_event
                        ? walletName[event?.wallet_event?.wallet?.type]?.name
                        : t(event?.paymethod?.name?.toUpperCase()?.replace(/ /g, '_'), event?.paymethod?.name)}
                    </OText>
                    {event?.data?.charge_id && (
                      <OText>
                        {`${t('CODE', 'Code')}: ${event?.data?.charge_id}`}
                      </OText>
                    )}
                  </View>
                  <OText>
                    -{parsePrice(event.amount, { currency: order?.currency })}
                  </OText>
                </View>
              ))}
            </View>
          </View>
        )}
      </OrderBill >
      <OModal
        open={openReviewModal}
        onClose={() => setOpenReviewModal(false)}
        entireModal
        customClose
      >
        <ReviewCustomer
          order={order}
          closeModal={() => setOpenReviewModal(false)}
          onClose={() => setOpenReviewModal(false)}
        />
      </OModal>
    </OrderContent>
  )
}
