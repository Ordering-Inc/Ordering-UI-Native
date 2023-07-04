import React, { useState } from 'react';
import { OText, OIconButton } from '../shared';
import { StyleSheet, View, Platform, Alert } from 'react-native';
import {
  Content,
  OrderCustomer,
  OrderHeader,
  OrderContent,
  OrderBusiness,
  OrderProducts,
  Table,
  OrderBill,
  Total,
  Action,
  ContentInfo,
} from './styles';
import { useUtils, useLanguage, useConfig } from 'ordering-components/native';
import { verifyDecimals, getProductPrice } from '../../utils';
import { FloatingButton } from '../FloatingButton';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';
import { useTheme } from 'styled-components/native';

import { ProductItemAccordion } from '../ProductItemAccordion';

export const OrderSummary = ({ order, navigation, orderStatus, askBluetoothPermission, getPermissions, isGrantedPermissions, checkBluetoothPermission }: any) => {
  const handleArrowBack: any = () => {
    navigation?.canGoBack() && navigation.goBack();
  };
  const [{ parsePrice, parseNumber, parseDate }] = useUtils();
  const [, t] = useLanguage();
  const [{ configs }] = useConfig();
  const [state, setState] = useState({
    selectedPrinter: { url: undefined },
  });
  const paymethodsLength = order?.payment_events?.filter((item: any) => item.event === 'payment')?.length

  const getFormattedSubOptionName = ({ quantity, name, position, price }: any) => {
    if (name !== 'No') {
      const pos = position && position !== 'whole' ? `(${t(position.toUpperCase(), position)})` : '';
      return pos
        ? `${quantity} x ${name} ${pos} +${parsePrice(price)}\n`
        : `${quantity} x ${name} +${parsePrice(price)}\n`;
    } else {
      return 'No\n';
    }
  };

  const getSuboptions = (suboptions: any) => {
    const array: any = []
    suboptions?.length > 0 &&
      suboptions?.map((suboption: any) => {
        const string = `&nbsp;&nbsp;&nbsp;${getFormattedSubOptionName(suboption)}<br/>`
        array.push(string)
      })

    return array.join('')
  }

  const getOptions = (options: any, productComment: string = '') => {
    const array: any = [];

    options?.length &&
      options?.map((option: any) => {
        const string =
          `  ${option.name}<br/>${getSuboptions(option.suboptions)}`;

        array.push(string)
      })

    if (productComment) {
      array.push(`${t('COMMENT', 'Comment')}<br/>&nbsp;&nbsp;&nbsp;&nbsp;${productComment}`)
    }

    return array.join('')
  }

  const theme = useTheme();
  const percentTip =
    parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
    !parseInt(configs?.driver_tip_use_custom?.value, 10) &&
    verifyDecimals(order?.summary?.driver_tip, parseNumber);

  const customerName = `${order?.customer?.name ?? ''} ${order?.customer?.middle_name ?? ''} ${order?.customer?.lastname ?? ''} ${order?.customer?.second_lastname ?? ''
    }`?.replace('  ', ' ')?.trim() ?? ''

  const walletName: any = {
    cash: {
      name: t('CASH_WALLET', 'Cash Wallet')
    },
    credit_point: {
      name: t('POINTS_WALLET', 'Points Wallet')
    }
  }

  const handlePaymethodsListString = () => {
    const paymethodsList = order?.payment_events?.filter((item: any) => item.event === 'payment').map((paymethod: any) => {
      return paymethod?.wallet_event
        ? walletName[paymethod?.wallet_event?.wallet?.type]?.name
        : t(paymethod?.paymethod?.gateway?.toUpperCase(), paymethod?.paymethod?.name)
    })
    return paymethodsList.join(', ')
  }

  const orderSummary = () => {
    return `
    <div>
        <h1>${t('ORDER_NO', 'Order No.')} ${order.id}</h1>
        <p style="font-size: 27px">

          ${orderStatus} </br>

          ${t('DELIVERY_TYPE', 'Delivery Type')}: ${deliveryStatus[order?.delivery_type]
      }
          </br>
          ${t('DELIVERY_DATE', 'Delivery Date')}: ${order?.delivery_datetime_utc
        ? parseDate(order?.delivery_datetime_utc)
        : parseDate(order?.delivery_datetime, { utc: false })
      }
          </br>
          ${paymethodsLength > 1 ? 'PAYMENT_METHODS' : 'PAYMENT_METHOD'}: ${handlePaymethodsListString()}
        </p>

        <h1>${t('CUSTOMER_DETAILS', 'Customer details')}</h1>
        <p style="font-size: 27px"> ${t('FULL_NAME', 'Full Name')}: ${customerName}
        </br>
        ${t('EMAIL', 'Email')}: ${order?.customer?.email}
        </br>
        ${t('MOBILE_PHONE', 'Mobile Phone')}: ${order?.customer?.cellphone}
         </br>
         ${!!order?.customer?.phone
        ? `${t('MOBILE_PHONE', 'Mobile Phone')}: ${order?.customer?.phone
        } </br>`
        : ''
      }
         ${t('FULL_ADDRESS', 'Full Addres')}: ${order?.customer?.address}
         </br>
         ${!!order?.customer?.internal_number
        ? `${t('INTERNAL_NUMBER', 'Internal Number')}: ${order?.customer?.internal_number
        } </br>`
        : ''
      }
         ${t('ZIPCODE', 'Zipcode')}: ${order?.customer.zipcode}
         </p>  

        <h1>${t('BUSINESS_DETAILS', 'Business details')}</h1>
        <p style="font-size: 27px"> 
        ${order?.business?.name} 
        </br> 
        ${order?.business?.email}
        </br> 
        ${t('BUSINESS_PHONE', 'Business Phone')}: ${order?.business?.cellphone}
        </br> 
        ${!!order?.business?.phone
        ? `${t('BUSINESS_PHONE', 'Business Phone')}: ${order?.business?.phone
        } </br>`
        : ''
      } 

        ${t('ADDRESS', 'Address')}: ${order?.business?.address} 
        </br>
        ${!!order?.business?.address_notes
        ? `${t('SPECIAL_ADDRESS', 'Special Address')}: ${order?.business?.address_notes
        } `
        : ''
      }
        </p>
        <h1> ${t('ORDER_DETAILS', 'Order Details')}</h1>

        ${order?.products.length &&
      order?.products.map(
        (product: any, i: number) =>
          `<div style="display: flex;flexDirection:row;flex-wrap:wrap">
                <div style="display:flex;width:100%">
                  <div style="display:flex; justify-content: flex-start; font-size: 26px; width: 70%">
                  ${product?.quantity}  ${product?.name}
                  </div>

                  <div style="display:flex; justify-content: flex-end; font-size: 26px; width: 30%">
                  ${parsePrice(product.total ?? getProductPrice(product))}
                  </div>
                </div>

                <div style="font-size: 26px;width:100%">
                  <div style="width:90%;display:flex;justifyContent:center;margin:auto;">
                    ${getOptions(product.options, product.comment)}
                  </div>
                </div>
              </div>`
      )
      }
        <div style="display: flex;">

            <div style="display:flex; justify-content: flex-start; font-size: 26px; width: 70%">
            ${t('SUBTOTAL', 'Subtotal')}
            </div>

            <div style="display:flex; justify-content: flex-end; font-size: 26px; width: 30%">
              ${parsePrice(
        order.tax_type === 1
          ? order?.summary?.subtotal + order?.summary?.tax ?? 0
          : order?.summary?.subtotal ?? 0,
      )}
            </div>

        </div>

        <div style="display: flex">
        ${order?.summary?.discount > 0
        ? order?.offer_type === 1
          ? `<div style="display:flex; justify-content: flex-start; font-size: 26px; width: 70%">
                  ${t('DISCOUNT', 'Discount')} (${verifyDecimals(
            order?.offer_rate,
            parsePrice,
          )}%)
                </div>`
          : `<div style="display:flex; justify-content: flex-start; font-size: 26px; width: 70%"> ${t(
            'DISCOUNT',
            'Discount',
          )}
                 </div>`
        : ''
      }
        ${order?.summary?.discount > 0
        ? `<div style="display:flex; justify-content: flex-end; font-size: 26px; width: 30%">- ${parsePrice(
          order?.summary?.discount,
        )}
              </div>`
        : ''
      }
        </div>

        ${order?.tax_type !== 1
        ? `<div style="font-size: 25px">
                ${t('TAX', 'Tax')}
                ${verifyDecimals(order?.summary?.tax_rate, parseNumber)}%
                ${parsePrice(order?.summary?.tax ?? 0)}
                ${t('TAX', 'Tax')}
                ${verifyDecimals(order?.summary?.tax_rate, parseNumber)}%
              </div>`
        : ''
      }

        ${order?.summary?.delivery_price > 0
        ? `<div style="font-size: 25px;"> ${t(
          'DELIVERY_FEE',
          'Delivery Fee',
        )}
              </div>`
        : ''
      }

        <div style="display: flex">

          <div style="font-size: 26px; width: 70%; display: flex; justify-content: flex-start"> 
            ${t('DRIVER_TIP', 'Driver tip')}
            ${percentTip ? `(${percentTip}%)` : ''}
          </div>

          <div style="font-size: 26px; width: 30%; display: flex; justify-content: flex-end">
            ${parsePrice(order?.summary?.driver_tip ?? 0)}
          </div>

        </div>

        <div style="display: flex">

          <div style="font-size: 26px; width: 70%; display: flex; justify-content: flex-start"> 
            ${t('SERVICE_FEE', 'Service Fee')}
           (${verifyDecimals(order?.summary?.service_fee, parseNumber)}%)
          </div>

          <div style="font-size: 26px; width: 30%; display: flex; justify-content: flex-end">
            ${parsePrice(order?.summary?.service_fee ?? 0)}
          </div>

        </div>

        <div style="display: flex">

          <div style="font-size: 26px; width: 70%; display: flex; justify-content: flex-start; font-weight: bold"> 
            ${t('TOTAL', 'Total')}
          </div>

          <div style="font-size: 26px; width: 30%; display: flex; justify-content: flex-end">
            ${parsePrice(order?.summary?.total ?? 0)}
          </div>

        </div>
        
    </div>`;
  };

  const deliveryStatus: any = {
    1: t('DELIVERY', 'Delivery'),
    2: t('PICK_UP', 'Pick up'),
    3: t('EAT_IN', 'Eat In'),
    4: t('CURBSIDE', 'Curbside'),
    5: t('DRIVER_THRU', 'Driver thru'),
  };

  // @NOTE iOS Only
  const selectPrinter = async () => {
    const selectedPrinter = await RNPrint.selectPrinter({ x: '100', y: '100' });
    setState({ selectedPrinter });
  };

  // @NOTE iOS Only
  const silentPrint = async () => {
    if (!state?.selectedPrinter) {
      Alert.alert('Must Select Printer First');
    }

    const jobName = await RNPrint.print({
      printerURL: state?.selectedPrinter?.url,
      html: orderSummary(),
    });
  };

  const printPDF = async () => {
    const results = await RNHTMLtoPDF.convert({
      html: orderSummary(),
      fileName: 'test',
      base64: true,
    });

    await RNPrint.print({
      filePath: results.filePath || '',
      jobName: `${t('ORDER_NO', `Order no. ${order.id}`)}`,
    });
  };

  const styles = StyleSheet.create({
    btnBackArrow: {
      maxWidth: 40,
      height: 25,
    },
    textBold: {
      fontWeight: '600',
    },
  });

  const handlePrint = async () => {
    if (Platform.OS === 'ios') {
      silentPrint()
      return
    }
    const _permissions = await getPermissions()

    if (!isGrantedPermissions) {
      checkBluetoothPermission()
    }
    if (isGrantedPermissions) {
      const response = await askBluetoothPermission();
      const isGranted = _permissions.reduce((allPermissions: boolean, _permission: string) => allPermissions && response?.[_permission] === 'granted', true)
      if (isGranted) {
        printPDF()
      }
    }
  };

  return (
    <>
      <Content>
        <OrderContent>
          <OrderHeader>
            <OIconButton
              icon={theme.images.general.arrow_left}
              iconStyle={{ width: 20, height: 20 }}
              borderColor={theme.colors.clear}
              style={{ maxWidth: 40, justifyContent: 'flex-end' }}
              onClick={() => handleArrowBack()}
            />
            <OText
              style={{ marginBottom: 5 }}
              size={15}
              color={theme.colors.textGray}
              weight="600">
              {t('INVOICE_ORDER_NO', 'Order No.')} {order.id}
            </OText>

            <OText
              style={{ marginBottom: 5 }}
              size={15}
              color={theme.colors.textGray}>
              {`${orderStatus}`}
            </OText>

            <OText style={{ marginBottom: 5 }}>
              {`${t('DELIVERY_TYPE', 'Delivery Type')}: ${deliveryStatus[order?.delivery_type]
                }`}
            </OText>

            <OText style={{ marginBottom: 5 }}>
              {`${t('DELIVERY_DATE', 'Delivery Date')}: ${order?.delivery_datetime_utc
                ? parseDate(order?.delivery_datetime_utc)
                : parseDate(order?.delivery_datetime, { utc: false })
                }`}
            </OText>

            <OText style={{ marginBottom: 5 }}>{`${t(`${paymethodsLength > 1 ? 'PAYMENT_METHODS' : 'PAYMENT_METHOD'}`, `${paymethodsLength > 1 ? 'Payment methods' : 'Payment method'}`)}: ${handlePaymethodsListString()}`}</OText>
          </OrderHeader>

          <OrderCustomer>
            <OText
              style={{ marginBottom: 5 }}
              size={16}
              weight="600"
              color={theme.colors.textGray}>
              {t('CUSTOMER_DETAILS', 'Customer details')}
            </OText>

            <OText
              style={{ marginBottom: 5 }}
              size={14}
              numberOfLines={2}
              adjustsFontSizeToFit
              ellipsizeMode="tail"
              color={theme.colors.textGray}>
              {`${t('FULL_NAME', 'Full Name')}: ${customerName}`}
            </OText>

            <OText
              style={{ marginBottom: 5 }}
              size={14}
              numberOfLines={2}
              adjustsFontSizeToFit
              ellipsizeMode="tail"
              color={theme.colors.textGray}>
              {`${t('EMAIL', 'Email')}: ${order?.customer?.email}`}
            </OText>

            <OText
              style={{ marginBottom: 5 }}
              size={14}
              numberOfLines={2}
              adjustsFontSizeToFit
              ellipsizeMode="tail"
              color={theme.colors.textGray}>
              {`${t('MOBILE_PHONE', 'Mobile Phone')}: ${order?.customer?.cellphone
                }`}
            </OText>

            {!!order?.customer?.phone && (
              <OText
                style={{ marginBottom: 5 }}
                size={14}
                numberOfLines={2}
                adjustsFontSizeToFit
                ellipsizeMode="tail"
                color={theme.colors.textGray}>
                {`${t('MOBILE_PHONE', 'Mobile Phone')}: ${order?.customer?.phone
                  }`}
              </OText>
            )}

            <OText
              style={{ marginBottom: 5 }}
              size={14}
              numberOfLines={2}
              adjustsFontSizeToFit
              ellipsizeMode="tail"
              color={theme.colors.textGray}>
              {`${t('ADDRESS', 'Address')}: ${order?.customer?.address}`}
            </OText>

            {!!order?.customer?.internal_number && (
              <OText numberOfLines={1} mBottom={4} ellipsizeMode="tail">
                {t('INTERNAL_NUMBER', 'Internal Number')}{' '}
                {order?.customer?.internal_number}
              </OText>
            )}

            {order?.customer?.address_notes && (
              <OText style={{ marginBottom: 5 }}>
                {`${t('NOTES', 'Notes')}: ${order?.customer?.address_notes}`}
              </OText>
            )}

            {!!order?.customer.zipcode && (
              <OText numberOfLines={1} mBottom={4} ellipsizeMode="tail">
                {t('ZIPCODE', 'Zipcode')}: {order?.customer?.zipcode}
              </OText>
            )}
          </OrderCustomer>

          <OrderBusiness>
            <OText
              style={{ marginBottom: 5 }}
              size={16}
              weight="600"
              color={theme.colors.textGray}>
              {t('BUSINESS_DETAILS', 'Business details')}
            </OText>

            <OText
              style={{ marginBottom: 5 }}
              size={14}
              numberOfLines={2}
              adjustsFontSizeToFit
              ellipsizeMode="tail"
              color={theme.colors.textGray}>
              {order?.business?.name}
            </OText>

            <OText
              style={{ marginBottom: 5 }}
              size={14}
              numberOfLines={2}
              adjustsFontSizeToFit
              ellipsizeMode="tail"
              color={theme.colors.textGray}>
              {order?.business?.email}
            </OText>

            {!!order?.business?.cellphone && (
              <OText
                style={{ marginBottom: 5 }}
                size={14}
                numberOfLines={2}
                ellipsizeMode="tail"
                color={theme.colors.textGray}>
                {`${t('BUSINESS_PHONE', 'Business Phone')}: ${order?.business?.cellphone
                  }`}
              </OText>
            )}

            {!!order?.business?.phone && (
              <OText
                style={{ marginBottom: 5 }}
                size={14}
                numberOfLines={2}
                ellipsizeMode="tail"
                color={theme.colors.textGray}>
                {`${t('BUSINESS_PHONE', 'Business Phone')}: ${order?.business?.phone
                  }`}
              </OText>
            )}

            {!!order?.business?.address && (
              <OText
                style={{ marginBottom: 5 }}
                size={14}
                adjustsFontSizeToFit
                ellipsizeMode="tail"
                color={theme.colors.textGray}>
                {`${t('ADDRESS', 'Address')}: ${order?.business?.address}`}
              </OText>
            )}

            {!!order?.business?.address_notes && (
              <OText
                style={{ marginBottom: 5 }}
                size={14}
                adjustsFontSizeToFit
                ellipsizeMode="tail"
                color={theme.colors.textGray}>
                {`${t('SPECIAL_ADDRESS', 'Special Address')}: ${order?.business?.address_notes
                  }`}
              </OText>
            )}
          </OrderBusiness>

          <OrderProducts>
            <OText
              style={{ marginBottom: 5 }}
              size={16}
              weight="600"
              color={theme.colors.textGray}>
              {t('ORDER_DETAILS', 'Order Details')}
            </OText>

            {order?.products.length &&
              order?.products.map((product: any, i: number) => (
                <View key={i}>
                  <ContentInfo>
                    <ProductItemAccordion
                      key={product?.id || i}
                      product={product}
                      isClickableEvent
                    />
                  </ContentInfo>
                </View>
              ))}
          </OrderProducts>

          <OrderBill>
            <Table>
              <OText style={{ marginBottom: 5 }}>
                {t('SUBTOTAL', 'Subtotal')}
              </OText>

              <OText style={{ marginBottom: 5 }}>
                {parsePrice(
                  order.tax_type === 1
                    ? order?.summary?.subtotal + order?.summary?.tax ?? 0
                    : order?.summary?.subtotal ?? 0,
                )}
              </OText>
            </Table>

            {order?.tax_type !== 1 && (
              <Table>
                <OText style={{ marginBottom: 5 }}>
                  {t('TAX', 'Tax')}
                  {`(${verifyDecimals(
                    order?.summary?.tax_rate,
                    parseNumber,
                  )}%)`}
                </OText>

                <OText style={{ marginBottom: 5 }}>
                  {parsePrice(order?.summary?.tax ?? 0)}
                </OText>
              </Table>
            )}

            {order?.summary?.discount > 0 && (
              <Table>
                {order?.offer_type === 1 ? (
                  <OText style={{ marginBottom: 5 }}>
                    <OText>{t('DISCOUNT', 'Discount')}</OText>

                    <OText>
                      {`(${verifyDecimals(order?.offer_rate, parsePrice)}%)`}
                    </OText>
                  </OText>
                ) : (
                  <OText style={{ marginBottom: 5 }}>
                    {t('DISCOUNT', 'Discount')}
                  </OText>
                )}

                <OText style={{ marginBottom: 5 }}>
                  - {parsePrice(order?.summary?.discount)}
                </OText>
              </Table>
            )}

            {order?.summary?.delivery_price > 0 && (
              <Table>
                <OText style={{ marginBottom: 5 }}>
                  {t('DELIVERY_FEE', 'Delivery Fee')}
                </OText>

                <OText>{parsePrice(order?.summary?.delivery_price)}</OText>
              </Table>
            )}

            <Table>
              <OText style={{ marginBottom: 5 }}>
                {t('DRIVER_TIP', 'Driver tip')}
                {order?.summary?.driver_tip > 0 &&
                  parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
                  !parseInt(configs?.driver_tip_use_custom?.value, 10) &&
                  `(${verifyDecimals(
                    order?.summary?.driver_tip,
                    parseNumber,
                  )}%)`}
              </OText>

              <OText style={{ marginBottom: 5 }}>
                {parsePrice(order?.summary?.driver_tip ?? 0)}
              </OText>
            </Table>

            {order?.summary?.service_fee > 0 && (
              <Table>
                <OText style={{ marginBottom: 5 }}>
                  {t('SERVICE_FEE', 'Service Fee')}
                  {`(${verifyDecimals(
                    order?.summary?.service_fee,
                    parseNumber,
                  )}%)`}
                </OText>

                <OText style={{ marginBottom: 5 }}>
                  {parsePrice(order?.summary?.service_fee)}
                </OText>
              </Table>
            )}

            <Total>
              <Table>
                <OText style={styles.textBold}>{t('TOTAL', 'Total')}</OText>
                <OText style={styles.textBold} color={theme.colors.primary}>
                  {parsePrice(order?.summary?.total ?? 0)}
                </OText>
              </Table>
            </Total>
          </OrderBill>
        </OrderContent>
        <View style={{ height: 40 }} />
      </Content>

      <View style={{ marginBottom: 0 }}>
        <FloatingButton
          firstButtonClick={() => handlePrint()}
          btnText={t('PRINT', 'Print')}
          color={theme.colors.green}
          widthButton={'100%'}
          isPadding
        />
      </View>
    </>
  );
};
