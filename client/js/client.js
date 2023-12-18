const socket = io("http://localhost:8000");
const messageInput = document.getElementById('msg-input');
const messageContainer = document.querySelector(".container");
const form = document.getElementById('send-container');
var audio = new Audio("client/sound/ping.mp3");

// Function to prompt for the user's name until a valid name is provided
function getUsername() {
    let username;
    do {
        username = prompt("Enter Your name to join");
    } while (!username);
    return username;
}

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position == 'left') {
        audio.play();
    }
}

const showNotification = (message) => {
    alert(message);
}

const sendMessage = () => {
    const message = messageInput.value.trim(); // Trim to remove leading and trailing whitespaces
    if (message !== '') {
        append(`You: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = '';
    } else {
        showNotification('Please write something before sending.');
    }
};

const username = getUsername(); // Use the function to get a valid username

socket.emit('new-user-joined', username);

form.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
});

socket.on('user-joined', name => {
    append(`${name} joined the Chat`, 'right');
});

socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

socket.on('left', name => {
    append(`${name}: left the chat`, 'right');
});
