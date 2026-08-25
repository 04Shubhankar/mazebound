export const GRID_SIZE = 10;

export const createEmptyGrid = (size = GRID_SIZE) => {
  return Array.from({ length: size }, () => Array(size).fill(0));
};

export const PRESET_MAZES = {
  empty: {
    name: 'Empty Arena',
    description: 'Clean 10x10 open canvas for custom wall drawing.',
    icon: 'Maximize2',
    generate: () => createEmptyGrid()
  },
  zigzag: {
    name: 'Classic Zigzag',
    description: 'Serpentine corridors forcing long path exploration.',
    icon: 'GitCommit',
    generate: () => {
      const grid = createEmptyGrid();
      // Wall 1: row 2, cols 0..7
      for (let c = 0; c < 8; c++) grid[2][c] = 1;
      // Wall 2: row 5, cols 2..9
      for (let c = 2; c < 10; c++) grid[5][c] = 1;
      // Wall 3: row 7, cols 0..7
      for (let c = 0; c < 8; c++) grid[7][c] = 1;
      return grid;
    }
  },
  spiral: {
    name: 'Spiral Labyrinth',
    description: 'Coiling inward barrier requiring tight cornering.',
    icon: 'RotateCw',
    generate: () => {
      const grid = createEmptyGrid();
      // Outer horizontal top
      for (let c = 2; c <= 8; c++) grid[1][c] = 1;
      // Right vertical
      for (let r = 2; r <= 8; r++) grid[r][8] = 1;
      // Bottom horizontal
      for (let c = 2; c <= 7; c++) grid[8][c] = 1;
      // Left vertical
      for (let r = 3; r <= 7; r++) grid[r][2] = 1;
      // Middle horizontal
      for (let c = 3; c <= 6; c++) grid[3][c] = 1;
      for (let r = 4; r <= 6; r++) grid[r][6] = 1;
      return grid;
    }
  },
  bottleneck: {
    name: 'Choke Point',
    description: 'Two chambers separated by a single narrow passage.',
    icon: 'Filter',
    generate: () => {
      const grid = createEmptyGrid();
      // Vertical barrier at col 4 with single opening at (5, 4)
      for (let r = 0; r < 10; r++) {
        if (r !== 5) grid[r][4] = 1;
      }
      // Diagonal obstacles in second chamber
      grid[2][7] = 1;
      grid[3][7] = 1;
      grid[7][7] = 1;
      grid[8][7] = 1;
      return grid;
    }
  },
  islands: {
    name: 'Obstacle Pillars',
    description: 'Scattered pillar barriers testing omni-directional navigation.',
    icon: 'Grid',
    generate: () => {
      const grid = createEmptyGrid();
      const pillars = [
        [2, 2], [2, 5], [2, 8],
        [5, 2], [5, 5], [5, 8],
        [8, 2], [8, 5]
      ];
      pillars.forEach(([r, c]) => {
        grid[r][c] = 1;
      });
      return grid;
    }
  },
  random: {
    name: 'Procedural Maze',
    description: 'Generates a random obstacle configuration (~25% density).',
    icon: 'Shuffle',
    generate: () => {
      const grid = createEmptyGrid();
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          // Avoid start and goal + immediate neighbors
          if ((r === 0 && c === 0) || (r === 0 && c === 1) || (r === 1 && c === 0)) continue;
          if ((r === GRID_SIZE - 1 && c === GRID_SIZE - 1) || (r === GRID_SIZE - 2 && c === GRID_SIZE - 1) || (r === GRID_SIZE - 1 && c === GRID_SIZE - 2)) continue;
          if (Math.random() < 0.25) {
            grid[r][c] = 1;
          }
        }
      }
      return grid;
    }
  }
};
