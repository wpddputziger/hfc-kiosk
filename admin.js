// Function to check the password
function checkPassword() {
  const enteredPassword = document.getElementById('passwordInput').value.trim(); // Trim any spaces
  const adminPassword = 'bravobravo';  // Replace with the correct password

  console.log('Entered Password:', enteredPassword); // Debugging the entered password
  console.log('Stored Password:', adminPassword);    // Debugging the stored password

  if (enteredPassword === adminPassword) {
    console.log('Password match successful!'); // Success log
    // Show the admin page and hide the password prompt
    document.getElementById('adminPage').style.display = 'block';
    document.getElementById('passwordPrompt').style.display = 'none';

    // Optionally, fetch playlists or initialize other admin features
    fetchPlaylists();
  } else {
    console.error('Incorrect password entered.'); // Error log for incorrect password
    alert('Incorrect password!');
  }
}

// Allow user to hit "Enter" key to submit password
document.getElementById('passwordInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    console.log('Enter key pressed!'); // Debugging Enter key press
    checkPassword();  // Trigger password check on Enter key press
  }
});

// Ensure the script is loading
console.log('admin.js script loaded successfully.');

// Sample fetch function for testing purposes
async function fetchPlaylists() {
  const token = localStorage.getItem('github_access_token');
  if (!token) {
    console.error('No access token found in localStorage!'); // Verbose error log for token
    return;
  }

  console.log('Fetching playlists with token:', token); // Verbose log for token usage
  const apiUrl = `https://api.github.com/repos/wpddputziger/hfc-kiosk/contents/playlists.json`;

  try {
    const getRes = await fetch(apiUrl, {
      headers: { 'Authorization': `Bearer ${token}`, Accept: 'application/vnd.github+json' }
    });
    const data = await getRes.json();
    if (getRes.status !== 200) {
      console.error('Error fetching playlists:', data);
      alert('Error fetching playlists: ' + data.message);
      return;
    }

    console.log('Fetched playlists successfully:', data);
    playlists = data;
    renderForm();
  } catch (err) {
    console.error('Error in fetch operation:', err);
  }
}

// Sample function to render playlists (just a placeholder for testing)
function renderForm() {
  console.log('Rendering form...');
  // Placeholder for actual rendering logic
}

// Sample log function to ensure the script executes up to this point
console.log('admin.js loaded and initialized.');
