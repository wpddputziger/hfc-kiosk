/* admin.js | v1.1.25 */

/**
 * checkPassword
 * Minimal approach: If the entered password matches the one we define here,
 * then redirect to the admin console. Otherwise, show an alert.
 */
function checkPassword() {
  const enteredPassword = document.getElementById('passwordInput')?.value.trim() || '';
  const adminPassword = '12345'; // <-- Put your real password here

  if (enteredPassword === adminPassword) {
    // Minimal approach: redirect if correct
    window.location.href = 'admin-console.html';
  } else {
    alert('Incorrect password!');
  }
}

/**
 * logout
 * In our minimal approach, we simply redirect back to the login page.
 */
function logout() {
  // Minimal approach: no session or localStorage, so just redirect.
  window.location.href = 'admin-login.html';
}

/* 
  If you want to do additional admin console functions (like 
  fetching or displaying playlists), add them here. 
  But let's keep it minimal for now.
*/
