import React from 'react';
import { Platform } from 'react-native';
import { OText } from '../shared';
import { BussFilterWrap, FilterItem, InnerWrapScroll } from './styles';

interface Props {
	items: Array<{name: string, value: string}>,
	onHandleFilter: (type: any) => void,
}

const BusinessesSortBy = (props: Props) => {
	const {items, onHandleFilter} = props;
	return (
		<BussFilterWrap>
			<InnerWrapScroll horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: 40}}>
				{items.map((t, idx) => (
					<FilterItem key={'b_filter_' + idx} onPress={() => onHandleFilter(t?.value)}>
						<OText size={12} weight={Platform.OS == 'ios' ? '600' : 'bold'}>{t?.name}</OText>
					</FilterItem>
				))}
			</InnerWrapScroll>
		</BussFilterWrap>
	)
}

export default BusinessesSortBy;