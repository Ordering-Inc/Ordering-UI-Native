import React, { useState, useEffect } from 'react';
import moment from 'moment';
import CalendarStrip from 'react-native-calendar-strip'
import {
	useLanguage,
	useConfig,
	useUtils,
	useOrder,
	MomentOption as MomentOptionController,
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import {
	StyleSheet,
	View,
	Platform,
	Pressable
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { MomentOptionParams } from '../../types';
import NavBar from '../NavBar';
import { OButton, OIcon, OText } from '../shared';
import { Container } from '../../layouts/Container';
import {
	WrapSelectOption,
	OrderTimeWrapper,
	TimeListWrapper,
	TimeContentWrapper,
	TimeItem
} from './styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { locale, monthsEnum } from '../../utils';

const MomentOptionUI = (props: MomentOptionParams) => {
	const {
		navigation,
		datesList,
		hoursList,
		dateSelected,
		timeSelected,
		cateringPreorder,
		isCart,
		preorderLeadTime,
		business,
		getActualSchedule,
		preorderMaximumDays,
		preorderMinimumDays,
		isPage,
		handleAsap,
		handleChangeDate,
		handleChangeTime,
	} = props;

	const theme = useTheme();

	const styles = StyleSheet.create({
		icon: {
			marginRight: 10,
		},
		dayNameStyle: {
			textTransform: 'uppercase',
		},
		selectStyle: {
			zIndex: 10,
		},
		dateLabel: {
			borderWidth: 1,
			borderColor: theme.colors.border,
			borderRadius: 7.6,
			paddingHorizontal: 12,
			paddingVertical: 9,
			marginBottom: 12,
		},
		dateWrap: {
			marginTop: 40,
			borderRadius: 7.6,
			borderColor: theme.colors.border,
			borderWidth: 1,
			padding: 17,
			marginBottom: 23,
		},
		timeLabel: {
			borderWidth: 1,
			borderColor: theme.colors.border,
			borderRadius: 7.6,
			height: 44,
			paddingHorizontal: 16,
			flexDirection: 'row',
			alignItems: 'center'
		},
		calendar: {
			paddingBottom: 15,
			borderBottomWidth: 1,
			borderColor: theme.colors.backgroundGray200,
			height: 100
		},
		calendarHeaderContainer: {
			flex: 1,
			justifyContent: 'flex-start',
			textAlign: 'left',
			marginBottom: 17,
			borderBottomWidth: 1,
			borderColor: theme.colors.backgroundGray200
		},
		calendarHeader: {
			color: '#344050',
			alignSelf: 'flex-start',
			fontSize: 14,
			fontWeight: '400'
		},
		dateNumber: {
			color: '#B1BCCC',
			fontSize: 16,
			fontWeight: '500',
		},
		dateName: {
			color: '#B1BCCC',
			fontSize: 12,
			textTransform: 'capitalize',
		},
		highlightDateName: {
			color: '#344050',
			fontSize: 12,
			textTransform: 'capitalize',
		},
		highlightDateNumber: {
			color: '#344050',
			fontSize: 16,
			textTransform: 'capitalize',
		},
		disabledDateName: {
			color: '#B1BCCC',
			fontSize: 10,
			textTransform: 'capitalize',
			opacity: 1,
		},
		disabledDateNumber: {
			color: '#B1BCCC',
			fontSize: 14,
			fontWeight: '500'
		}
	});

	const [, t] = useLanguage();
	const [{ configs }] = useConfig();
	const [{ parseTime }] = useUtils()
	const [orderState] = useOrder();
	const [optionSelected, setOptionSelected] = useState({
		isAsap: false,
		isSchedule: false,
	});
	const [momentState, setMomentState] = useState({
		isLoading: 0,
		isEditing: false,
	});
	const { bottom } = useSafeAreaInsets();

	const is12hours = configs?.general_hour_format?.value?.includes('hh:mm')

	const [selectedTime, setSelectedTime] = useState(null);
	const [datesWhitelist, setDateWhitelist] = useState<any>([{ start: null, end: null }])
	const [selectDate, setSelectedDate] = useState<any>(dateSelected)
	const [timeList, setTimeList] = useState<any>(hoursList)
	const goToBack = () => navigation?.canGoBack() && navigation.goBack();

	const _handleAsap = () => {
		setMomentState({ isLoading: 1, isEditing: true });
		handleAsap();
		setOptionSelected({ isAsap: true, isSchedule: false });
		if (!orderState.options?.moment) {
			setMomentState({ isLoading: 2, isEditing: false });
		}
	};

	const handleChangeMoment = (time?: any) => {
		setMomentState({ isLoading: 1, isEditing: true });
		handleChangeTime(time ?? selectedTime);
	};

	const momento = moment(
		`${dateSelected} ${timeSelected}`,
		'YYYY-MM-DD HH:mm',
	).toDate();
	const momentUnix = momento.getTime() / 1000;
	const momentFormat = moment
		.unix(momentUnix)
		.utc()
		.format('YYYY-MM-DD HH:mm:ss');

	useEffect(() => {
		if (orderState.options?.moment) {
			setOptionSelected({ isAsap: false, isSchedule: true });
		} else {
			setOptionSelected({ isAsap: true, isSchedule: false });
		}

		if (
			momentState.isEditing &&
			(momentFormat === orderState.options?.moment || timeSelected === null)
		) {
			setMomentState({ isLoading: 2, isEditing: false });
		}
	}, [orderState.options?.moment]);

	useEffect(() => {
		if (momentState.isLoading === 2 && !orderState?.loading) {
			goToBack();
		}
	}, [momentState.isLoading]);

	const onSelectDate = (val: any) => {
		setSelectedDate(val)
		if (handleChangeDate) handleChangeDate(moment(val).format('YYYY-MM-DD'))
	}

	const handleChangeTimeSelected = (time: any) => {
		if (cateringPreorder) {
			handleChangeMoment(time)
		} else {
			setSelectedTime(time)
		}
	}

	const LeftSelector = () => {
		return (
			<View style={{ height: '100%', justifyContent: 'flex-end' }}>
				<IconAntDesign
					name='caretleft'
					color={theme.colors.textNormal}
					size={16}
				/>
			</View>
		)
	}

	const RightSelector = () => {
		return (
			<View style={{ height: '100%', justifyContent: 'flex-end' }}>
				<IconAntDesign
					name='caretright'
					color={theme.colors.textNormal}
					size={16}
				/>
			</View>
		)
	}

	useEffect(() => {
		if (datesList?.length > 0) {
			const _datesList = datesList.slice((cateringPreorder && preorderMinimumDays) || 0, Number(cateringPreorder ? preorderMaximumDays || configs?.max_days_preorder?.value : configs?.max_days_preorder?.value ?? 6))
			if (_datesList?.length > 0) {
				const minDateParts = _datesList?.[0]?.split('-')
				const maxDateParts = _datesList[_datesList.length - 1].split('-')
				const _minDate = new Date(minDateParts[0], minDateParts[1] - 1, minDateParts[2])
				const _maxDate = new Date(maxDateParts[0], maxDateParts[1] - 1, maxDateParts[2])
				setDateWhitelist([{ start: _minDate, end: _maxDate }])
			}
		}
	}, [JSON.stringify(datesList), preorderMinimumDays, preorderMaximumDays, cateringPreorder])

	useEffect(() => {
		if (dateSelected) {
			const dateParts = dateSelected.split('-')
			const _dateSelected = new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
			setSelectedDate(_dateSelected)
			if (cateringPreorder) {
				onSelectDate(_dateSelected)
			}
		}
	}, [dateSelected])

	useEffect(() => {
		setSelectedTime(timeSelected)
	}, [timeSelected])

	useEffect(() => {
		if (cateringPreorder) {
			let _timeLists = []
			const schedule = business && getActualSchedule()
			if (!schedule && business) {
				return
			}
			_timeLists = hoursList
				.filter(hour => (!business || schedule?.lapses?.some((lapse: any) =>
					moment(dateSelected + ` ${hour.startTime}`) >= moment(dateSelected + ` ${lapse.open.hour}:${lapse.open.minute}`).add(preorderLeadTime, 'minutes') && moment(dateSelected + ` ${hour.endTime}`) <= moment(dateSelected + ` ${lapse.close.hour}:${lapse.close.minute}`))) &&
					moment(dateSelected + ` ${hour.startTime}`) < moment(dateSelected + ` ${hour.endTime}`) &&
					(moment().add(preorderLeadTime, 'minutes') < moment(dateSelected + ` ${hour.startTime}`) || !cateringPreorder))
				.map(hour => {
					return {
						value: hour.startTime,
						text: is12hours ? (
							hour.startTime.includes('12')
								? `${hour.startTime}PM`
								: parseTime(moment(hour.startTime, 'HH:mm'), { outputFormat: 'hh:mma' })
						) : (
							parseTime(moment(hour.startTime, 'HH:mm'), { outputFormat: 'HH:mm' })
						),
						endText: is12hours ? (
							hour.endTime.includes('12')
								? `${hour.endTime}PM`
								: parseTime(moment(hour.endTime, 'HH:mm'), { outputFormat: 'hh:mma' })
						) : (
							parseTime(moment(hour.endTime, 'HH:mm'), { outputFormat: 'HH:mm' })
						)
					}
				})
			if (_timeLists?.length > 0) {
				setTimeList(_timeLists)
			}
		} else {
			setTimeList(hoursList.map(hour => {
				return {
					value: hour.startTime,
					text: is12hours ? (
						hour.startTime.includes('12')
							? `${hour.startTime}PM`
							: parseTime(moment(hour.startTime, 'HH:mm'), { outputFormat: 'hh:mma' })
					) : (
						parseTime(moment(hour.startTime, 'HH:mm'), { outputFormat: 'HH:mm' })
					)
				}
			}))
		}
	}, [dateSelected, JSON.stringify(hoursList), JSON.stringify(datesWhitelist), cateringPreorder, JSON.stringify(business)])

	return (
		<>
			<Container
				style={{
					paddingLeft: !cateringPreorder || isPage ? 40 : 0,
					paddingRight: !cateringPreorder || isPage ? 40 : 0
				}}
				nestedScrollEnabled
			>
				<View style={{ paddingBottom: cateringPreorder ? 0 : 90, paddingRight: 20 }}>
					{!isCart && (
						<NavBar
							onActionLeft={() => goToBack()}
							btnStyle={{ paddingLeft: 0 }}
							style={{ paddingBottom: 0 }}
							paddingTop={Platform.OS === 'ios' ? 10 : 0}
							title={t('QUESTION_WHEN_ORDER', 'When do you want your order?')}
							titleAlign={'center'}
							titleStyle={{ fontSize: 20, marginRight: 0, marginLeft: 0 }}
							titleWrapStyle={{ paddingHorizontal: 0 }}
						/>
					)}
					{(preorderMinimumDays === 0 && preorderLeadTime === 0) || !cateringPreorder && (
						<WrapSelectOption
							onPress={() => _handleAsap()}
							disabled={orderState.loading} style={{ alignItems: 'flex-start' }}>
							{optionSelected.isAsap ? (
								<OIcon
									src={theme.images.general.option_checked}
									width={16}
									style={{ marginEnd: 24 }}
								/>
							) : (
								<OIcon
									src={theme.images.general.option_normal}
									width={16}
									style={{ marginEnd: 24 }}
								/>
							)}
							<OText color={optionSelected.isAsap ? theme.colors.textNormal : theme.colors.disabled}>{t('ASAP_ABBREVIATION', 'ASAP') + ` (${t(moment().format('dddd')?.toLocaleUpperCase(), moment().format('dddd'))}, ${t(monthsEnum[moment().format('MMM')], moment().format('MMM'))}${moment().format(' D, yyyy h:mm A')} + ${t('DELIVERY_TIME', 'delivery time')})`}</OText>
						</WrapSelectOption>
					)}
					<WrapSelectOption
						onPress={() => setOptionSelected({ isAsap: false, isSchedule: true })}
						disabled={orderState.loading}>
						{optionSelected.isSchedule ? (
							<OIcon
								src={theme.images.general.option_checked}
								width={16}
								style={{ marginEnd: 24 }}
							/>
						) : (
							<OIcon
								src={theme.images.general.option_normal}
								width={16}
								style={{ marginEnd: 24 }}
							/>
						)}
						<OText color={optionSelected.isSchedule ? theme.colors.textNormal : theme.colors.disabled}>{t('SCHEDULE_FOR_LATER', 'Schedule for later')}</OText>
					</WrapSelectOption>
					{optionSelected.isSchedule && (
						<OrderTimeWrapper>
							{datesWhitelist[0]?.start === datesWhitelist[0]?.end && (
								<OText>
									{moment(selectDate).format('Do MMMM, YYYY')}
								</OText>
							)}
							{datesWhitelist[0]?.start !== datesWhitelist[0]?.end && (
								<View style={{ flex: 1 }}>
									{selectDate && datesWhitelist[0]?.start !== null && (
										<CalendarStrip
											scrollable
											style={styles.calendar}
											calendarHeaderContainerStyle={styles.calendarHeaderContainer}
											calendarHeaderStyle={styles.calendarHeader}
											dateNumberStyle={styles.dateNumber}
											dateNameStyle={styles.dateName}
											iconContainer={{ flex: 0.1 }}
											highlightDateNameStyle={styles.highlightDateName}
											highlightDateNumberStyle={styles.highlightDateNumber}
											dayContainerStyle={{ height: '100%' }}
											highlightDateContainerStyle={{ height: '100%' }}
											calendarHeaderFormat='MMMM, YYYY'
											iconStyle={{ borderWidth: 1 }}
											selectedDate={dateSelected}
											datesWhitelist={datesWhitelist}
											minDate={moment()}
											maxDate={cateringPreorder ? moment().add(preorderMaximumDays, 'days') : undefined}
											disabledDateNameStyle={styles.disabledDateName}
											disabledDateNumberStyle={styles.disabledDateNumber}
											disabledDateOpacity={0.6}
											onDateSelected={(date) => onSelectDate(date)}
											leftSelector={<LeftSelector />}
											rightSelector={<RightSelector />}
										/>
									)}
								</View>
							)}
							<TimeListWrapper nestedScrollEnabled={true} cateringPreorder={cateringPreorder}>
								<TimeContentWrapper>
									{timeList.map((time: any, i: number) => (
										<Pressable key={i} onPress={() => handleChangeTimeSelected(time.value)}>
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
									))}
									{timeList.length % 3 === 2 && (
										<TimeItem style={{ backgroundColor: 'transparent' }} />
									)}
								</TimeContentWrapper>
							</TimeListWrapper>
						</OrderTimeWrapper>
					)}
				</View>
				<Spinner visible={momentState.isLoading === 1} />
			</Container>
			{!isCart && !cateringPreorder && (
				<View style={{ position: 'absolute', bottom: bottom, paddingBottom: 20, paddingHorizontal: 40, backgroundColor: 'white', width: '100%' }}>
					<OButton onClick={() => handleChangeMoment()} isDisabled={!selectedTime} text={t('CONTINUE', 'Continue')} style={{ borderRadius: 7.6, height: 44, shadowOpacity: 0 }} textStyle={{ color: 'white', fontSize: 14 }} showNextIcon />
				</View>
			)}
		</>
	);
};

export const MomentOption = (props: any) => {
	const momentOptionProps = {
		...props,
		UIComponent: MomentOptionUI,
	};
	return <MomentOptionController {...momentOptionProps} />;
};
