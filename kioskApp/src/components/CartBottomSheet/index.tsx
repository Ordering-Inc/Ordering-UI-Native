import React from 'react';
import { Dimensions, View, TouchableOpacity } from 'react-native';
import RBSheet from "react-native-raw-bottom-sheet";
import { useLanguage } from 'ordering-components/native';

import { colors } from '../../theme.json';
import { OButton, OText } from '../shared';
import {
	StyledBottomContent,
	StyledContent,
	StyledTopBar,
} from './styles';
import { DELIVERY_TYPE_IMAGES } from '../../config/constants';
import CartItem from '../CartItem';

const _dim = Dimensions.get('window');

const CartBottomSheet = (props: Props): React.ReactElement => {

	const [, t] = useLanguage();

	return (
		<>
			{props.children}

			<RBSheet
				ref={props.refRBSheet}
        closeOnDragDown={false}
				height={_dim.height * 0.5}
        customStyles={{
					wrapper: {
						backgroundColor: "rgba(0,0,0,0.5)"
          },
        }}
      >
				<View>
					<StyledContent>
						<TopBar/>

					</StyledContent>

					<StyledBottomContent>
						<OButton
							text={t('CONFIRM THIS ORDER', 'Confirm this ${{price}} order')}
							onClick={() => {
								console.log('Confirm order')
							}}
						/>
					</StyledBottomContent>
				</View>
      </RBSheet>
		</>
	);
}

const TopBar = (props:any) => {
	const [, t] = useLanguage();

	return (
		<StyledTopBar>
			<View>
				<OText
					size={_dim.width * 0.026}
					weight="700"
					mBottom={4}
				>
					{t('YOUR_ORDER', 'your order')}
				</OText>
				<OText
					size={_dim.width * 0.023}
					weight="500"
					color={colors.mediumGray}
				>
					{t('TAKE_OUT', 'Take out')}
				</OText>
			</View>

			<TouchableOpacity
				onPress={() => {
					console.log('cancel order')
				}}
			>
				<View>
					<OText
						size={_dim.width * 0.024}
						weight="500"
						color={colors.primary}
					>
						{t('CANCEL_ORDER', 'Cancel order')}
					</OText>
				</View>
			</TouchableOpacity>
		</StyledTopBar>
	);
}

interface Props {
	refRBSheet: React.RefObject<any>;
	children: any;
}

export default CartBottomSheet;
