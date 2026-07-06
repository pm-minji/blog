/**
 * Synthesized SFX — zero audio assets, everything from WebAudio oscillators.
 * All sounds fire from user gestures, so autoplay policies are satisfied.
 */
let ctx: AudioContext | null = null
let muted = localStorage.getItem('garage-muted') === '1'

function ac(): AudioContext {
  ctx ??= new AudioContext()
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

export function isMuted() {
  return muted
}

export function toggleMute() {
  muted = !muted
  localStorage.setItem('garage-muted', muted ? '1' : '0')
  return muted
}

function tone(
  freq: number,
  {
    type = 'sine' as OscillatorType,
    dur = 0.15,
    gain = 0.08,
    delay = 0,
    slide = 0,
  } = {},
) {
  if (muted) return
  try {
    const a = ac()
    const t0 = a.currentTime + delay
    const osc = a.createOscillator()
    const g = a.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, t0)
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t0 + dur)
    g.gain.setValueAtTime(0, t0)
    g.gain.linearRampToValueAtTime(gain, t0 + 0.012)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
    osc.connect(g).connect(a.destination)
    osc.start(t0)
    osc.stop(t0 + dur + 0.05)
  } catch {
    /* audio unavailable — stay silent */
  }
}

function noise({ dur = 0.12, gain = 0.05, delay = 0 } = {}) {
  if (muted) return
  try {
    const a = ac()
    const t0 = a.currentTime + delay
    const buf = a.createBuffer(1, a.sampleRate * dur, a.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
    const src = a.createBufferSource()
    src.buffer = buf
    const g = a.createGain()
    g.gain.value = gain
    const f = a.createBiquadFilter()
    f.type = 'bandpass'
    f.frequency.value = 1800
    src.connect(f).connect(g).connect(a.destination)
    src.start(t0)
  } catch {
    /* silent */
  }
}

export const sfx = {
  cordPull() {
    tone(180, { type: 'triangle', dur: 0.08, gain: 0.1 })
    noise({ dur: 0.06, gain: 0.04 })
  },
  lightsOn() {
    tone(262, { type: 'sine', dur: 0.5, gain: 0.05, delay: 0.05 })
    tone(330, { type: 'sine', dur: 0.5, gain: 0.05, delay: 0.12 })
    tone(392, { type: 'sine', dur: 0.7, gain: 0.06, delay: 0.2 })
  },
  open() {
    noise({ dur: 0.05, gain: 0.03 })
    tone(520, { type: 'triangle', dur: 0.07, gain: 0.05 })
  },
  clue() {
    tone(880, { type: 'sine', dur: 0.12, gain: 0.07 })
    tone(1318, { type: 'sine', dur: 0.22, gain: 0.06, delay: 0.09 })
  },
  lockWrong() {
    tone(130, { type: 'square', dur: 0.16, gain: 0.05 })
    tone(110, { type: 'square', dur: 0.2, gain: 0.05, delay: 0.14 })
  },
  lockOpen() {
    noise({ dur: 0.05, gain: 0.05 })
    tone(523, { type: 'triangle', dur: 0.1, gain: 0.06, delay: 0.05 })
    tone(659, { type: 'triangle', dur: 0.1, gain: 0.06, delay: 0.16 })
    tone(784, { type: 'triangle', dur: 0.1, gain: 0.06, delay: 0.27 })
    tone(1046, { type: 'triangle', dur: 0.3, gain: 0.07, delay: 0.38 })
  },
  radio() {
    noise({ dur: 0.25, gain: 0.06 })
    tone(440, { type: 'sine', dur: 0.3, gain: 0.04, delay: 0.3 })
    tone(494, { type: 'sine', dur: 0.3, gain: 0.04, delay: 0.62 })
    tone(392, { type: 'sine', dur: 0.5, gain: 0.04, delay: 0.94 })
  },
  dopamine() {
    ;[523, 659, 784, 1046, 1318].forEach((f, i) =>
      tone(f, { type: 'triangle', dur: 0.14, gain: 0.07, delay: i * 0.07 }),
    )
  },
  ending() {
    ;[392, 523, 659, 784].forEach((f, i) =>
      tone(f, { type: 'sine', dur: 0.5, gain: 0.05, delay: i * 0.12 }),
    )
  },
}
