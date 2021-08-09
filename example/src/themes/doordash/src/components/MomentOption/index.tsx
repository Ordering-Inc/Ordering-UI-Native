import React, { useState, useEffect } from 'react'
import moment from 'moment'
import {
	useLanguage,
	useConfig,
	useUtils,
	useOrder,
	MomentOption as MomentOptionController
} from 'ordering-components/native'
import { StyleSheet, TextStyle, TouchableOpacity, View } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Spinner from 'react-native-loading-spinner-overlay';
import { MomentOptionParams } from '../../types'
import NavBar from '../NavBar'
import { OIcon, OText } from '../shared'
import { colors, images, labels } from '../../theme.json'
import { Container } from '../../layouts/Container'
import {
	HeaderTitle,
	WrapSelectOption,
	Days,
	Day,
	WrapHours,
	Hours,
	Hour,
	WrapDelveryTime
} from './styles'
import { SafeAreaView } from 'react-native-safe-area-context'

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

	const [, t] = useLanguage()
	const [{ configs }] = useConfig()
	const [{ parseTime }] = useUtils()
	const [orderState] = useOrder()
	const [optionSelected, setOptionSelected] = useState({ isAsap: false, isSchedule: false })
	const [momentState, setMomentState] = useState({ isLoading: 0, isEditing: false })
	const [showTimes, setShowTimes] = useState(false);

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
		if (momentState.isLoading === 2 && !orderState?.loading) {
			goToBack()
		}
	}, [momentState.isLoading])

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
			<NavBar
				onActionLeft={() => goToBack()}
				btnStyle={{ paddingLeft: 0 }}
				paddingTop={0}
				style={{ paddingBottom: 0 }}
				title={t('WHEN_DO_WE_DELIVERY', 'When do we delivery?')}
			/>
			<Container nopadding={nopadding} style={{ paddingStart: 40, paddingEnd: 40, paddingTop: 28 }}>
				<WrapSelectOption
					onPress={() => _handleAsap()}
					disabled={orderState.loading}
				>
					{optionSelected.isAsap ? (
						<OIcon src={images.general.radio_act} color={colors.primary} width={16} />
					) : (
						<OIcon src={images.general.radio_nor} color={colors.disabled} width={16} />
					)}
					<OText style={styles.timeText} color={optionSelected.isAsap ? colors.textPrimary : colors.textSecondary}>{`${t('ASAP_ABBREVIATION', 'ASAP')} (${moment().format('dddd, MMMM D, yyyy h:m A')})`}</OText>
				</WrapSelectOption>
				<WrapSelectOption
					onPress={() => setOptionSelected({ isAsap: false, isSchedule: true })}
					disabled={orderState.loading}
				>
					{optionSelected.isSchedule ? (
						<OIcon src={images.general.radio_act} color={colors.primary} width={16} />
					) : (
						<OIcon src={images.general.radio_nor} color={colors.disabled} width={16} />
					)}
					<OText style={styles.timeText} color={optionSelected.isSchedule ? colors.textPrimary : colors.textSecondary}>{t('SCHEDULE_FOR_LATER', 'Schedule for later')}</OText>
				</WrapSelectOption>

				{optionSelected.isSchedule && (
					<WrapDelveryTime>
						{datesList.length > 0 && (
							<Days>
								{
									datesList.slice(0, 6).map((date: any, i: any) => {
										const dateParts = date.split('-')
										const _date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
										const dayName = t('DAY' + (_date.getDay() >= 1 ? _date.getDay() : 7)).substring(0, 3).toUpperCase()
										const dayNumber = (_date.getDate() < 10 ? '0' : '') + _date.getDate()
										return (
											<Day
												key={dayNumber}
												borderLeftShow={i === 0 || i === 4}
												onPress={() => handleChangeDate(date)}
											>
												<OText
													style={[labels.small, styles.dayNameStyle] as TextStyle}
													color={colors.textPrimary}
												>{dayName}</OText>
												<View style={(dateSelected === date && optionSelected.isSchedule) ? styles.todayDate : {}}>
													<OText
														size={16}
														color={(dateSelected === date && optionSelected.isSchedule) ? colors.white : colors.textPrimary}
													>{dayNumber}</OText>
												</View>
											</Day>
										)
									})
								}
							</Days>
						)}

						{hoursList.length > 0 && optionSelected.isSchedule && (
							<>
								<TouchableOpacity activeOpacity={0.7} style={styles.timePicker} onPress={() => { setShowTimes(!showTimes) }}>
									<View style={{ flexDirection: 'row', alignItems: 'center' }}>
										<OIcon src={images.general.clock} width={16} />
										<OText color={colors.textPrimary} style={[labels.middle, { marginStart: 12, fontWeight: '400' }] as TextStyle}>{timeSelected != null ? parseTime(moment(timeSelected, 'HH:mm'), { outputFormat: 'hh:mma' }) : '00:00'}</OText>
									</View>
									<OIcon src={images.general.chevron_right} style={{ transform: [{ rotate: showTimes ? '270deg' : '90deg' }] }} width={16} />
								</TouchableOpacity>
								{showTimes && (
									<WrapHours nestedScrollEnabled={true}>
										<Hours name='hours'>
											{
												hoursList.map((hour: any, i: any) => (
													<Hour
														key={i}
														onPress={() => handleChangeMoment(hour.startTime)}
														disabled={orderState.loading}
													>
														<OText color={timeSelected === hour.startTime ? colors.primary : colors.textSecondary}>
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
									</WrapHours>
								)}
							</>
						)}
					</WrapDelveryTime>
				)}
				<Spinner visible={momentState.isLoading === 1} />
			</Container>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	icon: {
		marginRight: 10
	},
	dayNameStyle: {
		textTransform: 'capitalize'
	},
	selectStyle: {
		zIndex: 10
	},
	timeText: { fontSize: 14, lineHeight: 24, marginStart: 24 },
	todayDate: {
		width: 26,
		height: 26,
		backgroundColor: colors.primary,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 15
	},
	timePicker: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: 44,
		maxHeight: 44,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 7.6,
		marginTop: 50,
		paddingHorizontal: 16
	}
})

export const MomentOption = (props: any) => {
	const momentOptionProps = {
		...props,
		UIComponent: MomentOptionUI
	}
	return <MomentOptionController {...momentOptionProps} />
}
