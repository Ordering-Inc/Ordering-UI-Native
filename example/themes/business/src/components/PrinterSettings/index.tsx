import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { useTheme } from 'styled-components/native'
import { useLanguage } from 'ordering-components/native'

import { _setStoreData, _retrieveStoreData } from '../../providers/StoreUtil'
import { Container } from './styles'
import { OText } from '../shared'

export const PrinterSettings = (props: any) => {
  const { onClose } = props

  const [currentPrinter, setCurrentPrinter] = useState<any>(null)

  const [, t] = useLanguage()
  const theme = useTheme()

  const styles = StyleSheet.create({
    icons: {
      maxWidth: 40,
      height: 40,
      padding: 10,
      alignItems: 'flex-end'
    },
  })

  const printerList = [
    { model: 'mPOP', emulation: 'StarPRNT', portName: 'BT:TSP100' },
    { model: 'FVP10', emulation: 'StarLine', portName: 'BT:TSP100' },
    { model: 'TSP100', emulation: 'StarGraphic', portName: 'BT:TSP100' },
    { model: 'TSP65011', emulation: 'StarLine', portName: 'BT:TSP100' },
    { model: 'TSP7001', emulation: 'StarLine', portName: 'BT:TSP100' },
    { model: 'TSP80011', emulation: 'StarLine', portName: 'BT:TSP100' },
    { model: 'SP700', emulation: 'StarDotimpact', portName: 'BT:TSP100' },
    { model: 'SM-S210i', emulation: 'EscPosMobile', portName: 'BT:TSP100' },
    { model: 'SM-S220i', emulation: 'EscPosMobile', portName: 'BT:TSP100' },
    { model: 'SM-S230i', emulation: 'EscosMobile', portName: 'BT:TSP100' },
    { model: 'SM-T300i/T300', emulation: 'EscPosMobile', portName: 'BT:TSP100' },
    { model: 'SM-T400i', emulation: 'EscosMobile', portName: 'BT:TSP100' },
    { model: 'SM-L200', emulation: 'StarPRNT', portName: 'BT:TSP100' },
    { model: 'SM-L300', emulation: 'StarPRNT', portName: 'BT:TSP100' },
    { model: 'BSC10', emulation: 'EscPos', portName: 'BT:TSP100' },
    { model: 'SM-S210i StarPRNT', emulation: 'StarPRNT', portName: 'BT:TSP100' },
    { model: 'SM-S220i StarPRNT', emulation: 'StarPRNT', portName: 'BT:TSP100' },
    { model: 'SM-S230i StarPRNT', emulation: 'StarPRNT', portName: 'BT:TSP100' },
    { model: 'SM-T300i/T300 StarPRNT', emulation: 'StarPRNT', portName: 'BT:TSP100' },
    { model: 'SM-T400i StarPRNT', emulation: 'StarPRNT', portName: 'BT:TSP100' },
  ]

  const handleClick = async (item: any) => {
    setCurrentPrinter(item)
    await _setStoreData('printer', item)
    onClose && onClose()
  }

  useEffect(() => {
    const getPrinterDefault = async () => {
      const printer = await _retrieveStoreData('printer')
      setCurrentPrinter(printer)
    }

    getPrinterDefault()
  }, [])

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
    >
      <OText size={24} style={{ paddingLeft: 30 }}>
        {t('PRINTER_SETTINGS', 'Printer Settings')}
      </OText>
      <View style={{ padding: 30 }}>
        {printerList.map((item: any, i: number) => (
          <Container
            key={i}
            activeOpacity={1}
            onPress={() => handleClick(item)}
          >
            <TouchableOpacity
              activeOpacity={1}
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={() => handleClick(item)}
            >
              <SimpleLineIcons
                name='printer'
                color={theme.colors.textGray}
                size={18}
                style={{ ...styles.icons, color: currentPrinter?.model === item.model ? theme.colors.primary : theme.colors.textGray }}
              />
              <OText
                size={18}
                color={currentPrinter?.model === item.model ? theme.colors.primary : theme.colors.textGray}
              >
                {item.model}
              </OText>
            </TouchableOpacity>
            {currentPrinter?.model === item.model && (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => handleClick(null)}
              >
                <FeatherIcon
                  name='x-circle'
                  color={theme.colors.danger500}
                  size={20}
                  style={styles.icons}
                />
              </TouchableOpacity>
            )}
          </Container>
        ))}
      </View>
    </ScrollView>
  )
}
