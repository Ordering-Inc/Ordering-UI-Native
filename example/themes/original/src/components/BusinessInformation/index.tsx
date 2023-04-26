import React, { useState, useCallback } from 'react';
import {
	BusinessInformation as BusinessInformationController,
	useLanguage, useUtils, useConfig,
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { OIcon, OText } from '../shared';
import {
	BusinessInformationContainer,
	WrapMainContent,
	GrayBackground,
	WrapScheduleBlock,
	ScheduleBlock,
	WrapBusinessMap,
	InnerContent,
	DivideView,
	MediaWrapper,
} from './styles';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { BusinessInformationParams } from '../../types';
import { GoogleMap } from '../GoogleMap';
import { WebView } from 'react-native-webview';
import { formatUrlVideo } from '../../utils'
import { ScheduleAccordion } from '../ScheduleAccordion';
import moment from 'moment';
import { DeviceOrientationMethods } from '../../../../../src/hooks/DeviceOrientation'
const { useDeviceOrientation } = DeviceOrientationMethods

const BusinessInformationUI = (props: BusinessInformationParams) => {
	const { businessState, businessSchedule, businessLocation } = props;

	const theme = useTheme();
	const [, t] = useLanguage();
	const [{ optimizeImage }] = useUtils();
	const [{ configs }] = useConfig()
	const [orientationState] = useDeviceOrientation();

	const [isReadMore, setIsReadMore] = useState(false)
	const [lengthMore, setLengthMore] = useState(false)
	const WIDTH_SCREEN = orientationState?.dimensions?.width

	const hideLocation = theme?.business_view?.components?.information?.components?.location?.hidden
	const hideSchedule = theme?.business_view?.components?.information?.components?.schedule?.hidden
	const hideVideos = theme?.business_view?.components?.information?.components?.videos?.hidden
	const hideImages = theme?.business_view?.components?.information?.components?.images?.hidden
	const hideAddress = theme?.business_view?.components?.information?.components?.address?.hidden
	const formatTime = configs?.general_hour_format?.value

	const checkTime = (val: number) => (val < 10 ? `0${val}` : val);
	const timeFormated = (time: any) => {
		return moment(`1900-01-01 ${checkTime(time.hour)}:${checkTime(time.minute)}`).format(formatTime)
	}

	const businessCoordinate = {
		lat: businessState?.business?.location?.lat,
		lng: businessState?.business?.location?.lng,
	};
	const businessImage = {
		uri: businessState?.business?.logo,
	};
	const businessMarker = {
		latlng: businessCoordinate,
		image: businessImage,
	};

	const bVideos = () => {
		const len = businessState?.business?.gallery?.length | 0;
		if (len == 0) return [];
		const vAry = businessState?.business?.gallery.filter(
			({ type, file }: any) => type == 2 && file == null,
		);
		return vAry;
	};
	//{uri: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4?_=1'}
	const bImages: any = () => {
		const len = businessState?.business?.gallery?.length | 0;
		if (len == 0) return [];
		const iAry = businessState?.business?.gallery.filter(
			({ type, video }: any) => type == 1 && video == null,
		);
		return iAry;
	};

	const onTextLayout = useCallback((e: any) => {
		setLengthMore((e.nativeEvent.lines.length == 3 && e.nativeEvent.lines[2].width > WIDTH_SCREEN * .76) || e.nativeEvent.lines.length > 3)
	}, [])

	return (
		<BusinessInformationContainer>
			<WrapMainContent contentContainerStyle={{}}>
				<InnerContent>
					<OText size={24} weight={'600'}>
						{businessState?.business?.name}
					</OText>
					{!hideLocation && (
						<>
							<GrayBackground>
								<OText size={16} weight="500">
									{t('BUSINESS_LOCATION', 'Business Location')}
								</OText>
							</GrayBackground>
							{businessLocation.location && (
								<WrapBusinessMap style={styles.wrapMapStyle}>
									<GoogleMap
										readOnly
										location={businessLocation.location}
										markerTitle={businessState?.business?.name}
									/>
								</WrapBusinessMap>
							)}
						</>
					)}
					{!hideAddress && (
						<OText size={12} mBottom={10}>
							{businessState?.business?.address}
						</OText>
					)}
					{businessState?.business?.address_notes && (
						<>
							<OText
								size={12}
								mBottom={10}
								numberOfLines={isReadMore ? 20 : 3}
								onTextLayout={onTextLayout}
							>
								{businessState?.business?.address_notes}
							</OText>
							{lengthMore && (
								<TouchableOpacity
									onPress={() => setIsReadMore(!isReadMore)}
								>
									<OText size={12} mBottom={20} color={theme.colors.primary}>{isReadMore ? t('SHOW_LESS', 'Show less') : t('READ_MORE', 'Read more')}</OText>
								</TouchableOpacity>
							)}
						</>
					)}
					<DivideView />
					{!hideSchedule && (
						<>
							<GrayBackground>
								<OText size={16} weight="500">
									{t('OPENING_TIME', 'Opening Time')}
								</OText>
							</GrayBackground>
							{businessSchedule && businessSchedule?.length > 0 && (
								<WrapScheduleBlock>
									{businessSchedule.map((schedule: any, i: number) => (
										<ScheduleBlock key={i}>
											<ScheduleAccordion
												weekIndex={i}
												timeFormated={timeFormated}
												schedule={schedule}
											/>
										</ScheduleBlock>
									))}
								</WrapScheduleBlock>
							)}
						</>
					)}

					{/* {businessState?.business?.gallery?.length > 0 && ( */}

					<>
						{!hideVideos && (
							<>
								{bVideos().length > 0 && (
									<>
										<DivideView />
										<GrayBackground>
											<OText size={16} weight="500">
												{t('VIDEOS', 'Videos')}
											</OText>
										</GrayBackground>
										<MediaWrapper horizontal>
											{bVideos().map((v: any) => (
												<WebView
													key={`vid_id_${v.id}`}
													style={{ width: 210, height: 127, borderRadius: 7.6 }}
													javaScriptEnabled={true}
													domStorageEnabled={true}
													source={{
														html: `
												<iframe width='80%' height='80%' src="${formatUrlVideo(v.video)}" frameBorder='0' allow='autoplay; encrypted-media' allowFullScreen />
												`,
													}}
													mediaPlaybackRequiresUserAction={true}
												/>
											))}
										</MediaWrapper>
									</>
								)}
							</>
						)}

						{!hideImages && (
							<>
								{bImages().length > 0 && (
									<>
										<DivideView />
										<GrayBackground>
											<OText size={16} weight="500">
												{t('IMAGES', 'Images')}
											</OText>
										</GrayBackground>
										<MediaWrapper horizontal>
											{bImages().map((i: any) => (
												i.file != null &&
												<View key={i.id} style={{ width: 210, height: 127, borderRadius: 7.6, marginEnd: 20, overflow: 'hidden' }}>
													<OIcon cover url={optimizeImage(i?.file, 'h_150,c_limit')} width={210} height={127} />
													{/* <OText size={12} color={colors.red} style={{position: 'absolute'}}>{i.file}</OText> */}
												</View>
											))}
										</MediaWrapper>
									</>
								)}
							</>
						)}
					</>
					{/* )} */}
				</InnerContent>
			</WrapMainContent>
		</BusinessInformationContainer>
	);
};

const styles = StyleSheet.create({
	wrapMapStyle: {
		overflow: 'hidden',
		marginTop: 15,
		marginBottom: 10,
	},
});

export const BusinessInformation = (props: BusinessInformationParams) => {
	const BusinessInformationProps = {
		...props,
		UIComponent: BusinessInformationUI,
	};
	return <BusinessInformationController {...BusinessInformationProps} />;
};
