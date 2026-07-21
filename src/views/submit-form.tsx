import { useState } from 'react'
import { XStack, YStack, H3, Text, Paragraph, Button, Input, TextArea } from '@hanzo/gui'
import { ui } from '../lib/requests'
import { Cta } from './cta'

/**
 * The new-request form. Collects a title + details and hands them to Board,
 * which owns the `requests` create + navigation back to the board.
 */
export function SubmitForm({
  submitting,
  error,
  onCancel,
  onSubmit,
}: {
  submitting: boolean
  error: Error | null
  onCancel: () => void
  onSubmit: (title: string, description: string) => void
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const ready = title.trim().length > 0

  return (
    <YStack gap="$5" maxWidth={640} width="100%">
      <Button alignSelf="flex-start" size="$2" chromeless onPress={onCancel}>
        ← Back to board
      </Button>

      <YStack gap="$2">
        <H3 fontWeight="800" color={ui.ink}>
          Submit a request
        </H3>
        <Paragraph color={ui.muted}>
          Describe the feature you’d like to see. Your team can upvote and discuss it.
        </Paragraph>
      </YStack>

      <YStack gap="$4" padding="$4" borderRadius={18} borderWidth={1} borderColor={ui.border} backgroundColor={ui.card}>
        <YStack gap="$2">
          <Text fontSize={13} fontWeight="700" color={ui.ink}>
            Title
          </Text>
          <Input value={title} placeholder="Short, specific summary" onChangeText={setTitle} />
        </YStack>
        <YStack gap="$2">
          <Text fontSize={13} fontWeight="700" color={ui.ink}>
            Details
          </Text>
          <TextArea
            value={description}
            placeholder="What problem does this solve? Who is it for?"
            onChangeText={setDescription}
            minHeight={140}
          />
        </YStack>
        {error ? <Text color="$red10">{error.message}</Text> : null}
        <XStack gap="$2" justifyContent="flex-end" alignItems="center">
          <Button chromeless onPress={onCancel}>
            Cancel
          </Button>
          <Cta disabled={!ready || submitting} onPress={() => onSubmit(title.trim(), description.trim())}>
            {submitting ? 'Submitting…' : 'Submit request'}
          </Cta>
        </XStack>
      </YStack>
    </YStack>
  )
}
