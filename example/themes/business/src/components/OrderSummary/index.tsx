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
import { verifyDecimals } from '../../utils';
import { FloatingButton } from '../FloatingButton';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';
import { useTheme } from 'styled-components/native';

export const OrderSummary = ({ order, navigation, orderStatus }: any) => {
  const handleArrowBack: any = () => {
    navigation?.canGoBack() && navigation.goBack();
  };
  const [{ parsePrice, parseNumber, parseDate }] = useUtils();
  const [, t] = useLanguage();
  const [{ configs }] = useConfig();
  const [state, setState] = useState({
    selectedPrinter: { url: undefined },
  });

  const theme = useTheme();
  const percentTip =
    parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
    !parseInt(configs?.driver_tip_use_custom?.value, 10) &&
    verifyDecimals(order?.driver_tip, parseNumber);

  const orderSummary = () => {
    return `
    <div>
        <h1>${t('ORDER_NO', 'Order No.')} ${order.id}</h1>
        <p style="font-size: 27px">

          ${orderStatus} </br> 

          ${t('DELIVERY_TYPE', 'Delivery Type')}: ${
      deliveryStatus[order?.delivery_type]
    } 
          </br>
          ${t('DELIVERY_DATE', 'Delivery Date')}: ${
      order?.delivery_datetime_utc
        ? parseDate(order?.delivery_datetime_utc)
        : parseDate(order?.delivery_datetime, { utc: false })
    } 
          </br> 
          ${t('PAYMENT_METHOD')}: ${order?.paymethod?.name}
        </p>

        <h1>${t('CUSTOMER_DETAILS', 'Customer details')}</h1>
        <p style="font-size: 27px"> ${t('FULL_NAME', 'Full Name')}: ${
      order?.customer?.name
    } ${order?.customer?.lastname}
        </br>  
        ${t('EMAIL', 'Email')}: ${order?.customer?.email} 
        </br> 
        ${t('MOBILE_PHONE', 'Mobile Phone')}: ${order?.customer?.cellphone}
         </br> 
         ${t('FULL_ADDRESS', 'Full Addres')}: ${order?.customer?.address} 
         </br> 
         ${t('ZIPCODE', 'Zipcode')}: ${order?.customer.zipcode}
         </p>  

        <h1>${t('BUSINESS_DETAILS', 'Business details')}</h1>
        <p style="font-size: 27px"> 
        ${order?.business?.name} 
        </br> 
        ${t('BUSINESS_PHONE', 'Business Phone')}: ${order?.business?.cellphone} 
        </br> 
        ${t('ADDRES', 'Addres')}: ${order?.business?.address} 
        </p>
        <h1> ${t('ORDER_DETAILS', 'Order Details')}</h1>

        ${
          order?.products.length &&
          order?.products.map(
            (product: any, i: number) =>
              `
              <div style="display: flex;">

                <div style="display:flex; justify-content: flex-start; font-size: 26px; width: 70%">
                ${product?.quantity}  ${product?.name} 
                </div>

                <div style="display:flex; justify-content: flex-end; font-size: 26px; width: 30%">
                ${parsePrice(product.total || product.price)}
                </div>

              </div>
              `,
          )
        }
    
        <div style="display: flex;">

            <div style="display:flex; justify-content: flex-start; font-size: 26px; width: 70%">  
            ${t('SUBTOTAL', 'Subtotal')}
            </div>

            <div style="display:flex; justify-content: flex-end; font-size: 26px; width: 30%">
              ${parsePrice(order?.subtotal)}
            </div>

        </div>

        <div style="display: flex">
        ${
          order?.summary?.discount > 0
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
        ${
          order?.summary?.discount > 0
            ? `<div style="display:flex; justify-content: flex-end; font-size: 26px; width: 30%">- ${parsePrice(
                order?.summary?.discount || order?.discount,
              )}
              </div>`
            : ''
        }
        </div>

        ${
          order?.tax_type !== 1
            ? `<div style="font-size: 25px"> 
                ${t('TAX', 'Tax')}  
                ${verifyDecimals(order?.tax, parseNumber)}% 
                ${parsePrice(order?.summary?.tax || order?.totalTax)}  
                ${t('TAX', 'Tax')}  
                ${verifyDecimals(order?.tax, parseNumber)}%
              </div>`
            : ''
        }
       
        ${
          order?.summary?.delivery_price > 0 || order?.deliveryFee > 0
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
            ${parsePrice(order?.summary?.driver_tip || order?.totalDriverTip)}
          </div>

        </div>

        <div style="display: flex">

          <div style="font-size: 26px; width: 70%; display: flex; justify-content: flex-start"> 
            ${t('SERVICE_FEE', 'Service Fee')}
           (${verifyDecimals(order?.service_fee, parseNumber)}%)
          </div>

          <div style="font-size: 26px; width: 30%; display: flex; justify-content: flex-end">
            ${parsePrice(order?.summary?.service_fee || order?.serviceFee || 0)}
          </div>

        </div>

        <div style="display: flex">

          <div style="font-size: 26px; width: 70%; display: flex; justify-content: flex-start; font-weight: bold"> 
            ${t('TOTAL', 'Total')}
          </div>

          <div style="font-size: 26px; width: 30%; display: flex; justify-content: flex-end">
            ${parsePrice(order?.summary?.total || order?.total)}
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
      borderWidth: 0,
      padding: 40,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      height: 14,
    },
    textBold: {
      fontWeight: 'bold',
    },
  });

  return (
    <>
      <Content>
        <OIconButton
          icon={theme.images.general.arrow_left}
          iconStyle={{ width: 20, height: 20 }}
          borderColor={theme.colors.clear}
          style={styles.btnBackArrow}
          onClick={() => handleArrowBack()}
        />

        <OrderContent>
          <OrderHeader>
            <OText size={15} color={theme.colors.textGray} weight="bold">
              {t('INVOICE_ORDER_NO', 'Order No.')} {order.id}
            </OText>

            <OText size={15} color={theme.colors.textGray}>
              {`${orderStatus}`}
            </OText>

            <OText>
              {`${t('DELIVERY_TYPE', 'Delivery Type')}: ${
                deliveryStatus[order?.delivery_type]
              }`}
            </OText>

            <OText>
              {`${t('DELIVERY_DATE', 'Delivery Date')}: ${
                order?.delivery_datetime_utc
                  ? parseDate(order?.delivery_datetime_utc)
                  : parseDate(order?.delivery_datetime, { utc: false })
              }`}
            </OText>

            <OText>{`${t('PAYMENT_METHOD')}: ${t(
              order?.paymethod?.name.toUpperCase(),
              order?.paymethod?.name,
            )}`}</OText>
          </OrderHeader>

          <OrderCustomer>
            <OText
              style={{ marginBottom: 5 }}
              size={16}
              weight="bold"
              color={theme.colors.textGray}>
              {t('CUSTOMER_DETAILS', 'Customer details')}
            </OText>

            <OText
              size={14}
              numberOfLines={1}
              ellipsizeMode="tail"
              color={theme.colors.textGray}>
              {`${t('FULL_NAME', 'Full Name')}: ${order?.customer?.name} ${
                order?.customer?.lastname
              }`}
            </OText>

            <OText
              size={14}
              numberOfLines={1}
              ellipsizeMode="tail"
              color={theme.colors.textGray}>
              {`${t('EMAIL', 'Email')}: ${order?.customer?.email}`}
            </OText>

            <OText
              size={14}
              numberOfLines={1}
              ellipsizeMode="tail"
              color={theme.colors.textGray}>
              {`${t('MOBILE_PHONE', 'Mobile Phone')}: ${
                order?.customer?.cellphone
              }`}
            </OText>

            <OText
              size={14}
              numberOfLines={1}
              ellipsizeMode="tail"
              color={theme.colors.textGray}>
              {`${t('ADDRESS', 'Address')}: ${order?.customer?.address}`}
            </OText>

            {order?.customer?.address_notes && (
              <OText>
                {`${t('NOTES', 'Notes')}: ${order?.customer?.address_notes}`}
              </OText>
            )}

            {order?.customer.zipcode && (
              <OText
                size={14}
                numberOfLines={1}
                ellipsizeMode="tail"
                color={theme.colors.textGray}>
                {`${t('ZIPCODE', 'Zipcode')}: ${order?.customer.zipcode}`}
              </OText>
            )}
          </OrderCustomer>

          <OrderBusiness>
            <OText
              style={{ marginBottom: 5 }}
              size={16}
              weight="bold"
              color={theme.colors.textGray}>
              {t('BUSINESS_DETAILS', 'Business details')}
            </OText>

            <OText
              size={14}
              numberOfLines={1}
              ellipsizeMode="tail"
              color={theme.colors.textGray}>
              {order?.business?.name}
            </OText>

            <OText
              size={14}
              numberOfLines={1}
              ellipsizeMode="tail"
              color={theme.colors.textGray}>
              {`${t('BUSINESS_PHONE', 'Business Phone')}: ${
                order?.business?.cellphone
              }`}
            </OText>

            <OText
              size={14}
              numberOfLines={1}
              ellipsizeMode="tail"
              color={theme.colors.textGray}>
              {`${t('ADDRESS', 'Address')}: ${order?.business?.address}`}
            </OText>
          </OrderBusiness>

          <OrderProducts>
            <OText
              style={{ marginBottom: 5 }}
              size={16}
              weight="bold"
              color={theme.colors.textGray}>
              {t('ORDER_DETAILS', 'Order Details')}
            </OText>

            {order?.products.length &&
              order?.products.map((product: any, i: number) => (
                <View
                  key={i}
                  style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <ContentInfo>
                    <View style={{ flexDirection: 'row' }}>
                      <OText color={theme.colors.quantityProduct} space>
                        {product?.quantity}
                      </OText>

                      <OText
                        size={12}
                        color={theme.colors.textGray}
                        style={{ marginLeft: 5 }}>
                        {product?.name}
                      </OText>
                    </View>

                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        alignItems: 'flex-end',
                      }}>
                      <OText size={12} color={theme.colors.textGray}>
                        {parsePrice(product.total || product.price)}
                      </OText>
                    </View>
                  </ContentInfo>
                </View>
              ))}
          </OrderProducts>

          <OrderBill>
            <Table>
              <OText>{t('SUBTOTAL', 'Subtotal')}</OText>

              <OText>{parsePrice(order?.subtotal)}</OText>
            </Table>

            {(order?.summary?.discount > 0 || order?.discount > 0) && (
              <Table>
                {order?.offer_type === 1 ? (
                  <OText>
                    <OText>{t('DISCOUNT', 'Discount')}</OText>

                    <OText>
                      {`(${verifyDecimals(order?.offer_rate, parsePrice)}%)`}
                    </OText>
                  </OText>
                ) : (
                  <OText>{t('DISCOUNT', 'Discount')}</OText>
                )}

                <OText>
                  - {parsePrice(order?.summary?.discount || order?.discount)}
                </OText>
              </Table>
            )}

            {order?.tax_type !== 1 && (
              <Table>
                <OText>
                  {t('TAX', 'Tax')}
                  {`(${verifyDecimals(order?.tax, parseNumber)}%)`}
                </OText>

                <OText>
                  {parsePrice(order?.summary?.tax || order?.totalTax)}
                </OText>
              </Table>
            )}

            {(order?.summary?.delivery_price > 0 || order?.deliveryFee > 0) && (
              <Table>
                <OText>{t('DELIVERY_FEE', 'Delivery Fee')}</OText>

                <OText>
                  {parsePrice(
                    order?.summary?.delivery_price || order?.deliveryFee,
                  )}
                </OText>
              </Table>
            )}

            <Table>
              <OText>
                {t('DRIVER_TIP', 'Driver tip')}
                {(order?.summary?.driver_tip > 0 || order?.driver_tip > 0) &&
                  parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
                  !parseInt(configs?.driver_tip_use_custom?.value, 10) &&
                  `(${verifyDecimals(order?.driver_tip, parseNumber)}%)`}
              </OText>

              <OText>
                {parsePrice(
                  order?.summary?.driver_tip || order?.totalDriverTip,
                )}
              </OText>
            </Table>

            <Table>
              <OText>
                {t('SERVICE_FEE', 'Service Fee')}
                {`(${verifyDecimals(order?.service_fee, parseNumber)}%)`}
              </OText>

              <OText>
                {parsePrice(
                  order?.summary?.service_fee || order?.serviceFee || 0,
                )}
              </OText>
            </Table>

            <Total>
              <Table>
                <OText style={styles.textBold}>{t('TOTAL', 'Total')}</OText>

                <OText style={styles.textBold} color={theme.colors.primary}>
                  {parsePrice(order?.summary?.total || order?.total)}
                </OText>
              </Table>
            </Total>
          </OrderBill>
        </OrderContent>
      </Content>

      <Action>
        <FloatingButton
          firstButtonClick={() =>
            Platform.OS === 'ios' ? selectPrinter() : printPDF()
          }
          btnText={
            Platform.OS === 'ios'
              ? t('SELECT_PRINTER', 'Select Printer')
              : t('PRINT', 'Print')
          }
          color={theme.colors.green}
        />

        {Platform.OS === 'ios' && state.selectedPrinter && (
          <FloatingButton
            firstButtonClick={() => silentPrint()}
            btnText={t('PRINT', 'Print')}
            color={theme.colors.green}
          />
        )}
      </Action>
    </>
  );
};
