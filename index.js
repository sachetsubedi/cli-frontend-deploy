const socket = io("https://chat-cli-1587.onrender.com");
// const socket = io("http://localhost:3000");
let userId;
let roomId='master';
// create connection
if (localStorage.getItem("userName")) {
	socket.emit("createConnection", localStorage.getItem("userName"));
} else {
	socket.emit("createConnection", null);
}

const messageContainer = document.getElementById("messageContainer");

socket.on("connectionSuccess", (userName) => {
	userId=userName;
	document.getElementById("userNameDisplay").innerHTML = `${userName}`;
	document.getElementById("bottomBarUserName").innerHTML = userName;
	const newLi = document.createElement("li");
	newLi.innerHTML = `You are connected as <span class="text-lime-500">${userName} </span>`;
	newLi.style.fontWeight = "bold";
	document.getElementById("messageContainer").append(newLi);
	messageContainer.scrollTop = messageContainer.scrollHeight;
});

const addChatItem = (userName, message) => {
	const newLi = document.createElement("li");
	newLi.innerHTML = `<span class="bg-blue-500 pl-2 pr-5 pt-1 pb-1  rounded-e-full font-bold mr-2" id="userIdDisplay">${userName}</span>${message}`;
	newLi.style.fontWeight = "bold";
	newLi.style.marginBottom = "5px";
	if (userName == userId) {
		newLi.firstChild.classList.replace("bg-blue-500", "bg-green-500");
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
	const newLi = document.createElement("li");
	newLi.innerHTML = `<span class="text-yellow-400"> ${userName} </span> joined the room`;
	newLi.style.fontWeight = "bold";
	messageContainer.append(newLi);
	messageContainer.scrollTop = messageContainer.scrollHeight;
});

// on disconnect
socket.on("disconnected", (userName) => {
	const newLi = document.createElement("li");
	newLi.innerHTML = `${userName} left the room`;
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
const bottomBarUserName = document.getElementById("bottomBarUserName");
const bottomBarRoomId = document.getElementById("bottomBarRoomId");

socket.on("renamed", ({ oldUsername, userName }) => {
	const newLi = document.createElement("li");
	newLi.innerHTML = `You changed you username to <span class="text-lime-400">${userName}</span> `;
	newLi.style.fontWeight = "bold";
	messageContainer.append(newLi);
	messageContainer.scrollTop = messageContainer.scrollHeight;
	inputBox.value = "";
	localStorage.setItem("userName", userName);
	document.getElementById("userNameDisplay").innerHTML = userName;
	bottomBarUserName.innerHTML = userName;
	userId=userName;
});

// room created
socket.on("roomCreated", (roomId) => {
	const newLi = document.createElement("li");
	newLi.innerHTML = `You created a room: <span class="text-lime-400"> ${roomId} </span>`;
	messageContainer.append(newLi);
});

// room joined
socket.on("roomJoined", (roomId) => {
	const newLi = document.createElement("li");
	newLi.innerHTML = `You joined a room: <span class="text-lime-400"> ${roomId} </span>`;
	messageContainer.append(newLi);
});

// someone joined the room
socket.on('join',(userName)=>{
	const newLi = document.createElement("li");
	newLi.innerHTML = `${userName} joined the room `;
	messageContainer.append(newLi);
})




// input always in focus
const inputBox = document.getElementById("inputBox");
document.body.addEventListener("click", () => {
	inputBox.focus(); 
});

document.body.addEventListener("keydown", (e) => {
	if (e.key === "Enter") {
		const inputBox = document.getElementById("inputBox");

		// rename
		if (inputBox.value.startsWith("/rename")) {
			const userName = inputBox.value.slice("/rename ".length);
			return socket.emit("rename", userName);
		}else if(inputBox.value.startsWith("/createroom")){
			socket.emit("createRoom",roomId);
			return inputBox.value='';
		}else if(inputBox.value.startsWith('/join')){
			const room=inputBox.value.slice("/joinroom ".length);
			socket.emit('joinRoom',roomId,room);
			return inputBox.value='';
		}
		 else {
			sendMessage(inputBox.value);
			// clear input
			messageContainer.scrollTop = messageContainer.scrollHeight;
			inputBox.value = "";
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
