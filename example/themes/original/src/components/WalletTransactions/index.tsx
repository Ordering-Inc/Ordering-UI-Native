import React from 'react'
import { View } from 'react-native'
import { useLanguage } from 'ordering-components/native'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import { useTheme } from 'styled-components/native'
import { OText } from '../shared';
import { WalletTransactionItem } from '../WalletTransactionItem'
import { NotFoundSource } from '../NotFoundSource';

import {
  Container,
  TransactionsWrapper
} from './styles'

export const WalletTransactions = (props: any) => {
  const {
    transactionsList,
    currentWalletSelected
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()

  return (
    <Container>
      <View style={{ width: '100%', paddingHorizontal: 1, paddingBottom: 40 }}>
        {!transactionsList?.loading &&
          !transactionsList?.error &&
          transactionsList.list?.[`wallet:${currentWalletSelected?.id}`]?.length > 0 &&
        (
          <>
            <OText style={{fontSize: 20, color: theme.colors.textNormal, marginBottom: 30}}>
              {t('TRANSACTIONS_HISTORY', 'Transactions history')}
            </OText>
            <TransactionsWrapper>
              {transactionsList.list?.[`wallet:${currentWalletSelected?.id}`]?.map((transaction: any, i: number) =>(
                <WalletTransactionItem
                  idx={i}
                  type={currentWalletSelected?.type}
                  key={transaction.id}
                  item={transaction}
                  withFormatPrice={currentWalletSelected?.type === 'cash'}
                />
              ))}
            </TransactionsWrapper>
          </>
        )}

        {(transactionsList?.loading || !transactionsList.list?.[`wallet:${currentWalletSelected?.id}`]) && (
          <View>
            {[...Array(4).keys()].map(i => (
              <View style={{ marginBottom: 10 }} key={i}>
                <Placeholder Animation={Fade}>
                  <PlaceholderLine width={100} height={100} style={{ marginBottom: 0, borderRadius: 8 }} />
                </Placeholder>
              </View>
            ))}
          </View>
        )}

        {!transactionsList?.loading &&
          !(transactionsList?.loading && transactionsList.list?.[`wallet:${currentWalletSelected?.id}`]) &&
          (transactionsList?.error ||
            !transactionsList.list?.[`wallet:${currentWalletSelected?.id}`]?.length) &&
        (
          <OText color={theme.colors.disabled} size={16} style={{ textAlign: 'center' }}>
            {transactionsList?.error
              ? t('ERROR_NOT_FOUND_TRANSACTIONS', 'Sorry, an error has occurred')
              : t('NOT_FOUND_TRANSACTIONS', 'No transactions to show at this time.')
            }
          </OText>
        )}
      </View>
    </Container>
  )
}
