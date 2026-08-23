from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from backend.env.maze_env import MazeEnv
from backend.agent.agent import Agent

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "mazebound backend running"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    env = MazeEnv()
    agent = Agent()
    
    for episode in range(500):
        state, _ = env.reset()
        done = False
        
        while not done:
            action = agent.select_action(state)
            next_state, reward, done, _ = env.step(action)
            agent.buffer.push(state, action, reward, next_state, done)
            agent.train()
            state = next_state
            
            await websocket.send_json({
                "agent_pos": env.agent_pos,
                "maze": env.maze.tolist(),
                "episode": episode,
                "epsilon": round(agent.epsilon, 3)
            })
        
        agent.update_epsilon()