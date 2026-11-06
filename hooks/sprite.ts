import type { MoodKind } from '../types'

// The whole animation lives inside one SVG as discrete SMIL tracks, so the
// bug keeps moving with no redraw; a redraw happens only when the mood changes.
// He walks on the top edge of the prompt box, so the ground is the bottom edge.
const H = 26
const SCALE = 3
const FPS = 8
const GROUND = H
const TOP = GROUND - 10
// Work scenes are laid out on this many units, centred on the stage.
const SCENE = 64
const BODY = '#D97757'
const INK = '#1F1410'

type Eyes = 'open' | 'shut' | 'joy'
type Fx = '' | 'zzz' | 'heart' | 'dots' | 'bang' | 'ask' | 'note'
type Frame = {
  x: number
  y: number
  legs: 0 | 1 | 2
  eyes: Eyes
  look: -1 | 0 | 1
  armL: number
  armR: number
  fx: Fx
}

class Reel {
  frames: Frame[] = []
  x: number

  constructor(x: number) {
    this.x = x
  }

  push(patch: Partial<Frame> = {}) {
    this.frames.push({
      x: this.x,
      y: 0,
      legs: 0,
      eyes: 'open',
      look: 0,
      armL: 0,
      armR: 0,
      fx: '',
      ...patch,
    })
  }

  hold(count: number, patch: Partial<Frame> = {}) {
    for (let i = 0; i < count; i++) this.push(patch)
  }

  walkTo(to: number, patch: Partial<Frame> = {}) {
    const dir = to > this.x ? 1 : -1
    for (let i = 0; this.x !== to; i++) {
      this.x += dir
      this.push({ legs: i % 2 ? 1 : 2, look: dir, ...patch })
    }
  }

  hop(patch: Partial<Frame> = {}) {
    for (const y of [-2, -4, -5, -5, -4, -2, 0]) {
      this.push({ y, armL: -1, armR: -1, ...patch })
    }
  }

  wave(count: number, patch: Partial<Frame> = {}) {
    for (let i = 0; i < count; i++) {
      this.push({ armR: i % 2 ? -1 : -3, eyes: 'joy', ...patch })
    }
  }

  dance(count: number) {
    for (let i = 0; i < count; i++) {
      const isUp = i % 4 < 2
      this.push({
        y: i % 2 ? -1 : 0,
        armL: isUp ? -2 : 0,
        armR: isUp ? 0 : -2,
        eyes: 'joy',
        fx: 'note',
      })
    }
  }

  nap(count: number) {
    this.hold(count, { y: 1, eyes: 'shut', fx: 'zzz' })
  }

  type(count: number, patch: Partial<Frame> = {}) {
    for (let i = 0; i < count; i++) {
      this.push({ armL: i % 2 ? -1 : 0, armR: i % 2 ? 0 : -1, look: 1, ...patch })
    }
  }

  shake(count: number, patch: Partial<Frame> = {}) {
    for (let i = 0; i < count; i++) {
      this.push({ x: this.x + (i % 2 ? 1 : -1), ...patch })
    }
  }
}

function randomFrom(seed: number) {
  let state = seed >>> 0

  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let mixed = Math.imul(state ^ (state >>> 15), 1 | state)
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed

    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296
  }
}

function idleReel(seed: number, stage: number) {
  const random = randomFrom(seed)
  const pick = (count: number) => Math.floor(random() * count)
  const home = Math.floor(stage / 2) - 8
  const reel = new Reel(home)

  while (reel.frames.length < FPS * 48) {
    const roll = random()

    if (roll < 0.4) {
      const target = reel.x + pick(121) - 60
      reel.walkTo(Math.max(2, Math.min(stage - 18, target)))
    } else if (roll < 0.55) {
      reel.hold(6, { look: -1 })
      reel.hold(6, { look: 1 })
    } else if (roll < 0.67) {
      reel.hop()
      if (random() < 0.5) reel.hop()
    } else if (roll < 0.77) {
      reel.wave(10)
    } else if (roll < 0.87) {
      reel.dance(24)
    } else {
      reel.nap(FPS * 6)
    }

    reel.hold(FPS)
    reel.hold(1, { eyes: 'shut' })
    reel.hold(FPS * pick(3))
  }

  reel.walkTo(home)

  return reel
}

