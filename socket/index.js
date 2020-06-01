const formatMessage = require("./utils_/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils_/users");
const botName = "ChatCord Bot";
const { SERVER_ERROR, JOINED_SUCCESS, ALREADY_JOINED, LEAVE_FAILED,LEAVE_SUCCESS } = require("./Constant");
const { newGroup, allGroups } = require("./utils/Group");
const {
  joinGroup,
  leaveGroup,
  UnJoinedGroups,
  JoinedGroups,
} = require("./utils/GroupUser");

module.exports = function (server) {
  // Add Socket to App server
  const io = require("socket.io").listen(server);
  // on connect Socket
  io.on("connection", (socket) => {
    console.log(111111111111);
    // New Group Add
    socket.on("CREATE_GROUP", async (data) => {
      const group = await newGroup(data);
      if (group.error) {
        socket.emit("CREATE_GROUP", {
          success: false,
          message: `${data.group} is already available.`,
        });
      } else {
        const member = await joinGroup(group.createdBy, group._id,'admin');
        socket.emit("CREATE_GROUP", {
          success: true,
          message: `${data.group} created successfully.`,
        });
      }
    });

    socket.on("DELETE_GROUP", async (data) => {
      const group = await newGroup(data);
      if (group.error) {
        socket.emit("DELETE_GROUP", {
          success: false,
          message: `${data.group} is already available.`,
        });
      } else {
        const member = await joinGroup(group.createdBy, group._id,'admin');
        socket.emit("DELETE_GROUP", {
          success: true,
          message: `${data.group} created successfully.`,
        });
      }
    });

    // Send all UnJoined groups List
    socket.on("UN_GROUP_LIST", async ({ uid }) => {
      try {
        const UnJoin = await UnJoinedGroups(uid);
        socket.emit("UN_GROUP_LIST", { 
          success: true, 
          data: UnJoin 
        });
      } catch (error) {
        socket.emit("UN_GROUP_LIST", {
          success: false,
          message: SERVER_ERROR,
        });
      }
    });

    // Send all Joined groups List
    socket.on("JN_GROUP_LIST", async ({ uid }) => {
      try {
        const UnJoin = await JoinedGroups(uid);
        socket.emit("JN_GROUP_LIST", { 
          success: true, 
          data: UnJoin 
        });
      } catch (error) {
        socket.emit("JN_GROUP_LIST", {
          success: false,
          message: SERVER_ERROR,
        });
      }
    });

    socket.on("JOIN_GROUP", async ({ user, group }) => {
      try {
        const member = await joinGroup(user, group);
        if (member.error) {
          socket.emit("JOIN_GROUP", {
            success: false,
            message: ALREADY_JOINED,
          });
        } else {
          socket.emit("JOIN_GROUP", {
            success: true,
            message: JOINED_SUCCESS,
          });
        }
      } catch (error) {
        socket.emit("JOIN_GROUP", {
          success: false,
          message: SERVER_ERROR,
        });
      }
    });

    socket.on("LEAVE_GROUP", async ({ user, group }) => {
      try {
        const member = await leaveGroup(user, group);
        if (member.error) {
          socket.emit("LEAVE_GROUP", {
            success: false,
            message: LEAVE_FAILED,
          });
        } else {
          socket.emit("LEAVE_GROUP", {
            success: true,
            message: LEAVE_SUCCESS,
          });
        }
      } catch (error) {
        socket.emit("LEAVE_GROUP", {
          success: false,
          message: SERVER_ERROR,
        });
      }
    });
    socket.on("joinRoom", ({ username, room }) => {
      console.log(socket.id, username, room);
      const user = userJoin(socket.id, username, room);
      console.log(socket.id, 555);
      socket.join(user.room);

      // Welcome current user
      socket.emit("message", formatMessage(botName, "Welcome to ChatCord!"));

      // Broadcast when a user connects
      socket.broadcast
        .to(user.room)
        .emit(
          "message",
          formatMessage(botName, `${user.username} has joined the chat`)
        );

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    });

    // Listen for chatMessage
    socket.on("chatMessage", (msg) => {
      const user = getCurrentUser(socket.id);

      io.to(user.room).emit("message", formatMessage(user.username, msg));
    });

    // Runs when client disconnects
    socket.on("disconnect", () => {
      const user = userLeave(socket.id);

      if (user) {
        io.to(user.room).emit(
          "message",
          formatMessage(botName, `${user.username} has left the chat`)
        );

        // Send users and room info
        io.to(user.room).emit("roomUsers", {
          room: user.room,
          users: getRoomUsers(user.room),
        });
      }
    });
  });
};
