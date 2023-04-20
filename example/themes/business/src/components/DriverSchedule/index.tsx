import React, { useEffect, useState } from 'react'
import { RefreshControl, ScrollView, View } from 'react-native'
import { OText } from '../shared'
import { useLanguage, useSession, useUtils } from 'ordering-components/native'
import { DayContainer } from './styles'
import { useTheme } from 'styled-components/native'
export const DriverSchedule = (props: any) => {
    const { schedule } = props
    const [, t] = useLanguage()
    const theme = useTheme()
    const [, { refreshUserInfo }] = useSession()
    const [{ parseDate }] = useUtils()
    const [refreshing] = useState(false);
    const [driverSchedule, setDriverSchedule] = useState([]);

    const daysOfWeek = [
        t('SUNDAY_ABBREVIATION', 'Sun'),
        t('MONDAY_ABBREVIATION', 'Mon'),
        t('TUESDAY_ABBREVIATION', 'Tues'),
        t('WEDNESDAY_ABBREVIATION', 'Wed'),
        t('THURSDAY_ABBREVIATION', 'Thur'),
        t('FRIDAY_ABBREVIATION', 'Fri'),
        t('SATURDAY_ABBREVIATION', 'Sat')
    ]

    const getNextDate = (day) => {
        const now = new Date()
        now.setDate(now.getDate() + (day + (7 - now.getDay())) % 7)
        return now
      }

    const scheduleFormatted = ({ hour, minute }: any) => {
        const checkTime = (val: number) => val < 10 ? `0${val}` : val
        return `${checkTime(hour)}:${checkTime(minute)}`
    }

    useEffect(() => {
        if (schedule) {
            setDriverSchedule(schedule)
        } else {
            const _schedule: any = []
            for (let i = 0; i < 7; i++) {
                _schedule.push({
                enabled: true,
                lapses: [
                  {
                    open: {
                      hour: 0,
                      minute: 0
                    },
                    close: {
                      hour: 23,
                      minute: 59
                    }
                  }
                ]
              })
            }
            setDriverSchedule(_schedule)
        }
    }, [schedule])

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
                {driverSchedule.map((item: any, i: number) => (
                    <DayContainer key={daysOfWeek[i]}>
                        <View style={{ width: '30%' }}>
                            <OText size={22} weight={700}>{daysOfWeek[i]}</OText>
                            <OText size={14}>{parseDate(getNextDate(i), { outputFormat: 'YYYY-MM-DD' })}</OText>
                        </View>
                        <View style={{ width: '70%', alignItems: 'center' }}>
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
