document.addEventListener('DOMContentLoaded', function () {
  // OAuth2 GitHub details (replace with your actual values)
  const clientId = 'Ov23liJNJhwGOI4gLxrC';  // Replace with your GitHub OAuth Client ID
  const redirectUri = 'https://wpddputziger.github.io/hfc-kiosk/admin.html';  // Replace with your redirect URI

  let playlists = [];

  // Redirect user to GitHub OAuth login page
  function redirectToGitHubOAuth() {
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo`;
    window.location.href = authUrl;  // Redirect to GitHub OAuth page
  }

  // Exchange the authorization code for the access token
  async function exchangeCodeForToken(code) {
    const response = await fetch('/exchange_code_for_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();
    const accessToken = data.access_token;  // Store this token securely
    localStorage.setItem('github_access_token', accessToken);  // Store the token in localStorage

    fetchPlaylists();  // After obtaining the token, fetch playlists
  }

  // Check if GitHub redirected with the authorization code
  if (window.location.search.includes('code=')) {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    exchangeCodeForToken(code);  // Exchange the code for a token
  }

  // Fetch playlists from GitHub
  async function fetchPlaylists() {
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

  // Render playlist form on the page
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

  // Update playlist field
  function updateField(index, field, value) {
    playlists[index][field] = value;
  }

  // Set default playlist
  function setDefault(index, isDefault) {
    if (isDefault) {
      playlists.forEach((p, i) => p.default = (i === index));
      renderForm();
    }
  }

  // Add new playlist
  function addEntry() {
    if (playlists.length >= 12) return alert('Maximum of 12 playlists allowed.');
    const url = prompt('Enter YouTube Playlist URL:');
    const match = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
    if (!match) return alert('Invalid playlist URL.');
    const playlistId = match[1];
    fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=YOUR_YOUTUBE_API_KEY`)
      .then(res => res.json())
      .then(data => {
        if (!data.items || !data.items.length) return alert('Playlist not found or not public.');
        const title = data.items[0].snippet.title;
        playlists.push({ title, id: playlistId, default: false, visible: true });
        renderForm();
      });
  }

  // Delete playlist entry
  function deleteEntry(index) {
    if (confirm('Delete this playlist?')) {
      playlists.splice(index, 1);
      renderForm();
    }
  }

  // Download JSON of playlists
  function downloadJSON() {
    const blob = new Blob([JSON.stringify(playlists, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'playlists.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  // Commit the changes to GitHub
  async function commitToGitHub() {
    const token = localStorage.getItem('github_access_token');
    if (!token) {
      alert('You need to log in with GitHub first!');
      return;
    }

    const apiUrl = `https://api.github.com/repos/wpddputziger/hfc-kiosk/contents/playlists.json`;
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(playlists, null, 2))));

    const getRes = await fetch(apiUrl, {
      headers: { 'Authorization': `Bearer ${token}`, Accept: 'application/vnd.github+json' }
    });

    const data = await getRes.json();
    const sha = data.sha;  // Get the sha for the existing file

    const commitRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Update playlists.json from admin panel',
        content: content,
        sha: sha
      })
    });

    const commitData = await commitRes.json();
    if (commitRes.ok) {
      alert('Successfully committed to GitHub!');
    } else {
      alert('Failed to commit changes: ' + commitData.message);
    }
  }

  // Event listener for GitHub login button
  document.getElementById('githubLoginBtn').addEventListener('click', redirectToGitHubOAuth);

  // Fetch playlists when the page loads
  fetchPlaylists();
});
