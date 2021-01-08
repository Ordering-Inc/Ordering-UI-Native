import * as React from 'react';
import { Rating } from 'react-native-elements';
import { IMAGES } from '../../config/constants';
import { buttonTheme } from '../../globalStyles';
import BottomWrapper from '../bottom-wrapper';
import { OButton, OText } from '../shared';
import { Avatar, FindingBtn, InnerWrapper, NameView, UserInfoView } from './styles';

const DriverOnOff = (props: any) => {

    const [is_online, setOnline] = React.useState(props.is_online)

    const onUpdateStatus = () => {

    }

    return (
        <BottomWrapper>
            <InnerWrapper>
                <UserInfoView style={{ flexShrink: 1 }}>
                    <Avatar source={IMAGES.avatar}></Avatar>
                    <NameView>
                        <OText size={17} weight={'700'} style={{marginBottom: 4}}>{'Smeeth Jhone Bailang'}</OText>
                        <Rating imageSize={12} readonly></Rating>
                    </NameView>
                </UserInfoView>
                <OButton
                    onClick={onUpdateStatus}
                    imgLeftSrc={IMAGES.arrow_up}
                    imgRightSrc={null}
                    imgLeftStyle={{ tintColor: 'white', width: 15, height: 15, marginRight: -5 }}
                    style={{ paddingLeft: 10, paddingRight: 4}}
                    text={'You\'re offline'}
                    bgColor={is_online ? buttonTheme.backgroundColor : buttonTheme.disabledBackgroundColor} 
                    borderColor={is_online ? buttonTheme.borderColor : buttonTheme.disabledBorderColor}
                    textStyle={{ color: 'white' }}
                />
            </InnerWrapper>
            {is_online ? (
                <FindingBtn>
                    <OText>{'FINDING TRIPS'}</OText>
                </FindingBtn>
            ) : null}
        </BottomWrapper>
    )
}

export default DriverOnOff;