import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, Timer } from 'claude-code'

import type { Mood, MoodKind } from '../types'
import { appConfigPath, captionFor, languageOf } from './captions'
import { HEIGHT_PX, SCALE_PX, drawSvg, moodForTool } from './sprite'

// Stage width in sprite units when the surface has not measured the band.
const FALLBACK_STAGE = 200
const MIN_STAGE = 96
// A desktop cell is about this many CSS pixels wide.
const CELL_PX = 7
// Wider than any band: the surface holds the drawing to its slot.
const WIDE_PX = 4000
const BAND_ROWS = 4
// A new mood reloads the drawing, so moods change at most this often.
const MOOD_HOLD_MS = 1500
const DONE_MS = 7000

const mood = atom(
  { plugin: 'clawd-buddy', key: 'mood' } as const,
  { kind: 'idle', seed: 1 } as Mood,
  { shape: 'mood-1' },
)

const newSeed = () => Math.floor(Math.random() * 2147483647)

let language = 'en'
let isTurn = false
let shown: MoodKind = 'idle'
let wanted: MoodKind = 'idle'
let isCooling = false
let rest: Timer | undefined

// The desktop app keeps its language in config.json, in the folder that also
// holds the claude-code binary it runs. Only the `locale` field is taken.
async function readAppLocale($: EngineInterface) {
  const path = appConfigPath(await $.env.get('CLAUDE_CODE_EXECPATH'))
  if (path === undefined) return undefined

  try {
    const config: unknown = JSON.parse(await $.fs.read(path))
    const locale = (config as { locale?: unknown }).locale

    return typeof locale === 'string' ? locale : undefined
  } catch {
    return undefined
  }
}

async function findLanguage($: EngineInterface) {
  const locale =
    (await readAppLocale($)) ?? (await $.env.get('LC_ALL')) ?? (await $.env.get('LANG'))

  return languageOf(locale)
}

function want($: EngineInterface, kind: MoodKind) {
  wanted = kind
  if (isCooling || kind === shown) return

  shown = kind
  isCooling = true
  void update($, mood, () => ({ kind, seed: newSeed() }))
  $.clock.after(MOOD_HOLD_MS, () => {
    isCooling = false
    if (wanted !== shown) want($, wanted)
  })
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    language = await findLanguage($)
    await update($, mood, () => ({ kind: 'idle', seed: newSeed() }))

    return next(e)
  })

  on('turn.start', ($, e, next) => {
    if (e.agentId === undefined) {
      isTurn = true
      rest?.cancel()
      want($, 'think')
    }

    return next(e)
  })

  on('tool.call', async ($, e, next) => {
    const kind = isTurn ? moodForTool(String(e.tool)) : undefined
    if (kind !== undefined) want($, kind)

    const ran = await next(e)
    if (kind !== undefined && isTurn) want($, 'think')

    return ran
  })

  on('turn.complete', ($, e, next) => {
    if (e.agentId === undefined) {
      isTurn = false
      want($, e.reason === 'answer' ? 'done' : e.reason === 'aborted' ? 'sad' : 'oops')
      rest?.cancel()
      rest = $.clock.after(DONE_MS, () => want($, 'idle'))
    }

    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey || e.surface !== 'desktop') return next(e)

    const { kind, seed } = await read($, mood)
    const columns = e.props.bodyColumns
    const stage = columns > 0
      ? Math.max(MIN_STAGE, Math.floor((columns * CELL_PX) / SCALE_PX))
      : FALLBACK_STAGE
    const { Box, Svg } = $.ui.resolve(e)

    // The app pads its card and offers no way to drop that, so the drawing is
    // placed one cell out from the card's content on three sides.
    return (
      <Box position="relative" height={BAND_ROWS}>
        <Box position="absolute" top={-1} left={-1} right={-1}>
          <Svg
            source={drawSvg(kind, seed, stage, captionFor(kind, language))}
            alt="Clawd, a pixel bug"
            width={WIDE_PX}
            height={HEIGHT_PX}
            isInteractive
          />
        </Box>
      </Box>
    )
  })
}
