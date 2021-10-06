import React, { useState, useEffect, useCallback } from 'react'
import { ReviewProduct as ReviewProductController, useLanguage, ToastType, useToast } from 'ordering-components/native'
import { useTheme } from 'styled-components/native';
import { useForm, Controller } from 'react-hook-form'

import {
	ReviewOrderContainer,
	BusinessLogo,
	FormReviews,
	Category,
	Stars,
	BlockWrap,
	CommentItem,
	IconBtn,
	HWrapper
} from './styles'
import { OButton, OIcon, OInput, OText } from '../shared'
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import NavBar from '../NavBar'
import Spinner from 'react-native-loading-spinner-overlay'

import { ReviewProductParams } from '../../types'
import { REVIEW_PRODUCT_COMMENTS } from '../../config/constants';
import TagSelector from '../TagSelector';
import OBottomStickBar from '../shared/OBottomStickBar';
import { Container } from '../../..';

const SingleProduct = (props: any) => {
	const {
		handleChangeFormState,
    formState,
		product
	} = props;
	const {id, name} = product;

	const theme = useTheme();
	const [, t] = useLanguage();
	const { control, errors } = useForm()

	const [suggests] = useState(REVIEW_PRODUCT_COMMENTS.map(({key, value}) => t(key, value)));
	const [comments, setComments] = useState([])
  const [extraComment, setExtraComment] = useState('')
	const [isExtra, setShowExtra] = useState(false);
	const [isLike, setLike] = useState(0);
	
	const singleStyle = StyleSheet.create({
		hWrapper: {
			flexDirection: 'row',
			alignItems: 'center'
		},
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
	})

	const onSuggestUpdate = useCallback((items) => {
		if (items.length > 0) {
			let selected: Array<never> = [];
			items.map(({label, checked}: never) => {
				if (checked === true) {
					selected.push(label);
				}
			});
			setComments(selected);
		}
	}, []);

	useEffect(() => {
    if (comments?.length === 0 && !extraComment && formState.changes?.length === 0 && isLike) return
    let _comments = ''
    if (comments.length > 0) {
      comments.map(comment => (_comments += comment + '. '))
    }
    const _comment = _comments + extraComment
    let found = false
    const _changes = formState.changes.map((item: any) => {
      if (item?.id === product?.id) {
        found = true
        return {
          id: product?.id,
          comment: _comment,
          qualification: isLike ? 5 : 1
        }
      }
      return item
    })
    if (!found) {
      _changes.push({
        product_id: product?.id,
        comment: _comment,
        qualification: isLike ? 5 : 1
      })
    }
    handleChangeFormState && handleChangeFormState(_changes)
  }, [comments, extraComment, isLike])


	return (
		<BlockWrap key={id}>
			<HWrapper style={{justifyContent: 'space-between', marginBottom: 14}}>
				<OText size={12} lineHeight={18}>{name}</OText>
				<HWrapper>
					<IconBtn onPress={() => setLike(5)}>
						<OIcon src={theme.images.general.thumbs_up} width={16} color={isLike == 5 ? theme.colors.primary : theme.colors.textSecondary} />
					</IconBtn>
					<IconBtn onPress={() => setLike(1)}>
						<OIcon src={theme.images.general.thumbs_up} width={16} color={isLike == 1 ? theme.colors.primary : theme.colors.textSecondary} style={{transform: [{rotate: '180deg'}]}} />
					</IconBtn>
				</HWrapper>
			</HWrapper>
			<View style={{flexShrink: 1}}>
				<TagSelector 
					items={suggests} 
					activeColor={theme.colors.primary} normalColor={'#E9ECEF'} 
					onUpdated={onSuggestUpdate}
				/>
			</View>
			<TouchableOpacity onPress={() => setShowExtra(!isExtra)} style={{marginBottom: 16}}>
				<OText size={10} lineHeight={15} 
					style={{textDecorationLine: 'underline', alignSelf: 'center'}}
					color={isExtra ? theme.colors.primary : theme.colors.textSecondary}
				>
					{t('ADDITIONAL_COMMENTS', 'Additional comments')}
				</OText>
			</TouchableOpacity>
			{isExtra && 
				<FormReviews>
					<OText size={12} lineHeight={18}>{t('DO_YOU_WANT_TO_ADD_SOMETHING', 'Do you want to add something?')}</OText>
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
									setExtraComment(val)
								}}
								style={singleStyle.inputTextArea}
								multiline
								inputStyle={{fontSize: 12}}
							/>
						)}
					/>
				</FormReviews>
			}
		</BlockWrap>
	)
}

export const ReviewProductUI = (props: ReviewProductParams) => {
	const {
		order,
		products,
    formState,
    closeReviewProduct,
    handleSendProductReview,
    setIsProductReviewed,
		handleChangeFormState,
		navigation
	} = props

	const sorted = products?.map((p: any) => {
		return {
			...p,
			like: 0,
			showExtra: false,
			comments: ''
		}
	})

	const theme = useTheme();

	const [, t] = useLanguage()
	const [, { showToast }] = useToast()
	const { handleSubmit, control, errors } = useForm()
	
	const [alertState, setAlertState] = useState<{ open: boolean, content: Array<any>, success?: boolean }>({ open: false, content: [], success: false })

	const [curVal, setReviewVal] = useState(-1);
	
	const [allProducts, setAllProducts] = useState(sorted);

	const onSubmit = () => {
		// if (Object.values(stars).some(value => value === 0)) {
		// 	setAlertState({
		// 		open: true,
		// 		content: Object.values(categories).map((category, i) => stars[category.name] === 0 ? `- ${t('CATEGORY_ATLEAST_ONE', `${category.show} must be at least one point`).replace('CATEGORY', category.name.toUpperCase())} ${i !== 3 && '\n'}` : ' ')
		// 	})
		// 	return
		// }
    handleSendProductReview()
		setAlertState({ ...alertState, success: true })
	}

	useEffect(() => {
		if (formState.error && !formState?.loading) {
			showToast(ToastType.Error, formState.result)
		}
		if (!formState.loading && !formState.error && alertState.success) {
			showToast(ToastType.Success, t('REVIEW_SUCCESS_CONTENT', 'Thank you, Review successfully submitted!'))
			navigation?.navigate('ReviewDriver', {	order: order });
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

	return (
		<>
		<Container>
			<ReviewOrderContainer>
				<NavBar
					title={t('REVIEW_PRODUCT', 'Review product')}
					onActionLeft={() => navigation?.canGoBack() && navigation.goBack()}
					showCall={false}
					btnStyle={{ paddingLeft: 0 }}
					paddingTop={0}
					isVertical
					leftImg={theme.images.general.close}
					leftImageStyle={{width: 16}}
				/>
				<View style={{ paddingBottom: 30 }}>
					{allProducts && allProducts.map((p: any) =>
						<SingleProduct key={p.id} {...props} product={p} />
					)}
				</View>
				<Spinner visible={formState.loading} />
			</ReviewOrderContainer>
		</Container>
		<OBottomStickBar 
			rightBtnStyle={{borderRadius: 7.6, height: 44}} 
			rightAction={handleSubmit(onSubmit)}
			leftAction={() => navigation?.navigate('ReviewDriver', {	order: order })}
		/>
		</>
	)
}


export const ReviewProduct = (props: ReviewProductParams) => {
	const reviewProductProps = {
		...props,
		UIComponent: ReviewProductUI
	}
	return <ReviewProductController {...reviewProductProps} />
}
