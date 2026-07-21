import type { ReactNode } from 'react'
import { XStack, Text } from '@hanzo/gui'
import { ui } from '../lib/requests'

const SIZES = {
  md: { paddingVertical: 10, paddingHorizontal: 18, fontSize: 15 },
  lg: { paddingVertical: 14, paddingHorizontal: 26, fontSize: 17 },
} as const

/**
 * The one indigo primary button — the app's calm accent, in ONE place. Built
 * from gui primitives (XStack + Text) so the fill is a precise indigo with white
 * text; @hanzo/gui's Button frame sets text color from the theme, not a prop.
 */
export function Cta({
  children,
  onPress,
  size = 'md',
  disabled = false,
}: {
  children: ReactNode
  onPress: () => void
  size?: keyof typeof SIZES
  disabled?: boolean
}) {
  const s = SIZES[size]
  return (
    <XStack
      alignItems="center"
      justifyContent="center"
      paddingVertical={s.paddingVertical}
      paddingHorizontal={s.paddingHorizontal}
      borderRadius={10}
      backgroundColor={ui.indigo}
      opacity={disabled ? 0.5 : 1}
      cursor={disabled ? 'default' : 'pointer'}
      hoverStyle={disabled ? undefined : { backgroundColor: ui.indigoText }}
      pressStyle={disabled ? undefined : { backgroundColor: '#3730a3' }}
      onPress={disabled ? undefined : onPress}
    >
      <Text fontSize={s.fontSize} fontWeight="700" color="#ffffff">
        {children}
      </Text>
    </XStack>
  )
}
