document.addEventListener('DOMContentLoaded', function () {
  const token = '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'; // <-- Insert your GitHub token here
  const filePath = 'playlists.json';
  const repo = 'wpddputziger/hfc-kiosk';
  let playlists = [];

  async function fetchPlaylists() {
    const res = await fetch(filePath);
    playlists = await res.json();
    renderForm();
  }

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

  function updateField(index, field, value) {
    playlists[index][field] = value;
  }

  function setDefault(index, isDefault) {
    if (isDefault) {
      playlists.forEach((p, i) => p.default = (i === index));
      renderForm();
    }
  }

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

  function deleteEntry(index) {
    if (confirm('Delete this playlist?')) {
      playlists.splice(index, 1);
      renderForm();
    }
  }

  function downloadJSON() {
    const blob = new Blob([JSON.stringify(playlists, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'playlists.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function commitToGitHub() {
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;

    // Step 1: Fetch the current file details to get the sha
    console.log('Fetching file data...');
    const getRes = await fetch(apiUrl, {
      headers: { 'Authorization': `Bearer ${token}`, Accept: 'application/vnd.github+json' }
    });

    // Log the response to check for issues
    const data = await getRes.json();
    console.log('Response data from GitHub:', data);

    if (getRes.status !== 200) {
      console.error('Error fetching file data:', data);
      alert(`Error fetching file data: ${data.message}`);
      return;
    }

    const sha = data.sha;  // Get the sha for the existing file
    console.log('SHA fetched:', sha);

    // Step 2: Base64 encode the content
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(playlists, null, 2))));
    console.log('Encoded content:', content);

    // Step 3: Commit the changes
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
    console.log('Commit Response:', commitData);

    if (commitRes.ok) {
      alert('Successfully committed to GitHub!');
    } else {
      console.error('Commit Error:', commitData);
      alert(`Failed to commit changes: ${commitData.message || commitData.errors}`);
    }
  }

  fetchPlaylists();
});
