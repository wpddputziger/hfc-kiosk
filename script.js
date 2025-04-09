const ADMIN_PASSWORD = 'bravobravo';
const GITHUB_REPO = 'wpddputziger/hfc-kiosk';
const PLAYLISTS_FILE = 'playlists.json';
const GITHUB_TOKEN = ''; // Insert token here if using GitHub write access

// Helper: get current filename
function currentPage() {
  return window.location.pathname.split("/").pop();
}
