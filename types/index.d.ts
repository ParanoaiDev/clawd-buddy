export type MoodKind =
  | 'idle'
  | 'think'
  | 'bash'
  | 'write'
  | 'read'
  | 'web'
  | 'agent'
  | 'ask'
  | 'done'
  | 'sad'
  | 'oops'

export type Mood = { kind: MoodKind; seed: number }

declare module 'claude-code' {
  interface PluginState {
    'clawd-buddy': { mood: Shaped<Mood> }
  }
}
