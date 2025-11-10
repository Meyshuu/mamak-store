require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Games data for seeding
const gamesData = [
  { id: 1, name: "Fortnite", img: "fortnite.png", desc: "Game battle royale dengan elemen membangun dan aksi cepat.", genre: ["battle-royale", "shooter", "action"], price: 0, releaseDate: "2017-07-25", developer: "Epic Games", platform: "PC, PS4, Xbox", rating: 4.5, sysReq: { min: "Minimum: Windows 7, 4GB RAM, GTX 660", rec: "Recommended: Windows 10, 8GB RAM, GTX 1060" }, screenshots: ["fortnite-ss1.png", "fortnite-ss2.png"], reviews: [] },
  { id: 2, name: "Rocket League", img: "rl.png", desc: "Pertandingan sepak bola menggunakan mobil roket.", genre: ["sports", "action", "arcade"], price: 0, releaseDate: "2015-07-07", developer: "Psyonix", platform: "PC, PS4, Xbox", rating: 4.2, sysReq: { min: "Minimum: Windows 7, 4GB RAM, GTX 650", rec: "Recommended: Windows 10, 8GB RAM, GTX 1060" }, screenshots: ["rl-ss1.png", "rl-ss2.png"], reviews: [] },
  { id: 3, name: "Apex Legends", img: "apex.png", desc: "Battle royale tim dengan karakter unik dan kemampuan khusus.", genre: ["battle-royale", "shooter", "action"], price: 0, releaseDate: "2019-02-04", developer: "Respawn Entertainment", platform: "PC, PS4, Xbox", rating: 4.3, sysReq: { min: "Minimum: Windows 7, 8GB RAM, GTX 640", rec: "Recommended: Windows 10, 16GB RAM, RTX 2060" }, screenshots: ["apex-ss1.png", "apex-ss2.png"], reviews: [] },
  { id: 4, name: "Cyberpunk 2077", img: "cpunk.png", desc: "RPG dunia terbuka bertema futuristik di kota Night City.", genre: ["rpg", "action", "adventure"], price: 699999, releaseDate: "2020-12-10", developer: "CD Projekt Red", platform: "PC, PS4, Xbox", rating: 3.8, sysReq: { min: "Minimum: Windows 10, 12GB RAM, GTX 970", rec: "Recommended: Windows 10, 16GB RAM, RTX 2060" }, screenshots: ["cpunk-ss1.png", "cpunk-ss2.png"], reviews: [] },
  { id: 5, name: "The Witcher 3", img: "tww.png", desc: "RPG epik tentang pemburu monster bernama Geralt of Rivia.", genre: ["rpg", "adventure", "action"], price: 359999, releaseDate: "2015-05-19", developer: "CD Projekt Red", platform: "PC, PS4, Xbox", rating: 4.9, sysReq: { min: "Minimum: Windows 7, 6GB RAM, GTX 660", rec: "Recommended: Windows 10, 8GB RAM, GTX 1060" }, screenshots: ["tww-ss1.png", "tww-ss2.png"], reviews: [] },
  { id: 6, name: "eFootball", img: "efootball.png", desc: "Simulasi sepak bola realistis dengan tim dan liga resmi.", genre: ["sports", "simulation"], price: 400000, releaseDate: "2022-09-30", developer: "EA Sports", platform: "PC, PS4, Xbox", rating: 4.1, sysReq: { min: "Minimum: Windows 10, 8GB RAM, GTX 660", rec: "Recommended: Windows 10, 16GB RAM, RTX 2060" }, screenshots: ["fifa23-ss1.png", "fifa23-ss2.png"], reviews: [] },
  { id: 7, name: "GTA V", img: "gta5.png", desc: "Aksi dunia terbuka dengan kebebasan bermain tinggi di Los Santos.", genre: ["action", "adventure", "open-world"], price: 439000, releaseDate: "2013-09-17", developer: "Rockstar Games", platform: "PC, PS4, Xbox", rating: 4.8, sysReq: { min: "Minimum: Windows 8.1, 4GB RAM, GTX 660", rec: "Recommended: Windows 10, 8GB RAM, GTX 1060" }, screenshots: ["gta5-ss1.png", "gta5-ss2.png"], reviews: [] },
  { id: 8, name: "Dota 2", img: "dota2.png", desc: "Pertarungan MOBA 5v5 dengan hero unik dan strategi kompleks.", genre: ["moba", "strategy"], price: 0, releaseDate: "2013-07-09", developer: "Valve", platform: "PC", rating: 4.4, sysReq: { min: "Minimum: Windows 7, 4GB RAM, Integrated Graphics", rec: "Recommended: Windows 10, 8GB RAM, GTX 1060" }, screenshots: ["dota2-ss1.png", "dota2-ss2.png"], reviews: [] },
  { id: 9, name: "Counter-Strike 2", img: "cs2.png", desc: "Shooter taktis antara tim teroris dan counter-teroris.", genre: ["shooter", "tactical", "action"], price: 0, releaseDate: "2023-09-27", developer: "Valve", platform: "PC", rating: 4.6, sysReq: { min: "Minimum: Windows 10, 8GB RAM, GTX 730", rec: "Recommended: Windows 10, 16GB RAM, RTX 2060" }, screenshots: ["cs2-ss1.png", "cs2-ss2.png"], reviews: [] },
  { id: 10, name: "Valorant", img: "valorant.png", desc: "Shooter taktis 5v5 dengan agen yang punya kemampuan unik.", genre: ["shooter", "tactical", "hero-shooter"], price: 0, releaseDate: "2020-06-02", developer: "Riot Games", platform: "PC", rating: 4.5, sysReq: { min: "Minimum: Windows 7, 4GB RAM, GTX 300", rec: "Recommended: Windows 10, 8GB RAM, GTX 1060" }, screenshots: ["valorant-ss1.png", "valorant-ss2.png"], reviews: [] },
  { id: 11, name: "Overwatch 2", img: "overwatch2.png", desc: "Shooter berbasis tim dengan karakter dan kemampuan spesial.", genre: ["shooter", "hero-shooter", "action"], price: 0, releaseDate: "2022-10-04", developer: "Blizzard Entertainment", platform: "PC, PS4, Xbox", rating: 4.0, sysReq: { min: "Minimum: Windows 7, 4GB RAM, GTX 660", rec: "Recommended: Windows 10, 8GB RAM, GTX 1060" }, screenshots: ["overwatch2-ss1.png", "overwatch2-ss2.png"], reviews: [] },
  { id: 12, name: "PUBG: BATTLEGROUNDS", img: "pubg.png", desc: "Battle royale realistis dengan 100 pemain di satu arena.", genre: ["battle-royale", "shooter", "survival"], price: 0, releaseDate: "2017-12-20", developer: "PUBG Corporation", platform: "PC, Mobile", rating: 4.2, sysReq: { min: "Minimum: Windows 7, 8GB RAM, GTX 960", rec: "Recommended: Windows 10, 16GB RAM, RTX 2060" }, screenshots: ["pubg-ss1.png", "pubg-ss2.png"], reviews: [] },
  { id: 13, name: "Battlefield 8", img: "battlefield8.png", desc: "Shooter skala besar dengan kendaraan dan pertempuran realistis.", genre: ["shooter", "war", "action"], price: 0, releaseDate: "2021-06-09", developer: "DICE", platform: "PC, PS4, Xbox", rating: 3.9, sysReq: { min: "Minimum: Windows 10, 8GB RAM, GTX 1050", rec: "Recommended: Windows 10, 16GB RAM, RTX 2060" }, screenshots: ["battlefield8-ss1.png", "battlefield8-ss2.png"], reviews: [] },
  { id: 14, name: "Repo", img: "repo.png", desc: "Game aksi taktis dengan elemen sci-fi dan misi penyelamatan.", genre: ["action", "sci-fi", "tactical"], price: 0, releaseDate: "2023-01-15", developer: "Unknown", platform: "PC", rating: 3.5, sysReq: { min: "Minimum: Windows 10, 8GB RAM, GTX 1060", rec: "Recommended: Windows 10, 16GB RAM, RTX 2060" }, screenshots: ["repo-ss1.png", "repo-ss2.png"], reviews: [] },
  { id: 15, name: "Peak", img: "peak.png", desc: "Game puzzle santai yang melatih otak dengan mini game beragam.", genre: ["puzzle", "education", "casual"], price: 0, releaseDate: "2022-05-10", developer: "Unknown", platform: "PC, Mobile", rating: 4.0, sysReq: { min: "Minimum: Windows 7, 2GB RAM, Integrated Graphics", rec: "Recommended: Windows 10, 4GB RAM, GTX 650" }, screenshots: ["peak-ss1.png", "peak-ss2.png"], reviews: [] },
  { id: 16, name: "NBA 2K26", img: "nba2k26.png", desc: "Simulasi basket dengan gameplay realistis dan mode karier.", genre: ["sports", "simulation"], price: 0, releaseDate: "2024-09-06", developer: "Visual Concepts", platform: "PC, PS4, Xbox", rating: 4.3, sysReq: { min: "Minimum: Windows 10, 8GB RAM, GTX 780", rec: "Recommended: Windows 10, 16GB RAM, RTX 2060" }, screenshots: ["nba2k26-ss1.png", "nba2k26-ss2.png"], reviews: [] },
  { id: 17, name: "Red Dead Redemption 2", img: "rdr2.png", desc: "Petualangan open-world bertema koboi di Amerika Barat.", genre: ["adventure", "action", "open-world"], price: 0, releaseDate: "2018-10-26", developer: "Rockstar Studios", platform: "PC, PS4, Xbox", rating: 4.9, sysReq: { min: "Minimum: Windows 7, 8GB RAM, GTX 770", rec: "Recommended: Windows 10, 16GB RAM, RTX 2060" }, screenshots: ["rdr2-ss1.png", "rdr2-ss2.png"], reviews: [] },
  { id: 18, name: "Marvel Rivals", img: "marvelrivals.png", desc: "Shooter tim dengan karakter superhero Marvel.", genre: ["shooter", "action", "superhero"], price: 0, releaseDate: "2024-12-06", developer: "NetEase", platform: "PC", rating: 4.1, sysReq: { min: "Minimum: Windows 10, 8GB RAM, GTX 1060", rec: "Recommended: Windows 10, 16GB RAM, RTX 2060" }, screenshots: ["marvelrivals-ss1.png", "marvelrivals-ss2.png"], reviews: [] },
  { id: 19, name: "Dead by Daylight", img: "dbd.png", desc: "Horror asimetris: satu pembunuh melawan empat penyintas.", genre: ["horror", "multiplayer", "survival"], price: 0, releaseDate: "2016-06-14", developer: "Behaviour Interactive", platform: "PC, PS4, Xbox", rating: 4.2, sysReq: { min: "Minimum: Windows 7, 8GB RAM, GTX 460", rec: "Recommended: Windows 10, 16GB RAM, GTX 1060" }, screenshots: ["dbd-ss1.png", "dbd-ss2.png"], reviews: [] },
  { id: 20, name: "Tekken 8", img: "tekken8.png", desc: "Pertarungan 3D cepat dengan karakter ikonik dan kombo mematikan.", genre: ["fighting", "action", "arcade"], price: 0, releaseDate: "2024-01-26", developer: "Bandai Namco", platform: "PC, PS4, Xbox", rating: 4.4, sysReq: { min: "Minimum: Windows 10, 8GB RAM, GTX 1050", rec: "Recommended: Windows 10, 16GB RAM, RTX 2060" }, screenshots: ["tekken8-ss1.png", "tekken8-ss2.png"], reviews: [] },
  { id: 21, name: "Resident Evil 4", img: "re4.png", desc: "Aksi horor bertahan hidup melawan wabah bioweapon di desa misterius.", genre: ["horror", "action", "survival"], price: 0, releaseDate: "2023-03-24", developer: "Capcom", platform: "PC, PS4, Xbox", rating: 4.7, sysReq: { min: "Minimum: Windows 10, 8GB RAM, GTX 1060", rec: "Recommended: Windows 10, 16GB RAM, RTX 2060" }, screenshots: ["re4-ss1.png", "re4-ss2.png"], reviews: [] },
  { id: 22, name: "Elden Ring", img: "eldenring.png", desc: "RPG dunia terbuka dengan pertarungan menantang dan dunia gelap.", genre: ["rpg", "action", "adventure"], price: 0, releaseDate: "2022-02-25", developer: "FromSoftware", platform: "PC, PS4, Xbox", rating: 4.8, sysReq: { min: "Minimum: Windows 10, 12GB RAM, GTX 1060", rec: "Recommended: Windows 10, 16GB RAM, RTX 2060" }, screenshots: ["eldenring-ss1.png", "eldenring-ss2.png"], reviews: [] },
  { id: 23, name: "Black Myth: Wukong", img: "wukong.png", desc: "Action RPG berdasarkan legenda Sun Wukong dengan grafis epik.", genre: ["rpg", "action", "fantasy"], price: 0, releaseDate: "2024-08-20", developer: "Game Science", platform: "PC, PS4, Xbox", rating: 4.6, sysReq: { min: "Minimum: Windows 10, 16GB RAM, RTX 2060", rec: "Recommended: Windows 10, 32GB RAM, RTX 3080" }, screenshots: ["wukong-ss1.png", "wukong-ss2.png"], reviews: [] },
  { id: 24, name: "Dying Light", img: "dyinglight.png", desc: "Aksi parkour dan bertahan hidup di dunia penuh zombie.", genre: ["action", "horror", "survival"], price: 291000, releaseDate: "2015-01-27", developer: "Techland", platform: "PC, PS4, Xbox", rating: 4.3, sysReq: { min: "Minimum: Windows 7, 4GB RAM, GTX 560", rec: "Recommended: Windows 10, 8GB RAM, GTX 1060" }, screenshots: ["dyinglight-ss1.png", "dyinglight-ss2.png"], reviews: [] },
  { id: 25, name: "The Legend of Zelda: Ocarina of Time", img: "zelda.png", desc: "Petualangan klasik dengan eksplorasi dan teka-teki di Hyrule.", genre: ["adventure", "rpg", "fantasy"], price: 799000, releaseDate: "1998-11-21", developer: "Nintendo", platform: "Nintendo 64", rating: 4.9, sysReq: { min: "N/A", rec: "N/A" }, screenshots: ["zelda-ss1.png", "zelda-ss2.png"], reviews: [] },
  { id: 26, name: "Baldur's Gate 3", img: "bg3.png", desc: "RPG berbasis D&D dengan pilihan moral dan narasi mendalam.", genre: ["rpg", "fantasy", "story-rich"], price: 999000, releaseDate: "2023-08-03", developer: "Larian Studios", platform: "PC, PS4, Xbox", rating: 4.9, sysReq: { min: "Minimum: Windows 10, 8GB RAM, GTX 1060", rec: "Recommended: Windows 10, 16GB RAM, RTX 2060" }, screenshots: ["bg3-ss1.png", "bg3-ss2.png"], reviews: [] },
  { id: 27, name: "Uncharted 2: Among Thieves", img: "uncharted2.png", desc: "Aksi petualangan sinematik dengan kisah harta karun dan misteri.", genre: ["adventure", "action", "story-rich"], price: 159000, releaseDate: "2009-10-13", developer: "Naughty Dog", platform: "PS3", rating: 4.8, sysReq: { min: "PS3 Hardware", rec: "PS3 Hardware" }, screenshots: ["uncharted2-ss1.png", "uncharted2-ss2.png"], reviews: [] },
  { id: 28, name: "Stardew Valley", img: "stardew.png", desc: "Simulasi kehidupan dan bertani di desa yang damai.", genre: ["simulation", "casual", "farming"], price: 85000, releaseDate: "2016-02-26", developer: "ConcernedApe", platform: "PC, Mobile", rating: 4.7, sysReq: { min: "Minimum: Windows Vista, 2GB RAM, Integrated Graphics", rec: "Recommended: Windows 10, 4GB RAM, GTX 650" }, screenshots: ["stardew-ss1.png", "stardew-ss2.png"], reviews: [] },
  { id: 29, name: "Mass Effect 2", img: "masseffect2.png", desc: "RPG sci-fi dengan cerita mendalam dan pilihan yang memengaruhi jalan cerita.", genre: ["rpg", "sci-fi", "action"], price: 700000, releaseDate: "2010-01-26", developer: "BioWare", platform: "PC, PS3, Xbox", rating: 4.6, sysReq: { min: "Minimum: Windows XP, 1GB RAM, GTX 260", rec: "Recommended: Windows 7, 4GB RAM, GTX 650" }, screenshots: ["masseffect2-ss1.png", "masseffect2-ss2.png"], reviews: [] },
  { id: 30, name: "God of War: Ragnarok", img: "gowr.png", desc: "Aksi epik Kratos dan Atreus melawan para dewa Nordik.", genre: ["action", "adventure", "mythology"], price: 259000, releaseDate: "2022-11-09", developer: "Santa Monica Studio", platform: "PC, PS4, PS5", rating: 4.9, sysReq: { min: "Minimum: Windows 10, 8GB RAM, GTX 1070", rec: "Recommended: Windows 10, 16GB RAM, RTX 2060" }, screenshots: ["gowr-ss1.png", "gowr-ss2.png"], reviews: [] }
];

