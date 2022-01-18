class Peer {
    constructor() {
        this.Ipfs = require('ipfs');
        this.OrbitDB = require('orbit-db');
    }

    async create() {
        this.node = await this.Ipfs.create({
            // preload: { enabled: false },
            relay: { enabled: true, hop: { enabled: false, active: false } },
            repo: './ipfs',
            EXPERIMENTAL: { ipnsPubsub: true },
            config: {
                Addresses: {
                    "Swarm": [
                        "/ip4/0.0.0.0/udp/4001/quic",
                        "/ip6/::/udp/4001/quic",
                        "/ip4/0.0.0.0/tcp/4002",
                        "/ip6/::/tcp/4002",
                        "/ip4/0.0.0.0/tcp/4003/ws",
                        "/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star"
                    ],
                }
            }
        });
        // console.log(this.node.ipns.options.relay);
        // this.node.bootstrap.reset();
        await this._init();
    }

    async _init() {
        const peerInfo = await this.node.id();
        // console.log(peerInfo);
        this.orbitdb = await this.OrbitDB.createInstance(this.node);
        this.defaultOptions = {
            accessController: {
                write: [this.orbitdb.identity.id]
            }
        };

        const docStoreOptions = {
            ...this.defaultOptions,
            indexBy: 'hash'
        }

        this.pieces = await this.orbitdb.docstore('pieces', docStoreOptions);
        await this.pieces.load();

        //* Database for Users
        this.user = await this.orbitdb.kvstore('user', this.defaultOptions);
        // this.user.events.on('load', (dbname) => console.log('Loaded: ', dbname))
        await this.user.load();
        await this.loadFixtureData({
            profile: null,
            // username: Math.floor(Math.random() * 1000000),
            pieces: this.pieces.id,
            nodeId: peerInfo.id
        });

        //* Database for Messages
        this.chats = await this.orbitdb.docstore('chats', docStoreOptions);
        await this.chats.load();

        await this.deleteChatByHash("Cloud");
        await this.addNewChat("Cloud");

        //* Event on Peer Connection
        this.node.libp2p.connectionManager.on('peer:connect', this.handlePeerConnected.bind(this));
        //* Peer to peer communication via IPFS pubsub
        await this.node.pubsub.subscribe(peerInfo.id, this.handleMessageReceived.bind(this));

        this.user.events.on('write', this.handleWriteEventUserDB.bind(this));

        this.user.events.on("replicated", () => {
            console.log(`Replication event fired`);
        });

        this.user.events.on("peer", (peer) => {
            console.log(`Peer Connection Event on user DB -> fired: \n${peer}`);
        });

        if (this.onready) await this.onready();
    }

    async getSwarms() {
        const multiAddrs = await this.node.swarm.localAddrs();
        return multiAddrs;
    }

    async getBootstrap() {
        const result = await this.node.bootstrap.list();
        return result.Peers;
    }

    async getTopics() {
        const topics = await this.node.pubsub.ls();
        return topics;
    }

    async addBootstrap(multiAddr) {
        await this.node.bootstrap.add(multiAddr);
    }

    async subscribeTopic(topic, handler) {
        await this.node.pubsub.subscribe(topic, handler.bind(this));
    }

    //* Peer Related Methods
    async getIpfsPeers() {
        const peers = await this.node.swarm.peers();
        return peers;
    }

    // /ip4/192.168.56.1/tcp/4002/p2p/12D3KooWKL6pQkPMGqxLjS24dVDP2ZgcTkPJ1Cw3fp9DwK73SLrD
    //* /ip4/147.75.100.9/tcp/4001/p2p/ => worked
    async connectToPeer(multiaddr) { //, protocol = '/ip4/127.0.0.1/tcp/4002/p2p/') {
        try {
            await this.node.swarm.connect(multiaddr);
        } catch (e) {
            throw (e);
        }
    }

    handlePeerConnected(ipfsPeer) {
        const ipfsId = ipfsPeer.remotePeer._idB58String;
        // console.log(ipfsPeer)
        if (this.onpeerconnect) this.onpeerconnect(ipfsId);
    }

    handleMessageReceived(msg) {
        if (this.onmessage) this.onmessage(msg);
    }

    //TODO: Dont forget to encrypt message first
    async sendMessage(topic, message) {
        try {
            // const msgString = JSON.stringify(message);
            // const messageBuffer = Buffer.from(msgString);
            await this.node.pubsub.publish(topic, new TextEncoder().encode(message));
        } catch (e) {
            throw (e)
        }
    }

    //* User DB Related Methods

    handleWriteEventUserDB(address, entry, heads) {
        console.log("Write OP: ");
        console.log("Address: ", address);
        console.log("Entry: ", entry);
        console.log("Heads: ", heads);

        // this.OrbitDB.parseAddress(address)
    }

    async loadFixtureData(fixtureData) {
        const fixtureKeys = Object.keys(fixtureData);
        for (let i in fixtureKeys) {
            let key = fixtureKeys[i];
            if (!this.user.get(key))
                await this.user.set(key, fixtureData[key])
        }
    }

    async updateProfileField(key, value) {
        const cid = await this.user.set(key, value);
        return cid;
    }


    async updateProfileFields(newData) {
        console.log(newData);
        for (const [key, value] of Object.entries(newData)) {
            await this.user.set(key, value);
        }
    }

    async deleteProfileField(key) {
        const cid = await this.user.del(key);
        return cid;
    }

    getAllProfileFields() {
        return this.user.all;
    }

    getProfileField(key) {
        return this.user.get(key);
    }

    //* Chats DB Related Methods

    async addNewChat(hash) {
        const existingChat = this.getChatByHash(hash);
        if (existingChat) return;

        const cid = await this.chats.put({ hash, messages: [] });
        return cid;
    }

    async updateChatByHash(hash, message) {
        const chat = await this.getChatByHash(hash);
        let messagesArr = Array.from(chat.messages);
        messagesArr.push(message);
        chat.messages = messagesArr;

        console.log(message);
        console.log(messagesArr);
        console.log(chat);
        const cid = await this.chats.put(chat);
        return cid;
    }

    async deleteChatByHash(hash) {
        const cid = await this.chats.del(hash);
        return cid;
    }

    getAllChats() {
        const chats = this.chats.get('');
        return chats;
    }

    getChatByHash(hash) {
        const singleChat = this.chats.get(hash)[0];
        return singleChat;
    }


    //* Piece DB Related Methods
    async addNewPiece(hash, instrument = 'Piano') {
        const existingPiece = this.getPieceByHash(hash);
        if (existingPiece) {
            return await this.updatePieceByHash(hash, instrument);
        }

        const dbName = 'counter.' + hash.substr(20, 20);
        console.log("dbName: ", dbName);
        const counter = await this.orbitdb.counter(dbName, this.defaultOptions);

        const cid = await this.pieces.put({ hash, instrument, counter: counter.id });
        return cid;
    }

    async updatePieceByHash(hash, instrument = 'Piano') {
        const piece = await this.getPieceByHash(hash);
        piece.instrument = instrument;
        const cid = await this.pieces.put(piece);
        return cid;
    }

    async deletePieceByHash(hash) {
        const cid = await this.pieces.del(hash);
        return cid;
    }

    getAllPieces() {
        const pieces = this.pieces.get('');
        return pieces;
    }

    getPieceByHash(hash) {
        const singlePiece = this.pieces.get(hash)[0];
        return singlePiece;
    }

    getPieceByInstrument(instrument) {
        return this.pieces.query(piece => piece.instrument === instrument);
    }

    //* Counter DB Related Methods
    async getPracticeCount(piece) {
        const counter = await this.orbitdb.counter(piece.counter);
        await counter.load();
        return counter.value;
    }

    async incrementPracticeCounter(piece) {
        const counter = await this.orbitdb.counter(piece.counter);
        await counter.load();
        const cid = await counter.inc()
        return cid;
    }
}

module.exports = exports = new Peer();