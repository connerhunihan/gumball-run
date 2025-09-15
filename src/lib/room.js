import { 
  ref, 
  set, 
  get, 
  onValue,
  remove
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
      isActive: true,
      lastGuessTime: null,
      gameStarted: false,
      currentRound: 1
    },
    players: {},
    totalJoined: 0, // Track total number of users who have joined a team
    playersStarted: 0, // Track number of players who have clicked start
    totalVisitors: 0, // Track total number of users who have opened the URL
    visitors: {} // Track individual visitors and their status
  }
  
  await set(roomRef, roomData)
  return roomId
}

// Join a team in a room
export const joinRoom = async (roomId, playerName) => {
  const playerId = `player_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
  const playerRef = ref(database, `rooms/${roomId}/players/${playerId}`)
  
  // Get current room data to increment totalJoined
  const roomRef = ref(database, `rooms/${roomId}`)
  const roomSnapshot = await get(roomRef)
  const roomData = roomSnapshot.val()
  
  // Determine guessing method (50/50 split)
  const players = Object.values(roomData?.players || {})
  const manualCount = players.filter(p => p.guessingMethod === 'manual').length
  const estimateCount = players.filter(p => p.guessingMethod === 'estimate').length
  const guessingMethod = manualCount <= estimateCount ? 'manual' : 'estimate'

  await set(playerRef, {
    name: playerName,
    joinedAt: Date.now(),
    hasStarted: false, // Track if this player has clicked start
    currentMachine: generateGumballs(), // Each player gets their own machine
    score: 0, // Individual player score
    guessingMethod: guessingMethod
  })
  
  // Increment totalJoined counter
  const newTotalJoined = (roomData?.totalJoined || 0) + 1
  const totalJoinedRef = ref(database, `rooms/${roomId}/totalJoined`)
  await set(totalJoinedRef, newTotalJoined)
  
  return playerId
}

// Mark a player as started
export const markPlayerStarted = async (roomId, playerId) => {
  const playerRef = ref(database, `rooms/${roomId}/players/${playerId}`)
  
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

// Submit a guess for a specific player
export const submitGuess = async (roomId, playerId, guess, confidence) => {
  const roomRef = ref(database, `rooms/${roomId}`)
  const roomSnapshot = await get(roomRef)
  const roomData = roomSnapshot.val()
  
  if (!roomData || !roomData.state.isActive) {
    throw new Error('Game not active')
  }
  
  // Get the player's current machine
  const playerRef = ref(database, `rooms/${roomId}/players/${playerId}`)
  const playerSnapshot = await get(playerRef)
  const playerData = playerSnapshot.val()
  
  if (!playerData || !playerData.currentMachine) {
    throw new Error('Player machine not found')
  }
  
  const playerMachine = playerData.currentMachine
  const score = scoreForGuess(parseInt(guess), playerMachine.count, confidence)
  
  // Calculate accuracy for this guess (0-1 scale)
  const actualCount = playerMachine.count
  const guessValue = parseInt(guess)
  const error = Math.abs(actualCount - guessValue)
  const errorPercentage = error / actualCount
  const accuracy = Math.max(0, 1 - errorPercentage)
  
  // Debug logging
  console.log(`Guess accuracy calculation:`, {
    actualCount,
    guessValue,
    error,
    errorPercentage: (errorPercentage * 100).toFixed(1) + '%',
    accuracy: (accuracy * 100).toFixed(1) + '%'
  })
  
  // Update player's stats
  const newPlayerScore = (playerData.score || 0) + score
  const newGuessCount = (playerData.guessCount || 0) + 1
  const newTotalAccuracy = (playerData.totalAccuracy || 0) + accuracy
  
  await set(playerRef, {
    ...playerData,
    score: newPlayerScore,
    guessCount: newGuessCount,
    totalAccuracy: newTotalAccuracy,
    currentMachine: generateGumballs() // Generate new machine for next round
  })
  
  // Record the guess
  const guessRef = ref(database, `rooms/${roomId}/guesses/${Date.now()}`)
  await set(guessRef, {
    playerId,
    playerName: playerData.name,
    guess: parseInt(guess),
    actualCount: playerMachine.count,
    score,
    timestamp: Date.now()
  })
  
  // Update last guess time
  const stateRef = ref(database, `rooms/${roomId}/state`)
  await set(stateRef, {
    ...roomData.state,
    lastGuessTime: Date.now()
  })
  
  return { 
    score, 
    newScore: newPlayerScore, 
    actualCount: playerMachine.count, 
    playerName: playerData.name
  }
}

// Listen to room state changes
export const subscribeToRoom = (roomId, callback) => {
  // Subscribe to the entire room for game state
  const roomRef = ref(database, `rooms/${roomId}`)
  return onValue(roomRef, (snapshot) => {
    const data = snapshot.val()
    if (data) {
      callback({
        ...data,
        _timestamp: Date.now()
      })
    }
  })
}

// Listen to team scores
export const subscribeToScores = (roomId, callback) => {
  const playersRef = ref(database, `rooms/${roomId}/players`)
  
  return onValue(playersRef, (snapshot) => {
    const players = snapshot.val()
    if (players) {
      callback(players)
    }
  })
}

// Check if game is still active
export const isGameActive = (roomData) => {
  if (!roomData || !roomData.state?.isActive) return false
  if (!roomData.state?.gameStarted) return true // Game hasn't started yet
  return Date.now() < roomData.gameEndTime
}

// Get remaining time in seconds
export const getRemainingTime = (roomData) => {
  if (!roomData || !roomData.gameEndTime) return 0
  const remaining = Math.max(0, Math.floor((roomData.gameEndTime - Date.now()) / 1000))
  return remaining
}

// Start the game (only if all visitors have joined teams and started)
export const startGame = async (roomId) => {
  const roomRef = ref(database, `rooms/${roomId}`)
  const roomSnapshot = await get(roomRef)
  const roomData = roomSnapshot.val()
  
  if (!roomData) return false
  
  // Game starts when the number of players who have clicked "Start"
  // equals the total number of players who have joined the room.
  if (roomData.playersStarted === 0 || roomData.playersStarted < roomData.totalJoined) {
    console.log(`Waiting for all players. ${roomData.playersStarted}/${roomData.totalJoined} ready.`);
    return false;
  }
  
  // Set new game end time when game actually starts
  const newGameEndTime = Date.now() + (3 * 60 * 1000) // 3 minutes from now
  const gameEndTimeRef = ref(database, `rooms/${roomId}/gameEndTime`)
  await set(gameEndTimeRef, newGameEndTime)
  
  const stateRef = ref(database, `rooms/${roomId}/state`)
  await set(stateRef, {
    isActive: true,
    lastGuessTime: null,
    gameStarted: true
  })
  
  return true
}

// Register a visitor to the room (when they open the URL)
export const registerVisitor = async (roomId, visitorId) => {
  const visitorRef = ref(database, `rooms/${roomId}/visitors/${visitorId}`)
  const visitorData = {
    id: visitorId,
    joinedAt: Date.now(),
    hasJoinedTeam: false,
    hasStarted: false,
    playerId: null
  }
  
  await set(visitorRef, visitorData)
  
  // Increment total visitors count
  const roomRef = ref(database, `rooms/${roomId}`)
  const roomSnapshot = await get(roomRef)
  const roomData = roomSnapshot.val()
  
  const newTotalVisitors = (roomData?.totalVisitors || 0) + 1
  const totalVisitorsRef = ref(database, `rooms/${roomId}/totalVisitors`)
  await set(totalVisitorsRef, newTotalVisitors)
  
  return visitorData
}

// Update visitor status when they join a team
export const updateVisitorStatus = async (roomId, visitorId, playerId) => {
  const visitorRef = ref(database, `rooms/${roomId}/visitors/${visitorId}`)
  const visitorSnapshot = await get(visitorRef)
  const currentData = visitorSnapshot.val() || {}
  
  await set(visitorRef, {
    ...currentData,
    hasJoinedTeam: true,
    playerId: playerId
  })
}

// Update visitor status when they start the game
export const markVisitorStarted = async (roomId, visitorId) => {
  const visitorRef = ref(database, `rooms/${roomId}/visitors/${visitorId}`)
  const visitorSnapshot = await get(visitorRef)
  const currentData = visitorSnapshot.val() || {}
  
  await set(visitorRef, {
    ...currentData,
    hasStarted: true
  })
}

// Check if a room exists
export const roomExists = async (roomId) => {
  const roomRef = ref(database, `rooms/${roomId}`)
  const roomSnapshot = await get(roomRef)
  return roomSnapshot.exists()
}

// Delete a room completely
export const deleteRoom = async (roomId) => {
  const roomRef = ref(database, `rooms/${roomId}`)
  await remove(roomRef)
  console.log(`Room ${roomId} deleted`)
}

// Clear room state (remove all players)
export const clearRoomState = async (roomId) => {
  const roomRef = ref(database, `rooms/${roomId}`)
  const roomSnapshot = await get(roomRef)
  const roomData = roomSnapshot.val()
  
  if (roomData) {
    // Reset teams to empty state
    const playersRef = ref(database, `rooms/${roomId}/players`)
    await set(playersRef, {})
    
    // Reset totalJoined counter
    const totalJoinedRef = ref(database, `rooms/${roomId}/totalJoined`)
    await set(totalJoinedRef, 0)
    
    // Reset playersStarted counter
    const playersStartedRef = ref(database, `rooms/${roomId}/playersStarted`)
    await set(playersStartedRef, 0)
    
    // Reset game state
    const stateRef = ref(database, `rooms/${roomId}/state`)
    await set(stateRef, {
      isActive: true,
      lastGuessTime: null,
      gameStarted: false
    })
  }
}

// Get or create the active room (fallback for non-URL based joining)
export const getOrCreateActiveRoom = async () => {
  // First, try to find an existing active room
  const roomsRef = ref(database, 'rooms')
  const roomsSnapshot = await get(roomsRef)
  const rooms = roomsSnapshot.val() || {}
  
  // Look for an active room (not started yet)
  for (const [roomId, roomData] of Object.entries(rooms)) {
    if (roomData && !roomData.state?.gameStarted && isGameActive(roomData)) {
      console.log('Found existing active room:', roomId)
      return roomId
    }
  }
  
  // If no active room found, create a new one
  console.log('No active room found, creating new one')
  const newRoomId = generateRoomId()
  await createRoom(newRoomId)
  return newRoomId
}