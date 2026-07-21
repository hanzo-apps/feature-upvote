import { useState } from 'react'
import { useQuery, useMutation } from '@hanzo/base/react'
import { XStack, YStack, H3, Text, Paragraph, Button, Input, Spinner, Circle, Separator } from '@hanzo/gui'
import { STATUSES, statusMeta, ui, type Comment, type Request, type Status } from '../lib/requests'
import { UpvotePill } from './upvote-pill'

/**
 * A single request: its description, the vote toggle, a status control (the
 * product team moves it open → planned → shipped), and threaded comments. Owns
 * the `comments` collection for this request; requests/votes stay with Board.
 */
export function RequestDetail({
  request,
  voted,
  authorName,
  onBack,
  onVote,
  onStatus,
}: {
  request: Request
  voted: boolean
  authorName: string
  onBack: () => void
  onVote: () => void
  onStatus: (status: Status) => void
}) {
  const comments = useQuery<Comment>('comments', {
    filter: `request_id = "${request.id}"`,
    sort: '-created',
    realtime: false,
  })
  const addComment = useMutation('comments', 'create')
  const [body, setBody] = useState('')
  const meta = statusMeta(request.status)

  async function post() {
    const text = body.trim()
    if (!text || addComment.isLoading) return
    await addComment.mutate({ request_id: request.id, body: text, author_name: authorName })
    setBody('')
    await comments.refetch()
  }

  return (
    <YStack gap="$5" maxWidth={760} width="100%">
      <Button alignSelf="flex-start" size="$2" chromeless onPress={onBack}>
        ← Back to board
      </Button>

      <XStack gap="$4" alignItems="flex-start">
        <UpvotePill count={request.votes} active={voted} onPress={onVote} />
        <YStack flex={1} gap="$3">
          <H3 fontWeight="800" color={ui.ink}>
            {request.title}
          </H3>
          <XStack alignItems="center" gap="$2">
            <Circle size={9} backgroundColor={meta.dot} />
            <Text fontSize={13} color={ui.muted}>
              {meta.label} · by {request.author_name || 'Anonymous'}
            </Text>
          </XStack>
          <Paragraph color={ui.ink} opacity={0.85}>
            {request.description || 'No description provided.'}
          </Paragraph>
        </YStack>
      </XStack>

      <YStack gap="$2">
        <Text fontSize={12} fontWeight="700" color={ui.faint} textTransform="uppercase">
          Move to
        </Text>
        <XStack gap="$2" flexWrap="wrap">
          {STATUSES.map((s) => (
            <Button
              key={s.key}
              size="$2"
              theme={s.key === request.status ? 'active' : undefined}
              onPress={() => onStatus(s.key)}
            >
              {s.label}
            </Button>
          ))}
        </XStack>
      </YStack>

      <Separator />

      <YStack gap="$3">
        <Text fontSize={16} fontWeight="700" color={ui.ink}>
          Comments{comments.data.length ? ` (${comments.data.length})` : ''}
        </Text>
        <XStack gap="$2">
          <Input
            flex={1}
            value={body}
            placeholder="Add a comment…"
            onChangeText={setBody}
            onSubmitEditing={post}
          />
          <Button theme="active" disabled={addComment.isLoading || !body.trim()} onPress={post}>
            Post
          </Button>
        </XStack>
        {addComment.error ? <Text color="$red10">{addComment.error.message}</Text> : null}

        {comments.isLoading ? (
          <XStack gap="$2" alignItems="center" opacity={0.6}>
            <Spinner />
            <Text color={ui.muted}>Loading…</Text>
          </XStack>
        ) : comments.data.length === 0 ? (
          <Text fontSize={14} color={ui.faint}>
            No comments yet — start the discussion.
          </Text>
        ) : (
          <YStack gap="$2">
            {comments.data.map((c) => (
              <YStack
                key={c.id}
                gap="$1"
                padding="$3"
                borderRadius={12}
                borderWidth={1}
                borderColor={ui.border}
                backgroundColor={ui.card}
              >
                <Text fontSize={13} fontWeight="600" color={ui.ink}>
                  {c.author_name || 'Anonymous'}
                </Text>
                <Text fontSize={14} color={ui.muted}>
                  {c.body}
                </Text>
              </YStack>
            ))}
          </YStack>
        )}
      </YStack>
    </YStack>
  )
}
