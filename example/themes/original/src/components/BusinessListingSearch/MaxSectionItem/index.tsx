import { useLanguage, useUtils } from 'ordering-components/native'
import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { OText } from '../../shared'

import { ProgressContentWrapper, ProgressBar } from './styles'

export const MaxSectionItem = (props: any) => {
    const {
        filters,
        handleChangeFilters,
        title,
        options,
        filter
    } = props

    const [, t] = useLanguage()
    const [{ parsePrice }] = useUtils();

    const styles = StyleSheet.create({
        maxContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        }
    });

    const parseValue = (option: number) => {
        return filter === 'max_distance'
            ? `${option / 1000} ${t('KM', 'Km')}`
            : filter === 'max_eta'
                ? `${option} ${t('TIME_MINUTES', 'min')}`
                : parsePrice(option)
    }
    return (
        <View style={{ marginBottom: 20 }}>
            <OText weight='bold' mBottom={10} size={16}>
                {title}
            </OText>
            <ProgressContentWrapper>
                <ProgressBar style={{ width: `${((options.indexOf(filters?.[filter]) / 3) * 100) ?? 100}%` }} />
            </ProgressContentWrapper>
            <View style={styles.maxContainer}>
                {options.map((option: any, i: number) => (
                    <TouchableOpacity
                        onPress={() => handleChangeFilters(filter, option)}
                        key={option}
                    >
                        <OText
                            size={12}
                            weight={filters?.[filter] === option || (option === 'default' && (filters?.[filter] === 'default' || !filters?.[filter])) ? 'bold' : '500'}
                        >
                            {option === 'default' ? `${parseValue(options[i - 1])}+` : parseValue(option)}
                        </OText>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    )
}
