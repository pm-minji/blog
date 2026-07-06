import { useCallback, useState } from 'react'

export type Lang = 'ko' | 'en'

/** 게임 UI 문자열 사전. 방 안의 한글 소품(화이트보드 등)은 세계관의
 *  일부로 번역하지 않는다 — 한국 PM의 차고에 놀러 온 감각을 유지. */
export const STRINGS = {
  ko: {
    brandSub: '새벽 2:47의 차고',
    clue: '단서',
    introTime: 'AM 2:47',
    introTitle: '민지의 차고 앞.\n셔터 틈으로 불빛이 샌다.',
    introSub: '주인은 잠깐 자리를 비운 것 같다. 안을 둘러볼 절호의 기회.',
    introBtn: '몰래 들어가기',
    introAlt: '그냥 블로그로 갈래요 →',
    toastDark: '깜깜하다. 어딘가 불을 켤 만한 게 있을 텐데… (노란 줄을 찾아보세요)',
    toastLit: (n: number) => `불이 켜졌다. 차고를 뒤져 단서 ${n}개를 찾아보자.`,
    endTitle: '이 차고의 주인을 알 것 같다.',
    endSub: '새벽 2시 47분에도 뭔가를 만들고, 어설퍼도 일단 출시하고, 죽은 프로젝트도 부검해서 벽에 붙여두는 사람.',
    endBlog: '작업 일지 읽으러 가기',
    endAbout: '민지에 대해 →',
    clueBadge: '단서 확보',
    close: '닫기',
    wb: {
      title: '화이트보드의 로드맵',
      text: '아이디어 → 프로토타입 → 출시에 빨간 동그라미. 그리고 옆에 화살표로 다시 처음으로.',
      quote: '"완벽한 계획보다 어설픈 출시. 이 차고의 유일한 규칙."',
    },
    term: {
      title: '민지의 컴퓨터',
      boot: ['PM-MINJI OS v1.0 — guest 세션', '"help"를 입력해 보세요.'],
      help: ['ls projects — 진행 중인 프로젝트', 'whoami — 이 차고의 주인', 'open blog — 작업 일지로 이동'],
      whoami: 'pm-minji — 만드는 걸 좋아하는 PM',
      blog: '블로그로 이동합니다...',
      pw: '...비밀번호는 여기가 아니라 공구함에.',
      notFound: (c: string) => `command not found: ${c}`,
      placeholder: '명령어 입력',
    },
    lockClosed: {
      title: '잠긴 공구함',
      text: '4자리 자물쇠가 걸려 있다. 이 차고 어딘가에 힌트가 있을 텐데.',
      hint: '힌트: 민지의 차고에서 시간은 늘 같은 곳에 멈춰 있다.',
      open: '열기',
    },
    lockOpen: {
      title: '공구함이 열렸다',
      text: '안에는 반쯤 조립된 비밀 프로토타입과 손글씨 메모가 들어 있다.',
      quoteSuffix: '— MJ',
    },
    cork: {
      title: '코르크보드의 기록들',
      text: '폴라로이드 몇 장 — 새벽 3시의 책상, 첫 배포의 날, 오른쪽 위로 꺾이는 그래프. 그리고 "일단 만들자" 메모.',
      link: '민지에 대해 →',
    },
    mail: {
      title: '우편함',
      text: '차고 소식지가 꽂혀 있다 — 새 프로젝트가 리프트에 오를 때마다 발행된다고.',
      link: '작업 일지 구독하러 가기 →',
    },
    clock: {
      title: '벽시계',
      text: '새벽 2시 47분에 멈춰 있다. 건전지가 없는 게 아니라, 일부러 맞춰둔 것 같다.',
      hint: '어딘가의 비밀번호 같기도 하고.',
    },
    radio: { title: '라디오', text: '지지직 — 새벽 주파수에서 lofi가 흘러나온다. 작업이 잘 되는 소리.' },
    project: { status: '상태', visit: '작업 일지 보기 →' },
    aria: {
      mailbox: '우편함 살펴보기',
      whiteboard: '화이트보드 읽기',
      clock: '벽시계 보기',
      terminal: '컴퓨터 사용하기',
      lamp: '램프 줄 당기기',
      corkboard: '코르크보드 살펴보기',
      toolboxLocked: '잠긴 공구함',
      toolboxOpen: '공구함 (열림)',
      radio: '라디오 틀기',
      room: '민지의 차고 내부',
      shelf: (name: string) => `선반 위 프로젝트: ${name}`,
    },
  },
  en: {
    brandSub: 'the garage at 2:47 AM',
    clue: 'Clues',
    introTime: '2:47 AM',
    introTitle: "Minji's garage.\nLight leaks through the shutter.",
    introSub: 'The owner seems to have stepped out. A perfect chance to look around.',
    introBtn: 'Sneak in',
    introAlt: 'Just take me to the blog →',
    toastDark: "It's pitch dark. There must be a light somewhere… (look for the yellow cord)",
    toastLit: (n: number) => `Lights on. Search the garage and find ${n} clues.`,
    endTitle: 'I think I know who owns this garage.',
    endSub: 'Someone who builds at 2:47 AM, ships rough drafts anyway, and pins post-mortems of dead projects on the wall.',
    endBlog: 'Read the work log',
    endAbout: 'About Minji →',
    clueBadge: 'CLUE FOUND',
    close: 'Close',
    wb: {
      title: 'The whiteboard roadmap',
      text: 'Idea → prototype → a red circle around "ship". And an arrow looping back to the start.',
      quote: '"A rough launch beats a perfect plan. The only rule of this garage." (the board is in Korean — you get the gist)',
    },
    term: {
      title: "Minji's computer",
      boot: ['PM-MINJI OS v1.0 — guest session', 'Try typing "help".'],
      help: ['ls projects — current projects', 'whoami — the owner of this garage', 'open blog — go to the work log'],
      whoami: 'pm-minji — a PM who loves building things',
      blog: 'Heading to the blog... (posts are in Korean)',
      pw: '...the passcode belongs to the toolbox, not here.',
      notFound: (c: string) => `command not found: ${c}`,
      placeholder: 'type a command',
    },
    lockClosed: {
      title: 'A locked toolbox',
      text: 'A 4-digit padlock. The hint must be somewhere in this garage.',
      hint: 'Hint: in this garage, time is always stopped at the same moment.',
      open: 'Open',
    },
    lockOpen: {
      title: 'The toolbox opens',
      text: 'Inside: a half-assembled secret prototype and a handwritten note.',
      quoteSuffix: '— MJ',
    },
    cork: {
      title: 'The corkboard',
      text: 'A few polaroids — a desk at 3 AM, launch day, a graph bending up and to the right. And a note: "just build it."',
      link: 'About Minji →',
    },
    mail: {
      title: 'The mailbox',
      text: 'A garage newsletter — published whenever a new project goes up on the lift.',
      link: 'Subscribe to the work log →',
    },
    clock: {
      title: 'The wall clock',
      text: "Stopped at 2:47 AM. Not a dead battery — it looks deliberately set.",
      hint: 'Almost like a passcode.',
    },
    radio: { title: 'The radio', text: 'Static — then lofi from a late-night frequency. The sound of work getting done.' },
    project: { status: 'status', visit: 'See the work log →' },
    aria: {
      mailbox: 'Inspect the mailbox',
      whiteboard: 'Read the whiteboard',
      clock: 'Look at the wall clock',
      terminal: 'Use the computer',
      lamp: 'Pull the lamp cord',
      corkboard: 'Inspect the corkboard',
      toolboxLocked: 'Locked toolbox',
      toolboxOpen: 'Toolbox (open)',
      radio: 'Turn on the radio',
      room: "Inside Minji's garage",
      shelf: (name: string) => `Project on the shelf: ${name}`,
    },
  },
} as const

export type GameStrings = (typeof STRINGS)[Lang]

export function useLang() {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem('garage-lang')
    if (saved === 'ko' || saved === 'en') return saved
    return navigator.language.toLowerCase().startsWith('ko') ? 'ko' : 'en'
  })
  const toggle = useCallback(() => {
    setLang((prev) => {
      const next = prev === 'ko' ? 'en' : 'ko'
      localStorage.setItem('garage-lang', next)
      return next
    })
  }, [])
  return { lang, toggle, t: STRINGS[lang] }
}
