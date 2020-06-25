import { useState } from 'react'
import IPFS from 'ipfs'
import OrbitDB from 'orbit-db'

export default function useOrbitDB () {
  const [db, setDB] = useState(null)
  const [log, setLog] = useState([])

  const getOrbit = async () => {
    const ipfs = await IPFS.create({
      repo: './tic-tac-toe-looping-donuts' + Date.now(),
      EXPERIMENTAL: {
        pubsub: true
      },
      config: {
        Addresses: {
          Swarm: [
            '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/'
          ]
        }
      }
    })

    return OrbitDB.createInstance(ipfs)
  }

  const create = async () => {
    const orbit = await getOrbit()

    const db = await orbit.create('first-database', 'eventlog', {
      accessController: {
        write: ['*']
      },
      overwrite: true,
      replicate: true
    })

    setDB(db)

    db.add({
      type: 'joined',
      data: 'host'
    })

    db.events.on('replicated', () => {
      const result = db
        .iterator({ limit: -1 })
        .collect()
        .map(e => e.payload.value)
      setLog(result)
    })

    db.events.on('write', (address, entry, heads) => {
      setLog(log => [...log, entry.payload.value])
    })
  }

  const join = async id => {
    const orbit = await getOrbit()

    const db = await orbit.open(id)
    setDB(db)

    db.add({
      type: 'joined',
      data: 'peer'
    })

    db.events.on('replicated', () => {
      const result = db
        .iterator({ limit: -1 })
        .collect()
        .map(e => e.payload.value)
      setLog(result)
    })

    db.events.on('write', (address, entry, heads) => {
      setLog(log => [...log, entry.payload.value])
    })
  }

  return [db, log, create, join]
}
