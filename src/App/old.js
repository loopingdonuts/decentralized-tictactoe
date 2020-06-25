const initIPFSInstance = async () => {
  return await IPFS.create({ repo: "./tic-tac-toe-looping-donuts" });
};

initIPFSInstance().then(async (ipfs) => {
  const orbitdb = await OrbitDB.createInstance(ipfs);

  // Create / Open a database
  const db = await orbitdb.create("user.posts", "eventlog", {
    accessController: {
      write: [
        // Give access to ourselves
        orbitdb.identity.id,
        // Give access to the second peer
        "042c07044e7ea51a489c02854db5e09f0191690dc59db0afd95328c9db614a2976e088cab7c86d7e48183191258fc59dc699653508ce25bf0369d67f33d5d77839",
      ],
    },
    overwrite: true,
    replicate: false,
    meta: { hello: "meta hello" },
  });

  db.accessController.add();

  await db.load();

  // Add an entry
  const hash = await db.add("world");
  //console.log(hash);

  // Listen for updates from peers
  db.events.on("replicated", (address) => {
    console.log(db.iterator({ limit: -1 }).collect());
  });

  // Query
  const result = db.iterator({ limit: -1 }).collect();
  //console.log(JSON.stringify(result, null, 2));
});
