// --- Playlist Buttons Scrolling ---
const playlistButtonsDiv = document.getElementById('playlistButtons');
const scrollLeftBtn = document.getElementById('scrollLeft');
const scrollRightBtn = document.getElementById('scrollRight');
function checkPlaylistScroll() {
  if (playlistButtonsDiv.scrollWidth <= playlistButtonsDiv.clientWidth) {
    scrollLeftBtn.style.display = 'none';
    scrollRightBtn.style.display = 'none';
  } else {
    scrollLeftBtn.style.display = 'block';
    scrollRightBtn.style.display = 'block';
  }
}
scrollLeftBtn.addEventListener('click', () => {
  playlistButtonsDiv.scrollBy({ left: -150, behavior: 'smooth' });
});
scrollRightBtn.addEventListener('click', () => {
  playlistButtonsDiv.scrollBy({ left: 150, behavior: 'smooth' });
});
window.addEventListener('load', checkPlaylistScroll);
window.addEventListener('resize', checkPlaylistScroll);

// --- YouTube API Setup ---
let player;
let currentPlaylistItems = [];
function onYouTubeIframeAPIReady() {
  player = new YT.Player('videoFrame', {
    height: '315',
    width: '100%',
    videoId: '',
    playerVars: { 'rel': 0, 'modestbranding': 1, 'playsinline': 0 },
    events: { 'onStateChange': onPlayerStateChange }
  });
}

function updatePlayPauseButton() {
  if (!player || typeof player.getPlayerState !== 'function') return;
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  const text = document.getElementById('playPauseText');
  const state = player.getPlayerState();
  if (state === YT.PlayerState.PLAYING) {
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
    text.innerText = 'Pause';
  } else {
    pauseIcon.style.display = 'none';
    playIcon.style.display = 'block';
    text.innerText = 'Play';
  }
}

function onPlayerStateChange(event) {
  updatePlayPauseButton();
  if (event.data === YT.PlayerState.PLAYING) {
    document.getElementById('videoPlaceholder').style.display = 'none';
  }
}

function cueVideo(videoId, thumbnail) {
  if (player && typeof player.cueVideoById === 'function') {
    player.cueVideoById(videoId);
  }
  const placeholder = document.getElementById('videoPlaceholder');
  if (placeholder) {
    placeholder.src = thumbnail;
    placeholder.style.display = 'block';
  }
  updatePlayPauseButton();
}

document.getElementById('videoPlaceholder').addEventListener('click', () => {
  if (player && typeof player.playVideo === 'function') {
    player.playVideo();
  }
  document.getElementById('videoPlaceholder').style.display = 'none';
  updatePlayPauseButton();
});

// --- Load Playlist Items ---
const playlistButtonsContainer = document.getElementById('playlistButtons');
let plButtons = [];
const playlistItemsElement = document.getElementById('playlistItems');
const loadingIndicator = document.getElementById('loadingIndicator');

