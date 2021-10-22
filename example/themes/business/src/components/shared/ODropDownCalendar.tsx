import React, { useState, useEffect } from 'react'
import styled, { css, useTheme } from 'styled-components/native'
import { useLanguage } from 'ordering-components/native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { ScrollView as CustomScrollView, TouchableOpacity as CustomTouchableOpacity, View, useWindowDimensions } from 'react-native'
import FeatherIcon from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Text } from 'react-native-paper';
import { OInput, OIcon } from '../shared';
import CalendarPicker from 'react-native-calendar-picker';
import moment, { Moment } from 'moment';

interface Props {
  secondary?: boolean,
  options?: any;
  defaultValue?: any,
  placeholder?: string,
  onSelect?: any,
  style?: any,
  dropViewMaxHeight?: any,
  isModal?: any,
  bgcolor?: string,
  textcolor?: string,
  isCalendar?: boolean,
  handleChangeDate?: any,
  rangeDate?: any
}

const Wrapper = styled.View`
  position: relative;
`
const Selected = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding: 15px;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${(props: any) => props.bgcolor || (props.secondary ? props.theme.colors.lightGray : props.theme.colors.primary)};
  background-color: ${(props: any) => props.bgcolor || (props.secondary ? props.theme.colors.white : props.theme.colors.primary)};
`
const SelectedLabel = styled.Text`
  font-size: 16px;
  color: ${(props: any) => props.textcolor || (props.secondary ? props.theme.colors.black : props.theme.colors.white)};
`

const DropView = styled.View`
  position: absolute;
  z-index: 9999;
  top: 60px;
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.lightGray};
  background-color: ${(props: any) => props.theme.colors.white};
  border-radius: 7.6px;
  padding-left: 10px;
  padding-right: 10px;
  width: 100%;
`
const DropOption = styled.View`
  padding: 15px;
  font-size: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.lightGray};
  flex-direction: row;
  align-items: center;
`

const DateInput = styled.TextInput`
  flex-grow: 1;
  flex: 1;
  min-height: 36px;
  font-size: 12px;
  font-family: 'Poppins-Regular';
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.tabBar};
  padding: 7px 14px;
  color: ${(props: any) => props.theme.colors.backArrow};
  ${({ active }: { active: boolean }) => active && css`
    border-color: ${(props: any) => props.theme.colors.primary};
  `}
