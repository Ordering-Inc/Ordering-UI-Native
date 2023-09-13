import React, { useState } from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import {
    useLanguage,
    useOrder,
    useConfig
} from 'ordering-components/native'
import { useTheme } from 'styled-components/native';
import { OText, OButton } from '../shared'
import {
    CartList,
    CartDivider,
    TopActionsHeader,
    TopHeader
} from './styles'
import { OrderSummary } from '../OrderSummary';
import { Cart } from '../Cart';
import { ScrollView } from 'react-native-gesture-handler';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UpsellingLayout } from './UpsellingLayout';

export const UpsellingContent = (props: any) => {
    const {
        onGoBack,
        handleUpsellingPage,
        onNavigationRedirect,
        cart,
        productsList
    } = props

    const theme = useTheme();

    const [{ carts }] = useOrder()
    const [{ configs }] = useConfig()
    const [, t] = useLanguage()
    const { bottom } = useSafeAreaInsets()
    const [isCartsLoading, setIsCartsLoading] = useState(false)
    const [showTitle, setShowTitle] = useState(false)

    const isMultiCheckout = configs?.checkout_multi_business_enabled?.value === '1'
    const isChewLayout = theme?.header?.components?.layout?.type?.toLowerCase() === 'chew'
    const showCartList = isChewLayout
    const commentDelayTime = isChewLayout ? 500 : null

    const cartList = (carts && Object.values(carts).filter((_cart: any) => _cart?.products?.length > 0 && _cart.uuid !== cart?.uuid)) || []

    const styles = StyleSheet.create({
        closeUpsellingButton: {
            borderRadius: 7.6,
            borderWidth: 1,
            alignSelf: 'center',
            height: 44,
            shadowOpacity: 0,
            width: '80%',
        },
        cancelBtn: {
            paddingHorizontal: 18,
            borderWidth: 1,
            borderRadius: 7.6,
            borderColor: theme.colors.textSecondary,
            height: 38
        },
        headerItem: {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 2,
            marginHorizontal: 20,
        },
        btnBackArrow: {
            borderWidth: 0,
            width: 26,
            height: 26,
            backgroundColor: theme.colors.clear,
            borderColor: theme.colors.clear,
            shadowColor: theme.colors.clear,
            paddingLeft: 0,
            paddingRight: 0,
            marginLeft: 20,
            marginBottom: 10
        },
        wrapperNavbar: {
            paddingHorizontal: 20,
            paddingTop: 0,
        }
    })


    const handleScroll = ({ nativeEvent: { contentOffset } }: any) => {
        setShowTitle(contentOffset.y > 30)
    }

    return (
        <>
            <View style={styles.wrapperNavbar}>
                <TopHeader>
                    <>
                        <TopActionsHeader onPress={() => onGoBack()}>
                            <IconAntDesign
                                name='arrowleft'
                                size={26}
                            />
                        </TopActionsHeader>
                        {showTitle && (
                            <OText
                                size={16}
                                style={{ flex: 1, textAlign: 'center', right: 15 }}
                                weight={Platform.OS === 'ios' ? '600' : 'bold'}
                                numberOfLines={2}
                                ellipsizeMode='tail'
                            >
                                {t('WANT_SOMETHING_ELSE', 'Do you want something else?')}
                            </OText>
                        )}
                    </>
                </TopHeader>
            </View>
            <ScrollView style={{ marginTop: 10, marginBottom: props.isPage ? 40 : bottom + (Platform.OS == 'ios' ? 96 : 130) }} showsVerticalScrollIndicator={false} onScroll={handleScroll}>
                {productsList.length > 0 &&
                    <View style={{ paddingHorizontal: 40, overflow: 'visible' }}>
                        <OText size={16} lineHeight={24} weight={'500'}>{t('WANT_SOMETHING_ELSE', 'Do you want something else?')}</OText>
                        <UpsellingLayout {...props} />
                    </View>
                }
                <View style={{ paddingHorizontal: 40 }}>
                    <OText size={20} lineHeight={30} weight={600} style={{ marginTop: 10, marginBottom: 17 }}>{t('YOUR_CART', 'Your cart')}</OText>
                    <OrderSummary
                        cart={cart}
                        commentDelayTime={commentDelayTime}
                        isCartPending={cart?.status === 2}
                        onNavigationRedirect={onNavigationRedirect}
                    />
                </View>
                {showCartList && cartList.map((cart: any, i: number) => (
                    <CartList key={i}>
                        <Cart
                            isFromUpselling
                            cart={cart}
                            cartuuid={cart.uuid}
                            hideUpselling
                            singleBusiness={props.singleBusiness}
                            isFranchiseApp={props.isFranchiseApp}
                            isCartsLoading={isCartsLoading}
                            setIsCartsLoading={setIsCartsLoading}
                            isMultiCheckout={isMultiCheckout}
                            onNavigationRedirect={props.onNavigationRedirect}
                        />
                        <CartDivider />
                    </CartList>
                ))}
            </ScrollView>
            <View
                style={{
                    alignItems: 'center',
                    bottom: props.isPage ? Platform.OS === 'ios' ? 0 : 20 : Platform.OS === 'ios' ? bottom + 59 : bottom + 125
                }}
            >
                <OButton
                    imgRightSrc=''
                    text={t('CHECKOUT', 'Checkout')}
                    textStyle={{ fontSize: 14 }}
                    style={{ ...styles.closeUpsellingButton }}
                    onClick={() => handleUpsellingPage(cart)}
                />
            </View>
        </>
    )
}
