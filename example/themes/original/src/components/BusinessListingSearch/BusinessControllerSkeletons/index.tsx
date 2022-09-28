import React from 'react'
import { View } from 'react-native'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'

export const BusinessControllerSkeletons = ({ paginationProps }: any) => {
  return (
    <>
      {[
        ...Array(
          paginationProps.nextPageItems
            ? paginationProps.nextPageItems
            : 3,
        ).keys(),
      ].map((item, i) => (
        <Placeholder
          Animation={Fade}
          key={i}
          style={{ width: 320, marginRight: 20, marginTop: 20 }}>
          <View style={{ width: 320 }}>
            <PlaceholderLine
              height={155}
              style={{ marginBottom: 20, borderRadius: 25 }}
            />
            <View style={{ paddingHorizontal: 10 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <PlaceholderLine
                  height={25}
                  width={40}
                  style={{ marginBottom: 10 }}
                />
                <PlaceholderLine
                  height={25}
                  width={20}
                  style={{ marginBottom: 10 }}
                />
              </View>
              <PlaceholderLine
                height={20}
                width={30}
                style={{ marginBottom: 10 }}
              />
              <PlaceholderLine
                height={20}
                width={80}
                style={{ marginBottom: 0 }}
              />
            </View>
          </View>
        </Placeholder>
      ))}
    </>
  )
}
