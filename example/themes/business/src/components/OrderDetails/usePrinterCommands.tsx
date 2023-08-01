import { useConfig, useUtils, useLanguage} from 'ordering-components/native'

import { verifyDecimals, getProductPrice } from '../../utils';

/**
 * Hook to create commands for star micronics printer using PassPRNT library
 * @returns array of strings
 */

export const usePrinterCommands = () => {
  const [, t] = useLanguage()
  const [{ configs }] = useConfig();
  const [{ parsePrice, parseNumber, parseDate }] = useUtils();

  const deliveryStatus: any = {
    1: t('DELIVERY', 'Delivery'),
    2: t('PICK_UP', 'Pick up'),
    3: t('EAT_IN', 'Eat In'),
    4: t('CURBSIDE', 'Curbside'),
    5: t('DRIVER_THRU', 'Driver thru'),
  };

  const walletName: any = {
    cash: {
      name: t('CASH_WALLET', 'Cash Wallet')
    },
    credit_point: {
      name: t('POINTS_WALLET', 'Points Wallet')
    }
  }

  const percentTip = (order: any) =>
    parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
    !parseInt(configs?.driver_tip_use_custom?.value, 10) &&
    verifyDecimals(order?.summary?.driver_tip, parseNumber);

  const handlePaymethodsListString = (order: any) => {
    const paymethodsList = order?.payment_events?.filter((item: any) => item.event === 'payment').map((paymethod: any) => {
      return paymethod?.wallet_event
        ? walletName[paymethod?.wallet_event?.wallet?.type]?.name
        : paymethod?.paymethod?.gateway && paymethod?.paymethod?.gateway === 'cash' && order?.cash > 0
          ? `${t(paymethod?.paymethod?.gateway?.toUpperCase(), paymethod?.paymethod?.name)} (${t('CASH_CHANGE_OF', 'Change of :amount:').replace(':amount:', parsePrice(order?.cash))})`
          : paymethod?.paymethod?.gateway
            ? t(paymethod?.paymethod?.gateway?.toUpperCase(), paymethod?.paymethod?.name)
            : t(order?.paymethod?.gateway?.toUpperCase(), order?.paymethod?.name)
    })
    return paymethodsList.join(', ')
  }

  const paymethodsLength = (order: any) => order?.payment_events?.filter((item: any) => item.event === 'payment')?.length

  const customerName = (order: any) => `${order?.customer?.name ?? ''} ${order?.customer?.middle_name ?? ''} ${order?.customer?.lastname ?? ''} ${order?.customer?.second_lastname ?? ''}`?.replace('  ', ' ')?.trim() ?? ''

  const deliveryDate = (order: any) => {
    const dateString = order?.delivery_datetime_utc ? order?.delivery_datetime_utc : order?.delivery_datetime
    const currentDate = new Date();
    const receivedDate: any = new Date(dateString.replace(/-/g, '/'));
    const formattedDate = receivedDate <= currentDate
      ? `${t('ASAP_ABBREVIATION', 'ASAP')}(${parseDate(receivedDate.toLocaleString(), { utc: !!order?.delivery_datetime_utc })})`
      : parseDate(receivedDate.toLocaleString(), { utc: !!order?.delivery_datetime_utc })
    return formattedDate
  }

  const generateProductsText = (order: any) => {
    const list: any = []

    if (order?.products.length) {
      order?.products.map((product: any) => {
        list.push(`${product?.quantity}  ${product?.name} \t ${parsePrice(product.total ?? getProductPrice(product))}`)

        if (product?.ingredients?.length) {
          list.push({ text: `\t ${t('INGREDIENTS', 'Ingredients')}:`, props: { fontSize: 10 } })
          product?.ingredients?.map((ingredient: any) => {
            list.push({ text: `\t ${t('NO', 'No')} ${ingredient.name}` , fontSize: 10 })
          })
        }

        product.options?.map((option: any) => {
          list.push({ text: `\t ${option.name}`, props: { fontSize: 10 } })

          option.suboptions?.map((suboption: any) => {
            const { quantity, name, position, price } = suboption
            const pos = position && position !== 'whole' ? `(${t(position.toUpperCase(), position)})` : ''
            const string = name !== 'No'
              ? pos
                ? `${quantity} x ${name} ${pos} +${parsePrice(price)}`
                : `${quantity} x ${name} +${parsePrice(price)}`
              : 'No'

            list.push({ text: `\t\t ${string}`, props: { fontSize: 10 } })
          })
        })

        if (product.comment) {
          list.push({ text: `\t ${t('COMMENT', 'Comment')}`, props: { fontSize: 10 } })
          list.push({ text: `\t\t ${product.comment}`, props: { fontSize: 10 } })
        }

        list.push('_separator_')
      })
    }

    return list
  }

  const paymethodsList = (order: any) => {
    const list: any = []

    if (order?.payment_events?.length > 0) {
      order?.payment_events.map((event: any) => {
        const payment = event?.wallet_event
          ? walletName[event?.wallet_event?.wallet?.type]?.name
          : t(event?.paymethod?.name?.toUpperCase()?.replace(/ /g, '_'), event?.paymethod?.name)

        const amount = (event?.paymethod?.gateway === 'cash' && order?.cash)
          ? parsePrice(order?.cash, { currency: order?.currency })
          : `-${parsePrice(event?.amount, { currency: order?.currency })}`

        list.push(`${payment} \t ${amount}`)
      })
    }

    return list
  }

  const generateCommands = (order: any) => {
    let commands: any = [];

    const textProps = { fontSize: 12 }

    const appends: any = [
      { text: `${t('ORDER_NO', 'Order No.')} ${order.id}`, props: { fontSize: 16 } },
      ' ',
      order.orderStatus,
      { text: `${t('ORDER_TYPE', 'Order Type')}: ${deliveryStatus[order?.delivery_type]}`, props: { fontSize: 14 } },
      { text: `${t(`PAYMENT_METHOD${paymethodsLength(order) > 1 ? 'S' : ''}`, `Payment method${paymethodsLength(order) > 1 ? 's' : ''}`)}: ${handlePaymethodsListString(order)}`, props: { fontSize: 14 } },
      `${!!order?.delivery_option ? `${t('DELIVERY_PREFERENCE', 'Delivery Preference')}: ${t(order?.delivery_option?.name?.toUpperCase()?.replace(/ /g, '_'), order?.delivery_option?.name)}` : ''}`,
      `${t('DELIVERY_DATE', 'Delivery Date')}: ${deliveryDate(order)}`,
      '_separator_',
      { text: `${t('CUSTOMER_DETAILS', 'Customer details')}`, props: { fontSize: 14 } },
      `${t('FULL_NAME', 'Full Name')}: ${customerName(order)}`,
      `${t('EMAIL', 'Email')}: ${order?.customer?.email}`,
      `${!!order?.customer?.cellphone ? `${t('MOBILE_PHONE', 'Mobile Phone')}: ${order?.customer?.cellphone}` : ''}`,
      `${!!order?.customer?.phone ? `${t('MOBILE_PHONE', 'Mobile Phone')}: ${order?.customer?.phone}` : ''}`,
      `${t('FULL_ADDRESS', 'Full Addres')}: ${order?.customer?.address}`,
      `${!!order?.customer?.internal_number ? `${t('INTERNAL_NUMBER', 'Internal Number')}: ${order?.customer?.internal_number}` : ''}`,
      `${!!order?.customer?.zipcode ? `${t('ZIPCODE', 'Zipcode')}: ${order?.customer?.zipcode}` : ''}`,
      '_separator_',
      { text: `${t('BUSINESS_DETAILS', 'Business details')}`, props: { fontSize: 14 } },
      order?.business?.name,
      order?.business?.email,
      `${!!order?.business?.cellphone ? `${t('BUSINESS_PHONE', 'Business Phone')}: ${order?.business?.cellphone}` : ''}`,
      `${!!order?.business?.phone ? `${t('BUSINESS_PHONE', 'Business Phone')}: ${order?.business?.phone}` : ''}`,
      `${t('ADDRESS', 'Address')}: ${order?.business?.address}`,
      `${!!order?.business?.address_notes ? `${t('SPECIAL_ADDRESS', 'Special Address')}: ${order?.business?.address_notes}` : ''}`,
      '_separator_',
      { text: `${t('ORDER_DETAILS', 'Order Details')}`, props: { fontSize: 14 } },
      `${!!order?.comment ? `${t('ORDER_COMMENT', 'Order Comment')}: ${order?.comment}` : ''}`,
      ...generateProductsText(order),
      ' ',
      `${t('SUBTOTAL', 'Subtotal')} \t\t ${parsePrice(order.tax_type === 1 ? (order?.summary?.subtotal + order?.summary?.tax) ?? 0 : order?.summary?.subtotal ?? 0)}`,
      `${order?.summary?.discount > 0 ? `${order?.offer_type === 1 ? `${t('DISCOUNT', 'Discount')} (${verifyDecimals(order?.offer_rate, parsePrice)}%)` : t('DISCOUNT', 'Discount')} \t\t ${parsePrice(order?.summary?.discount)}` : ''}`,
      `${order?.tax_type !== 1 ? `${t('TAX', 'Tax')} (${verifyDecimals(order?.summary?.tax_rate, parseNumber)}%) \t\t ${parsePrice(order?.summary?.tax ?? 0)}` : ''}`,
      `${order?.summary?.delivery_price > 0 && order.delivery_type !== 2 ? `${t('DELIVERY_FEE', 'Delivery Fee')} \t\t ${parsePrice(order?.summary?.delivery_price ?? 0)}` : ''}`,
      `${(order?.summary?.driver_tip > 0 || order?.driver_tip > 0) && order.delivery_type !== 2 ? `${t('DRIVER_TIP', 'Driver tip')} ${percentTip(order) ? `(${percentTip(order)}%)` : ''} \t\t ${parsePrice(order?.summary?.driver_tip ?? 0)}` : ''}`,
      `${t('SERVICE_FEE', 'Service Fee')} (${verifyDecimals(order?.summary?.service_fee, parseNumber)}%) \t\t ${parsePrice(order?.summary?.service_fee ?? 0)}`,
      '_separator_',
      `${t('TOTAL', 'Total')} \t\t ${parsePrice(order?.summary?.total ?? 0)}`,
      ' ',
      `${order?.payment_events?.length > 0 ? `${t('PAYMENTS', 'Payments')}` : ''}`,
      ...paymethodsList(order),
      ' ',
      ' ',
    ]

    commands = [
      ...commands,
      ...appends.map((append: any) => {
        return append === '_separator_'
          ? { appendBitmapText: '---------------------------------------' }
          : {
            appendBitmapText: append?.text ?? append,
            ...textProps,
            ...append?.props
          }
      })
    ]

    return commands
  }

  return { generateCommands }
}
