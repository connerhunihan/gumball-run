import { 
  ref, 
  set, 
  get, 
  onValue
} from 'firebase/database'
import { database } from './firebase.js'
import { generateGumballs, scoreForGuess } from './gumballs.js'

// Generate a simple room ID
export const generateRoomId = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

// Create a new game room
export const createRoom = async (roomId) => {
  const roomRef = ref(database, `rooms/${roomId}`)
  const now = Date.now()
  const gameEndTime = now + (3 * 60 * 1000) // 3 minutes from now
  
  const roomData = {
    createdAt: now,
    gameEndTime: gameEndTime,
    state: {
      currentMachine: generateGumballs(),
      isActive: true,
      lastGuessTime: null,
      gameStarted: false
    },
    teams: {
      team1: {
        name: 'Guestimators',
        players: {},
        score: 0
      },
      team2: {
        name: 'Quote warriors', 
        players: {},
        score: 0
      }
    },
    totalJoined: 0 // Track total number of users who have joined
  }
  
  await set(roomRef, roomData)
  return roomId
}

// Join a team in a room
export const joinTeam = async (roomId, teamId, playerName) => {
  const playerId = `${teamId}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
  const playerRef = ref(database, `rooms/${roomId}/teams/${teamId}/players/${playerId}`)
  
  // Get current room data to increment totalJoined
  const roomRef = ref(database, `rooms/${roomId}`)
  const roomSnapshot = await get(roomRef)
  const roomData = roomSnapshot.val()
  
  await set(playerRef, {
    name: playerName,
    joinedAt: Date.now()
  })
  
  // Increment totalJoined counter
  const newTotalJoined = (roomData?.totalJoined || 0) + 1
  const totalJoinedRef = ref(database, `rooms/${roomId}/totalJoined`)
  await set(totalJoinedRef, newTotalJoined)
  
  return playerId
}

// Submit a guess for any team
export const submitGuess = async (roomId, playerId, guess, teamId) => {
  const roomRef = ref(database, `rooms/${roomId}`)
  const roomSnapshot = await get(roomRef)
  const roomData = roomSnapshot.val()
  
  if (!roomData || !roomData.state.isActive) {
    throw new Error('Game not active')
  }
  
  const currentMachine = roomData.state.currentMachine
  const score = scoreForGuess(parseInt(guess), currentMachine.count)
  
  // Determine which team to update based on playerId or teamId
  const targetTeam = teamId || (playerId.startsWith('team1_') ? 'team1' : 'team2')
  const newScore = roomData.teams[targetTeam].score + score
  const teamScoreRef = ref(database, `rooms/${roomId}/teams/${targetTeam}/score`)
  await set(teamScoreRef, newScore)
  
  // Record the guess
  const guessRef = ref(database, `rooms/${roomId}/guesses/${Date.now()}`)
  await set(guessRef, {
    playerId,
    teamId: targetTeam,
    guess: parseInt(guess),
    actualCount: currentMachine.count,
    score,
    timestamp: Date.now()
  })
  
  // Generate new machine and update state
  const newMachine = generateGumballs()
  const stateRef = ref(database, `rooms/${roomId}/state`)
  await set(stateRef, {
    ...roomData.state,
    currentMachine: newMachine,
    lastGuessTime: Date.now()
  })
  
  return { score, newScore, actualCount: currentMachine.count, teamId: targetTeam }
}

// Listen to room state changes
export const subscribeToRoom = (roomId, callback) => {
  const roomRef = ref(database, `rooms/${roomId}`)
  
  const unsubscribe = onValue(roomRef, (snapshot) => {
    const data = snapshot.val()
    if (data) {
      callback(data)
    }
  })
  
  return unsubscribe
}

// Listen to team scores
export const subscribeToScores = (roomId, callback) => {
  const scoresRef = ref(database, `rooms/${roomId}/teams`)
  
  const unsubscribe = onValue(scoresRef, (snapshot) => {
    const data = snapshot.val()
    if (data) {
      callback({
        team1Score: data.team1?.score || 0,
        team2Score: data.team2?.score || 0
      })
    }
  })
  
  return unsubscribe
}

// Check if game is still active
export const isGameActive = (roomData) => {
  if (!roomData || !roomData.state?.isActive) return false
  return Date.now() < roomData.gameEndTime
}

// Get remaining time in seconds
export const getRemainingTime = (roomData) => {
  if (!roomData || !roomData.gameEndTime) return 0
  const remaining = Math.max(0, Math.floor((roomData.gameEndTime - Date.now()) / 1000))
  return remaining
}

// Start the game
export const startGame = async (roomId) => {
  const stateRef = ref(database, `rooms/${roomId}/state`)
  await set(stateRef, {
    currentMachine: generateGumballs(),
    isActive: true,
    lastGuessTime: null,
    gameStarted: true
  })
  
  return true
}