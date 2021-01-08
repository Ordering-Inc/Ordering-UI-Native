import * as React from 'react'
import { Platform, StyleSheet } from 'react-native'
import MapView, { Region, PROVIDER_GOOGLE, Marker, LatLng } from 'react-native-maps'
import { MapWrapper } from './styles';

export interface MapInterface {
    region?: Region,
    onChangeRegion?: any,
    markers: Array<{latlng: LatLng, image: any}>
}

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
                        animated: false
                    });
            },500)
        }
    })

    return (
        <MapWrapper>
            <MapView 
                style={ style.map }
                mapType={ Platform.OS == 'android' ? "none" : "standard" }
                provider={ PROVIDER_GOOGLE }
                onRegionChangeComplete={setRegion.bind(this, props.region)}
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
        </MapWrapper>
    )
}

const style = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject
    }
})

export default OrderMap;