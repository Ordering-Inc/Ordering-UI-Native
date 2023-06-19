import React from 'react';
import DatePicker from 'react-native-date-picker'
import { DateContainer } from './styles';
import { useLanguage } from 'ordering-components/native';

export const DatePickerUI = (props: any) => {
	const {
		birthdate,
		onConfirm,
		onCancel,
		open,
	} = props;

	const [, t] = useLanguage();

	return (
		<DateContainer>
			<DatePicker
				modal
				mode="date"
				open={open}
				title={t('SELECT_A_DATE', 'Select a date')}
				confirmText={t('CONFIRM', 'Confirm')}
				cancelText={t('CANCEL', 'Cancel')}
				date={birthdate ? new Date(birthdate) : new Date()}
				onConfirm={date => onConfirm(date)}
				onCancel={onCancel}
				maximumDate={new Date()}
			/>
		</DateContainer>
	);
};

