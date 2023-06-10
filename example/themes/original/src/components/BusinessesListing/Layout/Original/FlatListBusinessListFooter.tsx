import React from 'react'
import { ListWrapper } from './styles'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'
import { View } from 'react-native'

export const FlatListBusinessListFooter = (props : any) => {
    const {
        businessesList,
        paginationProps,
        isChewLayout
    } = props
    return (
        <>
            <ListWrapper style={{ paddingHorizontal: 20 }}>
                {(businessesList.loading || !businessesList?.fetched) && (
                    <>
                        {[
                            ...Array(
                                paginationProps.nextPageItems
                                    ? paginationProps.nextPageItems
                                    : 8,
                            ).keys(),
                        ].map((item, i) => (
                            <Placeholder
                                Animation={Fade}
                                key={i}
                                style={{ marginBottom: 20 }}>
                                <View style={{ width: '100%' }}>
                                    <PlaceholderLine
                                        height={200}
                                        style={{ marginBottom: 20, borderRadius: 25 }}
                                    />
                                    <View style={{ paddingHorizontal: 10 }}>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                            }}>
                                            <PlaceholderLine
                                                height={25}
                                                width={40}
                                                style={{ marginBottom: 10 }}
                                            />
                                            <PlaceholderLine
                                                height={25}
                                                width={20}
                                                style={{ marginBottom: 10 }}
                                            />
                                        </View>
                                        <PlaceholderLine
                                            height={20}
                                            width={30}
                                            style={{ marginBottom: 10 }}
                                        />
                                        <PlaceholderLine
                                            height={20}
                                            width={80}
                                            style={{ marginBottom: 10 }}
                                        />
                                    </View>
                                </View>
                            </Placeholder>
                        ))}
                    </>
                )}
            </ListWrapper>
        </>
    )
}
