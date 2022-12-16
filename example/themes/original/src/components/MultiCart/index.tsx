import React from 'react'
import { ChAddress, ChContainer, ChSection, ChUserDetails, DeliveryOptionsContainer } from '../Checkout/styles'
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder'
import { Container } from '../../layouts/Container';
import { View, StyleSheet } from 'react-native'
import { useTheme } from 'styled-components/native';
import { MultiCartCreate } from 'ordering-components/native'

export const MultiCartUI = () => {
    const theme = useTheme();

    const styles = StyleSheet.create({
        pagePadding: {
            paddingHorizontal: 40
        }
    })

    return (
        <>
            <Container noPadding>
                <ChContainer style={styles.pagePadding}>
                    <ChSection>
                        <ChUserDetails>
                            <Placeholder Animation={Fade}>
                                <PlaceholderLine height={20} />
                                <PlaceholderLine height={12} />
                                <PlaceholderLine height={12} />
                                <PlaceholderLine height={12} style={{ marginBottom: 20 }} />
                            </Placeholder>
                        </ChUserDetails>
                        <View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginHorizontal: -40 }} />
                    </ChSection>
                    <DeliveryOptionsContainer>
                        <View style={{ height: 110 }}>
                            <Placeholder Animation={Fade}>
                                <PlaceholderLine height={20} />
                                <PlaceholderLine height={40} />
                            </Placeholder>
                        </View>
                    </DeliveryOptionsContainer>
                    <ChSection>
                        <ChAddress>
                            <Placeholder Animation={Fade}>
                                <PlaceholderLine height={20} style={{ marginBottom: 50 }} />
                                <PlaceholderLine height={100} />
                            </Placeholder>
                        </ChAddress>
                        <View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginTop: 13, marginHorizontal: -40 }} />
                    </ChSection>
                </ChContainer>
            </Container>

        </>
    )
}

export const MultiCart = (props : any) => {
    const mulcartProps = {
        ...props,
        UIComponent: MultiCartUI
    }
    return <MultiCartCreate {...mulcartProps} />
}
