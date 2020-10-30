import * as React from 'react';
import { Text, View } from 'react-native';
import { Rating } from 'react-native-elements';
import styled from 'styled-components/native';
import BottomWrapper from '../components/BottomWrapper';
import OrderMap from '../components/OrderMap';
import OrderList from '../components/OrderList';
import OButton from '../components/shared/OButton';
import { colors } from '../theme';

const Wrapper = styled.View`
    height: 100%;
`
const TopActions = styled.View`
    position: absolute;
    width: 100%;
    min-height: 80px;
    background-color: transparent;
    padding: 40px 25px 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    top: 0;
    z-index: 5;
`
const InnerWrapper = styled.View`
    flex: 1;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`
const NameView = styled.View`
    flex-shrink: 1;
    align-items: flex-start;
`
const UserInfoView = styled.View`
    flex-direction: row;
    align-items: center;
    padding-right: 5px;
`
const Avatar = styled.Image`
    width: 60px;
    height: 60px; 
    margin-right: 6px;
    border-radius: 8px;
`
const FindingBtn = styled.TouchableOpacity`
    margin-top: 16px;
    margin-bottom: 10px;
    align-items: center;
`

export const IMAGES = {
    menu: require('../assets/icons/menu.png'),
    lunch: require('../assets/icons/lunch.png'),
    avatar: require('../assets/images/avatar.jpg'),
    arrow_up: require('../assets/icons/arrow_up.png'),
    map: require('../assets/icons/map.png'),
}
export const marker = require('../assets/images/marker.png');

interface Props {
    is_online: boolean,

}

const RecieveOrder = ({ navigation, route }: any) => {

    var [is_online, updateStatus] = React.useState(route.params.is_online)
    var [show_map, updateView] = React.useState(true)

    let markers = [
        {
            latlng: { latitude: 37.78825, longitude: -122.4324 },
            image: marker
        },
        {
            latlng: { latitude: 37.79825, longitude: -122.4524 },
            image: marker
        },
        {
            latlng: { latitude: 37.78925, longitude: -122.3324 },
            image: marker
        }
    ]

    React.useEffect(() => {
        // onChangeStatus(!is_online)
    })

    let onOffStatus = () => {
        updateStatus(!is_online)
    }

    let onChangeView = () => {
        updateView(!show_map)
    }
    
    return (
        <Wrapper>
            <TopActions>
                <OButton
                    isCircle={true}
                    onClick={() => { }}
                    imgRightSrc={null}
                    imgLeftSrc={IMAGES.menu} 
                />
                <OButton 
                    onClick={onChangeView} 
                    imgRightSrc={null}
                    imgLeftSrc={show_map ? IMAGES.lunch : IMAGES.map} 
                    text={show_map ? 'Order View' : 'Map View'} 
                />
            </TopActions>
            {show_map
                ? (
                    <OrderMap       
                        region={{
                            latitude: 37.78825,
                            longitude: -122.4324,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        markers={markers}
                    /> 
                )
                : (
                    <OrderList orders={[]} navigation={navigation}></OrderList>
                )
            }
            
            <BottomWrapper>
                <InnerWrapper>
                    <UserInfoView style={{ flexShrink: 1 }}>
                        <Avatar source={IMAGES.avatar}></Avatar>
                        <NameView>
                            <Text style={{ fontSize: 17, marginBottom: 4, fontWeight: '700'}}>{'Smeeth Jhone Bailang'}</Text>
                            <Rating imageSize={12} readonly></Rating>
                        </NameView>
                    </UserInfoView>
                    <OButton
                        onClick={onOffStatus}
                        imgLeftSrc={IMAGES.arrow_up}
                        imgRightSrc={null}
                        imgLeftStyle={{ tintColor: 'white', width: 15, height: 15, marginRight: -5 }}
                        style={{ paddingLeft: 10, paddingRight: 4}}
                        text={'You\'re offline'}
                        bgColor={is_online ? colors.primary : colors.backgroundDark} 
                        borderColor={is_online ? colors.primary : colors.backgroundDark}
                        textStyle={{ color: 'white' }}
                    />
                </InnerWrapper>
                {is_online ? (
                    <FindingBtn>
                        <Text>{'FINDING TRIPS'}</Text>
                    </FindingBtn>
                ) : null}
                
            </BottomWrapper>
        </Wrapper>
    );
}

export default RecieveOrder;