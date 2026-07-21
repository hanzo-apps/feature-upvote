import type { BaseRecord } from '@hanzo/base/react'

/** A feature request on the board (a row of the `requests` collection). */
export interface Request extends BaseRecord {
  title: string
  description: string
  status: Status
  votes: number
  author_name: string
}

/** One principal's upvote on a request (a row of the `votes` collection). */
export interface Vote extends BaseRecord {
  request_id: string
  voter: string
}

/** Discussion under a request (a row of the `comments` collection). */
export interface Comment extends BaseRecord {
  request_id: string
  body: string
  author_name: string
}

/** Where a request sits in the roadmap — the three board columns. */
export type Status = 'open' | 'planned' | 'shipped'

export interface StatusMeta {
  key: Status
  label: string
  /** The muted column-header dot. */
  dot: string
  /** Shown in an empty column. */
  blurb: string
}

/** The board columns, in flow order (left → right). */
export const STATUSES: StatusMeta[] = [
  { key: 'open', label: 'Open', dot: '#94a3b8', blurb: 'Nothing here yet — submit the first idea.' },
  { key: 'planned', label: 'Planned', dot: '#6366f1', blurb: 'Promote a request here once it is on the roadmap.' },
  { key: 'shipped', label: 'Shipped', dot: '#22c55e', blurb: 'Delivered requests land here.' },
]

/** Resolve a status string to its metadata (defaults to Open). */
export function statusMeta(key: string): StatusMeta {
  return STATUSES.find((s) => s.key === key) ?? STATUSES[0]
}

/** The Upvote palette — calm indigo on soft white, in ONE place. */
export const ui = {
  page: '#eceef4',
  column: '#f6f7fb',
  card: '#ffffff',
  border: '#e5e7f0',
  borderSoft: '#eef0f6',
  ink: '#1b1f2e',
  muted: '#6b7280',
  faint: '#98a0b0',
  indigo: '#4f46e5',
  indigoText: '#4338ca',
  indigoSoft: '#eef0fe',
  indigoBorder: '#c9cdf8',
} as const
