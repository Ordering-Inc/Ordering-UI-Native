import React, { useState, useEffect } from 'react'
import moment from 'moment'
import {
	useLanguage,
	useConfig,
	useUtils,
	useOrder,
	MomentOption as MomentOptionController
} from 'ordering-components/native'
import { StyleSheet, View } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Spinner from 'react-native-loading-spinner-overlay';
import { MomentOptionParams } from '../../types'
import NavBar from '../NavBar'
import { OIcon, OText } from '../shared'
import { Container } from '../../layouts/Container'
import {
	HeaderTitle,
	WrapSelectOption,
	Days,
	Day,
	WrapHours,
	Hours,
	Hour,
	WrapDelveryTime,
	TimePickerWrapper
} from './styles'
import { useTheme } from 'styled-components/native'
import RNPickerSelect from 'react-native-picker-select'
import { Platform } from 'react-native'
import { useMemo } from 'react'

const MomentOptionUI = (props: MomentOptionParams) => {
	const {
		navigation,
		nopadding,
		datesList,
		hoursList,
		dateSelected,
		timeSelected,
		handleAsap,
		handleChangeDate,
		handleChangeTime
	} = props

	const theme = useTheme()

	const pickerStyle = StyleSheet.create({
		inputAndroid: {
			color: theme.colors.textSecondary,
			borderWidth: 1,
			borderColor: 'transparent',
			borderRadius: 3,
			paddingHorizontal: 20,
			paddingEnd: 30,
			backgroundColor: theme.colors.clear,
			fontSize: 14,
			lineHeight: 18,
			flexGrow: 1,
		},
		inputIOS: {
			color: theme.colors.textSecondary,
			paddingEnd: 25,
			paddingStart: 10,
			height: 28,
			borderWidth: 1,
			borderColor: 'transparent',
			borderRadius: 3,
			backgroundColor: theme.colors.clear,
			fontSize: 14,
			minHeight: 28,
			marginTop: 6
		},
		icon: {
			top: 6,
			right: 10,
			position: 'absolute',
		},
		viewContainer: {
			flex: 1
		},
		placeholder: {
			color: theme.colors.secundaryContrast
		}
	})

	const [, t] = useLanguage()
	const [{ configs }] = useConfig()
	const [{ parseTime }] = useUtils()
	const [orderState] = useOrder()
	const [optionSelected, setOptionSelected] = useState({ isAsap: false, isSchedule: false })
	const [momentState, setMomentState] = useState({ isLoading: 0, isEditing: false })
	const [isTimePicker, setOpenTimePicker] = useState(false);
	const [selectedPickerVal, setSelectedPickerVal] = useState(timeSelected);
	const [parsedHours, setParsedHours] = useState<Array<any>>([]);

	const goToBack = () => navigation?.canGoBack() && navigation.goBack()

	const _handleAsap = () => {
		setMomentState({ isLoading: 1, isEditing: true })
		handleAsap()
		setOptionSelected({ isAsap: true, isSchedule: false })
		if (!orderState.options?.moment) {
			setMomentState({ isLoading: 2, isEditing: false })
		}
	}

	const handleChangeMoment = (time: any) => {
		setMomentState({ isLoading: 1, isEditing: true })
		handleChangeTime(time)
	}

	const momento = moment(`${dateSelected} ${timeSelected}`, 'YYYY-MM-DD HH:mm').toDate()
	const momentUnix = momento.getTime() / 1000
	const momentFormat = moment.unix(momentUnix).utc().format('YYYY-MM-DD HH:mm:ss')

	useEffect(() => {
		if (orderState.options?.moment) {
			setOptionSelected({ isAsap: false, isSchedule: true })
		} else {
			setOptionSelected({ isAsap: true, isSchedule: false })
		}

		if (momentState.isEditing && (momentFormat === orderState.options?.moment || timeSelected === null)) {
			setMomentState({ isLoading: 2, isEditing: false })
		}
	}, [orderState.options?.moment])

	useEffect(() => {
		if (momentState.isLoading === 2 && !orderState?.loading && momentState.isEditing) {
			goToBack()
		}
	}, [momentState.isLoading])

	useEffect(() => {
		if (hoursList.length === parsedHours.length) return;
		if (hoursList?.length == 0) {
			setParsedHours([]);
			 return;
		}
		let tmpAry: Array<any> = [];
		hoursList.map((hour: any, i: number) => {
			const item = { label: '', value: hour?.startTime, key: `time_key_${i}` };
			item.label = configs?.format_time?.value === '12' ? (
				hour.startTime.includes('12')
					? `${hour.startTime}PM`
					: parseTime(moment(hour.startTime, 'HH:mm'), { outputFormat: 'hh:mma' })
			) : (
				parseTime(moment(hour.startTime, 'HH:mm'), { outputFormat: 'HH:mm' })
			)
			tmpAry.push(item);
		});
		setParsedHours(tmpAry);
	}, [hoursList]);

	return (
		<Container nopadding>
			<View style={{ paddingBottom: 10, paddingHorizontal: 40 }}>
				<NavBar
					onActionLeft={() => goToBack()}
					btnStyle={{ paddingLeft: 0 }}
					paddingTop={0}
					style={{ paddingBottom: 0 }}
					title={t('DELIVERY_TIME', 'Delivery time')}
				/>

				<WrapSelectOption
					onPress={() => _handleAsap()}
					disabled={orderState.loading}
				>
					{optionSelected.isAsap ? (
						<OIcon
							src={theme.images.general.radio_act}
							width={16}
							color={theme.colors.primary}
							style={styles.icon}
						/>
					) : (
						<OIcon
							src={theme.images.general.radio_nor}
							width={16}
							color={theme.colors.textSecondary}
							style={styles.icon}
						/>
					)}
					<OText size={12} lineHeight={18}>{t('ASAP_ABBREVIATION', 'ASAP')}</OText>
				</WrapSelectOption>
				<WrapSelectOption
					onPress={() => setOptionSelected({ isAsap: false, isSchedule: true })}
					disabled={orderState.loading}
				>
					{optionSelected.isSchedule ? (
						<OIcon
							src={theme.images.general.radio_act}
							width={16}
							color={theme.colors.primary}
							style={styles.icon}
						/>
					) : (
						<OIcon
							src={theme.images.general.radio_nor}
							width={16}
							color={theme.colors.textSecondary}
							style={styles.icon}
						/>
					)}
					<OText size={12} lineHeight={18}>{t('SCHEDULE_FOR_LATER', 'Schedule for later')}</OText>
				</WrapSelectOption>

				{optionSelected.isSchedule && (
					<WrapDelveryTime>
						<View style={{flexDirection: 'row', alignItems: 'center'}}>
							<OIcon src={theme.images.general.clock_history} width={16} color={theme.colors.primary} style={{marginEnd: 10}} />
							<OText size={14} lineHeight={21} color={theme.colors.textPrimary}>
								{t('CHOOSE_DELIVERY_TIME', 'Choose delivery time')}
							</OText>
						</View>
						{datesList.length > 0 && (
							<Days horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 40 }}>
								{
									datesList.slice(0, 6).map((date: any, i: any) => {
										const dateParts = date.split('-')
										const _date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
										const dayName = t('DAY' + (_date.getDay() >= 1 ? _date.getDay() : 7)).substring(0, 3).toUpperCase()
										const dayNumber = (_date.getDate() < 10 ? '0' : '') + _date.getDate()
										return (
											<Day
												key={dayNumber}
												onPress={() => handleChangeDate(date)}
												isActive={dateSelected === date && optionSelected.isSchedule}
											>
												<OText
													style={{textTransform: i === 0 ? 'capitalize' : 'uppercase'}}
													color={(dateSelected === date && optionSelected.isSchedule) ? theme.colors.white : theme.colors.primary}
												>{i === 0 ? t('TODAY', 'Today') : dayName}</OText>
												<OText
													style={theme.labels.small}
													color={(dateSelected === date && optionSelected.isSchedule) ? theme.colors.white : theme.colors.primary}
												>{moment(_date).format('MMMM D')}</OText>
											</Day>
										)
									})
								}
							</Days>
						)}

						{hoursList.length > 0 && optionSelected.isSchedule && (
							<>
								<TimePickerWrapper>
									<OIcon src={theme.images.general.clock} width={16} color={theme.colors.primary} />
									<RNPickerSelect
										onValueChange={(value) => setSelectedPickerVal(value)}
										items={parsedHours}
										placeholder={{}}
										style={pickerStyle}
										value={selectedPickerVal}
										onDonePress={() => handleChangeMoment(selectedPickerVal)}
										onOpen={() => setOpenTimePicker(true)}
										onClose={() => setOpenTimePicker(false)}
										useNativeAndroidPickerStyle={false}
										disabled={momentState.isLoading === 1 && !isTimePicker}
										Icon={() => null}
										touchableWrapperProps={{style: {flex: 1, zIndex: 1}}}
									/>
									<View style={pickerStyle.icon}><OIcon src={theme.images.general.drop_down} color={theme.colors.textSecondary} width={16} /></View>
								</TimePickerWrapper>
								{/* <WrapHours
									nestedScrollEnabled={true}
								>
									<Hours name='hours'>
										{
											hoursList.map((hour: any, i: any) => (
												<Hour
													key={i}
													onPress={() => handleChangeMoment(hour.startTime)}
													disabled={orderState.loading}
												>
													<OText color={timeSelected === hour.startTime ? theme.colors.primary : theme.colors.textSecondary}>
														{configs?.format_time?.value === '12' ? (
															hour.startTime.includes('12')
																? `${hour.startTime}PM`
																: parseTime(moment(hour.startTime, 'HH:mm'), { outputFormat: 'hh:mma' })
														) : (
															parseTime(moment(hour.startTime, 'HH:mm'), { outputFormat: 'HH:mm' })
														)}
													</OText>
												</Hour>
											))
										}
									</Hours>
								</WrapHours> */}
							</>
						)}
					</WrapDelveryTime>
				)}
			</View>
			<Spinner visible={momentState.isLoading === 1} />
		</Container>
	)
}

const styles = StyleSheet.create({
	icon: {
		marginRight: 10
	},
	dayNameStyle: {
		textTransform: 'uppercase'
	},
	selectStyle: {
		zIndex: 10
	}
})

export const MomentOption = (props: any) => {
	const momentOptionProps = {
		...props,
		UIComponent: MomentOptionUI
	}
	return <MomentOptionController {...momentOptionProps} />
}
