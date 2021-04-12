class Websockets {
  users = [];
  connection(client) {
    console.log("connected");
    client.on("disconnect", () => {
      console.log("disconnected");
      // this.users = this.users.filter((user) => user.socketId !== client.id);
    });
    client.on("identity", (userId) => {
      this.users.push({
        socketId: client.id,
        userId: userId,
      });
    });
    client.on("subscribe", (room, otherUserId = "") => {
      this.subscribeOtherUser(room, otherUserId);
      client.join(room);
    });
    client.on("unsubscribe", (room) => {
      client.leave(room);
    });
    client.on("message", (message) => {
      global.io.emit("message", message);
    });
  }

  subscribeOtherUser(room, otherUserId) {
    const userSockets = this.users.filter(
      (user) => user.userId === otherUserId
    );
    userSockets.map((userInfo) => {
      const socketConn = global.io.sockets.connected(userInfo.socketId);
      if (socketConn) {
        socketConn.join(room);
      }
    });
  }
}

export default new Websockets();
