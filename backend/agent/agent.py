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
    
    def train(self):
        if len(self.buffer) < self.batch_size:
            return

        batch = self.buffer.sample(self.batch_size)
        states, actions, rewards, next_states, dones = zip(*batch)

        states = torch.FloatTensor(np.array(states)).view(-1, self.input_size)
        actions = torch.LongTensor(actions).unsqueeze(1)
        rewards = torch.FloatTensor(rewards).unsqueeze(1)
        next_states = torch.FloatTensor(np.array(next_states)).view(-1, self.input_size)
        dones = torch.FloatTensor(dones).unsqueeze(1)

        current_q_values = self.policy_net(states).gather(1, actions)

        with torch.no_grad():
            next_q = self.policy_net(next_states).max(1, keepdim=True)[0]

        target_q_values = rewards + (self.gamma * next_q * (1 - dones))

        loss = nn.MSELoss()(current_q_values, target_q_values)
        
        self.optimizer.zero_grad()
        loss.backward()
        self.optimizer.step()

    def update_epsilon(self):
        self.epsilon = max(self.epsilon_min, self.epsilon * self.epsilon_decay)