import React, { useState, useEffect, useCallback } from 'react'
import { ReviewDriver as ReviewDriverController, useLanguage, ToastType, useToast } from 'ordering-components/native'
import { useTheme } from 'styled-components/native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useForm, Controller } from 'react-hook-form'

import {
	ReviewOrderContainer,
	BusinessLogo,
	FormReviews,
	Category,
	Stars,
	BlockWrap,
	CommentItem
} from './styles'
import { OButton, OIcon, OInput, OText } from '../shared'
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import NavBar from '../NavBar'
import Spinner from 'react-native-loading-spinner-overlay'

import { ReviewDriverParams } from '../../types'
import { REVIEW_DRIVER_COMMENTS } from '../../config/constants';
import TagSelector from '../TagSelector';
import OBottomStickBar from '../shared/OBottomStickBar';
import { Container } from '../../..';

export const ReviewDriverUI = (props: ReviewDriverParams) => {
	const {
		dirverReviews,
    order,
    formState,
    setDriverReviews,
    closeReviewDriver,
    setIsDriverReviewed,
    handleSendDriverReview,
		navigation
	} = props

	const theme = useTheme();

	const styles = StyleSheet.create({
		inputTextArea: {
			borderColor: theme.colors.border,
			borderRadius: 7.6,
			marginVertical: 10,
			height: 100,
			alignItems: 'flex-start',
			paddingVertical: 12,
			fontSize: 10,
			marginBottom: 30
		},
		progress: {
			borderRadius: 5,
			height: 4,
			backgroundColor: theme.colors.backgroundGray200,
			marginVertical: 9,
		},
		progressLabel: {
			flexDirection: 'row',
			justifyContent: 'space-between',
		},
	})

	const [, t] = useLanguage()
	const [, { showToast }] = useToast()
	const { handleSubmit, control, errors } = useForm()
	
	const [alertState, setAlertState] = useState<{ open: boolean, content: Array<any>, success?: boolean }>({ open: false, content: [], success: false })

	const [curVal, setReviewVal] = useState(-1);
	const [curSuggest] = useState(REVIEW_DRIVER_COMMENTS.map(({key, value}) => t(key, value)));
	const [selectedSuggest, setSelectedSuggest] = useState([]);
	const [comment, setComment] = useState('');


	// const handleChangeReviews = (index) => {
  //   if (index) setDriverReviews({ ...dirverReviews, qualification: index })
  // }

  const onSubmit = () => {
    if (dirverReviews?.qualification === 0) {
      setAlertState({
        open: true,
        content: [`${t('REVIEW_QUALIFICATION_REQUIRED', 'Review qualification is required')}`]
      })
      return
    }
    setAlertState({ ...alertState, success: true })
    handleSendDriverReview()
  }

	const onSuggestUpdate = useCallback((items) => {
		if (items.length > 0) {
			let selected: Array<never> = [];
			items.map(({label, checked}: never) => {
				if (checked === true) {
					selected.push(label);
				}
			});
			setSelectedSuggest(selected);
		}
	}, []);

	const handleNext = (type: number) => {
		if (type == 1) handleSubmit(onSubmit)
		navigation?.navigate('BottomTab', { screen: 'MyOrders' });
	}

	useEffect(() => {
		if (formState.error && !formState?.loading) {
			showToast(ToastType.Error, formState.result)
		}
		if (!formState.loading && !formState.error && alertState.success) {
			showToast(ToastType.Success, t('REVIEW_SUCCESS_CONTENT', 'Thank you, Review successfully submitted!'))
			setIsDriverReviewed && setIsDriverReviewed(true)
			handleNext(0);
		}
	}, [formState.result])

	useEffect(() => {
		if (Object.keys(errors).length > 0) {
			// Convert all errors in one string to show in toast provider
			const list = Object.values(errors);
			let stringError = '';
			list.map((item: any, i: number) => {
				stringError +=
					i + 1 === list.length ? `- ${item.message}` : `- ${item.message}\n`;
			});
			showToast(ToastType.Error, stringError);
		}
	}, [errors]);

	useEffect(() => {
		if (alertState.open) {
			alertState.content && showToast(
				ToastType.Error,
				alertState.content
			)
		}
	}, [alertState.content])

  useEffect(() => {
    let _comments = comment || '';
    if (selectedSuggest.length > 0) {
      _comments = _comments + ', ' + selectedSuggest.join(', ');
    }
    setDriverReviews({ ...dirverReviews, comment: _comments, qualification: 5 })
  }, [comment, selectedSuggest])

	return (
		<>
		<Container>
			<ReviewOrderContainer>
				<NavBar
					title={t('REVIEW_ORDER', 'Review Order')}
					titleAlign={'center'}
					onActionLeft={() => navigation?.canGoBack() && navigation.goBack()}
					showCall={false}
					btnStyle={{ paddingLeft: 0 }}
					paddingTop={0}
					isVertical
					leftImg={theme.images.general.close}
					leftImageStyle={{width: 16}}
				/>
				<BusinessLogo>
					<OIcon 
						url={order?.driver?.photo || theme.images.dummies.driverPhoto} 
						width={72} height={72} 
						style={{borderRadius: 7.6, backgroundColor: theme.colors.inputDisabled}} 
					/>
					<OText size={14} lineHeight={21}>{order?.driver?.name}</OText>
				</BusinessLogo>
				<View style={{ paddingBottom: 0 }}>
					<BlockWrap>
						<OText mBottom={16}>{t('COMMENTS', 'Comments')}</OText>
						<View style={{flexShrink: 1}}>
							<TagSelector items={curSuggest} activeColor={theme.colors.primary} normalColor={'#E9ECEF'} onUpdated={onSuggestUpdate} />
						</View>
					</BlockWrap>
					<FormReviews>
						<OText mBottom={10}>{t('DO_YOU_WANT_TO_ADD_SOMETHING', 'Do you want to add something?')}</OText>
						<Controller
							control={control}
							defaultValue=''
							name='comments'
							render={({ onChange }: any) => (
								<OInput
									name='comments'
									placeholder={t('COMMENTS', 'Comments')}
									onChange={(val: string) => {
										onChange(val)
										setComment(val)
									}}
									style={styles.inputTextArea}
									multiline
									inputStyle={{fontSize: 12}}
								/>
							)}
						/>
					</FormReviews>
				</View>
				<Spinner visible={formState.loading} />
			</ReviewOrderContainer>
		</Container>
		<OBottomStickBar 
			rightBtnStyle={{borderRadius: 7.6, height: 44}} 
			rightAction={() => handleNext(1)}
			leftAction={() => handleNext(0)}
		/>
		</>
	)
}


export const ReviewDriver = (props: ReviewDriverParams) => {
	const reviewDriverProps = {
		...props,
		UIComponent: ReviewDriverUI
	}
	return <ReviewDriverController {...reviewDriverProps} />
}