// Load data from files for demo mode
function loadDataFromFiles() {
  try { 
    // Games are already defined in the array above
    // console.log('Games loaded from code');

    // Load reviews from file
    const data = fs.readFileSync(path.join(__dirname, 'reviews.json'), 'utf8').replace(/^\uFEFF/, '');
    const fileReviews = JSON.parse(data);

    // Populate games with reviews
    games.forEach(game => {
      game.reviews = fileReviews.filter(review => review.gameId === game.id);
    });
    // console.log('Reviews loaded from file');
  } catch (err) {
    // console.error('Error loading data from files:', err);
  }
}

const app = express();
const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Demo user data (for Vercel compatibility)
let userData = {
  "1": {
    "id": 1,
    "avatar": "images/avatar1.png",
    "username": "user1",
    "email": "user1@example.com",
    "password": "$2a$10$E4aDmzdZGCOuY./gdG8WUeCUwZ6zDXd1q63/jyw3wKdDVp0uyzzr.",
    "verified": true,
    "balance": 50,
    "wishlist": [],
    "library": [],
    "cart": [],
    "joinDate": "2023-01-15T00:00:00.000Z"
  },
  "2": {
    "id": 2,
    "avatar": "images/admin.png",
    "username": "admin",
    "email": "admin@example.com",
    "password": "$2a$10$lMhNaC8h884A.Emjsj521.k8xpluxgWXBMmc3BqpFnWDO003kprcy",
    "verified": true,
    "balance": 100,
    "wishlist": [1, 5, 7, 13, 17, 28],
    "library": [2, 4, 9, 15, 19, 20, 25, 27],
    "cart": [],
    "joinDate": "2023-01-01T00:00:00.000Z"
  },
  "3": {
    "id": 3,
    "avatar": "images/vian.png",
    "username": "vian",
    "email": "vian@example.com",
    "password": "$2a$10$0IUjhpe/VGlLgqvyLepKS.dJOo2Ag0fux64FEiwQOvxJOjQhAXAtG",
    "verified": true,
    "balance": 0,
    "wishlist": [],
    "library": [],
    "cart": [],
    "joinDate": "2023-02-01T00:00:00.000Z"
  }
};

