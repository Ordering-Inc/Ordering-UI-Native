import React from 'react'
import { Pressable } from 'react-native'
import {
    TimeItem,
} from './styles'
import { OIcon, OText } from '../shared'
import { useTheme } from 'styled-components/native'

const timeListItemPropsAreEqual = (prevProps: any, nextProps: any) => {
    return JSON.stringify(prevProps.time) === JSON.stringify(nextProps.time) && 
    JSON.stringify(prevProps.selectedTime) === JSON.stringify(nextProps.selectedTime) &&
    JSON.stringify(prevProps.cateringPreorder) === JSON.stringify(nextProps.cateringPreorder)
}
export const TimeListItem = React.memo((props : any) => {
    const {
        time,
        selectedTime,
        handleChangeTimeSelected,
        cateringPreorder
    } = props
    const theme = useTheme()

    return (
        <Pressable onPress={() => handleChangeTimeSelected(time.value)}>
            <TimeItem
                active={selectedTime === time.value}
                cateringPreorder={cateringPreorder}
            >
                {cateringPreorder && (
                    <>
                        {selectedTime === time.value ? (
                            <OIcon
                                src={theme.images.general.option_checked}
                                width={18}
                                style={{ marginEnd: 24, bottom: 2 }}
                            />
                        ) : (
                            <OIcon
                                src={theme.images.general.option_normal}
                                width={18}
                                style={{ marginEnd: 24, bottom: 2 }}
                            />
                        )}
                    </>
                )}
                <OText
                    size={cateringPreorder ? 18 : 16}
                    color={selectedTime === time.value ? theme.colors.primary : theme.colors.textNormal}
                    style={{
                        lineHeight: 24
                    }}
                >{time.text} {cateringPreorder && `- ${time.endText}`}</OText>
            </TimeItem>
        </Pressable>
    )
}, timeListItemPropsAreEqual)
