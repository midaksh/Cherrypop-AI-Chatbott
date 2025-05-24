function setupTextareaAutoResize() {
  const textarea = document.getElementById('prompt');
  textarea.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
  });
}

function setupDarkModeToggle() {
  const modeToggle = document.getElementById('modeToggle');
  const lightLogo = document.querySelector('.light-logo');
  const darkLogo = document.querySelector('.dark-logo');
  
  const savedMode = localStorage.getItem('darkMode');
  if (savedMode === 'enabled') {
      document.body.classList.add('dark-mode');
      modeToggle.checked = true;
      if (lightLogo) lightLogo.style.display = 'none';
      if (darkLogo) darkLogo.style.display = 'block';
  } else {
      if (lightLogo) lightLogo.style.display = 'block';
      if (darkLogo) darkLogo.style.display = 'none';
  }
  
  modeToggle.addEventListener('change', function() {
      if (this.checked) {
          document.body.classList.add('dark-mode');
          localStorage.setItem('darkMode', 'enabled');
          if (lightLogo) lightLogo.style.display = 'none';
          if (darkLogo) darkLogo.style.display = 'block';
      } else {
          document.body.classList.remove('dark-mode');
          localStorage.setItem('darkMode', null);
          if (lightLogo) lightLogo.style.display = 'block';
          if (darkLogo) darkLogo.style.display = 'none';
      }
  });
}

async function sendPrompt() {
  const prompt = document.getElementById('prompt').value;
  const responseDiv = document.getElementById('response');
  
  if (!prompt.trim()) {
      responseDiv.style.display = "none";
      return;
  }
  

  responseDiv.style.display = "block";
  responseDiv.textContent = "Thinking...";
  responseDiv.style.fontWeight = "normal"; // Reset to normal for loading state

  try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
              "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "http://localhost:5500",
              "X-Title": "ChatbotTest"
          },
          body: JSON.stringify({
              model: "mistralai/mistral-7b-instruct",
              messages: [{
                  role: "user",
                  content: prompt
              }]
          })
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "No reply received.";
      
      // Display the response with proper formatting
      responseDiv.textContent = reply;
      responseDiv.style.fontWeight = "700"; // Make text bolder
  } catch (error) {
      responseDiv.textContent = "Error: " + error.message;
  }
}


document.addEventListener('DOMContentLoaded', function() {
  setupTextareaAutoResize();
  setupDarkModeToggle();
  

  document.getElementById('response').style.display = "none";
  

  document.getElementById('prompt').addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendPrompt();
      }
  });
});
