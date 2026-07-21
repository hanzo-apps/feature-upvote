import { useMemo, useState } from 'react'
import { useIam } from '@hanzo/iam/react'
import { useQuery, useMutation } from '@hanzo/base/react'
import { XStack, YStack, Text, Paragraph, Button, Spinner, Circle } from '@hanzo/gui'
import { STATUSES, ui, type Request, type Vote, type Status } from '../lib/requests'
import { RequestCard } from './request-card'
import { RequestDetail } from './request-detail'
import { SubmitForm } from './submit-form'

type View = { mode: 'board' } | { mode: 'detail'; id: string } | { mode: 'submit' }

/**
 * The board is the single owner of `requests` + `votes`. Columns render the
 * vote-sorted requests grouped by status; a request opens the detail view, and
 * "New request" opens the submit form. Every read/write carries the signed-in
 * user's IAM token (wired in providers.tsx), so the board is scoped to one org.
 */
export function Board() {
  const { user } = useIam()
  const voter = user?.id || user?.name || 'anonymous'
  const authorName = user?.displayName || user?.name || 'Anonymous'

  const requests = useQuery<Request>('requests', { sort: '-votes', realtime: false })
  const votes = useQuery<Vote>('votes', { realtime: false })

  const createRequest = useMutation('requests', 'create')
  const updateRequest = useMutation('requests', 'update')
  const castVote = useMutation('votes', 'create')
  const dropVote = useMutation('votes', 'delete')

  const [view, setView] = useState<View>({ mode: 'board' })

  /** request_id → this user's vote row id, for one-vote-per-person + toggling. */
  const myVotes = useMemo(() => {
    const map = new Map<string, string>()
    for (const v of votes.data) if (v.voter === voter) map.set(v.request_id, v.id)
    return map
  }, [votes.data, voter])

  async function toggleVote(req: Request) {
    if (castVote.isLoading || dropVote.isLoading) return
    const existing = myVotes.get(req.id)
    if (existing) {
      await dropVote.mutate({ id: existing })
      await updateRequest.mutate({ id: req.id, votes: Math.max(0, (req.votes || 0) - 1) })
    } else {
      await castVote.mutate({ request_id: req.id, voter })
      await updateRequest.mutate({ id: req.id, votes: (req.votes || 0) + 1 })
    }
    await Promise.all([requests.refetch(), votes.refetch()])
  }

  async function setStatus(req: Request, status: Status) {
    await updateRequest.mutate({ id: req.id, status })
    await requests.refetch()
  }

  async function submit(title: string, description: string) {
    await createRequest.mutate({ title, description, status: 'open', votes: 0, author_name: authorName })
    await requests.refetch()
    setView({ mode: 'board' })
  }

  if (view.mode === 'submit') {
    return (
      <SubmitForm
        submitting={createRequest.isLoading}
        error={createRequest.error}
        onCancel={() => setView({ mode: 'board' })}
        onSubmit={submit}
      />
    )
  }

  if (view.mode === 'detail') {
    const back = () => setView({ mode: 'board' })
    const req = requests.data.find((r) => r.id === view.id)
    if (!req) {
      return (
        <YStack gap="$4" alignItems="flex-start">
          <Paragraph color={ui.muted}>That request is no longer available.</Paragraph>
          <Button onPress={back}>Back to board</Button>
        </YStack>
      )
    }
    return (
      <RequestDetail
        request={req}
        voted={myVotes.has(req.id)}
        authorName={authorName}
        onBack={back}
        onVote={() => toggleVote(req)}
        onStatus={(status) => setStatus(req, status)}
      />
    )
  }

  return (
    <YStack gap="$5">
      <XStack alignItems="flex-end" justifyContent="space-between" flexWrap="wrap" gap="$3">
        <YStack gap="$1">
          <Text fontSize={22} fontWeight="800" color={ui.ink}>
            Feature board
          </Text>
          <Text fontSize={14} color={ui.muted}>
            Vote on what matters — the most-wanted rise to the top of each column.
          </Text>
        </YStack>
        <Button theme="active" onPress={() => setView({ mode: 'submit' })}>
          + New request
        </Button>
      </XStack>

      {requests.error ? (
        <Paragraph color="$red10">
          Couldn’t reach Base ({requests.error.message}). Confirm VITE_HANZO_BASE_URL and that you’re
          signed in.
        </Paragraph>
      ) : requests.isLoading ? (
        <XStack gap="$2" alignItems="center" opacity={0.6}>
          <Spinner />
          <Text color={ui.muted}>Loading board…</Text>
        </XStack>
      ) : (
        <XStack gap="$4" flexWrap="wrap" alignItems="flex-start">
          {STATUSES.map((s) => {
            const items = requests.data.filter((r) => (r.status || 'open') === s.key)
            return (
              <YStack
                key={s.key}
                flex={1}
                minWidth={280}
                gap="$3"
                padding="$3"
                borderRadius={18}
                backgroundColor={ui.column}
                borderWidth={1}
                borderColor={ui.borderSoft}
              >
                <XStack alignItems="center" justifyContent="space-between" paddingHorizontal="$1" paddingTop="$1">
                  <XStack alignItems="center" gap="$2">
                    <Circle size={9} backgroundColor={s.dot} />
                    <Text fontSize={14} fontWeight="700" color={ui.ink}>
                      {s.label}
                    </Text>
                  </XStack>
                  <Text fontSize={13} fontWeight="600" color={ui.faint}>
                    {items.length}
                  </Text>
                </XStack>

                {items.length === 0 ? (
                  <YStack
                    padding="$4"
                    alignItems="center"
                    borderRadius={12}
                    borderWidth={1}
                    borderColor={ui.borderSoft}
                    borderStyle="dashed"
                  >
                    <Text fontSize={13} color={ui.faint} textAlign="center">
                      {s.blurb}
                    </Text>
                  </YStack>
                ) : (
                  items.map((r) => (
                    <RequestCard
                      key={r.id}
                      request={r}
                      voted={myVotes.has(r.id)}
                      onOpen={() => setView({ mode: 'detail', id: r.id })}
                      onVote={() => toggleVote(r)}
                    />
                  ))
                )}
              </YStack>
            )
          })}
        </XStack>
      )}
    </YStack>
  )
}
