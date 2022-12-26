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
	TouchableOpacity
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

	const is12hours = configs?.dates_moment_format?.value?.includes('hh:mm')

	const [selectedTime, setSelectedTime] = useState(null);
	const [datesWhitelist, setDateWhitelist] = useState<any>([{ start: null, end: null }])
	const [selectDate, setSelectedDate] = useState<any>(null)

	const goToBack = () => navigation?.canGoBack() && navigation.goBack();

	const _handleAsap = () => {
		setMomentState({ isLoading: 1, isEditing: true });
		handleAsap();
		setOptionSelected({ isAsap: true, isSchedule: false });
		if (!orderState.options?.moment) {
			setMomentState({ isLoading: 2, isEditing: false });
		}
	};

	const handleChangeMoment = () => {
		setMomentState({ isLoading: 1, isEditing: true });
		handleChangeTime(selectedTime);
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
			const _datesList = datesList.slice(0, Number(configs?.max_days_preorder?.value || 6))
			const minDateParts = _datesList[0].split('-')
			const maxDateParts = _datesList[_datesList.length - 1].split('-')
			const _minDate = new Date(minDateParts[0], minDateParts[1] - 1, minDateParts[2])
			const _maxDate = new Date(maxDateParts[0], maxDateParts[1] - 1, maxDateParts[2])
			setDateWhitelist([{ start: _minDate, end: _maxDate }])
		}
	}, [datesList])

	useEffect(() => {
		if (dateSelected) {
			const dateParts = dateSelected.split('-')
			const _dateSelected = new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
			setSelectedDate(_dateSelected)
		}
	}, [dateSelected])

	useEffect(() => {
		setSelectedTime(timeSelected)
	}, [timeSelected])

	return (
		<>
			<Container
				style={{
					paddingLeft: 40,
					paddingRight: 40
				}}>
				<View style={{ paddingBottom: 90, paddingRight: 20 }}>
					<NavBar
						onActionLeft={() => goToBack()}
						btnStyle={{ paddingLeft: 0 }}
						style={{ paddingBottom: 0 }}
						title={t('QUESTION_WHEN_ORDER', 'When do you want your order?')}
						titleAlign={'center'}
						titleStyle={{ fontSize: 20, marginRight: 0, marginLeft: 0 }}
						titleWrapStyle={{ paddingHorizontal: 0 }}
					/>
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
							<View style={{ flex: 1 }}>
								{selectDate && datesWhitelist[0]?.start !== null && (
									<CalendarStrip
										scrollable
										locale={locale}
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
										selectedDate={selectDate}
										datesWhitelist={datesWhitelist}
										disabledDateNameStyle={styles.disabledDateName}
										disabledDateNumberStyle={styles.disabledDateNumber}
										disabledDateOpacity={0.6}
										onDateSelected={(date) => onSelectDate(date)}
										leftSelector={<LeftSelector />}
										rightSelector={<RightSelector />}
									/>
								)}
							</View>
							<TimeListWrapper nestedScrollEnabled={true}>
								<TimeContentWrapper>
									{hoursList.map((time: any, i: number) => (
										<TouchableOpacity key={i} onPress={() => setSelectedTime(time.startTime)}>
											<TimeItem active={selectedTime === time.startTime}>
												<OText
													size={14}
													color={selectedTime === time.startTime ? theme.colors.primary : theme.colors.textNormal}
													style={{
														lineHeight: 24
													}}
												>{is12hours ? (
													time.startTime.includes('12')
														? `${time.startTime}PM`
														: parseTime(moment(time.startTime, 'HH:mm'), { outputFormat: 'hh:mma' })
												) : time.startTime
													}</OText>
											</TimeItem>
										</TouchableOpacity>
									))}
									{hoursList.length % 3 === 2 && (
										<TimeItem style={{ backgroundColor: 'transparent' }} />
									)}
								</TimeContentWrapper>
							</TimeListWrapper>
						</OrderTimeWrapper>
					)}
				</View>
				<Spinner visible={momentState.isLoading === 1} />
			</Container>
			<View style={{ position: 'absolute', bottom: bottom, paddingBottom: 20, paddingHorizontal: 40, backgroundColor: 'white', width: '100%' }}>
				<OButton onClick={handleChangeMoment} isDisabled={!selectedTime} text={t('CONTINUE', 'Continue')} style={{ borderRadius: 7.6, height: 44, shadowOpacity: 0 }} textStyle={{ color: 'white', fontSize: 14 }} showNextIcon />
			</View>
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
