import * as React from 'react'
import { Platform, StyleSheet, Image } from 'react-native'
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
        if (mapRef.current && props.markers.length > 0) {
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
            },1000)
        }
    }, [])

    return (
        <Wrapper>
             <MapView
                style={ styles.map }
                mapType={ Platform.OS == 'android' ? "none" : "standard" }
                // provider={ PROVIDER_GOOGLE }
                onRegionChangeComplete={setRegion.bind(this, props.region)}
                ref={ mapRef }
            >
                {
                    props.markers.map((item, index) => (
                        <Marker 
                            key={index}
                            tracksViewChanges={ false }
                            coordinate={ item.latlng }
                            anchor={{ x: -0.5, y: -0.5 }}
                        >
                            <Image
                                source={item.image}
                                resizeMode='contain'
                                style={styles.markerStyle}
                            />
                        </Marker>
                    ))
                }
            </MapView>
        </Wrapper>
    )
}

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject
    },
    markerStyle: {
        width: 45,
        height: 45,
        borderRadius: 30,
    }
})

export default OrderMap;