// Demo reviews data
let reviews = [];

// Function to save reviews to file (temporary)
function saveReviews() {
if (!process.env.VERCEL) {
fs.writeFileSync(path.join(__dirname, 'reviews.json'), JSON.stringify(reviews, null, 2));
}
}

// Function to save userData to file (temporary)
function saveUserData() {
if (!process.env.VERCEL) {
fs.writeFileSync(path.join(__dirname, 'userData.json'), JSON.stringify(userData, null, 2));
}
}

// For Vercel, use demo data
if (process.env.VERCEL) {
  // Use the demo data defined above
  // console.log('Using demo data for Vercel deployment');
}

// Serve the HTML file
app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/index.html', (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));





// Helper function to generate simple token
function generateToken() {
return Math.random().toString(36).substr(2) + Date.now().toString(36);
}

// API Endpoints

// Get all games
app.get('/api/games', (req, res) => {
res.json(gamesData);
});

// Login
app.post('/api/login', (req, res) => {
const { username, password } = req.body;
const user = Object.values(userData).find(u => u.username === username);
if (user && bcrypt.compareSync(password, user.password)) {
const token = generateToken();
res.json({ success: true, token, user: { id: user.id, username: user.username, email: user.email, avatar: user.avatar, balance: user.balance } });
} else {
res.status(401).json({ success: false, message: 'Invalid credentials' });
}
});



