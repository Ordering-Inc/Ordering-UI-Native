import React from 'react'
import { TouchableOpacity } from 'react-native';
import { useTheme } from 'styled-components/native';
import { OText } from '../shared';

export const ExtraOptions = (props : any) => {
    const {
        options,
        setSelectedOpt,
        scrollViewRef,
        optionLayout,
        editionsLayoutY,
        styles,
        selOpt
    } = props

    const theme = useTheme()

    return (
        <>
            {options.map(({ id, name, respect_to, suboptions }: any) => (
                <React.Fragment key={`cont_key_${id}`}>
                    {respect_to == null && suboptions?.length > 0 && (
                        <TouchableOpacity
                            key={`eopt_key_${id}`}
                            onPress={() => {
                                setSelectedOpt(id)
                                scrollViewRef?.current?.scrollTo && scrollViewRef.current.scrollTo({
                                    y: optionLayout[`id:${id}`]?.y + editionsLayoutY - 50,
                                    animated: true
                                })
                            }}
                            style={[
                                styles.extraItem,
                                {
                                    borderBottomColor:
                                        selOpt == id ? theme.colors.textNormal : theme.colors.backgroundPage,
                                },
                            ]}>
                            <OText
                                color={
                                    selOpt == id ? theme.colors.textNormal : theme.colors.textSecondary
                                }
                                size={12}
                                weight={selOpt == id ? '600' : 'normal'}
                                style={{ maxWidth: 150 }}
                                numberOfLines={1}>
                                {name}
                            </OText>
                        </TouchableOpacity>
                    )}
                </React.Fragment>
            ))}
        </>
    )
}
