import React, { useState, useEffect } from 'react'
import { Pressable, StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from 'styled-components/native'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import FastImage from 'react-native-fast-image'
import {
  WalletList,
  useLanguage,
  useUtils,
  useConfig
} from 'ordering-components/native'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'

import {
  Container,
  Header,
  BalanceElement,
  OTabs,
  OTab,
  SectionContent,
  LoyaltyContent,
  LoyaltyWrapp,
  LoyaltyImg,
  WalletTransactionsWrapper
} from './styles'

import { OButton, OIcon, OText, OModal } from '../shared';
import { NotFoundSource } from '../NotFoundSource';
import { WalletTransactions } from '../WalletTransactions'

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
  const [openHistory, setOpenHistory] = useState(false)
  const isChewLayout = theme?.wallets_view?.components?.layout?.type === 'chew'

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
      name: t('POINTS_WALLET', 'Points Wallet'),
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
    if (refreshWallets) {
      getWallets()
      setRefreshWallets && setRefreshWallets(false)
    }
  }, [refreshWallets])

  return (
    <>
      <Container>
        <Header>
        <OText size={24} style={{ marginTop: 30 }}>{t('WALLETS', 'Wallets')}</OText>
          {isChewLayout && (
            <OButton
              text={t('WALLET_HISTORY', 'Wallet history')}
              bgColor={theme.colors.white}
              borderColor={theme.colors.lightGray}
              imgRightSrc={null}
              textStyle={{ fontSize: 12, color: theme.colors.disabled }}
              onClick={() => setOpenHistory(true)}
              style={{ borderRadius: 8, height: 40 }}
            />
          )}
        </Header>

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
                  <TouchableOpacity
                    key={wallet.id}
                    onPress={() => handleChangeTab(wallet)}
                  >
                    <OTab
                      isSelected={tabSelected === wallet.type}
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor:
                          tabSelected === wallet.type
                          ? theme.colors.textNormal
                          : theme.colors.border
                      }}
                    >
                      <OText>
                        {walletName[wallet.type]?.name}
                      </OText>
                    </OTab>
                  </TouchableOpacity>
                ))}
              </OTabs>

              <SectionContent>
                {!!loyaltyLevel && tabSelected === 'credit_point' && (
                  <LoyaltyContent>
                    <LoyaltyWrapp>
                      <OText size={20}>
                        {`${t('LOYALTY_LEVEL_TITLE', 'Your level is')}:`}
                      </OText>
                      {/* {loyaltyLevel.image ? (
                        <FastImage
                          style={styles.logoStyle}
                          source={{
                            uri: loyaltyLevel.image,
                            priority: FastImage.priority.high,
                            cache: FastImage.cacheControl.web
                          }}
                          resizeMode={FastImage.resizeMode.contain}
                        />
                      ) : (
                        <LoyaltyImg
                          source={theme.images.dummies.loyaltyLevel}
                          resizeMode='contain'
                        />
                      )} */}
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
                  <OText size={20} style={{ fontWeight: '600' }}>
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

                {!isChewLayout && (
                  <WalletTransactions
                    transactionsList={transactionsList}
                    currentWalletSelected={currentWalletSelected}
                  />
                )}
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

      <OModal
        open={openHistory}
        onClose={() => setOpenHistory(false)}
        entireModal
        customClose
      >
        <ScrollView>
          <WalletTransactionsWrapper>
            <OButton
              imgRightSrc={null}
              style={{
                borderWidth: 0,
                backgroundColor: theme.colors.white,
                padding: 0,
                paddingHorizontal: 0,
                width: 30,
                paddingLeft: 0,
                paddingRight: 0
              }}
              onClick={() => setOpenHistory(false)}
              icon={AntDesignIcon}
              iconProps={{
                name: 'arrowleft',
                size: 26
              }}
            />
            <WalletTransactions
              transactionsList={transactionsList}
              currentWalletSelected={currentWalletSelected}
            />
          </WalletTransactionsWrapper>
        </ScrollView>
      </OModal>
    </>
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
