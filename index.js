// import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";
const socket = io("http://localhost:3000");
// socket.emit('message','hello from the other side');

// create connection
if(localStorage.getItem('userName')){
    socket.emit('createConnection',localStorage.getItem('userName'));
}
else{
    socket.emit('createConnection',null);
}


const messageContainer = document.getElementById("messageContainer");

socket.on('connectionSuccess',(userName)=>{
	document.getElementById("userNameDisplay").innerHTML = `${userName}`;
    const newLi=document.createElement('li');
    newLi.innerHTML=`You are connected as <span class="text-lime-500">${userName} </span>`;
	newLi.style.fontWeight = "bold";
    document.getElementById("messageContainer").append(newLi);
	messageContainer.scrollTop = messageContainer.scrollHeight;
})

const addChatItem = (userName, message, textColor) => {
	const newLi = document.createElement("li");
	newLi.innerHTML = `<span class="bg-blue-500 pl-2 pr-5 pt-1 pb-1  rounded-e-full font-bold mr-2" id="userIdDisplay">${userName}</span>${message}`;
	newLi.style.fontWeight = "bold";
    newLi.style.marginBottom='5px';
    if(userName==(document.getElementById('userNameDisplay').innerHTML)){
        (newLi.firstChild).classList.replace('bg-blue-500','bg-green-500')
    }
	document.getElementById("messageContainer").append(newLi);
	messageContainer.scrollTop = messageContainer.scrollHeight;
};
// get messages
socket.on("message", ({ userName, message }) => {
	addChatItem(userName, message, "red");
});

// user connected alert
socket.on("connected", (userName) => {
	const newLi = document.createElement("li");
	newLi.innerHTML = `<span class="text-yellow-400"> ${userName} </span> joined the room`;
	newLi.style.fontWeight = "bold";
	document.getElementById("messageContainer").append(newLi);
	messageContainer.scrollTop = messageContainer.scrollHeight;
});

// on disconnect
socket.on('disconnected',(userName)=>{
    const newLi=document.createElement('li');
    newLi.innerHTML=`${userName} left the room`;
    newLi.classList.add('text-red-500');
    newLi.style.fontWeight = "bold";
	document.getElementById("messageContainer").append(newLi);
	messageContainer.scrollTop = messageContainer.scrollHeight;

})


// on rename
socket.on("rename", ({ oldUsername, userName }) => {
	const newLi = document.createElement("li");
	newLi.innerHTML = `<span class="text-red-400"> ${oldUsername} </span> changed their username to <span class="text-lime-400">${userName}</span> `;
	newLi.style.fontWeight = "bold";
	document.getElementById("messageContainer").append(newLi);
	messageContainer.scrollTop = messageContainer.scrollHeight;
	inputBox.value = "";
    localStorage.setItem('userName',userName);
});

// input always in focuss
const inputBox = document.getElementById("inputBox");
document.body.addEventListener("click", () => {
	inputBox.focus();
});

document.body.addEventListener("keydown", (e) => {
	if (e.key === "Enter") {
		const message = document.getElementById("inputBox").value;

		// rename
		if (message.startsWith("/rename")) {
			const userName = message.slice("/rename ".length);
			socket.emit("rename", userName);
			document.getElementById("userNameDisplay").innerHTML = userName;
		} else {
			sendMessage(message);
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
    inputBox.value.startsWith('/')?inputBox.style.color='yellow':inputBox.style.color='white';
}, 200);
