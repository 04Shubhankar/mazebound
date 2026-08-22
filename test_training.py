from backend.env.maze_env import MazeEnv
from backend.agent.agent import Agent

env = MazeEnv()
# Temporary hardcoded walls for testing
env.maze[2, 0:8] = 1  # horizontal wall
env.maze[5, 2:10] = 1  # another horizontal wall
env.maze[0:5, 5] = 1  # vertical wall

agent = Agent()

for episode in range(500):
    state, _ = env.reset()
    done = False
    total_reward = 0
    steps = 0

    while not done and steps < 200:
        action = agent.select_action(state)
        next_state, reward, done, _ = env.step(action)
        agent.buffer.push(state, action, reward, next_state, done)
        agent.train()
        state = next_state
        total_reward += reward
        steps += 1

    agent.update_epsilon()
    print(f"Episode {episode + 1} | Steps: {steps} | Total Reward: {total_reward} | Epsilon: {round(agent.epsilon, 3)}")