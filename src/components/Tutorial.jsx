import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { subscribeToRoom, markPlayerStarted, startGame } from '../lib/room.js'
import { scoreForGuess } from '../lib/gumballs.js'
import GumballImage from './GumballImage.jsx'
import GamePanel from './GamePanel.jsx'
import StarScore from './StarScore.jsx'
import EstimateDisplay from './EstimateDisplay.jsx'

const TUTORIAL_GUMBALL_MACHINE = {
  balls: Array.from({ length: 120 }, (_, i) => ({
    // width=380, height=280. Radius=6. So padding=6
    // Valid x: 6 to 374. Range = 368.
    // Valid y: 6 to 274. Range = 268.
    x: Math.random() * 368 + 6,
    y: Math.random() * 268 + 6,
    c: `hsl(${Math.random() * 360}, 80%, 60%)`,
  })),
  count: 120,
};


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

export default function Tutorial() {
  const navigate = useNavigate()
  const location = useLocation()
  const { roomId, playerId } = location.state || {}
  
  const [step, setStep] = useState(1)
  const [roomData, setRoomData] = useState(null)
  const [hasPlayerStarted, setHasPlayerStarted] = useState(false)
  const [testGuess, setTestGuess] = useState('')
  const [testGuessResult, setTestGuessResult] = useState(null)
  
  const player = roomData?.players?.[playerId]
  const players = roomData?.players 
    ? Object.entries(roomData.players).map(([id, playerData]) => ({ id, ...playerData }))
    : []
  const playersStarted = players.filter(p => p.hasStarted).length
  const totalJoined = players.length
  const guessingMethod = player?.guessingMethod

  useEffect(() => {
    if (!roomId) return;
    const unsubscribe = subscribeToRoom(roomId, (data) => {
      setRoomData(data)
      if (data?.state?.gameStarted) {
        navigate('/individual-competition', { 
          state: { 
            roomId,
            playerId,
            fromHomepage: location.state?.fromHomepage || false
          } 
        })
      }
    });
    return () => unsubscribe();
  }, [roomId, navigate, playerId, location.state?.fromHomepage]);
  
  // Effect to advance to the next step *after* the score has been set
  useEffect(() => {
    if (testGuessResult) {
      handleNext();
    }
  }, [testGuessResult]);

  const handleNext = () => setStep(s => s + 1)
  
  const handleTestGuess = () => {
    if (testGuess.trim()) {
      const score = scoreForGuess(parseInt(testGuess), TUTORIAL_GUMBALL_MACHINE.count)
      setTestGuessResult({ score, guess: testGuess })
      // handleNext() is now called by the useEffect
    }
  }

  const handleStartGame = async () => {
    if (!hasPlayerStarted && playerId) {
      setHasPlayerStarted(true);
      await markPlayerStarted(roomId, playerId);
      await startGame(roomId);
    }
  }

  // Loading state while we wait for Firebase data
  if (!roomData || !player) {
    return (
      <div className="h-screen bg-[#8eebff] flex items-center justify-center">
        <div className="text-black text-2xl" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
          Loading tutorial...
        </div>
      </div>
    )
  }
  
  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <TutorialLayout 
            title="Here’s how it works" 
            description="The goal is to guess how many gumballs are inside this yellow box."
          >
            <div className="flex flex-col items-center gap-4">
              <div className="bg-[#ffff00] border-4 border-black rounded-2xl p-8 w-[429px] h-[328px]">
                <GumballImage machine={TUTORIAL_GUMBALL_MACHINE} width={380} height={280} />
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
            title="Here’s how it works" 
            description="You get points based on how close your guess is."
          >
            <div className="flex flex-row items-center justify-center gap-16">
              <StarScore score={testGuessResult?.score || 0} />
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="bg-[#ffff00] border-4 border-black rounded-2xl p-8 w-[429px] h-[328px]">
                    <GumballImage machine={TUTORIAL_GUMBALL_MACHINE} width={380} height={280} />
                  </div>
                </div>
                <div className="bg-gray-200 border-4 border-black p-4 w-[429px] h-[80px] rounded-2xl flex items-center justify-center">
                  <span className="text-3xl font-medium text-gray-500">{testGuessResult?.guess}</span>
                </div>
                {testGuessResult && (
                  <div className="bg-white p-2 border-2 border-black rounded-lg">
                    +{testGuessResult.score} points! Actual was {TUTORIAL_GUMBALL_MACHINE.count}.
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
        return (
          <TutorialLayout 
            title="Here’s how it works" 
            description="Some of you guess by hand, some of you evaluate a guess."
          >
            <div className="bg-[#ffff00] border-4 border-black rounded-2xl p-8 w-[450px] h-[350px] flex flex-col items-center justify-center">
              <GumballImage machine={TUTORIAL_GUMBALL_MACHINE} width={386} height={286} />
            </div>
            <div className="bg-[#ffff00] border-4 border-black rounded-2xl p-8 w-[450px] h-[350px] relative">
              <GumballImage machine={TUTORIAL_GUMBALL_MACHINE} width={386} height={286} />
              <EstimateDisplay confidence="Medium" guess="105" />
            </div>
          </TutorialLayout>
        );
      case 5:
        return (
          <TutorialLayout 
            title="Here’s how it works"
            description={guessingMethod === 'manual' ? "You will be guessing by hand." : "You will be evaluating a guess."}
          >
             {guessingMethod === 'manual' 
                ? (
                  <div className="bg-[#ffff00] border-4 border-black rounded-2xl p-8 w-[450px] h-[350px]">
                    <GumballImage machine={TUTORIAL_GUMBALL_MACHINE} width={386} height={286} />
                  </div>
                )
                : (
                  <div className="bg-[#ffff00] border-4 border-black rounded-2xl p-8 w-[450px] h-[350px] relative">
                    <GumballImage machine={TUTORIAL_GUMBALL_MACHINE} width={386} height={286} />
                    <EstimateDisplay confidence="Medium" guess="105" />
                  </div>
                )
              }
          </TutorialLayout>
        );
      case 6:
        return (
          <TutorialLayout 
            title="You're Ready!" 
            description="You have three minutes to make as many guesses as you can. The game will start when everyone is ready."
          >
            <GamePanel>
              <div className="text-center">
                <h2 className="text-black font-normal text-xl mb-4">Players Ready</h2>
                <div className="space-y-2 min-h-[200px] w-[350px] flex flex-col items-center justify-center">
                  {players.map((p, i) => <div key={i}>{p.name}</div>)}
                </div>
              </div>
            </GamePanel>
          </TutorialLayout>
        );
      default: return null;
    }
  }

  const handleButtonClick = () => {
    if (step === 1) {
      handleTestGuess();
    } else {
      handleNext();
    }
  };

  return (
    <div className="h-full w-full bg-[#8eebff] flex flex-col p-4 overflow-hidden">
      <TutorialLayout title={renderStep().props.title} description={renderStep().props.description}>
        {renderStep().props.children}
      </TutorialLayout>
      <div className="w-full px-8 pb-4">
        <div className="relative w-full max-w-7xl mx-auto h-16">
          {step < 6 && (
            <button onClick={handleButtonClick} className="absolute right-0 bottom-0 border-4 border-black rounded-2xl px-8 py-4 text-black font-black text-2xl" style={{backgroundColor: '#FF4910'}}>
              Next
            </button>
          )}
          {step === 6 && (
            <div className="flex justify-center">
              <button 
                onClick={handleStartGame} 
                className="bg-[#00f22a] border-4 border-black rounded-2xl px-8 py-4 text-black font-black text-2xl disabled:bg-gray-500 disabled:cursor-not-allowed" 
                disabled={hasPlayerStarted}
              >
                {hasPlayerStarted ? `Waiting... ${playersStarted}/${totalJoined} Ready` : 'Start'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}