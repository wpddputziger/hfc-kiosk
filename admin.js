// Function to check the password
function checkPassword() {
  const enteredPassword = document.getElementById('passwordInput').value.trim();
  const adminPassword = '12345';  // Replace with correct password

  if (enteredPassword === adminPassword) {
    // Set login status in localStorage
    localStorage.setItem('isLoggedIn', 'true');
    // Redirect to admin console page after setting the login flag
    window.location.href = 'admin-console.html';
  } else {
    alert('Incorrect password!');
  }
}

// Protect the admin page (admin-console.html) by checking if the user is logged in
if (window.location.pathname === '/admin-console.html') {
  if (!localStorage.getItem('isLoggedIn')) {
    // If not logged in, redirect to login page
    window.location.href = 'admin-login.html';
  }
}

// Function to handle logout
function logout() {
  localStorage.removeItem('isLoggedIn');  // Clear login status
  window.location.href = 'admin-login.html';  // Redirect to login page
}

// Example function to add a playlist entry (for testing)
function addEntry() {
  console.log('Adding new playlist...');
  // Logic for adding a new playlist goes here
}

// Example function to commit data to GitHub (for testing)
function commitToGitHub() {
  console.log('Saving to GitHub...');
  // GitHub commit logic goes here
}

// Example function to download JSON (for testing)
function downloadJSON() {
  console.log('Downloading JSON...');
  // Logic to download playlists goes here
}