function loadPlaylistItems(playlistId) {
  playlistItemsElement.innerHTML = '';
  currentPlaylistItems = [];
  loadingIndicator.style.display = 'block';
  const API_KEY = 'AIzaSyBXOnPb8MKxBE1pT6SYvdQdX_87350Nk9g';
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}`;
  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      return response.json();
    })
    .then(data => {
      loadingIndicator.style.display = 'none';
      if (data.error) {
        playlistItemsElement.innerHTML = `<li>Error ${data.error.code}: ${data.error.message}</li>`;
        return;
      }
      if (!data.items || data.items.length === 0) {
        playlistItemsElement.innerHTML = '<li>No playlist items found.</li>';
        return;
      }
      data.items.forEach((item, index) => {
        const videoId = item.snippet.resourceId.videoId;
        const title = item.snippet.title;
        const thumbnail = item.snippet.thumbnails.medium ? item.snippet.thumbnails.medium.url : item.snippet.thumbnails.default.url;
        currentPlaylistItems.push({ videoId, title, thumbnail });
        const li = document.createElement('li');
        li.classList.add('video-item');
        li.setAttribute('data-index', index);
        li.innerHTML = `<img src="${thumbnail}" alt="${title}"><span>${title}</span>`;
        li.addEventListener('click', () => {
          document.querySelectorAll('.video-item').forEach(el => el.classList.remove('active'));
          li.classList.add('active');
          cueVideo(videoId, thumbnail);
        });
        playlistItemsElement.appendChild(li);
        if (index === 0) {
          li.classList.add('active');
          cueVideo(videoId, thumbnail);
        }
      });
    })
    .catch(error => {
      console.error('Error fetching playlist items', error);
      loadingIndicator.style.display = 'none';
      playlistItemsElement.innerHTML = `<li>Error loading playlist items: ${error.message}</li>`;
    });
}

function selectPlaylist(button) {
  plButtons.forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
  const playlistId = button.getAttribute('data-playlist');
  loadPlaylistItems(playlistId);
}

function createPlaylistButtons(playlists) {
  playlistButtonsContainer.innerHTML = '';
  plButtons = [];
  playlists.forEach((playlist, index) => {
    const button = document.createElement('button');
    button.textContent = playlist.title;
    button.setAttribute('data-playlist', playlist.id);
    button.addEventListener('click', () => {
      selectPlaylist(button);
    });
    playlistButtonsContainer.appendChild(button);
    plButtons.push(button);
  });
  if (plButtons.length >= 3) {
    selectPlaylist(plButtons[2]);
  } else if (plButtons.length > 0) {
    selectPlaylist(plButtons[0]);
  }
}

fetch('playlists.json')
  .then(response => {
    if (!response.ok) throw new Error('Failed to load playlists.json');
    return response.json();
  })
  .then(data => createPlaylistButtons(data))
  .catch(error => {
    console.error('Error loading playlists:', error);
    playlistButtonsContainer.innerHTML = '<span style="color:red;">Error loading playlists</span>';
  });

// --- Utility Panel Functions ---
let currentFontSize = 16;
document.getElementById('decreaseText').addEventListener('click', () => {
  currentFontSize = Math.max(12, currentFontSize - 2);
  document.body.style.fontSize = currentFontSize + 'px';
});
document.getElementById('increaseText').addEventListener('click', () => {
  currentFontSize += 2;
  document.body.style.fontSize = currentFontSize + 'px';
});
document.getElementById('reloadPage').addEventListener('click', () => {
  location.reload();
});

// --- Playback Controls ---
document.getElementById('rewindBtn').addEventListener('click', () => {
  if (player && typeof player.getCurrentTime === 'function') {
    const currentTime = player.getCurrentTime();
    player.seekTo(Math.max(0, currentTime - 10), true);
  }
});
document.getElementById('playPauseBtn').addEventListener('click', () => {
  if (player) {
    const state = player.getPlayerState();
    if (state === YT.PlayerState.PLAYING) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
    updatePlayPauseButton();
  }
});
document.getElementById('skipBtn').addEventListener('click', () => {
  const activeItem = document.querySelector('.video-item.active');
  if (activeItem) {
    let index = parseInt(activeItem.getAttribute('data-index'));
    index = (index + 1) % currentPlaylistItems.length;
    const nextItem = document.querySelector(`.video-item[data-index="${index}"]`);
    if (nextItem) { nextItem.click(); }
  }
});

// --- Auto-Reload on Inactivity ---
let reloadTimeout = null;
let periodicReloadInterval = null;
function resetActivityTimer() {
  if (reloadTimeout) clearTimeout(reloadTimeout);
  if (periodicReloadInterval) {
    clearInterval(periodicReloadInterval);
    periodicReloadInterval = null;
  }
  reloadTimeout = setTimeout(() => {
    location.reload();
    periodicReloadInterval = setInterval(() => { location.reload(); }, 60 * 60 * 1000);
  }, 15 * 60 * 1000);
}
document.addEventListener('click', resetActivityTimer);
document.addEventListener('touchstart', resetActivityTimer);
resetActivityTimer();
