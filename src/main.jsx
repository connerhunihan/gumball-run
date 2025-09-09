import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import App from './routes/App.jsx'
import Game from './routes/Game.jsx'
import StartScreen from './components/StartScreen.jsx'
import JoinGame from './components/JoinGame.jsx'
import TeamSetup from './components/TeamSetup.jsx'
import Tutorial from './components/Tutorial.jsx'
import TeamCompetition from './components/TeamCompetition.jsx'
import TestTeamCompetition from './components/TestTeamCompetition.jsx'
import DebugPage from './components/DebugPage.jsx'
import FinalScore from './components/FinalScore.jsx'
import Leaderboard from './routes/Leaderboard.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
                  { index: true, element: <StartScreen /> },
                  { path: 'join', element: <JoinGame /> },
                  { path: 'join/:roomId', element: <JoinGame /> },
                  { path: 'team-setup', element: <TeamSetup /> },
                  { path: 'tutorial', element: <Tutorial /> },
                  { path: 'team-competition', element: <TeamCompetition /> },
                  { path: 'test-team-competition', element: <TestTeamCompetition /> },
                  { path: 'debug', element: <DebugPage /> },
                  { path: 'game', element: <Game /> },
                  { path: 'final-score', element: <FinalScore /> },
                  { path: 'leaderboard', element: <Leaderboard /> },
    ],
  },
], {
  basename: import.meta.env.PROD ? '/gumball-run' : '/'
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
