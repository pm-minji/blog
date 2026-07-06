/**
 * 프로젝트 레지스트리 — 새 사이드프로젝트가 생기면 여기에 항목 하나만
 * 추가하면 됩니다. 터미널의 `ls projects`와 차고 선반 위 오브젝트가
 * 이 배열에서 자동으로 렌더링됩니다 (방 아트 수정 불필요).
 */
export interface Project {
  id: string
  name: { ko: string; en: string }
  status: { ko: string; en: string }
  blurb: { ko: string; en: string }
  href?: string
  /** 선반 오브젝트 색 — 프로젝트의 시그니처 컬러 */
  color: string
  /** 공구함 안의 비밀 프로토타입은 선반에 올리지 않음 */
  secret?: boolean
}

export const PROJECTS: Project[] = [
  {
    id: 'project-a',
    name: { ko: '사이드프로젝트A', en: 'side-project-a' },
    status: { ko: '정비 중', en: 'in the shop' },
    blurb: {
      ko: '첫 번째 리프트에 올라가 있는 프로젝트. 실제 소개로 교체될 자리.',
      en: 'The project currently up on the first lift. Placeholder copy.',
    },
    href: '/blog/',
    color: '#5b8def',
  },
  {
    id: 'project-b',
    name: { ko: '사이드프로젝트B', en: 'side-project-b' },
    status: { ko: '지표 관찰', en: 'watching metrics' },
    blurb: {
      ko: '새벽 2시에 DAU가 튀는 이유를 아직 못 찾은 프로젝트.',
      en: 'Still investigating why DAU spikes at 2 AM.',
    },
    href: '/blog/',
    color: '#5fd0a5',
  },
  {
    id: 'secret-prototype',
    name: { ko: '비밀_프로토타입', en: 'secret_prototype' },
    status: { ko: '공구함?', en: 'toolbox?' },
    blurb: {
      ko: '아직 아무한테도 안 보여준 것. 다음 달엔 리프트에 올린다.',
      en: "Shown to no one yet. Going up on the lift next month.",
    },
    color: '#ff5a1f',
    secret: true,
  },
]

/** 선반에 진열되는 프로젝트들 (비밀 제외, 최신순 최대 4개) */
export const SHELF_PROJECTS = PROJECTS.filter((p) => !p.secret).slice(0, 4)
