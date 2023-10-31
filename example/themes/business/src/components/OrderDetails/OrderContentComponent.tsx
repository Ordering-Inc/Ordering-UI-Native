import React, { useState, useCallback } from 'react'

import { Platform, StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign'

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
  OrderVehicle,
  OrderSpot,
} from './styles';

import { ProductItemAccordion } from '../ProductItemAccordion';

import { verifyDecimals, calculateDistance, transformDistance } from '../../utils';

import {
  useLanguage,
  useUtils,
  useConfig,
  useSession
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { ReviewCustomer } from '../ReviewCustomer'

import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import { DeviceOrientationMethods } from '../../../../../src/hooks/DeviceOrientation'

const { useDeviceOrientation } = DeviceOrientationMethods

interface OrderContent {
  order: any,
  logisticOrderStatus?: Array<number>,
  isOrderGroup?: boolean,
  lastOrder?: boolean
}

export const OrderContentComponent = (props: OrderContent) => {
  const [, t] = useLanguage();
  const theme = useTheme()
  const [{ user }] = useSession()
  const { order, logisticOrderStatus, isOrderGroup, lastOrder } = props;
  const [{ parsePrice, parseNumber }] = useUtils();
  const [{ configs }] = useConfig();
  const [orientationState] = useDeviceOrientation();
  const distanceUnit = configs?.distance_unit?.value

  const WIDTH_SCREEN = orientationState?.dimensions?.width

  const [openReviewModal, setOpenReviewModal] = useState(false)
  const [showCustomFields, setShowCustomFields] = useState<boolean>(false);

  const [isReadMore, setIsReadMore] = useState({
    customerAddress: false,
    businessAddressNotes: false
  })
  const [lengthMore, setLengthMore] = useState({
    customerAddress: false,
    businessAddressNotes: false
  })

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

  const getIncludedTaxes = (isDeliveryFee?: boolean) => {
    if (!order?.taxes) return 0
    if (order?.taxes?.length === 0) {
      return order.tax_type === 1 ? order?.summary?.tax ?? 0 : 0
    } else {
      return order?.taxes.reduce((taxIncluded: number, tax: any) => {
        return taxIncluded +
          (((!isDeliveryFee && tax.type === 1 && tax.target === 'product') ||
            (isDeliveryFee && tax.type === 1 && tax.target === 'delivery_fee')) ? tax.summary?.tax : 0)
      }, 0)
    }
  }

  const getIncludedTaxesDiscounts = () => {
    return order?.taxes?.filter((tax: any) => tax?.type === 1 && tax?.target === 'product')?.reduce((carry: number, tax: any) => carry + (tax?.summary?.tax_after_discount ?? tax?.summary?.tax), 0)
  }

  const containsOnlyNumbers = (str: string) => {
    str = str?.replace('+', '');
    return /^\d+$/.test(str);
  }

  const onTextLayout = useCallback((e: any, item: string) => {
    if (item === 'customerAddress') {
      const customerAddressMore = (e.nativeEvent.lines.length == 2 && e.nativeEvent.lines[1].width > WIDTH_SCREEN * .76) || e.nativeEvent.lines.length > 2
      setLengthMore(prev => ({ ...prev, customerAddress: customerAddressMore }))
    }
    if (item === 'businessAddressNotes') {
      const businessAddressNotesMore = (e.nativeEvent.lines.length == 3 && e.nativeEvent.lines[2].width > WIDTH_SCREEN * .76) || e.nativeEvent.lines.length > 3
      setLengthMore(prev => ({ ...prev, businessAddressNotes: businessAddressNotesMore }))
    }
  }, []);

  return (
    <OrderContent isOrderGroup={isOrderGroup} lastOrder={lastOrder}>
      {isOrderGroup && (
        <OText size={18}>{t('ORDER', 'Order')} #{order?.id}</OText>
      )}

      {order?.metafields?.length > 0 && (
        <OrderBusiness>
          <TouchableOpacity onPress={() => setShowCustomFields((prev: boolean) => !prev)} style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <OText style={{ marginBottom: 5 }} size={16} weight="600">
              {t('CUSTOM_FIELDS', 'Custom fields')}
            </OText>
            <AntDesignIcon
              name={showCustomFields ? 'up' : 'down'}
              size={14}
            />
          </TouchableOpacity>
          {showCustomFields && (
            <>
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
            </>
          )}
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
                  url={`tel:${containsOnlyNumbers(order?.business?.cellphone) ? order?.business?.cellphone : 'invalid'}`}
                  shorcut={`${(!!order?.business?.country_phone_code && !order?.business?.cellphone?.includes('+')) ? '+' + order?.business?.country_phone_code : ''}${order?.business?.cellphone}`}
                  TextStyle={styles.textLink}
                />
              </View>
            )}

            {!!order?.business?.phone && (
              <View style={styles.linkWithIcons}>
                <OLink
                  PressStyle={styles.linkWithIcons}
                  url={`tel:${containsOnlyNumbers(order?.business?.phone) ? order?.business?.phone : 'invalid'}`}
                  shorcut={`${(!!order?.business?.country_phone_code && !order?.business?.phone?.includes('+')) ? '+' + order?.business?.country_phone_code : ''}${order?.business?.phone}`}
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
                ios: `maps:0,0?q=${order?.business?.address}@${order?.business?.location?.lat},${order?.business?.location?.lng}`,
                android: `geo:0,0?q=${order?.business?.address}@${order?.business?.location?.lat},${order?.business?.location?.lng}`,
              })}
              numberOfLines={2}
              shorcut={order?.business?.address}
              TextStyle={styles.textLink}
            />
          </View>
        )}
        {!!order?.business?.location && order?.customer?.location && (
          <OText>
            {t('DISTANCE_TO_THE_BUSINESS', 'Distance to the business')}: {transformDistance(calculateDistance(order?.business?.location, { latitude: order?.customer?.location?.lat, longitude: order?.customer?.location?.lng }), distanceUnit)} {t(distanceUnit?.toUpperCase?.(), distanceUnit)}
          </OText>
        )}
        {!!order?.business?.address_notes && (
          <>
            <View style={styles.linkWithIcons}>
              <OLink
                PressStyle={styles.linkWithIcons}
                url={Platform.select({
                  ios: `maps:0,0?q=${order?.business?.address_notes}@${order?.business?.location?.lat},${order?.business?.location?.lng}`,
                  android: `geo:0,0?q=${order?.business?.address_notes}@${order?.business?.location?.lat},${order?.business?.location?.lng}`,
                })}
                shorcut={order?.business?.address_notes}
                TextStyle={styles.textLink}
                onTextLayout={e => onTextLayout(e, 'businessAddressNotes')}
                numberOfLines={isReadMore.businessAddressNotes ? 20 : 3}
              />
            </View>
            {lengthMore.businessAddressNotes && (
              <TouchableOpacity
                onPress={() => setIsReadMore({ ...isReadMore, businessAddressNotes: !isReadMore.businessAddressNotes })}
              >
                <OText size={12} color={theme.colors.statusOrderBlue}>{isReadMore.businessAddressNotes ? t('SHOW_LESS', 'Show less') : t('READ_MORE', 'Read more')}</OText>
              </TouchableOpacity>
            )}
          </>
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
              url={`tel:${!!order?.customer?.country_phone_code ? '+' + order?.customer?.country_phone_code : ''} ${containsOnlyNumbers(order?.customer?.cellphone) ? order?.customer?.cellphone : 'invalid'}`}
              shorcut={`${!!order?.customer?.country_phone_code ? '+' + order?.customer?.country_phone_code : ''}${order?.customer?.cellphone}`}
              TextStyle={styles.textLink}
            />
          </View>
        )}

        {!!order?.customer?.phone && (
          <View style={styles.linkWithIcons}>
            <OLink
              PressStyle={styles.linkWithIcons}
              url={`tel:${!!order?.customer?.country_phone_code ? '+' + order?.customer?.country_phone_code : ''} ${containsOnlyNumbers(order?.customer?.phone) ? order?.customer?.phone : 'invalid'}`}
              shorcut={`${!!order?.customer?.country_phone_code ? '+' + order?.customer?.country_phone_code : ''}${order?.customer?.phone}`}
              TextStyle={styles.textLink}
            />
          </View>
        )}

        {!!order?.customer?.address && (
          <>
            <View style={styles.linkWithIcons}>
              <OLink
                PressStyle={{ ...styles.linkWithIcons, marginBottom: 0 }}
                url={Platform.select({
                  ios: `maps:0,0?q=${order?.customer?.address}@${order?.customer?.location?.lat},${order?.customer?.location?.lng}`,
                  android: `geo:0,0?q=${order?.customer?.address}@${order?.customer?.location?.lat},${order?.customer?.location?.lng}`,
                })}
                onTextLayout={e => onTextLayout(e, 'customerAddress')}
                numberOfLines={isReadMore.customerAddress ? 20 : 2}
                shorcut={order?.customer?.address}
                TextStyle={styles.textLink}
              />
            </View>
            {lengthMore.customerAddress && (
              <TouchableOpacity
                onPress={() => setIsReadMore({ ...isReadMore, customerAddress: !isReadMore.customerAddress })}
              >
                <OText size={12} color={theme.colors.statusOrderBlue}>{isReadMore.customerAddress ? t('SHOW_LESS', 'Show less') : t('READ_MORE', 'Read more')}</OText>
              </TouchableOpacity>
            )}
          </>
        )}

        {!!order?.customer?.internal_number && (
          <OText numberOfLines={1} mBottom={4} ellipsizeMode="tail">
            {order?.customer?.internal_number}
          </OText>
        )}

        {!!order?.customer?.address_notes && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            horizontal
          >
            <OText numberOfLines={1} mBottom={4} ellipsizeMode="tail">
              {order?.customer?.address_notes}
            </OText>
          </ScrollView>
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
        {(order?.delivery_option !== undefined && order?.delivery_type === 1) && (
          <View style={{ marginTop: 10 }}>
            {order?.delivery_option !== undefined && order?.delivery_type === 1 && (
              <OText>
                {t(order?.delivery_option?.name?.toUpperCase?.()?.replace(/ /g, '_'), order?.delivery_option?.name)}
              </OText>
            )}
          </View>
        )}
        {!order?.user_review && pastOrderStatuses.includes(order?.status) && order?.customer_id && (
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
        <OText style={{ marginBottom: 10 }} size={16} weight="600">
          {t('ORDER_DETAILS', 'Order Details')}
        </OText>

        {!!order?.comment && (
          <OText>
            {`${t('ORDER_COMMENT', 'Order Comment')}: ${order?.comment}`}
          </OText>
        )}

        {order?.products?.length > 0 &&
          order?.products.map((product: any, i: number) => (
            <ProductItemAccordion
              key={product?.id || i}
              product={product}
              currency={order?.currency}
            />
          ))}
      </OrderProducts>

      <OrderBill vehicleExists={!!order?.vehicle}>
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
                  {t(offer.name?.toUpperCase?.()?.replace(/ /g, '_'), offer.name)}
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
          order?.taxes?.length > 0 && order?.taxes?.filter((tax: any) => tax?.type === 2 && tax?.rate !== 0 && tax?.target === 'product').map((tax: any) => (
            <Table key={tax.id}>
              <OSRow>
                <OText mBottom={4}>
                  {t(tax?.name?.toUpperCase?.()?.replace(/ /g, '_'), tax?.name) || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}
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
                  {t(fee?.name?.toUpperCase?.()?.replace(/ /g, '_'), fee?.name) || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}
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
                  {t(offer.name?.toUpperCase?.()?.replace(/ /g, '_'), offer.name)}
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
          typeof order?.summary?.delivery_price === 'number' && order.delivery_type !== 2 && (
            <Table>
              <OText mBottom={4}>
                {t('DELIVERY_FEE', 'Delivery Fee')}
              </OText>

              <OText mBottom={4}>
                {parsePrice(order?.summary?.delivery_price + getIncludedTaxes(true), { currency: order?.currency })}
              </OText>
            </Table>
          )
        }
        {
          order?.taxes?.length > 0 && order?.taxes?.filter((tax: any) => tax?.type === 2 && tax?.rate !== 0 && tax?.target === 'delivery_fee').map((tax: any, i: number) => (
            <Table key={`${tax.description}_${i}`}>
              <OSRow>
                <OText mBottom={4}>
                  {tax.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}
                  {`(${verifyDecimals(tax?.rate, parseNumber)}%)`}
                </OText>
              </OSRow>
              <OText mBottom={4}>{parsePrice(tax?.summary?.tax_after_discount ?? tax?.summary?.tax ?? 0)}</OText>
            </Table>
          ))
        }
        {
          order?.offers?.length > 0 && order?.offers?.filter((offer: any) => offer?.target === 2)?.map((offer: any) => (
            <Table key={offer.id}>
              <OSRow>
                <OText mBottom={4}>
                  {t(offer.name?.toUpperCase?.()?.replace(/ /g, '_'), offer.name)}
                  {offer.rate_type === 1 && (
                    <OText>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</OText>
                  )}
                </OText>
              </OSRow>
              <OText mBottom={4}>- {parsePrice(offer?.summary?.discount, { currency: order?.currency })}</OText>
            </Table>
          ))
        }
        {(order?.summary?.driver_tip > 0 || order?.driver_tip > 0) && order.delivery_type !== 2 && (
          <Table>
            <OText mBottom={4}>
              {t('DRIVER_TIP', 'Driver tip')}
              {order?.driver_tip > 0 && parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
                !parseInt(configs?.driver_tip_use_custom?.value, 10) &&
                (
                  `(${verifyDecimals(order?.driver_tip, parseNumber)}%)`
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
                        : event?.paymethod?.gateway
                          ? t(event?.paymethod?.gateway?.toUpperCase?.(), event?.paymethod?.name)
                          : order?.paymethod?.id === event?.paymethod_id
                            ? t(order?.paymethod?.gateway?.toUpperCase?.(), order?.paymethod?.name)
                            : ''}
                    </OText>
                  </View>
                  <OText>
                    {(event?.paymethod?.gateway === 'cash' && order?.cash)
                      ? parsePrice(order?.cash, { currency: order?.currency })
                      : `-${parsePrice(event?.amount, { currency: order?.currency })}`}
                  </OText>
                </View>
              ))}
            </View>
          </View>
        )}

      </OrderBill >

      {!!order?.spot_number && (
        <OrderSpot vehicleExists={!!order?.vehicle}>
          <Table>
            <OText style={{ marginBottom: 5 }}>
              {t('SPOT_NUMBER', 'Spot number')}
            </OText>
            <OText style={{ marginBottom: 5 }}>
              {order?.spot_number}
            </OText>
          </Table>
        </OrderSpot>
      )}

      {!!order?.vehicle && (
        <OrderVehicle>
          <OText
            style={{ marginBottom: 5 }}
            size={16}
            weight="600"
            color={theme.colors.textGray}>
            {t('VEHICLE', 'Vehicle')}
          </OText>
          <Table>
            <OText style={{ marginBottom: 5 }}>
              {t('CAR_REGISTRATION', 'Car registration')}
            </OText>
            <OText style={{ marginBottom: 5 }}>
              {order?.vehicle?.car_registration}
            </OText>
          </Table>
          <Table>
            <OText style={{ marginBottom: 5 }}>
              {t('COLOR', 'Color')}
            </OText>
            <OText style={{ marginBottom: 5 }}>
              {order?.vehicle?.color}
            </OText>
          </Table>
          <Table>
            <OText style={{ marginBottom: 5 }}>
              {t('MODEL', 'Model')}
            </OText>
            <OText style={{ marginBottom: 5 }}>
              {order?.vehicle?.model}
            </OText>
          </Table>
          <Table>
            <OText style={{ marginBottom: 5 }}>
              {t('TYPE', 'Type')}
            </OText>
            <OText style={{ marginBottom: 5 }}>
              {order?.vehicle?.type}
            </OText>
          </Table>
        </OrderVehicle>
      )}
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