function reelFor(kind: MoodKind, seed: number, stage: number) {
  const reel = new Reel(kind === 'think' ? 18 : 24)

  switch (kind) {
    case 'idle':
      return idleReel(seed, stage)
    case 'think':
      reel.walkTo(34, { fx: 'dots' })
      reel.hold(10, { fx: 'dots', look: 1 })
      reel.hold(1, { fx: 'dots', eyes: 'shut' })
      reel.walkTo(18, { fx: 'dots' })
      reel.hold(10, { fx: 'dots', look: -1 })
      return reel
    case 'bash':
    case 'write':
    case 'web':
      reel.x = 16
      reel.type(24)
      return reel
    case 'read':
      reel.x = 16
      reel.hold(8, { look: 1 })
      reel.hold(1, { look: 1, eyes: 'shut' })
      reel.hold(7, { look: 0 })
      reel.hold(8, { look: 1 })
      return reel
    case 'agent':
      reel.x = 14
      reel.wave(16)
      reel.hold(16, { look: 1 })
      return reel
    case 'ask':
      reel.hold(12, { fx: 'ask' })
      reel.wave(8, { fx: 'ask' })
      reel.hold(1, { fx: 'ask', eyes: 'shut' })
      reel.hold(11, { fx: 'ask' })
      return reel
    case 'done':
      reel.hop({ eyes: 'joy', fx: 'heart' })
      reel.hop({ eyes: 'joy', fx: 'heart' })
      reel.hold(4, { eyes: 'joy', fx: 'heart' })
      reel.dance(16)
      return reel
    case 'sad':
      reel.hold(14, { y: 1, eyes: 'shut' })
      reel.hold(10, { y: 1, look: -1 })
      return reel
    case 'oops':
      reel.shake(8, { fx: 'bang' })
      reel.hold(12, { fx: 'bang', eyes: 'shut' })
      return reel
  }
}

