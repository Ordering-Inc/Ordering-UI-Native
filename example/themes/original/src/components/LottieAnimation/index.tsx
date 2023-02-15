import React, { useRef, useState } from 'react'
import Lottie from 'lottie-react-native';
import { TouchableOpacity, Easing, ViewStyle, Animated } from 'react-native';
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import { useTheme } from 'styled-components';

interface Props {
  initialValue: number,
  onClick: any,
  disableAnimation?: boolean
  toValue: number,
  style?: ViewStyle,
  duration?: number,
  type: 'favorite', // animation types
  isActive: boolean,
  animationType?: ((value: number) => number);
  useNativeDriver?: boolean,
  iconProps?: { color?: string, size?: number, style?: ViewStyle }
}

export const LottieAnimation = (props: Props) => {
  const {
    initialValue,
    onClick,
    disableAnimation,
    toValue,
    style,
    duration,
    type,
    isActive,
    useNativeDriver,
    animationType,
    iconProps
  } = props

  const theme = useTheme()
  const animationProgress = useRef(new Animated.Value(initialValue))
  const favRef = useRef<Lottie>(null)
  const [isHide, setIsHide] = useState(true)

  const favoriteArray = ['heart', 'hearto']
  const icon = type === 'favorite' ? favoriteArray : []
  const animationGif = type === 'favorite' ? theme.images?.general?.heart : ''

  const onPressLottie = () => {
    if (!disableAnimation) {
      if (type === 'favorite') {
        favRef.current?.play()
      } else {
        setIsHide(false)
        Animated.timing(animationProgress.current, {
          toValue,
          duration: duration || 5000,
          easing: animationType || Easing.linear,
          useNativeDriver: useNativeDriver ?? true
        }).start();
        hideLottie()
      }
    }
    onClick()
  }

  const hideLottie = () => {
    setTimeout(() => setIsHide(true), 4500)
  }

  return (
    <TouchableOpacity
      onPress={onPressLottie}
      style={style}
    >
      {type === 'favorite' ? (
        <Lottie
          ref={favRef}
          progress={initialValue}
          style={{ width: 20, height: 20 }}
          source={animationGif}
        />
      ) : (
        <>
          {!isHide &&
            <Lottie
              progress={animationProgress.current}
              source={animationGif}
            />
          }
          <IconAntDesign
            name={isActive ? icon[0] : icon[1]}
            color={iconProps?.color || theme.colors.danger5}
            size={iconProps?.size || 16}
            style={iconProps?.style}
          />
        </>
      )}
    </TouchableOpacity>
  )
}