// Email verification
app.get('/api/verify/:userId', (req, res) => {
const userId = parseInt(req.params.userId);
const user = userData[userId];
if (user) {
user.verified = true;
saveUserData();
res.send('Email verified successfully!');
} else {
res.status(404).send('User not found');
}
});

// Get user profile (requires token)
app.get('/api/user', (req, res) => {
const userId = req.query.userId; // Assuming userId is passed as query param for demo
const user = userData[userId];
if (user) {
res.json({ success: true, user: { id: user.id, username: user.username, email: user.email, avatar: user.avatar, verified: user.verified, balance: user.balance, joinDate: user.joinDate } });
} else {
res.status(404).json({ success: false, message: 'User not found' });
}
});

// Add/Remove from wishlist
app.post('/api/wishlist', (req, res) => {
const { userId, gameId, action } = req.body;
const user = userData[userId];
if (!user) return res.status(404).json({ success: false, message: 'User not found' });
if (action === 'add' && !user.wishlist.includes(gameId)) {
user.wishlist.push(gameId);
} else if (action === 'remove') {
user.wishlist = user.wishlist.filter(id => id !== gameId);
}
saveUserData();
res.json({ success: true, wishlist: user.wishlist });
});

// Add/Remove/Update cart
app.post('/api/cart', (req, res) => {
const { userId, gameId, action, quantity } = req.body;
const user = userData[userId];
if (!user) return res.status(404).json({ success: false, message: 'User not found' });
const cartItem = user.cart.find(item => item.gameId === gameId);
if (action === 'add') {
if (cartItem) {
cartItem.quantity += quantity || 1;
} else {
user.cart.push({ gameId, quantity: quantity || 1 });
}
} else if (action === 'remove') {
user.cart = user.cart.filter(item => item.gameId !== gameId);
} else if (action === 'update') {
if (cartItem) {
cartItem.quantity = quantity;
if (cartItem.quantity <= 0) {
user.cart = user.cart.filter(item => item.gameId !== gameId);
}
}
}
saveUserData();
res.json({ success: true, cart: user.cart });
});

