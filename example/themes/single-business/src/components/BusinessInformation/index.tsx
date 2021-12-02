import React, { useState } from 'react';
import {
	BusinessInformation as BusinessInformationController,
	useLanguage, useUtils
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { SliderBox } from 'react-native-image-slider-box';
import { OIcon, OText, OModal } from '../shared';
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
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { BusinessInformationParams } from '../../types';
import { GoogleMap } from '../GoogleMap';
import { WebView } from 'react-native-webview';
import NavBar from '../../../../../src/components/NavBar'

const BusinessInformationUI = (props: BusinessInformationParams) => {
	const { businessState, business, businessSchedule, businessLocation } = props;

	const theme = useTheme();
	const [, t] = useLanguage();
	const [{ optimizeImage }] = useUtils();

  const [openImages, setOpenImages] = useState(false)

	const daysOfWeek = [
		t('SUNDAY_ABBREVIATION', 'Sun'),
		t('MONDAY_ABBREVIATION', 'Mon'),
		t('TUESDAY_ABBREVIATION', 'Tues'),
		t('WEDNESDAY_ABBREVIATION', 'Wed'),
		t('THURSDAY_ABBREVIATION', 'Thur'),
		t('FRIDAY_ABBREVIATION', 'Fri'),
		t('SATURDAY_ABBREVIATION', 'Sat'),
	];
	const scheduleFormatted = ({
		hour,
		minute,
	}: {
		hour: number | string;
		minute: number | string;
	}) => {
		const checkTime = (val: number | string) => (val < 10 ? `0${val}` : val);
		const zz = hour > 12 ? 'PM' : 'AM';
		const h = parseInt(`${hour}`);
		return `${h > 12 ? h - 12 : h}:${checkTime(minute)} ${zz}`;
	};
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
	const bImages: any = () => {
		const len = businessState?.business?.gallery?.length ?? 0;
		if (len == 0) return [];
		const iAry = businessState?.business?.gallery.filter(
			({ type, video }: any) => type == 1 && video == null,
		);
		return iAry;
	};

	return (
		<BusinessInformationContainer>
      <NavBar
        style={{ paddingBottom: 0 }}
        onActionLeft={() => props.navigation?.canGoBack() && props.navigation.goBack()}
      />
			<WrapMainContent contentContainerStyle={{}}>
				<InnerContent>
					<OText size={24} weight={Platform.OS === 'ios' ? '600' : 'bold'}>
						{businessState?.business?.name}
					</OText>
					<GrayBackground>
						<OText size={16} weight={Platform.OS === 'ios' ? '600' : 'bold'}>
							{t('BUSINESS_LOCATION', 'Business Location')}
						</OText>
					</GrayBackground>
					{!!businessLocation.location && (
						<WrapBusinessMap style={styles.wrapMapStyle}>
							<GoogleMap
								readOnly
								location={businessLocation.location}
								markerTitle={businessState?.business?.name}
							/>
						</WrapBusinessMap>
					)}
					<OText size={12} mBottom={20}>
						{businessState?.business?.address}
					</OText>
					<DivideView />
					<GrayBackground>
						<OText size={16} weight={Platform.OS === 'ios' ? '600' : 'bold'}>
							{t('OPENING_TIME', 'Opening Time')}
						</OText>
					</GrayBackground>
					{!!businessSchedule && businessSchedule?.length > 0 && (
						<WrapScheduleBlock>
							{businessSchedule.map((schedule: any, i: number) => (
								<ScheduleBlock key={i}>
									<OText
										lineHeight={21}
										mBottom={16}
										size={14}
										weight={Platform.OS === 'ios' ? '600' : 'bold'}
										style={{ flexBasis: '20%' }}>
										{daysOfWeek[i].toUpperCase()}
									</OText>
									{schedule.enabled ? (
										<OText mBottom={16}>
											{scheduleFormatted(schedule.lapses[0].open) +
												' - ' +
												scheduleFormatted(schedule.lapses[0].close)}
										</OText>
									) : (
										<OText color={theme.colors.red} mBottom={16}>
											{t('CLOSED', 'Closed')}
										</OText>
									)}
								</ScheduleBlock>
							))}
						</WrapScheduleBlock>
					)}
					<>
						{bVideos().length > 0 && (
							<>
								<DivideView />
								<GrayBackground>
									<OText size={16} weight={Platform.OS === 'ios' ? '600' : 'bold'}>
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
											source={{ uri: v.video }}
										/>
									))}
								</MediaWrapper>
							</>
						)}
						{bImages().length > 0 && (
							<>
								<DivideView />
								<GrayBackground>
									<OText size={16} weight={Platform.OS === 'ios' ? '600' : 'bold'}>
										{t('IMAGES', 'Images')}
									</OText>
								</GrayBackground>

								<MediaWrapper horizontal>
									{bImages().map((i: any) => ( i.file != null && (
                    <View key={i.id} style={{ width: 210, height: 127, borderRadius: 7.6, marginEnd: 20, overflow: 'hidden' }}>
                      <TouchableOpacity  onPress={() => setOpenImages(true)}>
                        <OIcon cover url={optimizeImage(i?.file, 'h_150,c_limit')} width={210} height={127} />
                      </TouchableOpacity>
                    </View>
                  )))}
								</MediaWrapper>
							</>
						)}
					</>
				</InnerContent>
			</WrapMainContent>
      <OModal
				titleSectionStyle={styles.modalTitleSectionStyle}
				open={openImages}
				onClose={() => setOpenImages(false)}
				isNotDecoration
      >
        <View style={{ height: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          <View style={{ marginTop: 20, height: 200}}>
            <SliderBox
              // circleLoop
              sliderBoxHeight={200}
              images={bImages().map((image: any) => optimizeImage(image?.file, 'h_300,c_limit'))}
              dotColor={theme.colors.primary}
              inactiveDotColor={theme.colors.backgroundGray}
              dotStyle={styles.dotStyle}
              activeOpacity={1}
            />
          </View>
        </View>
			</OModal>
		</BusinessInformationContainer>
	);
};

const styles = StyleSheet.create({
	wrapMapStyle: {
		overflow: 'hidden',
		marginTop: 15,
		marginBottom: 10,
	},
  dotStyle: {
    width: 15,
    height: 15,
    borderRadius: 15,
    marginHorizontal: 10,
    padding: 0,
    margin: 0
  },
  modalTitleSectionStyle: {
		position: 'absolute',
		width: '100%',
		top: 0,
		zIndex: 100,
		left: 40
	},
});

export const BusinessInformation = (props: BusinessInformationParams) => {
	const BusinessInformationProps = {
		...props,
		UIComponent: BusinessInformationUI,
	};
	return <BusinessInformationController {...BusinessInformationProps} />;
};
