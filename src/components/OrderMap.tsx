import * as React from 'react'
import { StyleSheet } from 'react-native'
import MapView, { Region, PROVIDER_GOOGLE, Marker, LatLng } from 'react-native-maps'
import styled from 'styled-components/native'

export interface MapInterface {
    region?: Region,
    onChangeRegion?: any,
    markers: Array<{latlng: LatLng, image: any}>
}

const Wrapper = styled.View`
    height: 100%;
`

const OrderMap = (props: MapInterface) => {
    const mapRef = React.useRef<MapView>(null);
    const [region, setRegion] = React.useState(props.region);
    
    React.useEffect(() => {
        if (mapRef.current) {
            setTimeout(()=>{
                mapRef.current?.fitToCoordinates(
                    props.markers.map(item => item.latlng), 
                    {
                        edgePadding: {
                            top: 100,
                            left: 50,
                            right: 50,
                            bottom: 300
                        },
                        animated: true
                    });
            },600)
        }
    }, [])

    return (
        <Wrapper>
            <MapView 
                style={ style.map }
                provider={ PROVIDER_GOOGLE }
                onRegionChangeComplete={region => setRegion(region)}
                ref={ mapRef }
            >
                {
                    props.markers.map((item, index) => (
                        <Marker 
                            key={index}
                            tracksViewChanges={ false }
                            coordinate={ item.latlng }
                            image={ item.image }
                        />
                    ))
                }
            </MapView>
        </Wrapper>
    )
}

const style = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject
    }
})

export default OrderMap;