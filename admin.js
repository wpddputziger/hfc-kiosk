// Function to check the password
function checkPassword() {
  const enteredPassword = document.getElementById('passwordInput').value.trim(); // Trim extra spaces
  const adminPassword = 'yourpassword';  // Change to your desired password

  console.log('Entered Password:', enteredPassword); // Debugging the entered password
  console.log('Stored Password:', adminPassword);    // Debugging the stored password

  if (enteredPassword === adminPassword) {
    // Show the admin page and hide the password prompt
    document.getElementById('adminPage').style.display = 'block';
    document.getElementById('passwordPrompt').style.display = 'none';

    // Optionally, fetch playlists or initialize other admin features
    fetchPlaylists();
  } else {
    alert('Incorrect password!');
  }
}

// Allow user to hit "Enter" key to submit password
document.getElementById('passwordInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    checkPassword();  // Trigger password check on Enter key press
  }
});
