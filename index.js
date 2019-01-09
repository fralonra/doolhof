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

function flat (arr, depth = 1) {
  return arr.reduce((a, v) => a.concat(depth > 1 && Array.isArray(v) ? flat(v, depth - 1) : v), [])
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
  const unVisitedPaths = flat(cells).filter(c => c.type === TYPE_PATH).map(c => [c.col, c.row])
  let currentPath = cells[2 * start[0] + 1][2 * start[1] + 1]
  while (unVisitedPaths.length) {
    currentPath.visited = true
    removeFromCellList(unVisitedPaths, currentPath)
    const nearPaths = getNearPaths(cells, currentPath)
    const availableNearPaths = []
    // nearPaths.forEach(c => {
    //   if (!c) return
    //   if (!c.visited) availableNearPaths.push(c)
    // })
    // currentPath = availableNearPaths[random(availableNearPaths.length)]
    const index = random(nearPaths.length)
    const nextPath = nearPaths[index]
    if (nextPath) {
      let wallToBeBreak
      switch (index) {
        case 0:
          wallToBeBreak = cells[currentPath.col][currentPath.row - 1]
          break
        case 1:
          wallToBeBreak = cells[currentPath.col - 1][currentPath.row]
          break
        case 2:
          wallToBeBreak = cells[currentPath.col][currentPath.row + 1]
          break
        case 3:
          wallToBeBreak = cells[currentPath.col + 1][currentPath.row]
          break
      }
      wallToBeBreak.type = TYPE_PATH
    }
    currentPath = nextPath || unVisitedPaths[random(unVisitedPaths.length)]
  }
  // console.log(flat(cells).map(c => c.type))
  cells.forEach(c => {
    console.log(c.map(c => c.type))
  })
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

function removeFromCellList (cells, cell) {
  cells.splice(cells.indexOf([cell.col, cell.row]), 1)
}

const maze = new Labyrinth()