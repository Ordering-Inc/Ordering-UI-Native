import React, { useState } from 'react'
import { Dimensions, View, StyleSheet } from 'react-native'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'
import { OButton } from '../shared'
import { useTheme } from 'styled-components/native'
import { useLanguage } from 'ordering-components/native'

export const FooterComponent = (props : any) => {
    const {
        loading,
        reload,
        pagination,
        tabsFilter,
        tabs,
        loadMore
    } = props

    const theme = useTheme()
    const [, t] = useLanguage()

    const [orientation, setOrientation] = useState(
        Dimensions.get('window').width < Dimensions.get('window').height
            ? 'Portrait'
            : 'Landscape',
    );

    Dimensions.addEventListener('change', ({ window: { width, height } }) => {
        if (width < height) {
            setOrientation('Portrait');
        } else {
            setOrientation('Landscape');
        }
    });

    const styles = StyleSheet.create({
        loadButton: {
            borderRadius: 7.6,
            height: 44,
            marginRight: 10,
            marginBottom: 10,
            marginTop: 5,
        },
        loadButtonText: {
            color: theme.colors.white,
            fontFamily: 'Poppins',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: 18,
        },
    })

    return (
        <>
            {(loading || reload) && (
                <>
                    <View>
                        {[...Array(5)].map((item, i) => (
                            <Placeholder key={i} Animation={Fade}>
                                <View
                                    style={{
                                        width: '100%',
                                        flexDirection: 'row',
                                        marginBottom: 10,
                                    }}>
                                    <PlaceholderLine
                                        width={orientation === 'Portrait' ? 22 : 11}
                                        height={74}
                                        style={{
                                            marginRight: 20,
                                            marginBottom: 20,
                                            borderRadius: 7.6,
                                        }}
                                    />
                                    <Placeholder>
                                        <PlaceholderLine width={30} style={{ marginTop: 5 }} />
                                        <PlaceholderLine width={50} />
                                        <PlaceholderLine width={20} />
                                    </Placeholder>
                                </View>
                            </Placeholder>
                        ))}
                    </View>
                </>
            )}

            {pagination?.totalPages &&
                !loading &&
                !reload &&
                JSON.stringify(tabsFilter) === JSON.stringify(tabs[0].tags) &&
                pagination?.currentPage < pagination?.totalPages && (
                    <OButton
                        onClick={() => loadMore && loadMore()}
                        text={t('LOAD_MORE_ORDERS', 'Load more orders')}
                        imgRightSrc={null}
                        textStyle={styles.loadButtonText}
                        style={styles.loadButton}
                        bgColor={theme.colors.primary}
                        borderColor={theme.colors.primary}
                    />
                )}
        </>
    )
}
