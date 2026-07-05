import { Vector3 } from 'three'

export interface Station {
  id: string
  /** Card heading shown in the DOM overlay */
  title: string
  blurb: string
  href?: string
  cta?: string
  /** Which side of the hall the prop sits on */
  side: 'left' | 'right' | 'center'
  /** Hall depth position of the prop */
  z: number
}

/**
 * Placeholder copy — swap for real project intros in Phase 2.
 * Order matters: index i maps to rail stop i + 1 (stop 0 is outside the door).
 */
export const STATIONS: Station[] = [
  {
    id: 'welcome',
    title: "PM-Minji's Garage",
    blurb: '만드는 걸 좋아하는 PM의 차고. 스크롤해서 안쪽으로 들어와 보세요.',
    side: 'center',
    z: -2.5,
  },
  {
    id: 'lift-1',
    title: '리프트 #1',
    blurb: '첫 번째 사이드프로젝트 자리. 지금은 정비 중 — 실제 프로젝트 소개로 교체됩니다.',
    href: '/blog/',
    cta: '작업 일지 보기',
    side: 'right',
    z: -10.5,
  },
  {
    id: 'lift-2',
    title: '리프트 #2',
    blurb: '두 번째 사이드프로젝트 자리. 어떤 차가 올라올지 궁금하다면 블로그를 구독하세요.',
    href: '/blog/',
    cta: '작업 일지 보기',
    side: 'left',
    z: -18.5,
  },
  {
    id: 'lift-3',
    title: '리프트 #3',
    blurb: '세 번째 사이드프로젝트 자리. 도파민이 필요할 때마다 새 차가 들어옵니다.',
    href: '/blog/',
    cta: '작업 일지 보기',
    side: 'right',
    z: -26.5,
  },
  {
    id: 'workbench',
    title: '작업대 — 민지',
    blurb: '커버 범위 넓은 PM, 취미는 도파민 터지는 사이드프로젝트. 궁금하면 인사하러 오세요.',
    href: '/about/',
    cta: 'About 민지',
    side: 'center',
    z: -34.5,
  },
]

/** Rail stop count = outside-the-door stop + one per station. */
export const STOP_COUNT = STATIONS.length + 1

/** Scroll progress fraction for rail stop i (uniform CatmullRom parameter). */
export const stopFraction = (i: number) => i / (STOP_COUNT - 1)

/** Camera positions per rail stop — curve passes through these exactly. */
export const CAMERA_STOPS: Vector3[] = [
  new Vector3(0, 1.5, 10.5),
  new Vector3(0, 1.55, 3.2),
  new Vector3(-2.0, 1.6, -5.2),
  new Vector3(2.0, 1.6, -13.2),
  new Vector3(-2.0, 1.6, -21.2),
  new Vector3(0, 1.65, -28.5),
]

/** LookAt targets per rail stop. */
export const LOOK_STOPS: Vector3[] = [
  new Vector3(0, 1.6, -2),
  new Vector3(0, 1.8, -3.2),
  new Vector3(2.2, 1.15, -10.8),
  new Vector3(-2.2, 1.15, -18.8),
  new Vector3(2.2, 1.15, -26.8),
  new Vector3(0, 1.3, -34.5),
]
