import { expect, test } from 'claude-code/testing'

import { drawSvg, moodForTool } from './sprite'

const BAND = {
  plugin: 'clawd-buddy',
  component: 'AbovePrompt',
  requestId: 'above-prompt',
  props: { hasSurvey: false, bodyColumns: 90 },
} as const

test('every mood draws an svg under the limit', () => {
  const kinds = ['idle', 'think', 'bash', 'write', 'read', 'web', 'agent', 'ask', 'done', 'sad', 'oops'] as const

  for (const kind of kinds) {
    const svg = drawSvg(kind, 12345, 240, 'думаю')
    expect(svg.startsWith('<svg')).toBe(true)
    expect(svg.length < 131072).toBe(true)
  }
})

test('tools map to moods', () => {
  expect(moodForTool('PowerShell')).toBe('bash')
  expect(moodForTool('Edit')).toBe('write')
  expect(moodForTool('Grep')).toBe('read')
  expect(moodForTool('mcp__ccd_turn__update_plan')).toBe(undefined)
})

test('the band draws the bug on the desktop', async $ => {
  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect((await ui.find({ type: 'Svg' })) !== undefined).toBe(true)
  await ui.unmount()
})
