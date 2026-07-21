import { YStack, Text } from '@hanzo/gui'
import { ui } from '../lib/requests'

/**
 * The signature control: a vertical pill with a caret + count. Pressable when
 * `onPress` is given (a live vote toggle); a static badge otherwise (the landing
 * preview). `active` means the current user has already upvoted.
 */
export function UpvotePill({
  count,
  active = false,
  onPress,
}: {
  count: number
  active?: boolean
  onPress?: () => void
}) {
  const interactive = Boolean(onPress)
  return (
    <YStack
      alignItems="center"
      justifyContent="center"
      minWidth={54}
      paddingVertical="$2"
      paddingHorizontal="$3"
      borderRadius={12}
      borderWidth={1}
      backgroundColor={active ? ui.indigoSoft : '#ffffff'}
      borderColor={active ? ui.indigoBorder : ui.border}
      cursor={interactive ? 'pointer' : 'default'}
      hoverStyle={interactive ? { borderColor: ui.indigo } : undefined}
      pressStyle={interactive ? { backgroundColor: ui.indigoSoft, borderColor: ui.indigo } : undefined}
      onPress={onPress}
    >
      <Text fontSize={11} lineHeight={13} color={active ? ui.indigo : ui.faint}>
        ▲
      </Text>
      <Text fontSize={16} fontWeight="800" color={active ? ui.indigoText : ui.ink}>
        {count}
      </Text>
    </YStack>
  )
}
