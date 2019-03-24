# doolhof

[![Build Status](https://travis-ci.org/fralonra/doolhof.svg?branch=master)](https://travis-ci.org/fralonra/doolhof)
[![npm version](https://img.shields.io/npm/v/doolhof.svg)](https://www.npmjs.com/package/doolhof) [![Greenkeeper badge](https://badges.greenkeeper.io/fralonra/doolhof.svg)](https://greenkeeper.io/)

Doolhof, which stands for a labyrinth in Dutch, helps you genrates a maze, using [Prim's algorithm](https://en.wikipedia.org/wiki/Prim%27s_algorithm).

## Install

```bash
npm install doolhof
```

or

```bash
yarn add doolhof
```

## Usage

```javascript
import Doolhof from 'doolhof'

const maze = new Doolhof({
  row: 5, // The row count of the maze. Walls are excluded. Default: 10.
  col: 5, // The column count of the maze. Walls are excluded. Default: 10.
  start: [1, 0], // The coordinate of the entry. Walls are included. Default: the top-left corner.
  end: [9, 10] // The coordinate of the exit. Walls are included. Default: the bottom-right corner.
})

maze.generate() // Generates a new maze with the given option.
maze.get() // Get the formatted data of the maze.
```
