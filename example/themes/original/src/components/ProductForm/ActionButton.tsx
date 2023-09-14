import React from 'react'
import { useSession, useOrder, useLanguage, useConfig } from 'ordering-components/native'
import { useTheme } from 'styled-components/native'
import { TouchableOpacity, View } from 'react-native'
import { OButton, OText } from '../shared';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';

export const ActionButton = (props: any) => {
    const {
        navigation,
        isHaveWeight,
        isSoldOut,
        maxProductQuantity,
        productCart,
        handleSaveProduct,
        editMode,
        product,
        errors,
        productAddedToCartLength,
        handleRedirectLogin,
        guestCheckoutEnabled,
        orderTypeEnabled,
        handleUpdateGuest,
        actionStatus
    } = props
    const [, t] = useLanguage()
    const [{ auth }] = useSession()
    const [orderState] = useOrder()
    const theme = useTheme()
    const [{ configs }] = useConfig()
    const unaddressedTypes = configs?.unaddressed_order_types_allowed?.value.split('|').map((value: any) => Number(value)) || []
    const isAllowUnaddressOrderType = unaddressedTypes.includes(orderState?.options?.type)
    const saveErrors =
        orderState.loading ||
        maxProductQuantity === 0 ||
        Object.keys(errors)?.length > 0;
    const buttonColor = saveErrors || isSoldOut || maxProductQuantity <= 0 || (product?.minimum_per_order && ((productCart?.quantity + productAddedToCartLength) < product?.minimum_per_order)) || (product?.maximum_per_order && ((productCart?.quantity + productAddedToCartLength) > product?.maximum_per_order))



    return (
        <View
            style={{
                width: isHaveWeight ? '100%' : ((isSoldOut || maxProductQuantity <= 0) ? '60%' : '40%'),
            }}>
            {((productCart &&
                auth &&
                (orderState.options?.address_id || isAllowUnaddressOrderType)) || (isSoldOut || maxProductQuantity <= 0)) && (
                    <OButton
                        onClick={() => handleSaveProduct()}
                        imgRightSrc=""
                        text={`${orderState.loading
                            ? t('LOADING', 'Loading')
                            : (isSoldOut || maxProductQuantity <= 0)
                                ? t('SOLD_OUT', 'Sold out')
                                : editMode
                                    ? t('UPDATE', 'Update')
                                    : t('ADD', 'Add')
                            }`}
                        isDisabled={isSoldOut || maxProductQuantity <= 0 || (product?.minimum_per_order && ((productCart?.quantity + productAddedToCartLength) < product?.minimum_per_order)) || (product?.maximum_per_order && ((productCart?.quantity + productAddedToCartLength) > product?.maximum_per_order))}
                        textStyle={{
                            color: theme.colors.white,
                            fontSize: orderState.loading || editMode ? 10 : 14
                        }}
                        bgColor={buttonColor ? theme.colors.lightGray : theme.colors.primary}
                        borderColor={buttonColor ? theme.colors.lightGray : theme.colors.primary}
                        style={{
                            opacity: saveErrors || isSoldOut || maxProductQuantity <= 0 ? 0.3 : 1,
                            borderRadius: 7.6,
                            height: 44,
                            shadowOpacity: 0,
                            borderWidth: 1,
                            marginTop: isHaveWeight ? 10 : 0
                        }}
                    />
                )}
            {auth &&
                !orderState.options?.address_id && !isAllowUnaddressOrderType &&
                (orderState.loading ? (
                    <OButton
                        isDisabled
                        text={t('LOADING', 'Loading')}
                        imgRightSrc=""
                        textStyle={{ fontSize: 10 }}
                    />
                ) : (
                    <OButton onClick={() => navigation.navigate('AddressList')} />
                ))}
            {!auth && (
                <OButton
                    isDisabled={isSoldOut || maxProductQuantity <= 0}
                    onClick={() => handleRedirectLogin()}
                    text={
                        isSoldOut || maxProductQuantity <= 0
                            ? t('SOLD_OUT', 'Sold out')
                            : t('LOGIN_SIGNUP', 'Login / Sign Up')
                    }
                    imgRightSrc=""
                    textStyle={{ fontSize: 13, textAlign: 'center', color: theme.colors.primary }}
                    style={{
                        height: 42,
                        backgroundColor: theme.colors.white,
                        paddingLeft: 0,
                        paddingRight: 0
                    }}
                />
            )}
            {!auth && guestCheckoutEnabled && orderTypeEnabled && (
                <TouchableOpacity style={{ marginTop: 10 }} onPress={handleUpdateGuest}>
                    {actionStatus?.loading ? (
                        <Placeholder Animation={Fade}>
                            <PlaceholderLine height={20} />
                        </Placeholder>
                    ) : (
                        <OText color={theme.colors.primary} size={13} style={{ textAlign: 'center' }}>{t('AS_GUEST_USER', 'As guest user')}</OText>
                    )}
                </TouchableOpacity>
            )}
        </View>
    )
}
