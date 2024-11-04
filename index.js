// const socket = io(`https://cli-backend-deploy.onrender.com`);
const socket = io(
  "https://cli-chat-backend.whitetree-ac90122e.australiaeast.azurecontainerapps.io"
);
// const socket = io("http://localhost:3000");
let userId;
let roomId = "master";

const selfConnectedAudio = new Audio("./public/assets/audio/selfConnected.mp3");
const messageAudio = new Audio("./public/assets/audio/message.mp3");
const userConnectedAudio = new Audio("./public/assets/audio/UserConnected.mp3");
const userDisconnectedAudio = new Audio(
  "./public/assets/audio/userDisconnect.mp3"
);

const playMessage = () => {
  messageAudio.currentTime = 0;
  messageAudio.play();
};

const playSelfConnected = () => {
  selfConnectedAudio.currentTime = 0;
  selfConnectedAudio.play();
};
const playUserConnected = () => {
  userConnectedAudio.currentTime = 0;
  userConnectedAudio.play();
};
const playUserDisconnected = () => {
  userDisconnectedAudio.currentTime = 0;
  userDisconnectedAudio.play();
};

const bottomBarUserName = document.getElementById("bottomBarUserName");
const bottomBarRoomId = document.getElementById("bottomBarRoomId");
// create connection
if (localStorage.getItem("userName")) {
  socket.emit("createConnection", localStorage.getItem("userName"));
} else {
  socket.emit("createConnection", null);
}

const messageContainer = document.getElementById("messageContainer");

const refreshDetails = () => {
  bottomBarUserName.innerHTML = userId;
  bottomBarRoomId.innerHTML = roomId;
};

socket.on("connectionSuccess", (userName) => {
  // selfConnectedAudio.play();
  animationContainer.classList.add("hidden");
  loading = false;
  userId = userName;
  document.getElementById("userNameDisplay").innerHTML = `${userName}`;
  const newLi = document.createElement("li");
  newLi.innerHTML = `You are connected as <span class="text-lime-500">${userName} </span> <br> You are connected to room: <span class="text-purple-500">${roomId}</span> <br> <span class="text-yellow-400">/help</span> for help`;
  newLi.style.fontWeight = "bold";
  document.getElementById("messageContainer").append(newLi);
  messageContainer.scrollTop = messageContainer.scrollHeight;
  refreshDetails();
});

const addChatItem = (userName, message) => {
  const newLi = document.createElement("li");
  newLi.innerHTML = `<span class="bg-blue-500 pl-2 pr-5 pt-1 pb-1  rounded-e-full font-bold mr-2" id="userIdDisplay">${userName}</span>${message}`;
  newLi.style.fontWeight = "bold";
  newLi.style.marginBottom = "5px";
  if (userName == userId) {
    newLi.firstChild.classList.replace("bg-blue-500", "bg-green-500");
  } else {
    playMessage();
  }

  messageContainer.append(newLi);
  messageContainer.scrollTop = messageContainer.scrollHeight;
};
// get messages
socket.on("message", ({ userName, message }) => {
  addChatItem(userName, message);
});

// user connected alert
socket.on("connected", (userName) => {
  playUserConnected();
  const newLi = document.createElement("li");
  newLi.innerHTML = `<span class="text-lime-400"> ${userName} </span> connected`;
  newLi.style.fontWeight = "bold";
  messageContainer.append(newLi);
  messageContainer.scrollTop = messageContainer.scrollHeight;
});

// on disconnect
socket.on("disconnected", (userName) => {
  playUserDisconnected();
  const newLi = document.createElement("li");
  newLi.innerHTML = `${userName} disconnected`;
  newLi.classList.add("text-red-500");
  newLi.style.fontWeight = "bold";
  messageContainer.append(newLi);
  messageContainer.scrollTop = messageContainer.scrollHeight;
});

