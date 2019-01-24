const TYPE_WALL = 0
const TYPE_PATH = 1
const chalk = require('chalk')

class Labyrinth {
  constructor (opt) {
    const defaultOptions = {
      generate: true,
      row: 10,
      col: 10,
      print: false
    }
    this.options = {
      ...defaultOptions,
      ...opt
    }
    this.fmtMaze = null
    if (this.options.generate) {
      this.generate()
    }
  }

  generate () {
    console.time('gen-maze')
    const rawMaze = generateCells(this.options)
    generateMaze(rawMaze, this.options)
    this.fmtMaze = formatMaze(rawMaze, this.options)
    if (this.options.print) {
      this.fmtMaze.raw.forEach(c => {
        console.log(c.map(c => c ? chalk.green('o') : '·').join(' '))
      })
    }
    console.timeEnd('gen-maze')
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
    col
  } = opt
  return {
    meta: {
      row,
      col
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
  for (let i = 0; i < 2 * row + 1; ++i) {
    const c = []
    for (let j = 0; j < 2 * col + 1; ++j) {
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
    col
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

function removeFromCellList (cells, cell) {
  cells.splice(cells.indexOf([cell.x, cell.y]), 1)
}

new Labyrinth({
  row: 5,
  col: 10
})

module.exports = Labyrinth
