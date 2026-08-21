import gymnasium as gym
import numpy as np

class MazeEnv(gym.Env):
    def __init__(self,grid_size = 10):
        super().__init__()

        self.grid_size = grid_size

        # In the grid 0 indicates a free cell and 1 indicates a wall
        self.maze = np.zeros((grid_size, grid_size), dtype=np.int32)

        # Agent start at the top-left corner of the maze and the goal is to reach the bottom right corner
        self.start = (0, 0)
        self.goal = (grid_size - 1, grid_size - 1)
        self.agent_pos = list(self.start)

        # 4 possible actions: 0=up, 1=down, 2=left, 3=right
        self.action_space = gym.spaces.Discrete(4)

        # Agent sees the entire maze 
        self.observation_space = gym.spaces.Box(
            low=0,
            high=1,
            shape=(grid_size, grid_size),
            dtype=np.int32
        )
    
    def reset(self):
        self.agent_pos = list(self.start)
        self.maze = np.zeros((self.grid_size, self.grid_size), dtype=np.int32)
        return self.maze.copy()
    
    def step(self, action):
        row, col = self.agent_pos
        if action == 0:  # up
            row -= 1
        elif action == 1:  # down
            row += 1
        elif action == 2:  # left
            col -= 1
        elif action == 3:  # right
            col += 1

        # Check 1: Is new position within bounds?
        if row < 0 or row >= self.grid_size or col < 0 or col >= self.grid_size:
            # If boundary hit don't move and penalize
            reward = -1
            done = False
            return self.maze.copy(), reward, done, {}

        # Check 2: Is new position a wall?
        if self.maze[row, col] == 1:
            # If wall hit don't move and penalize
            reward = -1
            done = False
            return self.maze.copy(), reward, done, {}

        # If valid move, update agent position
        self.agent_pos = [row, col]

        # Check 3: Has the agent reached the goal?
        if self.agent_pos == list(self.goal):
            reward = 100  # Reward for reaching the goal
            done = True

        else:
            reward = -1  # Small penalty for each step taken
            done = False

        return self.maze.copy(), reward, done, {}

    
    def render(self):
        pass