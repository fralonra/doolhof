const t = require('tap')
const test = t.test

const Labyrinth = require('../lib/labyrinth')

test(`Maze's size is correct`, t => {
  t.plan(2)

  const row = Math.ceil(Math.random() * 50)
  const col = Math.ceil(Math.random() * 50)
  const labytinth = new Labyrinth({
    row,
    col
  }).get().raw

  const rawRow = labytinth.length
  t.comment(row, col)
  // if (!labytinth.every(r => r.length === 2 * col + 1)) {
  //   t.fail('Same column lengths')
  // }
  t.strictEqual(labytinth[0].length, 2 * col + 1)
  t.strictEqual(rawRow, 2 * row + 1)
  // if (labytinth[0].length !== 2 * col + 1) {
  //   t.fail('Correct column counts')
  // }
  // if (rawRow !== 2 * row + 1) {
  //   t.fail('Correct row counts')
  // }
})