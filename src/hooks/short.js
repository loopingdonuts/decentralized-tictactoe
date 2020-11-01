export default function useOrbitDB() {
  const [db, setDB] = useState(null);
  const [log, setLog] = useState([]);

  const getOrbit = async () => {
    const ipfs = await IPFS.create({
      repo: "ipfs/tic-tac-toe-looping-donuts/" + String(Math.random() + Date.now()),
      EXPERIMENTAL: {
        pubsub: true,
      },
    });

    return await OrbitDB.createInstance(ipfs);
  };

  const create = async name => {
    const orbit = await getOrbit();

    const db = await orbit.create("game", "eventlog", {
      accessController: {
        write: ["*"],
      },
      overwrite: true,
      replicate: true,
    });

    setDB(db);

    return new Promise((resolve, reject) => {
      db.events.on("replicated", () => {
        console.log("replicated");

        const result = db
          .iterator({ limit: -1 })
          .collect()
          .map(e => e.payload.value);
        setLog(result);

        if (result.length === 2) {
          resolve();
        }
      });

      db.events.on("write", (address, entry, heads) => {
        console.log("write", address, entry, heads);
        setLog(log => [...log, entry.payload.value]);
      });
    });
  };

  const join = async (name, id) => {
    const orbit = await getOrbit();

    console.log(orbit);

    const db = await orbit.open(id);
    setDB(db);

    return new Promise((resolve, reject) => {
      db.events.on("write", (address, entry, heads) => {
        setLog(log => [...log, entry.payload.value]);
      });

      db.events.on("replicated", () => {
        const result = db
          .iterator({ limit: -1 })
          .collect()
          .map(e => e.payload.value);
        setLog(result);
      });
    });
  };

  return [db, log, create, join];
}
