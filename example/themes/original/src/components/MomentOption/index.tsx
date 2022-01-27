import React, { useState, useEffect, useCallback } from 'react';
import moment, { Moment } from 'moment';
import {
	useLanguage,
	useConfig,
	useUtils,
	useOrder,
	MomentOption as MomentOptionController,
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import {
	ImageStore,
	StyleSheet,
	useWindowDimensions,
	View,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { MomentOptionParams } from '../../types';
import NavBar from '../NavBar';
import { OButton, OIcon, OText } from '../shared';
import { Container } from '../../layouts/Container';
import {
	HeaderTitle,
	WrapSelectOption,
	Days,
	Day,
	WrapHours,
	Hours,
	Hour,
	WrapDelveryTime,
} from './styles';
import CalendarPicker from 'react-native-calendar-picker';
import { TouchableRipple } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import SelectDropdown from 'react-native-select-dropdown';

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
		handleChangeTime,
	} = props;

	const countries = ["Egypt", "Canada", "Australia", "Ireland"]

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
		}
	});

	const [, t] = useLanguage();
	const [{ configs }] = useConfig();
	const [{ parseTime }] = useUtils();
	const [orderState] = useOrder();
	const [optionSelected, setOptionSelected] = useState({
		isAsap: false,
		isSchedule: false,
	});
	const [momentState, setMomentState] = useState({
		isLoading: 0,
		isEditing: false,
	});
	const { width } = useWindowDimensions();
	const { bottom } = useSafeAreaInsets();

	const [toggleTime, setToggleTime] = useState(false);
	const [selectedTime, setSelectedTime] = useState(timeSelected);

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

	const getTwoChar = (ori: string) => {
		return ori.substring(0, 2);
	};
	const weekDays = [
		getTwoChar(t('SUNDAY_ABBREVIATION', 'Su')),
		getTwoChar(t('MONDAY_ABBREVIATION', 'Mo')),
		getTwoChar(t('TUESDAY_ABBREVIATION', 'Tu')),
		getTwoChar(t('WEDNESDAY_ABBREVIATION', 'We')),
		getTwoChar(t('THURSDAY_ABBREVIATION', 'Th')),
		getTwoChar(t('FRIDAY_ABBREVIATION', 'Fr')),
		getTwoChar(t('SATURDAY_ABBREVIATION', 'Sa')),
	];

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

	const customDayHeaderStylesCallback = () => {
		return {
			textStyle: {
				color: theme.colors.disabled,
				fontSize: 12,
			},
		};
	};
	return (
		<>
		<Container style={{ paddingLeft: 40, paddingRight: 40 }}>
			<View style={{ paddingBottom: 90 }}>
				<NavBar
					onActionLeft={() => goToBack()}
					btnStyle={{ paddingLeft: 0 }}
					paddingTop={0}
					style={{ paddingBottom: 0, flexDirection: 'column', alignItems: 'flex-start' }}
					title={t('QUESTION_WHEN_ORDER', 'When do you want your order?')}
					titleAlign={'center'}
					titleStyle={{ fontSize: 14, marginRight: 0, marginLeft: 0 }}
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
					<OText color={optionSelected.isAsap ? theme.colors.textNormal : theme.colors.disabled}>{t('ASAP_ABBREVIATION', 'ASAP') + ` (${moment().format('dddd, MMM d, yyyy h:mm A')} + delivery time)`}</OText>
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
					<WrapDelveryTime>
						{datesList.length > 0 && (
							<View style={styles.dateWrap}>
								<View style={styles.dateLabel}>
									<OText size={12} color={theme.colors.textNormal}>{dateSelected}</OText>
								</View>
								<SelectDropdown
									defaultButtonText={timeSelected ? timeSelected : t('DELIVERY_TIME', 'Delivery Time')}
									defaultValue={74}
									data={hoursList}
									disabled={orderState.loading}
									onSelect={(selectedItem, index) => {
										setSelectedTime(selectedItem.startTime)
									}}
									buttonTextAfterSelection={(selectedItem, index) => {
										return `${selectedItem.startTime} - ${selectedItem.endTime}`
									}}
									rowTextForSelection={(item, index) => {
										return `${item.startTime} - ${item.endTime}`
									}}
									buttonStyle={{
										backgroundColor: theme.colors.white,
										borderColor: theme.colors.border,
										borderWidth: 1,
										borderRadius: 8,
										height: 40,
										width: '100%',
										flexDirection: 'column',
										alignItems: 'flex-start',
										marginBottom: 20
									}}
									buttonTextStyle={{
										color: theme.colors.textNormal,
										fontSize: 12,
										paddingTop: 10
									}}
									dropdownStyle={{
										borderRadius: 8,
										borderColor: theme.colors.lightGray,
									}}
									rowStyle={{
										borderBottomColor: theme.colors.white,
										backgroundColor: theme.colors.white,
										height: 40,
										flexDirection: 'column',
										alignItems: 'flex-start',
										paddingTop: 8,
										paddingLeft: 22
									}}
									rowTextStyle={{
										color: theme.colors.textNormal,
										fontSize: 14,
									}}
								/>							
								<CalendarPicker
									nextTitle=">"
									width={width - 80}
									previousTitle="<"
									nextComponent={
										<OIcon
											src={theme.images.general.chevron_right}
											color={theme.colors.disabled}
											width={12}
											style={{ marginHorizontal: 4 }}
										/>
									}
									previousComponent={
										<OIcon
											src={theme.images.general.chevron_left}
											color={theme.colors.disabled}
											width={12}
											style={{ marginHorizontal: 4 }}
										/>
									}
									onDateChange={(date: moment.Moment) =>
										handleChangeDate(date.format('YYYY-MM-DD'))
									}
									selectedDayColor={theme.colors.primaryContrast}
									todayBackgroundColor={theme.colors.border}
									dayLabelsWrapper={{ borderColor: theme.colors.clear }}
									customDayHeaderStyles={customDayHeaderStylesCallback}
									weekdays={weekDays}
									selectedStartDate={momento}
									minDate={moment()}
								/>
							</View>
						)}
					</WrapDelveryTime>
				)}
			</View>
			<Spinner visible={momentState.isLoading === 1} />
		</Container>
		<View style={{position: 'absolute', bottom: bottom, paddingBottom: 20, paddingHorizontal: 40, backgroundColor: 'white', width: '100%'}}>
			<OButton onClick={handleChangeMoment} isDisabled={!selectedTime} text={t('CONTINUE', 'Continue')} style={{borderRadius: 7.6, height: 44, shadowOpacity: 0}} textStyle={{color: 'white', fontSize: 14}} showNextIcon />
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
