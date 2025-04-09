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

    const getRes = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' }
    });
    const data = await getRes.json();
    const sha = data.sha;

    const content = btoa(unescape(encodeURIComponent(JSON.stringify(playlists, null, 2))));

    const commitRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Update playlists.json from admin panel',
        content: content,
        sha: sha
      })
    });

    if (commitRes.ok) {
      alert('Successfully committed to GitHub!');
    } else {
      alert('Failed to commit changes. Check token and permissions.');
    }
  }

  fetchPlaylists();
});
