
import React from 'react'
import { useTheme } from 'styled-components/native'
import { BusinessesListing as OriginalBusinessListing } from './Layout/Original'
import { BusinessesListing as AppointmentBusinessListing } from './Layout/Appointment'

export const BusinessesListing = (props: any) => {
	const theme = useTheme()
	const layout = theme?.layout?.businessListing?.layout?.type || 'original'

	return (
    <>
      {(layout === 'original') && <OriginalBusinessListing {...props} />}
      {(layout === 'appointment') && <AppointmentBusinessListing {...props} />}
    </>
	)
}
