import { expect, test } from 'claude-code/testing'

import { LANGUAGES, appConfigPath, captionFor, languageOf } from './captions'
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
    const svg = drawSvg(kind, 12345, 240, 'thinking')
    expect(svg.startsWith('<svg')).toBe(true)
    expect(svg.length < 131072).toBe(true)
  }
})

test('the app locale picks the language and unknown ones fall back to English', () => {
  expect(languageOf('ru')).toBe('ru')
  expect(languageOf('pt-BR')).toBe('pt')
  expect(languageOf('de_DE.UTF-8')).toBe('de')
  expect(languageOf('xx')).toBe('en')
  expect(languageOf(undefined)).toBe('en')
})

test('the app config is found beside the binary on every platform', () => {
  expect(appConfigPath('C:\\Users\\me\\AppData\\Roaming\\Claude\\claude-code\\2.1\\ab\\claude.exe')).toBe(
    'C:\\Users\\me\\AppData\\Roaming\\Claude/config.json',
  )
  expect(appConfigPath('/Users/me/Library/Application Support/Claude/claude-code/2.1/claude')).toBe(
    '/Users/me/Library/Application Support/Claude/config.json',
  )
  expect(appConfigPath('/usr/local/bin/claude')).toBe(undefined)
  expect(appConfigPath(undefined)).toBe(undefined)
})

test('every language has a line for every working mood', () => {
  const kinds = ['think', 'bash', 'write', 'read', 'web', 'agent', 'ask', 'done', 'sad', 'oops'] as const

  for (const language of LANGUAGES) {
    for (const kind of kinds) expect(captionFor(kind, language).length > 0).toBe(true)
  }
  expect(captionFor('idle', 'ru')).toBe('')
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
