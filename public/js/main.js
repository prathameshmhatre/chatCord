const chartFrm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
// Get usernanme and room from URL
const urlParams = new URLSearchParams(location.search);
const username = urlParams.get("username");
const room = urlParams.get("room");

const socket = io();
socket.emit("joinRoom", { username, room });

//get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Output the message to the dome
socket.on("message", (message) => {
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chartFrm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get message from the txt
  const msg = e.target.elements.msg.value;

  // Emit chat message to server
  socket.emit("chatMessage", msg);

  // Clear the chat
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// oputput the message to the room
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

// Add room name to dom
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to the dom
function outputUsers(users) {
  userList.innerHTML = `
    ${users.map((user) => `<li>${user.username}</li>`).join("")}
  `;
}
