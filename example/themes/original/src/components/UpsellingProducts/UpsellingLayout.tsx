import React from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import {
    useUtils,
    useLanguage
} from 'ordering-components/native'
import {
    Container,
    UpsellingContainer,
    Item,
    Details,
    AddButton,
} from './styles'
import { OIcon, OText } from '../shared'
import { useTheme } from 'styled-components/native';

export const UpsellingLayout = (props : any) => {
    const {
        upsellingProducts,
        productsList,
        onNavigationRedirect,
        business
    } = props
    const theme = useTheme()
    const [{ parsePrice }] = useUtils()
    const [, t] = useLanguage()

    const styles = StyleSheet.create({
        imageStyle: {
            width: 73,
            height: 73,
            resizeMode: 'cover',
            borderRadius: 7.6,
        },
    })

    const handleFormProduct = (product: any) => {
        onNavigationRedirect && onNavigationRedirect('ProductDetails', {
            product: product,
            businessId: product?.api?.businessId,
            businessSlug: business.slug,
        })
    }


    return (
        <>
            <Container>
                <UpsellingContainer
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: Platform.OS === 'ios' ? 40 : 0 }}
                >
                    {
                        !upsellingProducts.loading && (
                            <>
                                {
                                    !upsellingProducts.error ? productsList.map((product: any, i: number) => (
                                        <Item key={`${product.id}_${i}`}>
                                            <View style={{ flexBasis: '57%' }}>
                                                <Details>
                                                    <OText size={12} lineHeight={18} numberOfLines={1} ellipsizeMode='tail'>{product.name}</OText>
                                                    <OText size={12} lineHeight={18} color={theme.colors.textNormal}>{parsePrice(product.price)}</OText>
                                                </Details>
                                                <AddButton onPress={() => handleFormProduct(product)}>
                                                    <OText size={10} color={theme.colors.primary}>{t('ADD', 'Add')}</OText>
                                                </AddButton>
                                            </View>
                                            <View>
                                                <OIcon url={product?.images || theme?.images?.dummies?.product} style={styles.imageStyle} />
                                            </View>
                                        </Item>
                                    )) : (
                                        <OText>
                                            {upsellingProducts.message}
                                        </OText>
                                    )
                                }
                            </>
                        )
                    }
                </UpsellingContainer>
            </Container>
        </>
    )
}
