import IPFS from 'ipfs'
import OrbitDB from 'orbit-db'

export default async () => {
  const ipfs = await IPFS.create({
    repo: './tic-tac-toe-looping-donuts' + Date.now(),
    EXPERIMENTAL: {
      pubsub: true
    },
    config: {
      Addresses: {
        Swarm: ['/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/']
      }
    }
  })

  return await OrbitDB.createInstance(ipfs)
}
