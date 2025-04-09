// Simple password for admin access
const adminPassword = '12345';  // Replace with your desired password

// Function to check the password
function checkPassword() {
  const enteredPassword = prompt('Please enter the admin password:');
  
  if (enteredPassword === adminPassword) {
    // If password is correct, proceed to show the admin interface
    document.getElementById('adminPage').style.display = 'block'; // Show admin page
    document.getElementById('passwordPrompt').style.display = 'none'; // Hide password prompt
    fetchPlaylists();  // Fetch playlists (if needed)
  } else {
    // If password is incorrect, alert the user
    alert('Incorrect password!');
    // Optionally, you can keep asking until the correct password is entered
  }
}

// Run checkPassword when the page loads
window.onload = function () {
  checkPassword();
};

// Your existing fetchPlaylists, renderForm, and other functions can remain here

// Example of displaying content after password is entered
function fetchPlaylists() {
  const token = localStorage.getItem('github_access_token');
  if (!token) {
    console.error('No access token found!');
    return;
  }

  const apiUrl = `https://api.github.com/repos/wpddputziger/hfc-kiosk/contents/playlists.json`;

  const getRes = await fetch(apiUrl, {
    headers: { 'Authorization': `Bearer ${token}`, Accept: 'application/vnd.github+json' }
  });
  const data = await getRes.json();
  if (getRes.status !== 200) {
    console.error('Error fetching playlists:', data);
    alert('Error fetching playlists: ' + data.message);
    return;
  }

  playlists = await data;
  renderForm();
}

// Render playlists in the admin interface
function renderForm() {
  const container = document.getElementById('playlistContainer');
  container.innerHTML = '';
  playlists.forEach((pl, index) => {
    const div = document.createElement('div');
    div.className = 'playlist-entry';
    div.innerHTML = `
      <label>Title</label>
      <input type="text" name="title" maxlength="50" value="${pl.title}" onchange="updateField(${index}, 'title', this.value)">
      <label>Playlist ID</label>
      <input type="text" value="${pl.id}" onchange="updateField(${index}, 'id', this.value)">
      <div class="controls">
        <label><input type="checkbox" name="default" ${pl.default ? 'checked' : ''} onchange="setDefault(${index}, this.checked)"> Default</label>
        <label><input type="checkbox" ${pl.visible !== false ? 'checked' : ''} onchange="updateField(${index}, 'visible', this.checked)"> Visible</label>
        <button class="delete-btn" onclick="deleteEntry(${index})">Delete</button>
      </div>`;
    container.appendChild(div);
  });
}

// Other functions remain the same
