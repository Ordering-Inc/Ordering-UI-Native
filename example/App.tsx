import * as React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DeliveryApp from './src/DeliveryApp'

const App = () => {
  return (
    <SafeAreaProvider>
      <DeliveryApp />
    </SafeAreaProvider>
  )
}

export default App
