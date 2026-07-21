import { useIam } from '@hanzo/iam/react'
import { XStack, YStack, Text, Button } from '@hanzo/gui'
import { ui } from '../lib/requests'
import { Board } from './board'

/** Signed-in shell: the Upvote top bar (brand + who + sign out) over the board. */
export function Home() {
  const { user, logout } = useIam()
  const who = user?.displayName || user?.name || user?.email || 'you'

  return (
    <YStack flex={1} minHeight="100vh" backgroundColor={ui.page}>
      <XStack
        alignItems="center"
        justifyContent="space-between"
        paddingVertical="$3"
        paddingHorizontal="$5"
        backgroundColor="#ffffff"
        borderBottomWidth={1}
        borderColor={ui.border}
      >
        <XStack alignItems="center" gap="$2">
          <YStack width={26} height={26} borderRadius={8} alignItems="center" justifyContent="center" backgroundColor={ui.indigo}>
            <Text fontSize={13} fontWeight="900" color="#ffffff">
              ▲
            </Text>
          </YStack>
          <Text fontSize={17} fontWeight="800" color={ui.ink}>
            Upvote
          </Text>
        </XStack>
        <XStack alignItems="center" gap="$3">
          <Text fontSize={13} color={ui.muted}>
            {who}
          </Text>
          <Button size="$2" onPress={() => logout()}>
            Sign out
          </Button>
        </XStack>
      </XStack>

      <YStack padding="$5" gap="$4" maxWidth={1120} width="100%" alignSelf="center">
        <Board />
      </YStack>
    </YStack>
  )
}
