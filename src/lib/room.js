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
      team1Machine: generateGumballs(),
      team2Machine: generateGumballs(),
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
    totalJoined: 0, // Track total number of users who have joined
    playersStarted: 0 // Track number of players who have clicked start
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
    joinedAt: Date.now(),
    hasStarted: false // Track if this player has clicked start
  })
  
  // Increment totalJoined counter
  const newTotalJoined = (roomData?.totalJoined || 0) + 1
  const totalJoinedRef = ref(database, `rooms/${roomId}/totalJoined`)
  await set(totalJoinedRef, newTotalJoined)
  
  return playerId
}

// Mark a player as started
export const markPlayerStarted = async (roomId, playerId) => {
  const playerRef = ref(database, `rooms/${roomId}/teams/${playerId.startsWith('team1_') ? 'team1' : 'team2'}/players/${playerId}`)
  
  // Mark this player as started
  await set(playerRef, {
    ...(await get(playerRef)).val(),
    hasStarted: true
  })
  
  // Increment playersStarted counter
  const roomRef = ref(database, `rooms/${roomId}`)
  const roomSnapshot = await get(roomRef)
  const roomData = roomSnapshot.val()
  
  const newPlayersStarted = (roomData?.playersStarted || 0) + 1
  const playersStartedRef = ref(database, `rooms/${roomId}/playersStarted`)
  await set(playersStartedRef, newPlayersStarted)
  
  return newPlayersStarted
}

// Submit a guess for any team
export const submitGuess = async (roomId, playerId, guess, teamId) => {
  const roomRef = ref(database, `rooms/${roomId}`)
  const roomSnapshot = await get(roomRef)
  const roomData = roomSnapshot.val()
  
  if (!roomData || !roomData.state.isActive) {
    throw new Error('Game not active')
  }
  
  // Get the machine for the specific team
  const teamMachine = roomData.state[`${teamId}Machine`] || roomData.state.currentMachine
  const score = scoreForGuess(parseInt(guess), teamMachine.count)
  
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
    actualCount: teamMachine.count,
    score,
    timestamp: Date.now()
  })
  
  // Generate new machine for this team and update state
  const newMachine = generateGumballs()
  const stateRef = ref(database, `rooms/${roomId}/state`)
  await set(stateRef, {
    ...roomData.state,
    [`${targetTeam}Machine`]: newMachine,
    lastGuessTime: Date.now()
  })
  
  return { score, newScore, actualCount: teamMachine.count, teamId: targetTeam }
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

// Start the game (only if all players have started)
export const startGame = async (roomId) => {
  const roomRef = ref(database, `rooms/${roomId}`)
  const roomSnapshot = await get(roomRef)
  const roomData = roomSnapshot.val()
  
  if (!roomData) return false
  
  // Check if all players have started
  const totalPlayers = roomData.totalJoined || 0
  const playersStarted = roomData.playersStarted || 0
  
  if (playersStarted < totalPlayers || totalPlayers === 0) {
    return false // Not all players have started yet
  }
  
  const stateRef = ref(database, `rooms/${roomId}/state`)
  await set(stateRef, {
    team1Machine: generateGumballs(),
    team2Machine: generateGumballs(),
    isActive: true,
    lastGuessTime: null,
    gameStarted: true
  })
  
  return true
}

// Check if a room exists
export const roomExists = async (roomId) => {
  const roomRef = ref(database, `rooms/${roomId}`)
  const roomSnapshot = await get(roomRef)
  return roomSnapshot.exists()
}

// Clear room state (remove all players)
export const clearRoomState = async (roomId) => {
  const roomRef = ref(database, `rooms/${roomId}`)
  const roomSnapshot = await get(roomRef)
  const roomData = roomSnapshot.val()
  
  if (roomData) {
    // Reset teams to empty state
    const teamsRef = ref(database, `rooms/${roomId}/teams`)
    await set(teamsRef, {
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
    })
    
    // Reset totalJoined counter
    const totalJoinedRef = ref(database, `rooms/${roomId}/totalJoined`)
    await set(totalJoinedRef, 0)
    
    // Reset playersStarted counter
    const playersStartedRef = ref(database, `rooms/${roomId}/playersStarted`)
    await set(playersStartedRef, 0)
    
    // Reset game state
    const stateRef = ref(database, `rooms/${roomId}/state`)
    await set(stateRef, {
      team1Machine: generateGumballs(),
      team2Machine: generateGumballs(),
      isActive: true,
      lastGuessTime: null,
      gameStarted: false
    })
  }
}

// Get or create the active room (only one room at a time)
export const getOrCreateActiveRoom = async () => {
  // First, try to find an existing active room
  const roomsRef = ref(database, 'rooms')
  const roomsSnapshot = await get(roomsRef)
  const rooms = roomsSnapshot.val() || {}
  
  // Look for an active room (not started yet)
  for (const [roomId, roomData] of Object.entries(rooms)) {
    if (roomData && !roomData.state?.gameStarted && isGameActive(roomData)) {
      console.log('Found existing active room:', roomId)
      // Clear the room state to give fresh experience
      await clearRoomState(roomId)
      return roomId
    }
  }
  
  // If no active room found, create a new one
  console.log('No active room found, creating new one')
  const newRoomId = generateRoomId()
  await createRoom(newRoomId)
  return newRoomId
}