const rect = (x: number, y: number, w: number, h: number, fill: string) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`

const track = (dur: number) =>
  `calcMode="discrete" dur="${dur}s" repeatCount="indefinite"`

const move = (values: string[], dur: number) =>
  `<animateTransform attributeName="transform" type="translate" ${track(dur)} values="${values.join(';')}"/>`

const fade = (values: string[], dur: number) =>
  `<animate attributeName="opacity" ${track(dur)} values="${values.join(';')}"/>`

// Shows the part from `from` (0..1) of a loop onward, so lines appear in turn.
const reveal = (from: number, dur: number) => {
  const steps = 12

  return fade(
    Array.from({ length: steps }, (_, i) => (i / steps >= from ? '1' : '0')),
    dur,
  )
}

const sometimes = (body: string, frames: Frame[], isOn: (f: Frame) => boolean, dur: number) =>
  frames.some(isOn)
    ? `<g opacity="0">${fade(frames.map(f => (isOn(f) ? '1' : '0')), dur)}${body}</g>`
    : ''

const glyphZ = (x: number, y: number, fill: string) =>
  rect(x, y, 4, 1, fill) +
  rect(x + 2, y + 1, 1, 1, fill) +
  rect(x + 1, y + 2, 1, 1, fill) +
  rect(x, y + 3, 4, 1, fill)

const FX: Record<Exclude<Fx, ''>, string> = {
  zzz: glyphZ(13, -5, '#9DB4D6') + glyphZ(17, -9, '#9DB4D6'),
  heart:
    rect(6, -7, 2, 1, '#E5484D') +
    rect(9, -7, 2, 1, '#E5484D') +
    rect(5, -6, 7, 2, '#E5484D') +
    rect(6, -4, 5, 1, '#E5484D') +
    rect(7, -3, 3, 1, '#E5484D') +
    rect(8, -2, 1, 1, '#E5484D'),
  dots: [4, 8, 12]
    .map((x, i) => {
      const values = ['0.25', '0.25', '0.25']
      values[i] = '1'

      return `<g>${fade(values, 1.2)}${rect(x, -4, 2, 2, '#E8E2D6')}</g>`
    })
    .join(''),
  bang: rect(7, -8, 2, 5, '#F5C542') + rect(7, -2, 2, 1, '#F5C542'),
  ask:
    rect(6, -9, 4, 1, '#F5C542') +
    rect(5, -8, 2, 1, '#F5C542') +
    rect(9, -8, 2, 2, '#F5C542') +
    rect(8, -6, 2, 1, '#F5C542') +
    rect(7, -5, 2, 1, '#F5C542') +
    rect(7, -3, 2, 1, '#F5C542'),
  note:
    rect(16, -8, 1, 5, '#F5C542') +
    rect(14, -4, 3, 2, '#F5C542') +
    rect(16, -8, 3, 1, '#F5C542'),
}

const EYES_OPEN = rect(5, 2, 1, 2, INK) + rect(10, 2, 1, 2, INK)
const EYES_SHUT = rect(4, 3, 3, 1, INK) + rect(9, 3, 3, 1, INK)
const EYES_JOY =
  rect(4, 3, 1, 1, INK) +
  rect(5, 2, 1, 1, INK) +
  rect(6, 3, 1, 1, INK) +
  rect(9, 3, 1, 1, INK) +
  rect(10, 2, 1, 1, INK) +
  rect(11, 3, 1, 1, INK)

function drawBug(frames: Frame[], dur: number) {
  const fx = (Object.keys(FX) as Exclude<Fx, ''>[])
    .map(name => sometimes(FX[name], frames, f => f.fx === name, dur))
    .join('')

  return (
    `<g>${move(frames.map(f => `${f.x} ${TOP + f.y}`), dur)}` +
    `<g>${move(frames.map(f => `0 ${f.legs === 1 ? -1 : 0}`), dur)}${rect(3, 8, 1, 2, BODY)}${rect(10, 8, 1, 2, BODY)}</g>` +
    `<g>${move(frames.map(f => `0 ${f.legs === 2 ? -1 : 0}`), dur)}${rect(5, 8, 1, 2, BODY)}${rect(12, 8, 1, 2, BODY)}</g>` +
    rect(2, 0, 12, 8, BODY) +
    `<g>${move(frames.map(f => `0 ${f.armL}`), dur)}${rect(0, 3, 2, 2, BODY)}</g>` +
    `<g>${move(frames.map(f => `0 ${f.armR}`), dur)}${rect(14, 3, 2, 2, BODY)}</g>` +
    `<g>${move(frames.map(f => `${f.look} 0`), dur)}` +
    sometimes(EYES_OPEN, frames, f => f.eyes === 'open', dur) +
    sometimes(EYES_SHUT, frames, f => f.eyes === 'shut', dur) +
    sometimes(EYES_JOY, frames, f => f.eyes === 'joy', dur) +
    `</g>${fx}</g>`
  )
}

function terminalProp(dur: number) {
  const green = '#7FD08A'

  return (
    rect(38, 11, 20, 15, '#3A3A42') +
    rect(39, 12, 18, 13, '#111114') +
    `<g>${reveal(0, dur)}${rect(41, 14, 9, 1, green)}</g>` +
    `<g>${reveal(0.25, dur)}${rect(41, 16, 13, 1, green)}</g>` +
    `<g>${reveal(0.5, dur)}${rect(41, 18, 6, 1, green)}</g>` +
    `<g>${reveal(0.75, dur)}${rect(41, 20, 11, 1, green)}</g>` +
    `<g>${fade(['1', '0'], 0.8)}${rect(41, 22, 2, 1, '#E8E2D6')}</g>`
  )
}

function paperProp(dur: number, isWriting: boolean) {
  const lines = [13, 16, 19, 22]
    .map((y, i) => {
      const line = rect(43, y, i % 2 ? 8 : 10, 1, '#6E675C')

      return isWriting ? `<g>${reveal(i / 4, dur)}${line}</g>` : line
    })
    .join('')

  return rect(40, 10, 16, 16, '#EDE6D6') + lines
}

function lensProp(dur: number) {
  const ring = '#C9C3B6'

  return (
    `<g>${move(['0 0', '3 3', '6 6', '3 9', '0 6', '-2 3'], dur)}` +
    rect(42, 10, 6, 1, ring) +
    rect(42, 15, 6, 1, ring) +
    rect(41, 11, 1, 4, ring) +
    rect(48, 11, 1, 4, ring) +
    rect(49, 16, 1, 1, ring) +
    rect(50, 17, 1, 1, ring) +
    '</g>'
  )
}

function globeProp() {
  const sea = '#3E7CB1'
  const land = '#5FA777'
  const rows = [
    [44, 12, 6],
    [42, 13, 10],
    [41, 14, 12],
    [40, 15, 14],
    [40, 16, 14],
    [40, 17, 14],
    [40, 18, 14],
    [40, 19, 14],
    [40, 20, 14],
    [41, 21, 12],
    [42, 22, 10],
    [44, 23, 6],
  ]

  return (
    rows.map(([x, y, w]) => rect(x ?? 0, y ?? 0, w ?? 0, 1, sea)).join('') +
    `<g>${move(['0 0', '1 0', '2 0', '3 0', '4 0', '3 0', '2 0', '1 0'], 3.2)}` +
    rect(43, 15, 4, 2, land) +
    rect(44, 17, 2, 2, land) +
    rect(46, 20, 3, 1, land) +
    '</g>'
  )
}

function helperProp(dur: number) {
  const steps = Array.from({ length: 16 }, (_, i) => {
    const walked = i < 8 ? i : 16 - i

    return `${36 + walked * 2} ${GROUND - 5 - (i % 2)}`
  })

  return (
    `<g>${move(steps, dur)}<g transform="scale(0.5)">` +
    rect(3, 8, 1, 2, BODY) +
    rect(5, 8, 1, 2, BODY) +
    rect(10, 8, 1, 2, BODY) +
    rect(12, 8, 1, 2, BODY) +
    rect(2, 0, 12, 8, BODY) +
    rect(0, 3, 2, 2, BODY) +
    rect(14, 3, 2, 2, BODY) +
    EYES_OPEN +
    '</g></g>'
  )
}

function propFor(kind: MoodKind, dur: number) {
  switch (kind) {
    case 'bash':
      return terminalProp(dur)
    case 'write':
      return paperProp(dur, true)
    case 'read':
      return paperProp(dur, false) + lensProp(dur)
    case 'web':
      return globeProp()
    case 'agent':
      return helperProp(dur)
    default:
      return ''
  }
}

export const SCALE_PX = SCALE
// The drawing is taller than the app's card, which clips it, so it covers the
// card's padding. The scene sits this far down and the ground fills what is left.
export const OVERHANG_PX = 30
export const HEIGHT_PX = 120
const SCENE_PX = H * SCALE

// Percent across the band, px down, loop seconds: the sky stretches with the band.
const STARS: [number, number, number][] = [
  [4, 14, 3.1],
  [11, 40, 4.3],
  [19, 10, 2.7],
  [27, 30, 5.1],
  [36, 12, 3.7],
  [44, 44, 4.7],
  [53, 18, 2.9],
  [61, 36, 5.3],
  [69, 9, 3.3],
  [76, 28, 4.1],
  [93, 42, 3.5],
  [97, 16, 4.9],
]

function drawSky() {
  const stars = STARS.map(
    ([x, y, dur]) =>
      `<rect x="${x}%" y="${y}" width="3" height="3" fill="#E8E2D6" opacity="0.7">` +
      `<animate attributeName="opacity" dur="${dur}s" repeatCount="indefinite" values="0.7;0.15;0.7"/></rect>`,
  ).join('')

  return (
    '<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0" stop-color="#0E0F1A"/><stop offset="1" stop-color="#1D1A2B"/>' +
    '</linearGradient></defs>' +
    '<rect width="100%" height="100%" fill="url(#sky)"/>' +
    `<g transform="translate(0 ${OVERHANG_PX})">` +
    stars +
    '<svg x="86%" y="10" overflow="visible">' +
    rectPx(6, 0, 12, 3, '#F2E6C4') +
    rectPx(3, 3, 12, 3, '#F2E6C4') +
    rectPx(0, 6, 12, 12, '#F2E6C4') +
    rectPx(3, 18, 12, 3, '#F2E6C4') +
    rectPx(6, 21, 12, 3, '#F2E6C4') +
    '</svg>' +
    `<rect y="${SCENE_PX}" width="100%" height="${HEIGHT_PX}" fill="#241A22"/>` +
    `<rect y="${SCENE_PX - 3}" width="100%" height="3" fill="#8A4F41"/>` +
    '</g>'
  )
}

const rectPx = rect

export function drawSvg(kind: MoodKind, seed: number, stage: number, caption: string) {
  const { frames } = reelFor(kind, seed, stage)
  const dur = frames.length / FPS
  const shift = kind === 'idle' ? 0 : Math.floor((stage - SCENE) / 2)
  // Anchored to the band's centre, so the bug needs no exact band width.
  const left = shift - stage / 2

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="${HEIGHT_PX}" shape-rendering="crispEdges">` +
    drawSky() +
    `<text x="16" y="${OVERHANG_PX + 20}" font-family="sans-serif" font-size="13" fill="#B9B4C7">${caption}</text>` +
    `<svg x="50%" y="${OVERHANG_PX - 3}" overflow="visible"><g transform="scale(${SCALE}) translate(${left} 0)">` +
    propFor(kind, dur) +
    drawBug(frames, dur) +
    '</g></svg></svg>'
  )
}

