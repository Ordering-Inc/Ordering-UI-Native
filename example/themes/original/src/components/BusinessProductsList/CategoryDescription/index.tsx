import React from 'react'
import { OModal, OText, OIcon } from '../../shared'
import { ScrollView } from 'react-native'
import { useUtils } from 'ordering-components/native'

interface CategoryDescriptionParams {
    openDescription?: {name: string, image: string, description: string} | null,
    setOpenDescription: any;
}

function categoryDescriptionPropsAreEqual(prev : any, next : any) {
    return prev.openDescription === next.openDescription
}

const CategoryDescription = (props : CategoryDescriptionParams) => {
    const [{ optimizeImage }] = useUtils()
    return (
        <OModal
            open={!!props.openDescription}
            onClose={() => props.setOpenDescription(null)}
            styleContainerCloseButton={{
                marginLeft: -30,
                width: 55,
                height: 55,
                marginTop: 2
            }}
        >
            <OText size={20} style={{ paddingLeft: 70, paddingRight: 20, bottom: 25 }}>{props.openDescription?.name}</OText>
            <ScrollView style={{ padding: 20 }}>
                {!!props.openDescription?.image && (
                    <OIcon
                        url={optimizeImage(props.openDescription?.image, 'h_100,c_limit')}
                        width={240}
                        height={240}
                        style={{ borderRadius: 7.6 }}
                    />
                )}
                <OText mBottom={60}>{props.openDescription?.description}</OText>
            </ScrollView>
        </OModal>
    )
}

export const CategoryDescriptionMemoized = React.memo(CategoryDescription,categoryDescriptionPropsAreEqual)
