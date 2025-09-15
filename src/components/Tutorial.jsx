import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { subscribeToRoom, markPlayerStarted, startGame } from '../lib/room.js'
import GumballImage from './GumballImage.jsx'
import GamePanel from './GamePanel.jsx'
import StarScore from './StarScore.jsx'
import EstimateComponent from './EstimateComponent.jsx'

// A consistent layout component for each tutorial step
const TutorialLayout = ({ title, description, children }) => (
  <div className="flex flex-col items-center justify-center text-center w-full max-w-7xl min-h-[60vh]">
    <h1 className="text-black font-black text-5xl mb-4" style={{ fontFamily: 'Lexend Exa, sans-serif' }}>
      {title}
    </h1>
    <p className="text-black font-normal text-3xl mb-8 max-w-3xl">
      {description}
    </p>
    <div className="flex justify-center items-center gap-16 w-full">
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
  
  const player = roomData?.players?.[playerId]
  const players = Object.values(roomData?.players || {})
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

  const handleNext = () => setStep(s => s + 1)
  
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
            <div className="bg-[#ffff00] border-4 border-black rounded-2xl p-8 w-[429px] h-[328px]">
              <GumballImage count={120} width={380} height={280} />
            </div>
          </TutorialLayout>
        );
      case 2:
        return (
          <TutorialLayout 
            title="Here’s how it works" 
            description="You get points based on how close your guess is."
          >
            <div className="flex-1 flex justify-end">
              <StarScore score={1250} playerStats={{guessCount: 1, totalAccuracy: 0.95}} />
            </div>
            <div className="flex-1 flex justify-start">
              <div className="bg-[#ffff00] border-4 border-black rounded-2xl p-8 w-[429px] h-[328px]">
                <GumballImage count={120} width={380} height={280} />
              </div>
            </div>
          </TutorialLayout>
        );
      case 3:
        return (
          <TutorialLayout 
            title="Here’s how it works" 
            description="You are competing against everyone else."
          >
            <div className="w-[575px] bg-white border-4 border-black rounded-2xl p-4">
              <h2 className="text-2xl font-bold text-center mb-4">Leaderboard</h2>
              <ol className="list-decimal list-inside text-left">
                {players.map((p, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{p.name}{p.id === playerId ? ' (You)' : ''}</span>
                    <span>{i === 0 ? 1250 : 1100 - i * 200}</span>
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
            description="Some of you guess by hand, some of you evaluate a guess (with a confidence tag)."
          >
            <div className="bg-[#ffff00] border-4 border-black rounded-2xl p-8 w-[450px] h-[350px] flex flex-col items-center justify-between">
              <GumballImage count={120} width={400} height={200} />
              <div 
                className="bg-white border-4 border-black p-4 w-full"
                style={{
                  borderRadius: '16px',
                  boxShadow: '8px 8px 0px 0px #000000',
                  height: '80px',
                }}
              >
                <input
                  type="number"
                  placeholder="enter a number"
                  className="w-full h-full text-center text-lg font-medium text-black placeholder-gray-500 border-none outline-none bg-transparent"
                  disabled
                />
              </div>
            </div>
            <div className="bg-[#ffff00] border-4 border-black rounded-2xl p-8 w-[450px] h-[350px] flex flex-col items-center justify-around">
              <GumballImage count={120} width={400} height={150} />
              <EstimateComponent onSubmitGuess={() => {}} isSubmitting={true} actualCount={120} />
            </div>
          </TutorialLayout>
        );
      case 5:
        return (
          <TutorialLayout 
            title="Here’s how it works"
            description={guessingMethod === 'manual' ? "You will be guessing by hand." : "You will be evaluating a guess with a confidence tag."}
          >
             <div className="bg-[#ffff00] border-4 border-black rounded-2xl p-8 w-[450px] h-[350px] flex flex-col items-center justify-between">
              <GumballImage count={120} width={400} height={guessingMethod === 'manual' ? 200 : 150} />
              {guessingMethod === 'manual' 
                ? <div 
                    className="bg-white border-4 border-black p-4 w-full"
                    style={{
                      borderRadius: '16px',
                      boxShadow: '8px 8px 0px 0px #000000',
                      height: '80px',
                    }}
                  >
                    <input
                      type="number"
                      placeholder="enter a number"
                      className="w-full h-full text-center text-lg font-medium text-black placeholder-gray-500 border-none outline-none bg-transparent"
                    />
                  </div>
                : <EstimateComponent onSubmitGuess={() => {}} isSubmitting={false} actualCount={120} />
              }
            </div>
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

  return (
    <div className="h-screen bg-[#8eebff] flex flex-col items-center justify-center p-4 overflow-hidden">
      {renderStep()}
      <div className="fixed bottom-8 flex gap-4">
        {step < 6 ? (
          <button onClick={handleNext} className="border-4 border-black rounded-2xl px-8 py-4 text-black font-black text-2xl" style={{backgroundColor: '#FF4910'}}>
            Next
          </button>
        ) : (
          <button 
            onClick={handleStartGame} 
            className="bg-[#00f22a] border-4 border-black rounded-2xl px-8 py-4 text-black font-black text-2xl disabled:bg-gray-500 disabled:cursor-not-allowed" 
            disabled={hasPlayerStarted}
          >
            {hasPlayerStarted ? `Waiting... ${playersStarted}/${totalJoined} Ready` : 'Start'}
          </button>
        )}
      </div>
    </div>
  )
}