`;

const ODropDownCalendar = (props: Props) => {
  const {
    secondary,
    options,
    defaultValue,
    placeholder,
    onSelect,
    dropViewMaxHeight,
    isModal,
    isCalendar,
    handleChangeDate,
    rangeDate
  } = props

  const theme = useTheme();
  const { width } = useWindowDimensions();
  const [, t] = useLanguage();

  const [isOpen, setIsOpen] = useState(false)
  const defaultOption = options?.find((option: any) => option.value === defaultValue)
  const [selectedOption, setSelectedOption] = useState<any>(defaultOption)
  const [value, setValue] = useState(defaultValue)
  // const [startDate, setStartDate] = useState('')
  // const [endDate, setEndDate] = useState('')

  const onToggle = () => {
    setIsOpen(!isOpen)
  }

  const onSelectOption = (option: any) => {
    setSelectedOption(option)
    setValue(option.value)
    onSelect(option.name || option.value)
    setIsOpen(false)
  }

  const onDateChange = (date: any, type: any) => {
    if (!date) return
    if (type === 'END_DATE') {
      handleChangeDate(rangeDate.from, date.format('MM/DD/YY'))
    } else {
      handleChangeDate(date.format('MM/DD/YY'), '')
    }
  }

  const customDayHeaderStylesCallback = () => {
		return {
			textStyle: {
				color: theme.colors.unselectText,
				fontSize: 12,
			},
		};
	};

  const calendarText = (from: any, to: any, placeholder: any) => {
    console.log(from, 'this is from')
    const end = ` -${to}`
    const str = (from || to) ? (from + (to ? end : '')) : placeholder
    console.log(str)
    return str
  }

  useEffect(() => {
    const _defaultOption = options?.find((option: any) => option.value === defaultValue)
    setSelectedOption(_defaultOption)
    setValue(defaultValue)
  }, [defaultValue, options])

  return (
    <Wrapper style={props.style}>
      <Selected
        secondary={secondary}
        bgcolor={props.bgcolor}
        onPress={() => onToggle()}
      >
        <SelectedLabel
          secondary={secondary}
          textcolor={props.textcolor}
        >
          {
            defaultValue === 'calendar'
              ? `${calendarText(rangeDate.from, rangeDate.to, placeholder)}`
              : `${selectedOption?.content || selectedOption?.name || placeholder}`
          }
        </SelectedLabel>
        <FeatherIcon
          name='calendar'
          color={theme.colors.backArrow}
          size={24}
        />
      </Selected>
      {isOpen && options && (
        <DropView
          secondary={secondary}
        >
          {!isModal ? (
            <ScrollView style={{
              maxHeight: dropViewMaxHeight || null
            }}
            >
              {options.map((option: any, index: number) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => onSelectOption(option)}
                >
                  <View style={{ marginRight: 10 }}>
                    {value === option.value ? (
                      <MaterialCommunityIcons
                        name='radiobox-marked'
                        size={24}
                        color={theme.colors.primary}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name='radiobox-blank'
                        size={24}
                        color={theme.colors.primary}
                      />
                    )}
                  </View>
                  <Text>{option.content || option.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <CustomScrollView style={{
              maxHeight: dropViewMaxHeight || null
            }}
            >
              {options.map((option: any, index: number) => (
                <CustomTouchableOpacity
                  key={index}
                  onPress={() => onSelectOption(option)}
                >
                  <DropOption
                    numberOfLines={1}
                    selected={value === option.value}
                  >
                    <View style={{ marginRight: 10 }}>
                      {value === option.value ? (
                        <MaterialCommunityIcons
                          name='radiobox-marked'
                          size={24}
                          color={theme.colors.primary}
                        />
                      ) : (
                        <MaterialCommunityIcons
                          name='radiobox-blank'
                          size={24}
                          color={theme.colors.arrowColor}
                        />
                      )}
                    </View>
                    <Text>{option.content || option.name}</Text>
                  </DropOption>
                </CustomTouchableOpacity>
              ))}
              {isCalendar && (
                <>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10
                  }}>
                    <View style={{marginRight: 10, flex: 1, marginBottom: 15}}>
                      <Text style={{marginBottom: 5}}>{t('FROM', 'From')}</Text>
                      <DateInput
                        value={rangeDate.from}
                        placeholder={t('FROM', 'From')}
                        autoCorrect={false}
                        style={{
                          borderRadius: 7.6
                        }}
                        active={defaultValue === 'calendar'}
                        onFocus={() => onSelect('calendar')}
                      />
                      <AntDesign
                        name='close'
                        color={theme.colors.disabled}
                        size={20}
                        style={{position: 'absolute', bottom: 13, right: 10}}
                        onPress={() => handleChangeDate('', rangeDate.to)}
                      />
                    </View>
                    <View style={{marginLeft: 10, flex: 1, marginBottom: 15}}>
                      <Text style={{marginBottom: 5}}>{t('TO', 'To')}</Text>
                      <DateInput
                        value={rangeDate.to}
                        placeholder={t('TO', 'To')}
                        autoCorrect={false}
                        style={{
                          borderRadius: 7.6
                        }}
                        active={defaultValue === 'calendar'}
                        onFocus={() => onSelect('calendar')}
                      />
                      <AntDesign
                        name='close'
                        color={theme.colors.disabled}
                        size={20}
                        style={{position: 'absolute', bottom: 13, right: 10}}
                        onPress={() => handleChangeDate(rangeDate.from, '')}
                      />
                    </View>
                  </View>
                  {
                    defaultValue === 'calendar' && (
                      <CalendarPicker
                        previousComponent={
                          <FeatherIcon
                            name='chevron-left'
                            color={theme.colors.disabled}
                            size={24}
                            style={{ marginHorizontal: 4 }}
                          />
                        }
                        nextComponent={
                          <FeatherIcon
                            name='chevron-right'
                            color={theme.colors.disabled}
                            size={24}
                            style={{ marginHorizontal: 4 }}
                          />
                        }
                        width={width - 80}
                        startFromMonday={true}
                        allowRangeSelection={true}
                        selectedDayTextColor={theme.colors.textGray}
                        selectedDayColor={theme.colors.forgotText}
                        todayBackgroundColor={theme.colors.border}
                        dayLabelsWrapper={{ borderColor: theme.colors.clear }}
                        onDateChange={onDateChange}
                        customDayHeaderStyles={customDayHeaderStylesCallback}
                      />
                    )
                  }

                </>
              )}
            </CustomScrollView>
          )}
        </DropView>
      )}
    </Wrapper>
  )
}

export default ODropDownCalendar
