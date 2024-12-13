const form = document.getElementById('endorsement-form');
const input = document.getElementById('endorsement-input');
const endorsementList = document.getElementById('endorsement-list');

// Handle form submission
form.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent page reload
  
  const endorsement = input.value.trim();
  
  if (endorsement) {
    // Add endorsement to the list
    const endorsementItem = document.createElement('div');
    endorsementItem.textContent = endorsement;
    endorsementItem.classList.add('endorsement-item');
    endorsementList.appendChild(endorsementItem);
    
    // Clear the textarea
    input.value = '';
  }
});


const apiBaseUrl = 'https://.*****execute-api.us-east-1.amazonaws.com'; // Replace with your API's base URL

  // Fetch endorsements on page load
  async function fetchEndorsements() {
    const response = await fetch(`${apiBaseUrl}/endorsements`);
    const endorsements = await response.json();
    const endorsementList = document.getElementById('endorsement-list');
    endorsementList.innerHTML = '';
    endorsements.forEach((endorsement) => {
      const item = document.createElement('div');
      item.textContent = endorsement.text;
      endorsementList.appendChild(item);
    });
  }

  // Handle endorsement form submission
  document.getElementById('endorsement-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('endorsement-input');
    const endorsement = input.value.trim();
    if (endorsement) {
      await fetch(`${apiBaseUrl}/endorsements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endorsement }),
      });
      input.value = '';
      fetchEndorsements();
    }
  });

  // Load endorsements on page load
  fetchEndorsements();

  function toggleDetails(element) {
    const details = element.nextElementSibling;
  
    if (details) {
      const icon = element.querySelector(".icon");
      if (details.classList.contains("show")) {
        details.classList.remove("show");
        details.style.display = "none";
        if (icon) icon.textContent = "▼";
      } else {
        details.classList.add("show");
        details.style.display = "block";
        if (icon) icon.textContent = "▲";
      }
    }
  }
