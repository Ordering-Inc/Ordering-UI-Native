import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
	useLanguage,
	useConfig,
	useUtils,
	useOrder,
	MomentOption as MomentOptionController,
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import {
	TouchableOpacity,
	StyleSheet,
	useWindowDimensions,
	View,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { MomentOptionParams } from '../../types';
import NavBar from '../NavBar';
import { OIcon, OText } from '../shared';
import { Container } from '../../layouts/Container';
import {
	WrapSelectOption,
	Days,
	Day,
	WrapHours,
	Hours,
	Hour,
	WrapDelveryTime,
} from './styles';
import { TouchableRipple } from 'react-native-paper';

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
      marginHorizontal: 10,
      marginTop: 10
		},
		dateWrap: {
			marginTop: 40,
			borderRadius: 7.6,
			borderColor: theme.colors.border,
			borderWidth: 1,
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
  const { width } = useWindowDimensions();

  const [toggleTime, setToggleTime] = useState(false);
	const [optionSelected, setOptionSelected] = useState({
		isAsap: false,
		isSchedule: false,
	});
	const [momentState, setMomentState] = useState({
		isLoading: 0,
		isEditing: false,
	});
	const momento = moment(`${dateSelected} ${timeSelected}`, 'YYYY-MM-DD HH:mm').toDate();
	const momentUnix = momento.getTime() / 1000;
	const momentFormat = moment.unix(momentUnix).utc().format('YYYY-MM-DD HH:mm:ss');

	const goToBack = () => navigation?.canGoBack() && navigation.goBack();

	const _handleAsap = () => {
		setMomentState({ isLoading: 1, isEditing: true });
		handleAsap();
		setOptionSelected({ isAsap: true, isSchedule: false });
		if (!orderState.options?.moment) {
			setMomentState({ isLoading: 2, isEditing: false });
		}
	};

	const handleChangeMoment = (time: any) => {
		setMomentState({ isLoading: 1, isEditing: true });
		handleChangeTime(time);
	};

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

	return (
		<Container style={{ paddingLeft: 40, paddingRight: 40 }}>
			<View style={{ paddingBottom: 10 }}>
				<NavBar
					onActionLeft={() => goToBack()}
					btnStyle={{ paddingLeft: 0 }}
					paddingTop={0}
					style={{ paddingBottom: 0 }}
					title={t('WHEN_DO_WE_DELIVERY', 'When do we delivery?')}
					titleAlign={'center'}
					titleStyle={{ fontSize: 14 }}
					titleWrapStyle={{ flexBasis: '80%' }}
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
					<OText
            color={optionSelected.isAsap ? theme.colors.textNormal : theme.colors.disabled}
          >
            {t('ASAP_ABBREVIATION', 'ASAP') + ` (${moment().format('dddd, MMM D, yyyy h:mm A')} + delivery time)`}
          </OText>
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
									<OText size={12} color={theme.colors.disabled}>{dateSelected}</OText>
								</View>
                <Days>
                  {datesList.slice(0, 6).map((date: any, i: any) => {
                    const dateParts = date.split('-')
                    const _date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
                    const dayName = t('DAY' + (_date.getDay() >= 1 ? _date.getDay() : 7)).substring(0, 3).toUpperCase()
                    const dayNumber = (_date.getDate() < 10 ? '0' : '') + _date.getDate()
                    return (
                      <TouchableOpacity
                        key={dayNumber}
                        style={{ paddingHorizontal: 10, paddingBottom: 10, paddingTop: 10, borderColor: 'transparent', borderWidth: 1 }}
                      >
                        <Day onPress={() => handleChangeDate(date)} style={{ width: (width * 0.25) - 108 }}>
                          <OText
                            style={styles.dayNameStyle}
                            color={(dateSelected === date && optionSelected.isSchedule) ? theme.colors.primary : theme.colors.textSecondary}
                          >{dayName}</OText>
                          <OText
                            size={20}
                            color={(dateSelected === date && optionSelected.isSchedule) ? theme.colors.primary : theme.colors.textSecondary}
                          >{dayNumber}</OText>
                        </Day>
                      </TouchableOpacity>
                    )
                  })}
                </Days>
							</View>
						)}

						{hoursList.length > 0 && optionSelected.isSchedule && (
							<>
								<TouchableRipple style={styles.timeLabel} onPress={() => { setToggleTime(!toggleTime) }}>
									<>
										<OIcon src={theme.images.general.clock} width={16} />
										<OText style={{ flexGrow: 1, paddingHorizontal: 12 }} color={theme.colors.disabled}>{timeSelected ? timeSelected : t('DELIVERY_TIME', 'Delivery Time')}</OText>
										<OIcon src={theme.images.general.arrow_down} width={16} style={{ transform: [{ rotate: toggleTime ? '180deg' : '0deg' }] }} />
									</>
								</TouchableRipple>
								{toggleTime ? (

									<WrapHours nestedScrollEnabled={true}>
										<Hours name="hours">
											{hoursList.map((hour: any, i: any) => (
												<Hour
													key={i}
													onPress={() => handleChangeMoment(hour.startTime)}
													disabled={orderState.loading}
													style={{ borderColor: timeSelected === hour.startTime ? theme.colors.primary : theme.colors.border }}
												>
													<OText
														color={
															timeSelected === hour.startTime
																? theme.colors.primary
																: theme.colors.textSecondary
														}>
														{configs?.format_time?.value === '12'
															? hour.startTime.includes('12')
																? `${hour.startTime}PM`
																: parseTime(moment(hour.startTime, 'HH:mm'), {
																	outputFormat: 'hh:mma',
																})
															: parseTime(moment(hour.startTime, 'HH:mm'), {
																outputFormat: 'HH:mm',
															})}
													</OText>
												</Hour>
											))}
										</Hours>
									</WrapHours>
								) : null}
							</>
						)}
					</WrapDelveryTime>
				)}
			</View>
			<Spinner visible={momentState.isLoading === 1} />
		</Container>
	);
};

export const MomentOption = (props: any) => {
	const momentOptionProps = {
		...props,
		UIComponent: MomentOptionUI,
	};
	return <MomentOptionController {...momentOptionProps} />;
};
