async function sendMessage() {
    const inputField = document.getElementById('chat-input');
    const message = inputField.value;
    inputField.value = ''; // Clear the input field
  
    displayMessage(message, 'user');
  
    const response = await fetch('/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
  
    if (response.ok) {
      const data = await response.json();
      displayMessage(data.message, 'bot');
    } else {
      console.error('Error sending message');
    }
  }
  
  function displayMessage(message, sender) {
    const messagesContainer = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = `${sender}: ${message}`;
    messagesContainer.appendChild(messageElement);
  }
  