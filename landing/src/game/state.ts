import { useCallback, useState } from 'react'
import { sfx } from './sfx'

export type ClueId = 'whiteboard' | 'terminal' | 'toolbox' | 'corkboard' | 'mailbox'
export type Phase = 'intro' | 'dark' | 'lit' | 'done'
export type DialogId = ClueId | 'clock' | 'radio' | `project:${string}` | null

export const CLUE_IDS: ClueId[] = ['whiteboard', 'terminal', 'toolbox', 'corkboard', 'mailbox']

export interface GameState {
  phase: Phase
  clues: Set<ClueId>
  dialog: DialogId
  lockSolved: boolean
  enter: () => void
  lightsOn: () => void
  openDialog: (id: Exclude<DialogId, null>) => void
  closeDialog: () => void
  collect: (id: ClueId) => void
  solveLock: () => void
  finish: () => void
}

export function useGameState(): GameState {
  const [phase, setPhase] = useState<Phase>('intro')
  const [clues, setClues] = useState<Set<ClueId>>(new Set())
  const [dialog, setDialog] = useState<DialogId>(null)
  const [lockSolved, setLockSolved] = useState(false)

  const collect = useCallback((id: ClueId) => {
    setClues((prev) => {
      if (prev.has(id)) return prev
      sfx.clue()
      return new Set(prev).add(id)
    })
  }, [])

  return {
    phase,
    clues,
    dialog,
    lockSolved,
    enter: useCallback(() => setPhase('dark'), []),
    lightsOn: useCallback(() => {
      sfx.cordPull()
      sfx.lightsOn()
      setPhase('lit')
    }, []),
    openDialog: useCallback(
      (id: Exclude<DialogId, null>) => {
        if (id === 'radio') sfx.radio()
        else sfx.open()
        setDialog(id)
        // Passive clues are collected on inspection; terminal/toolbox
        // collect through their own interactions.
        if (id === 'whiteboard' || id === 'corkboard' || id === 'mailbox') collect(id)
      },
      [collect],
    ),
    closeDialog: useCallback(() => setDialog(null), []),
    collect,
    solveLock: useCallback(() => {
      sfx.lockOpen()
      setLockSolved(true)
    }, []),
    finish: useCallback(() => {
      sfx.ending()
      setPhase('done')
    }, []),
  }
}
