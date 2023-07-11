const musicCon = document.querySelector('.musicCon');
const playBtn = document.querySelector('#play');
const prevBtn = document.querySelector('#prev');
const nextBtn = document.querySelector('#next');
const progress = document.querySelector('.progress');
const audio = document.querySelector('#audio');
const progressCon = document.querySelector('.progressCon');
const title = document.querySelector('#title');
const cover = document.querySelector('#cover');
const audioCtx = new AudioContext();
const loader = document.querySelector('.load-wrapper');
const themeToggle = document.querySelector('#toggle');
const songList = document.querySelector('.list');
const canvas = document.querySelector("#canvas");
const body = document.querySelector("#bd");
const mainTitle = document.querySelector(".title");

// Song titles
const songs = [
    "Discord Remix", "Space Worm Food", "Wii Shop Music",
    "Lancer Theme Remix", "Lofi", "Superstitous Foundation",
    "Place Holder" ,"Chiller", "The Windows Update",
    "The Search Engine", "Noir Et Blanc Vie Birth Noir", "Poltergeist",
    "Haunted", "Ksyantos", "The Bywater",
    "Smartphone Calling Back", "Creo - We Can Dream",
    "Akihabara Cruise", "Blue Bird Lofi", "A cuel angels theisis lofi",
    "Zankyou Sanka", "Gurenge Lofi", "Golden Wind Lofi",
    "Netsujou no Spectrum", "Zenitsu Theme", "Tanjiro No Uta Lofi",
    "Pumped Up Kicks", "Next To You", "La La La",
    "Industry Baby", "Enemy", "Bones",
    "Venom", "Rap God", "We Go!",
    "Hard Knock Days", "Blue Bird (English)", "House Of Memories",
    "Bad Apple", "Bad Apple (English)", "Heat Waves",
    "Living Life In The Night", "Dark Seeks Light", "Light Switch",
    "Light Switch (Japanese)", "Rise", "Levitating",
    "Young Girl A", "Toxic", "We Are!",
    "Unravel", "GIGACHAD ONE PIECE", "Can You Feel My Heart",
    "Dancin", "Departure!", "Kaikai Kitan",
    "Bad Guy", "One Dance", "Love Nwantiti",
    "Fashion Week", "Here"
];

// On load
setTimeout(function loaded() {
    loader.classList.toggle("fadeout");
}, 4500);

// keep track of songs
let songIndex = 31;

// update song details
function loadSong(song) {
    title.innerHTML = song;
    audio.src = `audio/${song}.mp3`;
    cover.src = `img/${song}.png`;
}

// Load the song
loadSong(songs[songIndex]);


playBtn.addEventListener('click', () => {
    const isPlaying = musicCon.classList.contains('play');
    if (isPlaying) {
        pauseSong();
    }
    else {
        playSong();
    }
});

// functions
function playSong() {
    musicCon.classList.add('play');
    playBtn.querySelector('i.fas').classList.remove('fa-play');
    playBtn.querySelector('i.fas').classList.add('fa-pause');
    audio.play();
}

function pauseSong() {
    musicCon.classList.remove('play');
    playBtn.querySelector('i.fas').classList.remove('fa-pause');
    playBtn.querySelector('i.fas').classList.add('fa-play');
    audio.pause();
}

function prevSong() {
    const isPlaying = musicCon.classList.contains("play")
    songIndex--;
    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }
    loadSong(songs[songIndex]);
    if (songIndex > songs.length - 1) {
        songIndex = 60;
    }
    loadSong(songs[songIndex]);
    if (isPlaying) {
        playSong();
    }
    else {
        return
    }
}

function nextSong() {
    const isPlaying = musicCon.classList.contains("play")
    songIndex++;
    if (songIndex > songs.length - 1) {
        songIndex = 0;
    }
    loadSong(songs[songIndex]);
    if (isPlaying != true) {
        return
    }
    else {
        playSong();
    }
}

function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

function theme() {
    musicCon.classList.toggle('dark');
    songList.classList.toggle('dark');
    canvas.classList.toggle('dark');
    body.classList.toggle('dark');
    playBtn.classList.toggle('dark');
    prevBtn.classList.toggle('dark');
    nextBtn.classList.toggle('dark');
    mainTitle.classList.toggle('dark');
}

playBtn.onclick = function () {
    var files = songs[songIndex] + ".mp3";
    var context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext("2d");

    src.connect(analyser);
    analyser.connect(context.destination);

    analyser.fftSize = 256;

    var bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);

    var dataArray = new Uint8Array(bufferLength);

    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;

    var barWidth = (WIDTH / bufferLength) * 4;
    var barHeight;
    var x = 0;

    function renderFrame() {
        requestAnimationFrame(renderFrame);

        x = 0;

        analyser.getByteFrequencyData(dataArray);
        if (canvas.classList.contains("dark")) {
            ctx.fillStyle = "#424242";
        }
        else {
            ctx.fillStyle = "#fff";
        }
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        for (var i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            //change colors here
            var r = barHeight + 50 * (i / bufferLength);
            var g = 75 * (i / bufferLength);
            var b = 90;

            ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
            ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }
    }
    audio.play();
    renderFrame();
};

// next and prev buttons
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);
audio.addEventListener('timeupdate', updateProgress);
progressCon.addEventListener('click', setProgress);
audio.addEventListener('ended', nextSong);
themeToggle.addEventListener('change', theme)
