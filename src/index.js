const TYPE_WALL = 0
const TYPE_PATH = 1

class Doolhof {
  constructor (opt) {
    const defaultOptions = {
      row: 10,
      col: 10,
      start: [1, 0]
    }
    this.options = {
      ...defaultOptions,
      ...opt
    }
    if (!this.options.end) {
      this.options.end = [2 * this.options.col - 1, 2 * this.options.row]
    }
    this.fmtMaze = null
    this.generate()
  }

  generate () {
    const rawMaze = generateCells(this.options)
    generateMaze(rawMaze, this.options)
    this.fmtMaze = formatMaze(rawMaze, this.options)
  }

  get () {
    return this.fmtMaze
  }
}

function flat (arr, depth = 1) {
  return arr.reduce((a, v) => a.concat(depth > 1 && Array.isArray(v) ? flat(v, depth - 1) : v), [])
}

function formatMaze (raw, opt) {
  const {
    row,
    col,
    start,
    end
  } = opt
  return {
    meta: {
      row,
      col,
      start,
      end
    },
    raw: raw.map(r => r.map(c => c.type === TYPE_PATH))
  }
}

function generateCells (opt) {
  const {
    row,
    col
  } = opt
  const cells = []
  for (let i = 0; i < 2 * col + 1; ++i) {
    const c = []
    for (let j = 0; j < 2 * row + 1; ++j) {
      const cell = {
        x: i,
        y: j
      }
      if (i % 2 === 1 && j % 2 === 1) {
        cell.type = TYPE_PATH
        cell.visited = false
      } else {
        cell.type = TYPE_WALL
      }
      c.push(cell)
    }
    cells.push(c)
  }
  cells.forEach(c => c.forEach(cell => {
    cell.path = getNearPaths(cells, cell)
    cell.wall = getNearWalls(cells, cell)
  }))
  return cells
}

function generateMaze (cells, opt) {
  const {
    row,
    col,
    start,
    end
  } = opt
  let lastPassage
  const visitedPaths = []
  const unSkippedPaths = []
  flat(cells).filter(c => c.type === TYPE_PATH).forEach((c, i) => {
    unSkippedPaths[i] = c
  })
  function handleVisit (currentPath, nextPath) {
    if (!currentPath.visited) {
      currentPath.visited = true
      visitedPaths.push(currentPath)
    }
    if (nextPath) {
      lastPassage = cells[(currentPath.x + nextPath.x) / 2][(currentPath.y + nextPath.y) / 2]
      lastPassage.type = TYPE_PATH
    } else {
      lastPassage = null
    }
    return nextPath
  }

  const cellSum = row * col
  let currentPath = cells[1][1]

  while (visitedPaths.length < cellSum) {
    const nearPaths = currentPath.path
    let nextPath
    const nearUnVisitedPaths = nearPaths.filter(p => !p.visited)
    if (nearUnVisitedPaths.length) {
      nextPath = nearUnVisitedPaths[random(nearUnVisitedPaths.length)]
    } else {
      const nearPassage = currentPath.wall.filter(w => w.type === TYPE_PATH)
      if (!nearPassage.length) {
        nextPath = nearPaths[random(nearPaths.length)]
      } else if (nearPassage.length !== 1 ||
        (lastPassage && nearPassage.lengh === 1 && lastPassage.x !== nearPassage[0].x && lastPassage.y !== nearPassage[0].y)) {
        unSkippedPaths.splice(unSkippedPaths.findIndex(p => p.x === currentPath.x && p.y === currentPath.y), 1)
      }
    }
    currentPath = handleVisit(currentPath, nextPath) || visitedPaths[random(visitedPaths.length)]
  }

  cells[start[0]][start[1]].type = TYPE_PATH
  cells[end[0]][end[1]].type = TYPE_PATH
}

function getNearWalls (cells, cell) {
  return getNear(cells, cell, 1)
}

function getNearPaths (cells, cell) {
  return getNear(cells, cell, 2)
}

function getNear (cells, cell, distance) {
  const { x, y } = cell
  const paths = []
  if (cells[x] && cells[x][y - distance]) {
    paths.push(cells[x][y - distance])
  }
  if (cells[x - distance] && cells[x - distance][y]) {
    paths.push(cells[x - distance][y])
  }
  if (cells[x] && cells[x][y + distance]) {
    paths.push(cells[x][y + distance])
  }
  if (cells[x + distance] && cells[x + distance][y]) {
    paths.push(cells[x + distance][y])
  }
  return paths
}

function random (max) {
  return Math.floor(Math.random() * max)
}

export default Doolhof