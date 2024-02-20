document.getElementById('question').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default action to avoid form submission or any other unwanted behavior
      askQuestion(); // Call the askQuestion function
  }
});

async function askQuestion() {
  const questionInput = document.getElementById('question');
  const responsesDiv = document.getElementById('responses');
  const question = questionInput.value;
  const you = document.createElement('div');
  you.classList.add('message', 'user'); // This div will be our flex container for the user message
  you.textContent = question; // Set text content directly for simplicity
  responsesDiv.appendChild(you);
  
  questionInput.value = ''; // Clear input field

  // Show typing indicator
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'typing-indicator';
  typingIndicator.innerHTML = `<div class="dot"></div><div class="dot"></div><div class="dot"></div>`;
  responsesDiv.appendChild(typingIndicator);
  scrollToBottom();

  try {
    const response = await fetch('http://193.196.53.153:3000/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    responsesDiv.removeChild(typingIndicator); // Remove typing indicator
    const answerDiv = document.createElement('div');
    answerDiv.innerHTML = `<div class="message bot">${data.answer}</div>`;
    responsesDiv.appendChild(answerDiv);
    scrollToBottom();
  } catch (error) {
    console.error('Error:', error);
    responsesDiv.removeChild(typingIndicator); // Ensure removal even on error
  }
}

// Helper function to scroll to the bottom of the chat area
function scrollToBottom() {
const responsesDiv = document.getElementById('responses');
responsesDiv.scrollTop = responsesDiv.scrollHeight;
}
