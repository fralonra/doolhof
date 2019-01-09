const TYPE_PATH = 0
const TYPE_WALL = 1

class Labyrinth {
  constructor (opt) {
    const defaultOptions = {
      generate: true,
      row: 10,
      col: 10,
      start: [0, 0]
    }
    defaultOptions.end = [defaultOptions.row - 1, defaultOptions.col - 1]
    this.options = {
      ...defaultOptions,
      ...opt
    }
    if (this.options.generate) {
      this.generate()
    }
  }

  generate () {
    const {
      row,
      col
    } = this.options
    generateMaze(generateCells(row, col), this.options)
  }
}

function generateCells (row, col) {
  const cells = []
  for (let i = 0; i < 2 * col + 1; ++i) {
    const c = []
    for (let j = 0; j < 2 * row + 1; ++j) {
      const cell = {
        row: j,
        col: i
      }
      if (i % 2 === 1 && j % 2 === 1) {
        cell.type = TYPE_PATH,
        cell.visited = false
      } else {
        cell.type = TYPE_WALL
      }
      c.push(cell)
    }
    cells.push(c)
  }
  return cells
}

function generateMaze (cells, opt) {
  const {
    row,
    col,
    start,
    end
  } = opt
  const unVisitedPaths = cells.flat().filter(c => c.type === TYPE_PATH).map(c => [c.col, c.row])
  let currentPath = cells[2 * start[0] + 1][2 * start[1] + 1]
  while (unVisitedPaths.length) {
    currentPath.visited = true
    unVisitedPaths.splice(unVisitedPaths.indexOf([currentPath.col, currentPath.row]), 1)
    const nearPaths = getNearPaths(cells, currentPath)
    const availableNearPaths = []
    nearPaths.forEach(c => {
      if (!c) return
      if (!c.visited) availableNearPaths.push(c)
    })
    currentPath = availableNearPaths[random(availableNearPaths.length)]
  }
}

function getNearPaths (cells, cell) {
  const x = cell.col
  const y = cell.row
  let top, left, bottom, right
  if (cells[x] && cells[x][y - 2]) {
    top = cells[x][y - 2]
  }
  if (cells[x - 2] && cells[x - 2][y]) {
    left = cells[x - 2][y]
  }
  if (cells[x] && cells[x][y + 2]) {
    bottom = cells[x][y + 2]
  }
  if (cells[x + 2] && cells[x + 2][y]) {
    right = cells[x + 2][y]
  }
  return [ top, left, bottom, right ]
}

function random (max) {
  return Math.floor(Math.random() * max)
}

const maze = new Labyrinth()