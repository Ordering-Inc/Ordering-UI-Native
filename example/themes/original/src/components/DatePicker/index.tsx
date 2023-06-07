import React from 'react';
import DatePicker from 'react-native-date-picker'
import { DateContainer } from './styles';

export const DatePickerUI = (props: any) => {
	const {
		birthdate,
		handleChangeDate
	} = props;

	return (
		<DateContainer>
			<DatePicker mode="date" date={birthdate ? new Date(birthdate) : new Date()} onDateChange={handleChangeDate} />
		</DateContainer>
	);
};