// on rename
socket.on("rename", ({ oldUsername, userName }) => {
  const newLi = document.createElement("li");
  newLi.innerHTML = `<span class="text-red-400"> ${oldUsername} </span> changed their username to <span class="text-lime-400">${userName}</span> `;
  newLi.style.fontWeight = "bold";
  messageContainer.append(newLi);
  messageContainer.scrollTop = messageContainer.scrollHeight;
  inputBox.value = "";
});

// on self rename

socket.on("renamed", ({ oldUsername, userName }) => {
  const newLi = document.createElement("li");
  newLi.innerHTML = `You changed you username to <span class="text-lime-400">${userName}</span> `;
  newLi.style.fontWeight = "bold";
  messageContainer.append(newLi);
  messageContainer.scrollTop = messageContainer.scrollHeight;
  inputBox.value = "";
  localStorage.setItem("userName", userName);
  document.getElementById("userNameDisplay").innerHTML = userName;
  userId = userName;
  refreshDetails();
});

// room created
socket.on("roomCreated", (roomId) => {
  const newLi = document.createElement("li");
  newLi.innerHTML = `You created a room: <span class="text-purple-400"> ${roomId} </span>`;
  messageContainer.append(newLi);
  messageContainer.scrollTop = messageContainer.scrollHeight;
});

// room joined
socket.on("roomJoined", (room) => {
  const newLi = document.createElement("li");
  newLi.innerHTML = `You joined a room: <span class="text-purple-400"> ${room} </span>`;
  messageContainer.append(newLi);
  roomId = room;
  refreshDetails();
  messageContainer.scrollTop = messageContainer.scrollHeight;
});

// left custom room

socket.on("leftCustomRoom", (user) => {
  const newLi = document.createElement("li");
  newLi.innerHTML = `<span class="text-yellow-400">${user}</span> left the room`;
  newLi.classList.add("text-red-500");
  messageContainer.append(newLi);
  playUserDisconnected();
});

// someone joined the room
socket.on("join", (userName) => {
  const newLi = document.createElement("li");
  newLi.innerHTML = `<span class="text-lime-400">${userName} </span> joined the room `;
  messageContainer.append(newLi);
  playUserConnected();
  messageContainer.scrollTop = messageContainer.scrollHeight;
});

// input always in focus
const inputBox = document.getElementById("inputBox");
document.body.addEventListener("click", () => {
  inputBox.focus();
});

document.body.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const inputBox = document.getElementById("inputBox");

    if (!inputBox.value) return;

    storeHistory(inputBox.value);
    // rename
    if (inputBox.value.startsWith("/rename")) {
      const userName = inputBox.value.slice("/rename ".length).slice(0, 20);
      return socket.emit("rename", userName);
    } else if (inputBox.value.startsWith("/createroom")) {
      socket.emit("createRoom", roomId);
      return (inputBox.value = "");
    } else if (inputBox.value.startsWith("/join")) {
      const room = inputBox.value.slice("/joinroom ".length);
      socket.emit("joinRoom", roomId, room);
      return (inputBox.value = "");
    } else if (inputBox.value == "/help") {
      return displayHelp();
    } else {
      sendMessage(inputBox.value);
      // clear input
      messageContainer.scrollTop = messageContainer.scrollHeight;
      return (inputBox.value = "");
    }
  }
});

const sendMessage = (message) => {
  socket.emit("message", message);
};

// watch for keywords to change color

setInterval(() => {
  const inputBox = document.getElementById("inputBox");
  inputBox.value.startsWith("/")
    ? (inputBox.style.color = "yellow")
    : (inputBox.style.color = "white");
}, 200);

const displayHelp = () => {
  const newLi = document.createElement("li");
  newLi.innerHTML = `
	-------------------------------------------------------------- <br>
	<span class="text-yellow-400">/rename </span> new_username --> change your username <br>
	<span class="text-yellow-400">/createroom </span> --> create a room <br>
	<span class="text-yellow-400">/joinroom </span>room_id --> join a room <br>  
	-------------------------------------------------------------- <br>
	`;
  newLi.classList.add("font-semibold");
  messageContainer.append(newLi);
  return (inputBox.value = "");
};
