import React from 'react'
import { useTheme } from 'styled-components/native'
import { useLanguage, useUtils } from 'ordering-components/native'

import {
  Container,
  DateBlock,
  MessageBlock,
  DescriptionBlock,
  Dot
} from './styles'
import { OIcon, OText } from '../shared';

export const WalletTransactionItem = (props: any) => {
  const {
    item,
    idx,
    type,
    withFormatPrice
  } = props

  const theme = useTheme()
  const [{ parsePrice, parseDate }] = useUtils()
  const [, t] = useLanguage()

  const LANG_EVENT_KEY = `WALLET_${type.toUpperCase()}_${item?.event.toUpperCase()}_${item?.event_type.toUpperCase()}_${item?.amount >= 0 ? 'POSITIVE' : 'NEGATIVE'}`
  const lang_event_text = !!item?.event?.order_id
    ? `:author${item?.amount >= 0 ? 'Add' : 'Reduce'} money in Order No. :order_id`
    : `:author${item?.amount >= 0 ? 'Add' : 'Reduce'} money`

  return (
    <Container>
      <Dot isTop={idx === 0} />
      <DateBlock>
        <OText color={theme.colors.disabled}>{parseDate(item?.created_at)}</OText>
        <OText
          style={{
            color: item?.amount > 0 && theme.colors.primary,
            fontWeight: 'bold'
          }}
        >
          {item?.amount > 0 && '+ '}{withFormatPrice ? parsePrice(item?.amount) : item?.amount}
        </OText>
      </DateBlock>
      <MessageBlock>
        <OText>
          {t(LANG_EVENT_KEY, lang_event_text)
            .replace(':author', item?.event?.author?.name ? item?.event?.author?.name + ' ' : '')
            .replace(':order_id', item?.event?.order_id ? item?.event?.order_id + ' ' : '')}
        </OText>
      </MessageBlock>
      {/* {!!item?.description && (
        <DescriptionBlock>
          <OText>{item?.description}</OText>
        </DescriptionBlock>
      )}
      {!!item?.code && (
        <DescriptionBlock>
          <OText weight={'bold'}>
            {t('CODE', 'Code')}
            <OText weight={'100'}>
              {': '}{item?.code}
            </OText>
          </OText>
        </DescriptionBlock>
      )} */}
    </Container>
  )
}
