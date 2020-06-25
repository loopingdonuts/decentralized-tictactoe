import React, { useState, useEffect } from 'react'
import useOrbit from './useOrbit'

import './style.css'

function App () {
  const [db, log, create, join] = useOrbit()

  const [joinInput, setJoinInput] = useState('')
  const [gameID, setGameID] = useState(null)
  const [gameCreated, setGameCreated] = useState(false)

  useEffect(() => {
    if (db) setGameID(db.address.toString())
  }, [db])

  const joinGame = async () => {
    if (!db) {
      setJoinInput('')
      join(joinInput)
    }
  }

  const createGame = async () => {
    if (!db) {
      setGameCreated(true)
      create()
    }
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <h1>Tic tac toe</h1>
        {gameID === null && !gameCreated ? (
          <React.Fragment>
            <p>
              Generate a code to start a game{' '}
              <button onClick={() => createGame()}>Generate code</button>
            </p>
            <p>
              Or join a game{' '}
              <input
                placeholder='Enter code'
                onChange={e => setJoinInput(e.target.value)}
                value={joinInput}
              />
              {joinInput !== '' && (
                <button onClick={() => joinInput !== '' && joinGame()}>
                  Join game
                </button>
              )}
            </p>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {gameCreated ? (
              <React.Fragment>
                <p>Copy to friend:</p>
                <p>{gameID}</p>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <p>Game id:</p>
                <p>{gameID}</p>
              </React.Fragment>
            )}
          </React.Fragment>
        )}

        {db && (
          <React.Fragment>
            <h2>Send message</h2>
            <button onClick={() => db.add({ type: 'ping', data: null })}>
              Ping
            </button>
            <button onClick={() => db.add({ type: 'pong', data: null })}>
              Pong
            </button>

            <h2>Log</h2>
            {log.map(item => (
              <p>{JSON.stringify(item)}</p>
            ))}
          </React.Fragment>
        )}
      </header>
    </div>
  )
}

export default App
