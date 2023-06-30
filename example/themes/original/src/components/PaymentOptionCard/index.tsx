import React, { useEffect, useRef, useState } from 'react'
import { View, Modal, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { OButton, OIcon, OInput, OModal, OText } from '../shared'
import { PaymentOptionStripe, useLanguage, useSession } from 'ordering-components/native'
import { StripeCardsListUI } from '../StripeCardsList'
import { useTheme } from 'styled-components/native';
import { CreditCardInput } from "react-native-credit-card-input-plus";
import Alert from '../../providers/AlertProvider'

const PaymentOptionCardUI = (props: any) => {
    const {
        cardSelected,
        deleteCard,
        onSelectCard,
        handleCardClick,
        cardsList,
        addCardOpen,
        setAddCardOpen,
        gateway,
        handleNewCard,
        paymethodsWithoutSaveCards
    } = props
    const [, t] = useLanguage()
    const theme = useTheme()
    const [{ token }] = useSession()
    const [alertState, setAlertState] = useState<{ open: boolean, content: Array<string> }>({ open: false, content: [] })
    const [newCard, setNewCard] = useState<any>(null)

    const onChangeCardForm = (values: any) => {
        if (values?.valid) {
            const expiry = values?.values?.expiry?.split('/')
            const expiryMonth = expiry[0]
            const expiryYear = expiry[1]
            const expiryString = expiryMonth + expiryYear
            let lastFourDigits = values?.values?.number?.substr(-4);
            setNewCard({
                name: values?.values.name,
                number: values?.values.number.replace(/\s/g, ''),
                cvc: values?.values.cvc,
                expiryMonth: expiryMonth,
                expiryYear: expiryYear,
                expiry: expiry,
                brand: values?.values?.type,
                last4: lastFourDigits,
                expiryString: expiryString
            })
        }
    }

    const handleAddNewCard = () => {
        handleNewCard(newCard)
        setAddCardOpen({ ...addCardOpen, card: false })
        setNewCard(null)
    }

    useEffect(() => {
        if (cardsList.error && !cardsList.loading) {
            setAlertState({
                open: true,
                content: cardsList.error
            })
        }
    }, [JSON.stringify(cardsList)])

    const style = StyleSheet.create({
        wrapperIcon: {
            marginLeft: 25,
            marginTop: Platform.OS === 'ios' ? 40 : 12,
            marginBottom: 20,
            alignItems: 'center',
            justifyContent: 'center',
        },
        buttonStyle: {
            marginVertical: 20,
            borderRadius: 7.6,
            shadowOpacity: 0,
            height: 44,
            borderWidth: 1
        }
    })

    return (
        <View>
            <>
                {token && (!cardSelected || !paymethodsWithoutSaveCards.includes(gateway)) && (
                    <OButton
                        text={t('ADD_PAYMENT_CARD', 'Add New Payment Card')}
                        bgColor={theme.colors.white}
                        borderColor={theme.colors.primary}
                        style={{
                            marginVertical: 20,
                            borderRadius: 7.6,
                            shadowOpacity: 0,
                            height: 44,
                            borderWidth: 1
                        }}
                        textStyle={{ color: theme.colors.primary, fontSize: 12 }}
                        imgRightSrc={null}
                        onClick={() => setAddCardOpen({ ...addCardOpen, card: true })}
                    />
                )}
                <StripeCardsListUI
                    cardSelected={cardSelected}
                    deleteCard={deleteCard}
                    onSelectCard={onSelectCard}
                    handleCardClick={handleCardClick}
                    cardsList={cardsList}
                    noShowErrors
                    gateway={gateway}
                    onOpen={() => setAddCardOpen({ ...addCardOpen, stripe: true })}
                    onCancel={() => setAddCardOpen({ ...addCardOpen, stripe: false })}
                />
            </>
            <Modal
                animationType="slide"
                visible={addCardOpen?.card}
                onDismiss={() => setAddCardOpen({ ...addCardOpen, card: false })}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{
                        flex: 1,
                    }}
                >
                    <ScrollView>
                        <TouchableOpacity onPress={() => setAddCardOpen({ ...addCardOpen, card: false })}>
                            <OIcon
                                src={theme.images.general.close}
                                width={16}
                                style={style.wrapperIcon}
                            />
                        </TouchableOpacity>
                        <>
                            <CreditCardInput
                                onChange={onChangeCardForm}
                                requiresName
                            />
                            {alertState?.content?.[0] && !cardsList?.loading && (
                                <OText
                                    color={theme?.colors?.error}
                                    style={{
                                        alignSelf: 'center'
                                    }}
                                    size={20}
                                >
                                    {alertState.content[0]}
                                </OText>
                            )}
                            <OButton
                                text={t('ADD_CARD', 'Add card')}
                                isDisabled={!newCard || cardsList?.loading}
                                isLoading={cardsList?.loading}
                                onClick={() => handleAddNewCard()}
                                style={{
                                    margin: 20,
                                    ...style.buttonStyle
                                }}
                            />
                        </>
                    </ScrollView>
                </KeyboardAvoidingView>
            </Modal>
            <Alert
                open={alertState?.open || false}
                title=''
                content={alertState.content}
                onClose={() => setAlertState({ open: false, content: [] })}
                onAccept={() => setAlertState({ open: false, content: [] })}
            />
        </View>
    )
}

export const PaymentOptionCard = (props: any) => {
    const paymentOptions = {
        ...props,
        UIComponent: PaymentOptionCardUI
    }
    return (
        <PaymentOptionStripe {...paymentOptions} />
    )
}