const CAPTIONS: Record<MoodKind, string[]> = {
  idle: [''],
  think: ['думаю…', 'хм…', 'соображаю…'],
  bash: ['гоняю команды', 'стучу по клавишам'],
  write: ['пишу код', 'строчу'],
  read: ['читаю', 'изучаю файлы'],
  web: ['лезу в интернет', 'гуглю'],
  agent: ['зову подмогу'],
  ask: ['жду твой ответ'],
  done: ['готово!', 'сделано!'],
  sad: ['ладно…'],
  oops: ['ой, что-то сломалось'],
}

export function captionFor(kind: MoodKind, seed: number) {
  const options = CAPTIONS[kind]

  return options[seed % options.length] ?? ''
}

export function moodForTool(tool: string): MoodKind | undefined {
  if (tool === 'Bash' || tool === 'PowerShell') return 'bash'
  if (tool === 'Edit' || tool === 'Write' || tool === 'NotebookEdit') return 'write'
  if (tool === 'Read' || tool === 'Grep' || tool === 'Glob') return 'read'
  if (tool === 'WebFetch' || tool === 'WebSearch' || /browser|chrome|playwright/i.test(tool)) {
    return 'web'
  }
  if (tool === 'Agent' || tool === 'Workflow') return 'agent'
  if (tool === 'AskUserQuestion') return 'ask'

  return undefined
}
