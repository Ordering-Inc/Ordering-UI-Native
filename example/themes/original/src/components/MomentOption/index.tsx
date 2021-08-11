import React, { useState, useEffect, useCallback } from 'react';
import moment, { Moment } from 'moment';
import {
  useLanguage,
  useConfig,
  useUtils,
  useOrder,
  MomentOption as MomentOptionController,
} from 'ordering-components/native';
import {
  ImageStore,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Spinner from 'react-native-loading-spinner-overlay';
import { MomentOptionParams } from '../../types';
import NavBar from '../NavBar';
import { OIcon, OText } from '../shared';
import { colors, images } from '../../theme.json';
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

  const [toggleTime, setToggleTime] = useState(false);

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
        color: colors.disabled,
        fontSize: 12,
      },
    };
  };

  return (
    <Container style={{paddingLeft: 40, paddingRight: 40}}>
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
          disabled={orderState.loading} style={{alignItems: 'flex-start'}}>
          {optionSelected.isAsap ? (
            <OIcon
              src={images.general.option_checked}
              width={16}
              style={{ marginEnd: 24 }}
            />
          ) : (
            <OIcon
              src={images.general.option_normal}
              width={16}
              style={{ marginEnd: 24 }}
            />
          )}
          <OText color={optionSelected.isAsap ? colors.textNormal : colors.disabled}>{t('ASAP_ABBREVIATION', 'ASAP') + ` (${moment().format('dddd, MMM d, yyyy h:mm A')} + delivery time)`}</OText>
        </WrapSelectOption>
        <WrapSelectOption
          onPress={() => setOptionSelected({ isAsap: false, isSchedule: true })}
          disabled={orderState.loading}>
          {optionSelected.isSchedule ? (
            <OIcon
              src={images.general.option_checked}
              width={16}
              style={{ marginEnd: 24 }}
            />
          ) : (
            <OIcon
              src={images.general.option_normal}
              width={16}
              style={{ marginEnd: 24 }}
            />
          )}
          <OText color={optionSelected.isSchedule ? colors.textNormal : colors.disabled}>{t('SCHEDULE_FOR_LATER', 'Schedule for later')}</OText>
        </WrapSelectOption>

        {optionSelected.isSchedule && (
          <WrapDelveryTime>
            {datesList.length > 0 && (
              <View style={styles.dateWrap}>
                <View style={styles.dateLabel}>
                  <OText size={12} color={colors.disabled}>{dateSelected}</OText>
                </View>
                <CalendarPicker
                  nextTitle=">"
                  width={width - 80}
                  previousTitle="<"
                  nextComponent={
                    <OIcon
                      src={images.general.chevron_right}
                      color={colors.disabled}
                      width={12}
                      style={{ marginHorizontal: 4 }}
                    />
                  }
                  previousComponent={
                    <OIcon
                      src={images.general.chevron_left}
                      color={colors.disabled}
                      width={12}
                      style={{ marginHorizontal: 4 }}
                    />
                  }
                  onDateChange={(date: moment.Moment) =>
                    handleChangeDate(date.format('YYYY-MM-DD'))
                  }
                  selectedDayColor={colors.primaryContrast}
                  todayBackgroundColor={colors.border}
                  dayLabelsWrapper={{ borderColor: colors.clear }}
                  customDayHeaderStyles={customDayHeaderStylesCallback}
                  weekdays={weekDays}
                  selectedStartDate={momento}
                />
              </View>
            )}

            {hoursList.length > 0 && optionSelected.isSchedule && (
              <>
					 <TouchableRipple style={styles.timeLabel} onPress={() => { setToggleTime(!toggleTime) }}>
						 <>
					 	<OIcon src={images.general.clock} width={16} />
						 <OText style={{flexGrow: 1, paddingHorizontal: 12}} color={colors.disabled}>{timeSelected ? timeSelected : t('DELIVERY_TIME', 'Delivery Time')}</OText>
					 	<OIcon src={images.general.arrow_down} width={16} style={{transform: [{ rotate: toggleTime ? '180deg' : '0deg' }]}} />
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
								style={{borderColor: timeSelected === hour.startTime ? colors.primary : colors.border }}
								>
                        <OText
                          color={
                            timeSelected === hour.startTime
                              ? colors.primary
                              : colors.textSecondary
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
    borderColor: colors.border,
    borderRadius: 7.6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 12,
  },
  dateWrap: {
    marginTop: 40,
    borderRadius: 7.6,
    borderColor: colors.border,
    borderWidth: 1,
    padding: 17,
    marginBottom: 23,
  },
  timeLabel: {
	borderWidth: 1,
	borderColor: colors.border,
	borderRadius: 7.6,
	height: 44,
	paddingHorizontal: 16,
	flexDirection: 'row',
	alignItems: 'center'
  }
});

export const MomentOption = (props: any) => {
  const momentOptionProps = {
    ...props,
    UIComponent: MomentOptionUI,
  };
  return <MomentOptionController {...momentOptionProps} />;
};
