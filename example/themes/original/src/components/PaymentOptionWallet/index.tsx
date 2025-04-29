
import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import { useTheme } from 'styled-components/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  PaymentOptionWallet as PaymentOptionWalletController,
  useLanguage,
  useUtils,
  useOrder,
  useConfig
} from 'ordering-components/native'

import {
  Container,
  SectionLeft,
} from './styles'

import { OText } from '../shared'

const PaymentOptionWalletUI = (props: any) => {
  const {
    businessConfigs,
    businessId,
    walletsState,
    selectWallet,
    deletetWalletSelected
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ configs }] = useConfig()
  const [{ carts }] = useOrder()
  const [{ parsePrice }] = useUtils()

  const cart = carts?.[`businessId:${businessId}`] ?? {}

  const isWalletCashEnabled = configs?.wallet_cash_enabled?.value === '1'
  const isWalletPointsEnabled = configs?.wallet_credit_point_enabled?.value === '1'

  const isBusinessWalletCashEnabled = businessConfigs.find((config: any) => config.key === 'wallet_cash_enabled')?.value === '1'
  const isBusinessWalletPointsEnabled = businessConfigs.find((config: any) => config.key === 'wallet_credit_point_enabled')?.value === '1'

  const [checkedState, setCheckedState] = useState(
    new Array(walletsState.result?.length).fill(false)
  );

  const creditBalance: any = (wallet: any) => ` = ${parsePrice(wallet.balance / wallet.redemption_rate, { isTruncable: true })}`

  const walletName: any = {
    cash: {
      name: t('PAY_WITH_CASH_WALLET', 'Pay with Cash Wallet'),
      isActive: isWalletCashEnabled && isBusinessWalletCashEnabled
    },
    credit_point: {
      name: t('PAY_WITH_CREDITS_POINTS_WALLET', 'Pay with Credit Points Wallet'),
      isActive: isWalletPointsEnabled && isBusinessWalletPointsEnabled
    }
  }

  const handleOnChange = (position: any, wallet: any) => {
    const updatedCheckedState = checkedState.map((item: any, index: any) =>
      index === position ? !item : item
    );

    if (!checkedState[position]) {
      selectWallet(wallet)
    } else {
      deletetWalletSelected(wallet)
    }

    setCheckedState(updatedCheckedState);
  };

  useEffect(() => {
    if (!walletsState.loading && walletsState.result?.length) {
      setCheckedState(
        walletsState.result?.map((wallet: any) => {
          return !!cart?.payment_events?.find((w: any) => w.wallet_id === wallet.id)
        })
      )
    }
  }, [walletsState.result?.length])

  return (
    <>
      {!walletsState.loading &&
        !walletsState.error &&
        walletsState.result?.length > 0 &&
        (
          <>
            {walletsState.result?.map((wallet: any, idx: any) => wallet.valid && wallet.balance >= 0 && walletName[wallet.type]?.isActive && (
              <Container
                key={wallet.id}
                isBottomBorder={idx === walletsState.result?.filter((wallet: any) => wallet.valid)?.length - 1}
                onPress={() => handleOnChange(idx, wallet)}
                disabled={(cart?.balance === 0 && !checkedState[idx]) || wallet.balance === 0}
              >
                <SectionLeft>
                  {checkedState[idx] ? (
                    <MaterialCommunityIcons
                      name="checkbox-marked"
                      size={25}
                      color={theme.colors.primary}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="checkbox-blank-outline"
                      size={25}
                      color={theme.colors.disabled}
                    />
                  )}
                  <View style={{ alignItems: 'baseline', marginLeft: 5 }}>
                    <View>
                      <OText
                        style={((cart?.balance === 0 && !checkedState[idx]) || wallet.balance === 0) ? {
                          color: theme.colors.disabled
                        } : {}}
                      >
                        {walletName[wallet.type]?.name}
                      </OText>
                    </View>
                  </View>
                </SectionLeft>

                <View style={{ maxWidth: '35%', alignItems: 'flex-end' }}>
                  {wallet.type === 'cash' && (
                    <OText>
                      {parsePrice(wallet?.balance, { isTruncable: true })}
                    </OText>
                  )}
                  {wallet.type === 'credit_point' && (
                    <OText>
                      <OText color={theme.colors.primary} weight='bold'>
                        {`${wallet?.balance} ${t('POINTS', 'Points')}`}
                      </OText>
                      <OText>
                        {wallet?.balance > 0
                          ? creditBalance(wallet)
                          : null}
                      </OText>
                    </OText>
                  )}
                </View>
              </Container>
            ))}
          </>
        )}

      {walletsState?.loading && (
        <View>
          {[...Array(2).keys()].map(i => (
            <View style={{ marginBottom: 10 }} key={i}>
              <Placeholder Animation={Fade}>
                <PlaceholderLine width={100} height={40} style={{ marginBottom: 0, borderRadius: 8 }} />
              </Placeholder>
            </View>
          ))}
        </View>
      )}
    </>
  )
}

export const PaymentOptionWallet = (props: any) => {
  const paymentWalletProps = {
    ...props,
    UIComponent: PaymentOptionWalletUI
  }

  return (
    <PaymentOptionWalletController {...paymentWalletProps} />
  )
}
