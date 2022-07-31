import React from 'react'
import { Dimensions, View } from 'react-native'
import { OButton, OIcon, OText } from '../shared'
import { useLanguage, useSession } from 'ordering-components/native'
import { useTheme } from 'styled-components/native'

export const ScheduleBlocked = (props : any) => {
    const { nextSchedule } = props
    const [, t] = useLanguage()
    const [{ user }, {logout}] = useSession()
    const theme = useTheme()
    const deviceWidth = Dimensions.get('screen').width
    console.log(nextSchedule)

    const daysOfWeek = [
        t('MONDAY', 'Monday'),
        t('TUESDAY', 'Tuesday'),
        t('WEDNESDAY', 'Wednesday'),
        t('THURSDAY', 'Thurday'),
        t('FRIDAY', 'Friday'),
        t('SATURDAY', 'Saturday'),
        t('SUNDAY', 'Sunday')
    ]

    const scheduleFormatted = ({ hour, minute }: any) => {
        const checkTime = (val: number) => val < 10 ? `0${val}` : val
        return `${checkTime(hour)}:${checkTime(minute)}`
    }

    const goBack = () => {
        logout()
    }

    return (
        <View style={{ alignItems: 'center', padding: 40 }}>
            <OText size={20}>{t('YOU_CANT_LOGIN', 'You can\'t login')}</OText>
            <OIcon
                src={theme.images?.general?.deliveryWaiting}
                width={(deviceWidth - 80) * 0.9}
                height={(deviceWidth - 80) * 0.8}
            />
            <OText>{t('OUTSIDE_ESTABLISHED_SCHEDULE', 'You are outside the established schedule')}</OText>
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                <OText color={theme.colors.primary}>{t('NEXT_TIME', 'Next time')}: </OText>
                <OText>{daysOfWeek[nextSchedule?.day - 1]} {scheduleFormatted(nextSchedule?.schedule?.open)}</OText>
            </View>
            <OButton
                text={t('GO_BACK', 'Go back')}
                textStyle={{ color: theme.colors.white }}
                onClick={goBack}
            />
        </View>
    )
}
