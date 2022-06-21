import React, { useState, useEffect } from 'react'
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from 'styled-components/native'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import FastImage from 'react-native-fast-image'
import {
  WalletList,
  useLanguage,
  useUtils,
  useConfig
} from 'ordering-components/native'

import {
  Container,
  BalanceElement,
  TransactionsWrapper,
  OTabs,
  OTab,
  SectionContent,
  LoyaltyContent,
  LoyaltyWrapp,
  LoyaltyImg
} from './styles'

import NavBar from '../NavBar'
import { OText } from '../shared';
import { NotFoundSource } from '../NotFoundSource';
import { WalletTransactionItem } from '../WalletTransactionItem'

const WalletsUI = (props: any) => {
  const {
    navigation,
    walletList,
    userLoyaltyLevel,
    transactionsList,
    setWalletSelected,
    isWalletCashEnabled,
    isWalletPointsEnabled,
    getWallets,
    refreshWallets,
    setRefreshWallets
  } = props

  const [, t] = useLanguage()
  const theme = useTheme()
  const [{ parsePrice }] = useUtils()
  const [{ configs }] = useConfig()

  const styles = StyleSheet.create({
    logoStyle: {
      width: 120,
      height: 120,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }
  });

  const [tabSelected, setTabSelected] = useState(isWalletCashEnabled ? 'cash' : 'credit_point')

  const isWalletEnabled = configs?.cash_wallet?.value && configs?.wallet_enabled?.value === '1' && (isWalletCashEnabled || isWalletPointsEnabled)

  const currentWalletSelected = (walletList.wallets?.length > 0 && walletList.wallets?.find((w: any) => w.type === tabSelected)) ?? null

  const loyaltyLevel = Object.keys(userLoyaltyLevel.loyaltyLevel ?? {}).length > 0 && userLoyaltyLevel.loyaltyLevel

  const walletName: any = {
    cash: {
      name: t('CASH_WALLET', 'Cash Wallet'),
      value: 0,
      isActive: isWalletCashEnabled
    },
    credit_point: {
      name: t('CREDITS_POINTS_WALLET', 'Credit Points Wallet'),
      value: 1,
      isActive: isWalletPointsEnabled
    }
  }

  const handleChangeTab = (wallet: any) => {
    setTabSelected(wallet.type)
    setWalletSelected(wallet.id)
  }

  const goToBack = () => {
    navigation?.canGoBack() && navigation.goBack()
  }

  useEffect(() => {
    if (!isWalletEnabled) {
      navigation.navigate('BottomTab', {
        screen: 'Profile'
      })
    }
  }, [configs])

  useEffect(() => {
    if(refreshWallets){
      getWallets()
      setRefreshWallets && setRefreshWallets(false)
    }
  }, [refreshWallets])

  return (
    <Container>
      <NavBar
        title={t('WALLETS', 'Wallets')}
        titleAlign={'center'}
        onActionLeft={goToBack}
        showCall={false}
        paddingTop={10}
        btnStyle={{ paddingLeft: 0 }}
      />

      {!walletList.loading &&
        !userLoyaltyLevel.loading &&
        !walletList.error &&
        walletList.wallets?.length > 0 &&
      (
        <>
          <OTabs
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {walletList.wallets?.map((wallet: any) => walletName[wallet.type]?.isActive && (
              <Pressable
                key={wallet.id}
                onPress={() => handleChangeTab(wallet)}
              >
                <OTab isSelected={tabSelected === wallet.type}>
                  <OText size={18}>
                    {walletName[wallet.type]?.name}
                  </OText>
                </OTab>
              </Pressable>
            ))}
          </OTabs>

          <SectionContent>
            {!!loyaltyLevel && (
              <LoyaltyContent>
                <LoyaltyWrapp>
                  <OText size={20}>
                    {`${t('LOYALTY_LEVEL_TITLE', 'Your level is')}:`}
                  </OText>
                  {loyaltyLevel.image ? (
                    <FastImage
                      style={styles.logoStyle}
                      source={{
                        uri: loyaltyLevel.image,
                        priority: FastImage.priority.high,
                        cache:FastImage.cacheControl.web
                      }}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                  ) : (
                    <LoyaltyImg
                      source={theme.images.dummies.loyaltyLevel}
                      resizeMode='contain'
                    />
                  )}
                  <OText
                    size={22}
                    weight='bold'
                    style={{ textTransform: 'uppercase' }}
                    color={theme.colors.primary}
                  >
                    {loyaltyLevel.name}
                  </OText>
                </LoyaltyWrapp>
              </LoyaltyContent>
            )}
            <BalanceElement>
              <OText size={20} style={{fontWeight: '600'}}>
                {currentWalletSelected?.type === 'cash'
                  ? parsePrice(currentWalletSelected?.balance)
                  : currentWalletSelected?.balance
                }
              </OText>
              <OText style={{ paddingLeft: 5 }}>
                {currentWalletSelected?.type === 'cash'
                  ? configs?.stripe_currency?.value
                  : t('POINTS', 'Points')}
              </OText>
            </BalanceElement>

            <View style={{ marginTop: 20, width: '100%', paddingHorizontal: 1, paddingBottom: 40 }}>
              {!transactionsList?.loading &&
                !transactionsList?.error &&
                transactionsList.list?.[`wallet:${currentWalletSelected?.id}`]?.length > 0 &&
              (
                <>
                  <OText style={{fontSize: 20}}>
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
                <NotFoundSource
                  content={transactionsList?.error
                    ? t('ERROR_NOT_FOUND_TRANSACTIONS', 'Sorry, an error has occurred')
                    : t('NOT_FOUND_TRANSACTIONS', 'No transactions to show at this time.')
                  }
                />
              )}
            </View>
          </SectionContent>
        </>
      )}

      {(walletList?.loading || userLoyaltyLevel.loading) && (
        <>
          <View>
            <Placeholder Animation={Fade}>
              <PlaceholderLine width={100} height={40} style={{ marginBottom: 0 }} />
            </Placeholder>
          </View>
          <View style={{ marginTop: 10, marginBottom: 20 }}>
            <Placeholder Animation={Fade}>
              <PlaceholderLine width={100} height={40} style={{ marginBottom: 0 }} />
            </Placeholder>
          </View>
          <View>
            {[...Array(4).keys()].map(i => (
              <View style={{ marginBottom: 10 }} key={i}>
                <Placeholder Animation={Fade}>
                  <PlaceholderLine width={100} height={60} style={{ marginBottom: 0 }} />
                </Placeholder>
              </View>
            ))}
          </View>
        </>
      )}

      {!walletList?.loading && !userLoyaltyLevel.loading && (walletList?.error || !walletList?.wallets?.length) && (
        <NotFoundSource
          content={walletList?.error
            ? t('ERROR_NOT_FOUND_WALLETS', 'Sorry, an error has occurred')
            : t('NOT_FOUND_WALLETS', 'No wallets to show at this time.')
          }
        />
      )}
    </Container>
  )
}

export const Wallets = (props: any) => {
  const [{ configs }] = useConfig()

  const isWalletCashEnabled = configs?.wallet_cash_enabled?.value === '1'
  const isWalletPointsEnabled = configs?.wallet_credit_point_enabled?.value === '1'

  const walletsProps = {
    ...props,
    UIComponent: WalletsUI,
    isWalletCashEnabled,
    isWalletPointsEnabled
  }
  return (
    <WalletList {...walletsProps} />
  )
}
