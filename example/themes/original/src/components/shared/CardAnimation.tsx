import React, { useState } from 'react'
import { StyleSheet, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

const CardContainerTouchable = styled.TouchableOpacity``

interface Props {
    children: React.ReactChildren | Element,
    style?: Array<ViewStyle> | any,
    onClick: any
}

export const CardAnimation = (props : Props) => {
    const {
        children,
        onClick,
        style
    } = props
    const [isPressed, setIsPressed] = useState(false)
    const styles = StyleSheet.create({
        cardAnimation: {
            elevation: isPressed ? 2 : 0,
            shadowColor: '#888',
            shadowOffset: { width: 0, height: isPressed ? 2 : 0 },
            shadowRadius: 18,
            shadowOpacity: isPressed ? 0.8 : 0,
            borderRadius: 12,
        }
    })

    const styleProvided = style || []
    return (
        <CardContainerTouchable
            onPress={onClick}
            activeOpacity={0.8}
            delayPressIn={20}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            style={[
                ...styleProvided,
                styles.cardAnimation
            ]}
        >
            {children}
        </CardContainerTouchable>
    )
}
