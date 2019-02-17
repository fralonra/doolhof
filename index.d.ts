export as namespace Doolhof

interface DoolhofOptions {
  generate?: boolean
  row?: number
  col?: number
  start?: Array<number>
  end?: Array<number>
}

interface MazeMeta {
  row: number
  col: number
  start: Array<number>
  end: Array<number>
}

type MazeRow = Array<boolean>

interface Maze {
  meta: MazeMeta
  raw: Array<MazeRow>
}

declare class Doolhof {
  constructor(options: DoolhofOptions)

  /**
   * Manually generate the maze
   * */
  generate(): void

  /**
   * Get maze data
   * */
  get(): Maze
}

export = Doolhof