import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
from .dqn import DQN
from .replay_buffer import ReplayBuffer

class Agent:
    def __init__(self, grid_size=10, lr=0.001, gamma=0.99, epsilon=1.0, epsilon_min=0.01, epsilon_decay=0.995, buffer_capacity=10000, batch_size=64):
        self.grid_size = grid_size
        self.input_size = grid_size * grid_size 
        self.output_size = 4 
        self.lr = lr
        self.gamma = gamma
        self.epsilon = epsilon
        self.epsilon_min = epsilon_min
        self.epsilon_decay = epsilon_decay
        self.batch_size = batch_size

        self.policy_net = DQN(self.input_size, self.output_size)
        self.optimizer = optim.Adam(self.policy_net.parameters(), lr=self.lr)
        self.buffer = ReplayBuffer(buffer_capacity)

    def select_action(self, state):
        if np.random.rand() < self.epsilon:
            return np.random.randint(self.output_size)
    
        state_tensor = torch.FloatTensor(state.flatten()).unsqueeze(0) 
        with torch.no_grad():
            q_values = self.policy_net(state_tensor)
        return q_values.argmax().item()