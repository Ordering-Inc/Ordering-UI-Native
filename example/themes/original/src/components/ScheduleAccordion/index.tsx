import React, { useState } from 'react'
import { Platform, View } from 'react-native'
import { useLanguage } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';

import {
	Accordion,
	AccordionSection,
	DropdownWrapper,
} from './styles'
import { OIcon, OText } from '../shared';

export const ScheduleAccordion = (props: any) => {

	const {
		timeFormated,
		schedule,
		weekIndex
	} = props

	const [isActive, setActiveState] = useState(false)
	const [, t] = useLanguage()
	const theme = useTheme();

	const daysOfWeek = [
		t('DAY7', 'Sunday'),
		t('DAY1', 'Monday'),
		t('DAY2', 'Tuesday'),
		t('DAY3', 'Wednesday'),
		t('DAY4', 'Thursday'),
		t('DAY5', 'Friday'),
		t('DAY6', 'Saturday'),
	];

	return (
		<AccordionSection>
			<Accordion
				onPress={() => setActiveState(!isActive)}
				activeOpacity={1}
			>
				<DropdownWrapper>
					<OText
						mBottom={16}
						mRight={8}
						lineHeight={21}
						size={14}
						weight={Platform.OS === 'android' ? 'bold' : '600'}
					>{daysOfWeek[weekIndex]}</OText>
					<OIcon src={theme.images.general.arrow_down} color={theme.colors.textNormal} width={8} />
				</DropdownWrapper>
				<View style={{ display: isActive ? 'flex' : 'none', paddingStart: 20 }}>
					{schedule?.lapses?.map((lapse: any) => (
						schedule?.enabled ?
							<OText mBottom={16}>
								{timeFormated(lapse.open) +
									' - ' +
									timeFormated(lapse.close)}
							</OText>
							:
							<OText color={theme.colors.red} mBottom={16}>
								{t('CLOSED', 'Closed')}
							</OText>
					))}
				</View>
			</Accordion>
		</AccordionSection>
	)
}