// Add to library (purchase)
app.post('/api/library', (req, res) => {
const { userId, gameId } = req.body;
const user = userData[userId];
if (!user) return res.status(404).json({ success: false, message: 'User not found' });
if (!user.library.includes(gameId)) {
user.library.push(gameId);
// Remove from cart if present
user.cart = user.cart.filter(item => item.gameId !== gameId);
saveUserData();
}
res.json({ success: true, library: user.library });
});

// Get user data
app.get('/api/user-data/:userId', (req, res) => {
const user = userData[req.params.userId];
if (user) {
    // Populate cart with full game data
    const populatedCart = user.cart.map(cartItem => {
        const game = gamesData.find(g => g.id === cartItem.gameId);
        return game ? { ...cartItem, game } : cartItem;
    });
    res.json({ success: true, data: { wishlist: user.wishlist, library: user.library, cart: populatedCart } });
} else {
res.status(404).json({ success: false, message: 'User not found' });
}
});

// Update user avatar
app.post('/api/avatar', upload.single('avatar'), (req, res) => {
const userId = req.body.userId; // Assuming userId is passed in body for demo
const user = userData[userId];
if (user) {
  let avatarUrl;
  if (req.file) {
    // File uploaded
    avatarUrl = '/uploads/' + req.file.filename;
  } else {
    // URL provided
    avatarUrl = req.body.avatar;
  }
  user.avatar = avatarUrl;
  saveUserData();
  res.json({ success: true, avatar: avatarUrl });
} else {
  res.status(404).json({ success: false, message: 'User not found' });
}
});

