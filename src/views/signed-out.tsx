import { useIam } from '@hanzo/iam/react'
import { XStack, YStack, H1, Text, Paragraph, Button, Circle } from '@hanzo/gui'
import { STATUSES, ui, type Status } from '../lib/requests'
import { UpvotePill } from './upvote-pill'
import { Cta } from './cta'

/** Illustrative board content for the landing preview (not live data). */
const SAMPLE: Record<Status, { title: string; who: string; votes: number }[]> = {
  open: [
    { title: 'Bulk CSV export', who: 'Priya', votes: 42 },
    { title: 'Keyboard shortcuts', who: 'Marcus', votes: 28 },
    { title: 'Two-factor auth', who: 'Lena', votes: 19 },
  ],
  planned: [
    { title: 'Dark mode', who: 'Sam', votes: 86 },
    { title: 'Slack notifications', who: 'Devon', votes: 54 },
  ],
  shipped: [
    { title: 'SSO / SAML', who: 'Ari', votes: 73 },
    { title: 'Audit log', who: 'Noor', votes: 31 },
  ],
}

/**
 * Landing + sign-in. The public, pre-auth view: a themed hero over a static
 * preview of the board (illustrative, not live data — the real board is behind
 * sign-in). One action: PKCE sign-in with Hanzo — IAM owns every credential.
 */
export function SignedOut() {
  const { login, isLoading } = useIam()

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
        <Button size="$3" disabled={isLoading} onPress={() => login()}>
          Sign in
        </Button>
      </XStack>

      <YStack alignItems="center" paddingTop={44} paddingBottom={72} paddingHorizontal="$5" gap={44} maxWidth={1080} width="100%" alignSelf="center">
        <YStack alignItems="center" gap="$4" maxWidth={640}>
          <XStack
            backgroundColor={ui.indigoSoft}
            borderColor={ui.indigoBorder}
            borderWidth={1}
            borderRadius={999}
            paddingVertical={6}
            paddingHorizontal={14}
          >
            <Text fontSize={13} fontWeight="700" color={ui.indigoText}>
              Feature requests, sorted by demand
            </Text>
          </XStack>
          <H1 textAlign="center" fontSize={44} lineHeight={50} fontWeight="900" color={ui.ink}>
            Let users vote on what’s next.
          </H1>
          <Paragraph textAlign="center" fontSize={17} color={ui.muted} maxWidth={540}>
            A shared board where your users submit ideas and upvote the ones they want. The product
            team moves each request from open to planned to shipped — demand, ranked.
          </Paragraph>
          <XStack gap="$3" alignItems="center" flexWrap="wrap" justifyContent="center">
            <Cta size="lg" disabled={isLoading} onPress={() => login()}>
              {isLoading ? 'Loading…' : 'Sign in with Hanzo'}
            </Cta>
            <Text fontSize={13} color={ui.faint}>
              Secured by Hanzo IAM · data in Hanzo Base
            </Text>
          </XStack>
        </YStack>

        <YStack
          width="100%"
          borderRadius={22}
          borderWidth={1}
          borderColor={ui.border}
          backgroundColor="#ffffff"
          padding="$4"
          shadowColor="#0b1030"
          shadowOpacity={0.08}
          shadowRadius={28}
          shadowOffset={{ width: 0, height: 18 }}
        >
          <XStack gap="$4" flexWrap="wrap" alignItems="flex-start">
            {STATUSES.map((s) => (
              <YStack
                key={s.key}
                flex={1}
                minWidth={230}
                gap="$3"
                padding="$3"
                borderRadius={16}
                backgroundColor={ui.column}
                borderWidth={1}
                borderColor={ui.borderSoft}
              >
                <XStack alignItems="center" justifyContent="space-between" paddingHorizontal="$1">
                  <XStack alignItems="center" gap="$2">
                    <Circle size={9} backgroundColor={s.dot} />
                    <Text fontSize={13} fontWeight="700" color={ui.ink}>
                      {s.label}
                    </Text>
                  </XStack>
                  <Text fontSize={12} fontWeight="600" color={ui.faint}>
                    {SAMPLE[s.key].length}
                  </Text>
                </XStack>
                {SAMPLE[s.key].map((item) => (
                  <XStack
                    key={item.title}
                    gap="$3"
                    alignItems="center"
                    padding="$3"
                    borderRadius={14}
                    borderWidth={1}
                    borderColor={ui.border}
                    backgroundColor={ui.card}
                  >
                    <UpvotePill count={item.votes} active={s.key === 'planned' && item.title === 'Dark mode'} />
                    <YStack flex={1} gap="$1">
                      <Text fontSize={14} fontWeight="600" color={ui.ink}>
                        {item.title}
                      </Text>
                      <Text fontSize={12} color={ui.muted}>
                        {item.who}
                      </Text>
                    </YStack>
                  </XStack>
                ))}
              </YStack>
            ))}
          </XStack>
        </YStack>
      </YStack>
    </YStack>
  )
}
