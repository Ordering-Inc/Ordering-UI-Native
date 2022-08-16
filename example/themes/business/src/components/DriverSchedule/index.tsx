import React, { useState } from 'react'
import { RefreshControl, ScrollView, View } from 'react-native'
import { OText } from '../shared'
import { useLanguage, useSession } from 'ordering-components/native'
import { DayContainer } from './styles'
import { useTheme } from 'styled-components/native'
export const DriverSchedule = (props: any) => {
    const { schedule } = props
    const [, t] = useLanguage()
    const theme = useTheme()
    const [, { refreshUserInfo }] = useSession()
    const [refreshing] = useState(false);

    const daysOfWeek = [
        t('SUNDAY_ABBREVIATION', 'Sun'),
        t('MONDAY_ABBREVIATION', 'Mon'),
        t('TUESDAY_ABBREVIATION', 'Tues'),
        t('WEDNESDAY_ABBREVIATION', 'Wed'),
        t('THURSDAY_ABBREVIATION', 'Thur'),
        t('FRIDAY_ABBREVIATION', 'Fri'),
        t('SATURDAY_ABBREVIATION', 'Sat')
    ]

    const scheduleFormatted = ({ hour, minute }: any) => {
        const checkTime = (val: number) => val < 10 ? `0${val}` : val
        return `${checkTime(hour)}:${checkTime(minute)}`
    }

    return (
        <ScrollView
            refreshControl={<RefreshControl
                refreshing={refreshing}
                onRefresh={() => refreshUserInfo()}
            />}
        >
            <OText size={24} style={{ paddingLeft: 30 }}>
                {t('SCHEDULE', 'Schedule')}
            </OText>
            <View style={{ padding: 30 }}>
                {schedule.map((item: any, i: number) => (
                    <DayContainer key={daysOfWeek[i]}>
                        <OText style={{ width: '20%' }} size={22} weight={700}>{daysOfWeek[i]}</OText>
                        <View style={{ width: '80%', alignItems: 'center' }}>
                            <>
                                {item?.enabled ? (
                                    <View>
                                        {item?.lapses.map((lapse: any, i: number) => (
                                            <View key={`${daysOfWeek[i]}_${i}`} style={{ marginTop: 3, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <OText size={18} style={{ width: '30%' }}>
                                                    {scheduleFormatted(lapse.open)}
                                                </OText>
                                                <OText size={18} style={{ width: 15 }}>
                                                    -
                                                </OText>
                                                <OText size={18} style={{ width: '30%' }}>
                                                    {scheduleFormatted(lapse.close)}
                                                </OText>
                                            </View>
                                        ))}
                                    </View>
                                ) : (
                                    <OText size={18} style={{ marginTop: 3, marginBottom: 10 }} color={theme.colors.red}>{t('NOT_AVAILABLE', 'Not available')}</OText>
                                )}
                            </>
                        </View>
                    </DayContainer>
                ))}
            </View>
        </ScrollView>
    )
}
