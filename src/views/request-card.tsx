import { XStack, YStack, Text } from '@hanzo/gui'
import { ui, type Request } from '../lib/requests'
import { UpvotePill } from './upvote-pill'

/** A request as it appears in a board column: upvote pill + title + author. */
export function RequestCard({
  request,
  voted,
  onOpen,
  onVote,
}: {
  request: Request
  voted: boolean
  onOpen: () => void
  onVote: () => void
}) {
  return (
    <XStack
      gap="$3"
      alignItems="center"
      padding="$3"
      borderRadius={16}
      borderWidth={1}
      borderColor={ui.border}
      backgroundColor={ui.card}
      shadowColor="#0b1030"
      shadowOpacity={0.05}
      shadowRadius={10}
      shadowOffset={{ width: 0, height: 3 }}
      hoverStyle={{ borderColor: ui.indigoBorder }}
    >
      <UpvotePill count={request.votes} active={voted} onPress={onVote} />
      <YStack flex={1} gap="$1" cursor="pointer" hoverStyle={{ opacity: 0.7 }} onPress={onOpen}>
        <Text fontSize={15} fontWeight="600" color={ui.ink} numberOfLines={2}>
          {request.title}
        </Text>
        <Text fontSize={13} color={ui.muted}>
          {request.author_name || 'Anonymous'}
        </Text>
      </YStack>
    </XStack>
  )
}
