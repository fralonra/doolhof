const chalk = require('chalk')

const TYPE_WALL = 0
const TYPE_PATH = '+'

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
  console.time('gen-maze')
  const {
    row,
    col,
    start,
    end
  } = opt
  const visitedPaths = []
  function handleVisit (currentPath, nextPath) {
    if (visitedPaths.findIndex(p => ['x', 'y'].every(k => currentPath[k] === p[k])) < 0) {
      currentPath.visited = true
      visitedPaths.push(currentPath)
    }
    if (nextPath) {
      cells[(currentPath.x + nextPath.x) / 2]
        [(currentPath.y + nextPath.y) / 2].type = TYPE_PATH
    }
    return nextPath
  }

  const cellSum = row * col
  let currentPath = cells[2 * start[0] + 1][2 * start[1] + 1]
  
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
      }
    }
    currentPath = handleVisit(currentPath, nextPath) || visitedPaths[random(visitedPaths.length)]
  }
  console.timeEnd('gen-maze')
  // cells.forEach(c => {
  //   console.log(c.map(c => c.type === TYPE_PATH ? chalk.green(c.visited ? 'v' : 'n') : c.type).join(' '))
  // })
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

const maze = new Labyrinth()