// Change password
app.post('/api/change-password', (req, res) => {
const userId = req.body.userId; // Assuming userId is passed in body for demo
const { currentPassword, newPassword } = req.body;
const user = userData[userId];
if (user && bcrypt.compareSync(currentPassword, user.password)) {
const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
user.password = hashedNewPassword;
saveUserData();
res.json({ success: true, message: 'Password changed successfully' });
} else {
res.status(400).json({ success: false, message: 'Current password is incorrect' });
}
});

// Get recommendations for user
app.get('/api/recommendations/:userId', (req, res) => {
const user = userData[req.params.userId];
if (!user) return res.json({ success: true, recommendations: [] });

const userGenres = new Set();
const userGames = [...user.library, ...user.wishlist];
userGames.forEach(gameId => {
    const game = gamesData.find(g => g.id === gameId);
    if (game) game.genre.forEach(genre => userGenres.add(genre));
});

const recommendations = gamesData.filter(game =>
    !userGames.includes(game.id) &&
    game.genre.some(genre => userGenres.has(genre))
).slice(0, 5); // Limit to 5 recommendations

res.json({ success: true, recommendations });
});

// Add review
app.post('/api/reviews', (req, res) => {
const { gameId, user, rating, comment } = req.body;
const game = gamesData.find(g => g.id === parseInt(gameId));
if (game) {
const userObj = userData[Object.keys(userData).find(id => userData[id].username === user)];
const avatar = userObj ? userObj.avatar : 'default-avatar.png';
const newReview = {
gameId: parseInt(gameId),
user,
rating: parseFloat(rating),
comment,
date: new Date().toISOString(),
avatar
};
game.reviews.push(newReview);
reviews.push(newReview);
saveReviews();
res.json({ success: true, reviews: game.reviews });
} else {
res.status(404).json({ success: false, message: 'Game not found' });
}
});

// For Vercel deployment
if (require.main === module) {
  app.listen(PORT, () => {
      // console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
