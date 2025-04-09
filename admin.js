// Function to check the password
function checkPassword() {
  const enteredPassword = document.getElementById('passwordInput').value.trim();
  const adminPassword = '12345';  // Replace with correct password

  if (enteredPassword === adminPassword) {
    // Set login status in localStorage
    localStorage.setItem('isLoggedIn', 'true');
    // Redirect to admin console page
    window.location.href = 'admin-console.html';
  } else {
    alert('Incorrect password!');
  }
}

// Protect the admin page
if (!localStorage.getItem('isLoggedIn')) {
  window.location.href = 'admin-login.html'; // Redirect to login if not logged in
}

// Function to handle logout
function logout() {
  localStorage.removeItem('isLoggedIn');  // Clear login status
  window.location.href = 'admin-login.html';  // Redirect to login page
}

// Sample fetch function for testing purposes
async function fetchPlaylists() {
  const token = localStorage.getItem('github_access_token');
  if (!token) {
    console.error('No access token found in localStorage!');
    return;
  }

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

// Example function to add a playlist entry (for testing)
function addEntry() {
  console.log('Adding new playlist...');
  // Logic for adding a new playlist goes here
}
