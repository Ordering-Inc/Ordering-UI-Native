import React from 'react'
import { useLanguage, useConfig } from 'ordering-components/native'
import { View, Platform, StyleSheet, Dimensions } from 'react-native'
import { HeaderTitle, OButton, OText } from '../shared'
import { SearchBar } from '../SearchBar';
import { NotFoundSource } from '../NotFoundSource'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import {
    SearchWrapper,
    BContainer,
} from './styles'
import { useTheme } from 'styled-components/native'

export const BusinessSearchHeader = (props: any) => {
    const {
        businessesSearchList,
        onChangeTermValue,
        termValue,
        handleOpenfilters
    } = props
    const theme = useTheme()
    const [, t] = useLanguage()
    const [{ configs }] = useConfig()

    const noResults = (!businessesSearchList.loading && !businessesSearchList.lengthError && businessesSearchList?.businesses?.length === 0)
    const isChewLayout = theme?.header?.components?.layout?.type?.toLowerCase() === 'chew'
    const hideBrowse = theme?.bar_menu?.components?.browse?.hidden

    const styles = StyleSheet.create({
        searchInput: {
            fontSize: 12,
            height: 44
        }
    });

    return (
        <>
            <View style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                {hideBrowse && !isChewLayout && (
                    <OButton
                        imgLeftStyle={{ width: 18 }}
                        imgRightSrc={null}
                        style={{
                            borderWidth: 0,
                            width: 26,
                            height: 26,
                            paddingLeft: 0,
                            paddingRight: 0,
                            marginTop: 50,
                        }}
                        useArrow
                        onClick={() => props.navigation.goBack()}
                        icon={AntDesignIcon}
                        iconProps={{
                            name: 'arrowleft',
                            size: 26
                        }}
                    />
                )}
                <HeaderTitle ph={20} text={t('SEARCH', 'Search')} />
                {configs?.filter_search_options?.value !== '' && (
                    <AntDesignIcon name='filter' size={18} style={{ marginLeft: 'auto', marginTop: Platform.OS === 'ios' ? 35 : 55, paddingHorizontal: 20 }} onPress={() => handleOpenfilters()} />
                )}
            </View>
            <BContainer
                style={{ paddingHorizontal: 20 }}
            >
                <SearchWrapper>
                    <SearchBar
                        lazyLoad
                        {...(isChewLayout && { height: 55 })}
                        inputStyle={{ ...styles.searchInput }}
                        placeholder={t('SEARCH_BUSINESSES', 'Search Businesses')}
                        onSearch={(val: string) => onChangeTermValue(val)}
                        value={termValue}
                    />
                </SearchWrapper>
                <OText size={12} lineHeight={20} color={theme.colors.textThird} mLeft={5}>
                    {t('TYPE_AT_LEAST_2_CHARACTERS', 'Type at least 2 characters')}
                </OText>
                {
                    noResults && (
                        <View>
                            <NotFoundSource
                                content={t('NOT_FOUND_BUSINESSES', 'No businesses to delivery / pick up at this address, please change filters or change address.')}
                            />
                        </View>
                    )
                }
            </BContainer>
        </>
    )
}
