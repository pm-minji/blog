import { Vector3 } from 'three'

export interface Station {
  id: string
  /** Card heading shown in the DOM overlay */
  title: string
  blurb: string
  href?: string
  cta?: string
  /** Hall depth position of the station's set piece */
  z: number
}

/**
 * Placeholder copy — swap for real project intros here (single content file).
 * Order matters: index i maps to rail stop i + 1 (stop 0 is outside the door).
 */
export const STATIONS: Station[] = [
  {
    id: 'whiteboard',
    title: '새벽 2시의 작업실',
    blurb: '여기는 민지의 차고 — 무언가가 계속 만들어지는 곳. 화이트보드부터 둘러보세요.',
    z: -2.5,
  },
  {
    id: 'desk-1',
    title: '작업대 01',
    blurb: '첫 번째 사이드프로젝트 자리. 지금은 코드가 올라가 있어요 — 실제 프로젝트 소개로 교체될 예정.',
    href: '/blog/',
    cta: '작업 일지 보기',
    z: -10.5,
  },
  {
    id: 'desk-2',
    title: '작업대 02',
    blurb: '두 번째 자리는 지표를 보는 밤. 새벽 2시에 DAU가 튀는 이유는 아직 미스터리.',
    href: '/blog/',
    cta: '작업 일지 보기',
    z: -18.5,
  },
  {
    id: 'desk-3',
    title: '작업대 03',
    blurb: '세 번째 자리엔 다음 프로토타입이 자라는 중. 박스를 열면 무엇이 나올까요.',
    href: '/blog/',
    cta: '작업 일지 보기',
    z: -26.5,
  },
  {
    id: 'minji-desk',
    title: '민지의 자리',
    blurb: '커버 범위 넓은 PM, 취미는 도파민 터지는 사이드프로젝트. 커피는 줄이는 중(3주째 실패).',
    href: '/about/',
    cta: 'About 민지',
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
  new Vector3(-2.0, 1.5, -5.2),
  new Vector3(2.0, 1.5, -13.2),
  new Vector3(-2.0, 1.5, -21.2),
  new Vector3(0.9, 1.55, -28.5),
]

/** LookAt targets per rail stop. */
export const LOOK_STOPS: Vector3[] = [
  new Vector3(0, 1.6, -2),
  new Vector3(0, 1.7, -2.8),
  new Vector3(3.0, 1.05, -10.7),
  new Vector3(-3.0, 1.05, -18.7),
  new Vector3(3.0, 1.05, -26.7),
  new Vector3(-1.4, 1.15, -35.0),
]
