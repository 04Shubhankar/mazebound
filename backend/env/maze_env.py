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
        pass
    
    def render(self):
        pass