import { useState, useEffect, useMemo, memo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import GumballImage from './GumballImage.jsx'
import ScoreCounter from './ScoreCounter.jsx'
import Leaderboard from '../routes/Leaderboard.jsx'
import EstimateComponent from './EstimateComponent.jsx'
import StarScore from './StarScore.jsx'
import { subscribeToRoom, markPlayerStarted, startGame } from '../lib/room.js'
import { scoreForGuess, generateGumballs } from '../lib/gumballs.js'
import EstimateDisplay from './EstimateDisplay.jsx' // Assuming this is used somewhere

const TutorialLobby = ({ players, onStart, isReady, playerId, hasStarted, roomId }) => {
  console.log('TutorialLobby rendering with players:', players)
  console.log('TutorialLobby players length:', players.length)
  console.log('TutorialLobby players details:', players.map(p => ({ id: p.id, name: p.name })))
  const startedCount = players.filter(p => p.hasStarted).length
  const totalCount = players.length
  
  return (
    <div className="fixed top-1/2 right-4 transform -translate-y-1/2 border-4 border-black rounded-2xl p-6 w-72 h-auto max-h-[80vh] overflow-y-auto z-30">
      <h2 className="text-2xl font-bold text-center mb-2">Players</h2>
      {roomId && (
        <div className="text-sm text-gray-600 text-center mb-4">
          Room: {roomId}
        </div>
      )}
      <div className="space-y-2 mb-6">
        {players.map((p) => (
          <div 
            key={p.id} 
            className={`p-2 rounded-lg text-lg ${p.hasStarted ? 'bg-green-200' : 'bg-gray-200'}`}
          >
            {p.name} {p.id === playerId && '(You)'}
          </div>
        ))}
      </div>
      <button
        onClick={onStart}
        disabled={!isReady}
        className="w-full bg-[#00F22A] border-2 border-black rounded-lg py-3 text-xl font-bold transition-all duration-200 disabled:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-green-500"
      >
        {hasStarted ? `${startedCount} of ${totalCount} players joined` : 'Start Game'}
      </button>
    </div>
  )
}

// A consistent layout component for each tutorial step
const TutorialLayout = ({ title, description, children }) => (
  <div className="flex-1 flex flex-col items-center justify-center text-center w-full">
    <h1 className="text-black font-black text-5xl mb-4" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
      {title}
    </h1>
    <p className="text-black font-normal text-3xl mb-8 max-w-3xl">
      {description}
    </p>
    <div className="flex justify-center items-center gap-16 w-full px-16">
      {children}
    </div>
  </div>
);

const TutorialStep = memo(function TutorialStep({ step, players, playerId, testGuess, setTestGuess, handleTestGuess, testGuessResult, tutorialGumballMachine }) {
  switch (step) {
    case 1:
      return (
        <TutorialLayout 
          title="Here's how it works" 
          description="The goal is to guess how many gumballs are inside this yellow box."
        >
          <div className="flex flex-col items-center gap-4">
            <div className="bg-[#ffff00] border-4 border-black rounded-2xl p-2 w-[429px] h-[328px] overflow-hidden">
              <GumballImage machine={tutorialGumballMachine} width={425} height={320} />
            </div>
            <div className="bg-white border-4 border-black p-4 w-[429px] h-[80px] rounded-2xl">
              <input
                type="number"
                placeholder="enter a guess"
                value={testGuess}
                onChange={e => setTestGuess(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTestGuess()}
                className="w-full h-full text-center text-3xl font-medium outline-none"
              />
            </div>
          </div>
        </TutorialLayout>
      );
    case 2:
      return (
        <TutorialLayout 
          title="Here's how it works" 
          description="You get points based on how close your guess is."
        >
          <div className="flex flex-row items-center justify-center gap-16">
            <StarScore score={testGuessResult?.score || 0} />
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="bg-[#ffff00] border-4 border-black rounded-2xl p-2 w-[429px] h-[328px] overflow-hidden">
                  <GumballImage machine={tutorialGumballMachine} width={425} height={320} />
                </div>
              </div>
              <div className="bg-gray-200 border-4 border-black p-4 w-[429px] h-[80px] rounded-2xl flex items-center justify-center">
                <span className="text-3xl font-medium text-gray-500">{testGuessResult?.guess}</span>
              </div>
              {testGuessResult && (
                <div className="bg-white p-2 border-2 border-black rounded-lg">
                  +{testGuessResult.score} points! Actual was {tutorialGumballMachine.count}.
                </div>
              )}
            </div>
          </div>
        </TutorialLayout>
      );
    case 3:
      return (
        <TutorialLayout 
          title="Here's how it works" 
          description="You are competing against everyone else."
        >
          <div className="w-[575px] bg-white border-4 border-black rounded-2xl p-4">
            <h2 className="text-2xl font-bold text-center mb-4">Leaderboard</h2>
            <ol className="list-decimal list-inside text-left">
              {players.map((p, i) => (
                <li key={i} className="flex justify-between">
                  <span>{p.name}{p.id === playerId ? ' (You)' : ''}</span>
                  <span>
                    {p.id === playerId 
                      ? (testGuessResult?.score || 0) 
                      : (p.score || 0)
                    }
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </TutorialLayout>
      );
    case 4:
      // Final step - estimate and confidence explanation
      return (
        <TutorialLayout 
          title="How to Guess" 
          description="An estimate and confidence score are provided to help you with your guess."
        >
          <div className="flex justify-center items-center gap-8">
            <div className="bg-[#ffff00] border-4 border-black rounded-2xl p-2 w-[429px] h-[328px] relative overflow-hidden">
              <GumballImage machine={tutorialGumballMachine} width={425} height={320} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <EstimateDisplay confidence="Medium" guess="105" />
              </div>
            </div>
          </div>
        </TutorialLayout>
      )
    default:
      return <div>Unknown step</div>
  }
})

const Tutorial = () => {
  const [step, setStep] = useState(1)
  const navigate = useNavigate()
  const location = useLocation()
  const { roomId, playerId } = location.state || {}
  const [roomData, setRoomData] = useState(null)
  const [players, setPlayers] = useState([])
  const [testGuess, setTestGuess] = useState('')
  const [testGuessResult, setTestGuessResult] = useState(null)
  const [hasStarted, setHasStarted] = useState(false)

  const totalSteps = 4 // Updated total steps - estimate screen is now the final step

  // Memoize the gumball machine so it only generates once
  const tutorialGumballMachine = useMemo(() => generateGumballs(), [])

  useEffect(() => {
    if (roomId) {
      const unsubscribe = subscribeToRoom(roomId, (data) => {
        console.log('Tutorial room data updated:', data)
        setRoomData(data)
        if (data?.state?.gameStarted) {
          navigate(`/individual-competition`, { state: { roomId, playerId } })
        }
      });
      return () => unsubscribe();
    }
  }, [roomId, navigate, playerId]);
  
  // Effect to advance to the next step *after* the score has been set
  useEffect(() => {
    if (testGuessResult) {
      handleNext();
    }
  }, [testGuessResult]);

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  const handleTestGuess = () => {
    if (testGuess.trim()) {
      const score = scoreForGuess(parseInt(testGuess), tutorialGumballMachine.count)
      setTestGuessResult({ score, guess: testGuess })
    }
  }

  const handleStartGame = async () => {
    if (step === totalSteps) {
      setHasStarted(true)
      await markPlayerStarted(roomId, playerId)
      // Attempt to start the game. The server-side logic will check if all players are ready.
      startGame(roomId)
    }
  }

  // Update players when roomData changes
  useEffect(() => {
    if (roomData?.players) {
      const playersList = Object.entries(roomData.players).map(([id, data]) => ({ id, ...data }))
      console.log('Setting players to:', playersList)
      setPlayers(playersList)
    } else {
      console.log('No roomData.players, setting empty array')
      setPlayers([])
    }
  }, [roomData?.players])

  // Debug logging for room data
  useEffect(() => {
    console.log('Tutorial roomData:', roomData)
    console.log('Tutorial roomData.players:', roomData?.players)
  }, [roomData])

  // This effect will listen for changes and navigate when the game starts
  useEffect(() => {
    if (roomData?.state?.gameStarted) {
      navigate(`/individual-competition`, { state: { roomId, playerId } })
    }
  }, [roomData?.state?.gameStarted, navigate, roomId, playerId])

  return (
    <div className="min-h-screen bg-[#8eebff] flex flex-col items-center justify-center p-8 relative">
      <TutorialLobby 
        key={`lobby-${players.length}-${players.map(p => p.id).join(',')}`}
        players={players}
        onStart={handleStartGame}
        isReady={step === totalSteps}
        playerId={playerId}
        hasStarted={hasStarted}
        roomId={roomId}
      />
      <div className="max-w-4xl w-full mr-80">
        <TutorialStep 
          step={step} 
          players={players} 
          playerId={playerId}
          testGuess={testGuess}
          setTestGuess={setTestGuess}
          handleTestGuess={handleTestGuess}
          testGuessResult={testGuessResult}
          tutorialGumballMachine={tutorialGumballMachine}
        />
      </div>

      {step < totalSteps && (
        <div className="fixed bottom-8 right-80 z-40">
          <button
            onClick={handleNext}
            className="bg-[#FFC700] border-2 border-black rounded-lg px-8 py-3 text-xl font-bold"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default Tutorial