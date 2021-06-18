import React from 'react';
import { Dimensions, View } from 'react-native';
import { useLanguage } from 'ordering-components/native';
import styled from 'styled-components/native'

import { Container } from '../layouts/Container';
import NavBar from '../components/NavBar';
import { OButton, OIcon, OImage, OText } from '../components/shared';
import { colors } from '../theme.json'
import { color } from 'react-native-reanimated';
import GridContainer from '../layouts/GridContainer';
import { DELIVERY_TYPE_IMAGES } from '../config/constants';

const ConfirmationPage = (props:any): React.ReactElement => {
	const {
		navigation,
		route,
	} = props;
	
	const [, t] = useLanguage();

  const goToBack = () => navigation.goBack();

  return (
		<>
			<Container>
				<NavBar
					title={t('TAKE_YOUR_RECEIPT', 'Take your receipt')}
					onActionLeft={goToBack}
				/>

				<View style={{ marginVertical: _dim.height * 0.03 }}>
					<OText
						size={_dim.width * 0.05}
						mBottom={15}
					>
						{t('WE_KNOW_YOU_ARE', 'We know you are')} {'\n'}
						<OText
							size={_dim.width * 0.05}
							weight="700"
						>
							{`${t('HUNGRY', 'hungry')}, Cuco!`}
						</OText>
					</OText>

					<OText
						size={_dim.width * 0.04}
					>
						{t('TO_FINISH_TAKE_YOUR_RECEIPT_AND_GO_TO_THE_FRONT_COUNTER', 'To finish take your receipt and go to the front counter.')}
					</OText>
				</View>

				<OSOrderDetailsWrapper>
					<OSTable>
						<OText>
							<OText
								size={_dim.width * 0.04}
								weight="700"
							>
								{t('ORDER_NUMBER', 'Order No.')} {' '}
							</OText>
							<OText
								size={_dim.width * 0.04}
								weight="700"
								color={colors.primary}
							>
								{'347272'}
							</OText>
						</OText>
					</OSTable>

					<OSTable>
						<View>
							<OText
								weight="bold"
								mBottom={15}
							>
								{`${4} ${t('ITEMS', 'items')}`}
							</OText>

							<GridContainer style={{ maxWidth: _dim.width * 0.6 }}>
								{Array(4).fill(null).map(_ => (
									<OImage
										source={DELIVERY_TYPE_IMAGES.eatIn}
										resizeMode="cover"
										height={80}
										width={80}
										borderRadius={8}
										style={{ marginEnd: 10, marginBottom: 10 }}
									/>
								))}
							</GridContainer>
						</View>

						<OText
							color={colors.primary}
							weight="bold"
						>
							$50.00
						</OText>
					</OSTable>

					<OSTable>
						<OText
							weight="bold"
							mBottom={15}
						>
							{t('PROMO_CODE', 'Promo code')}
							{'\n'}
							<OText weight="400">
								$25 off
							</OText>
						</OText>

						<OText
							color={colors.primary}
							weight="bold"
						>
							-$12.00
						</OText>
					</OSTable>

					<OSTable style={{ justifyContent: 'flex-end' }}>
						<OText
							weight="bold"
							style={{ textAlign: 'right' }}
						>
							{t('TOTAL', 'Total')}
							{'\n'}
							<OText
								color={colors.primary}
								weight="bold"
							>
								$37.50
							</OText>
						</OText>
					</OSTable>
				</OSOrderDetailsWrapper>
			</Container>

			<OSActions>
				<OButton
					text={`${t('YOU ARE DONE', 'You are done')}!`}
				/>
			</OSActions>
		</>
	);
};

const OSOrderDetailsWrapper = styled.View`
	min-height: 320px;
	background-color: ${colors.whiteGray}
	padding: 20px;
	border-radius: 6px;
`

const OSTable = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
`

const OSActions = styled.View`
  position: relative;
  bottom: 0px;
  width: 100%;
  background-color: #FFF;
	z-index: 1000;
	padding: 20px;
`

const _dim = Dimensions.get('window');

export default ConfirmationPage;
