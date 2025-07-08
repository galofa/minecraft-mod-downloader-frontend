# 🧩 Minecraft Mod Downloader - Frontend

BulkMod is a responsive frontend built with React + Vite that allows users to upload a .txt file with Modrinth URLs and download all compatible mods in a single zip file.

---

## 🔍 Features

- 🌐 Select any Minecraft version and mod loader
- 📄 Upload a .txt file with multiple Modrinth mod URLs (one per line)
- 📦 Download all compatible mods bundled in a zip file
- 📊 Real-time download progress with progress bar and feedback
- ❌ Clear error list for unsupported or incompatible mods
- 💡 Hover tips to guide file format and usage

## 🧪 Tech Stack

- ⚛️ React + Vite
- 💨 TailwindCSS
- 📡 Server-Sent Events (SSE) for real-time progress
- 🧰 TypeScript for full type safety
- 📦 Modular components

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── ModDownloader.tsx       # Main React component for mod selection/upload
│   ├── App.tsx                     # Entry point rendering the downloader component
│   ├── main.tsx                    # Mounts the React app
│   └── styles.css                  # TailwindCSS + custom styles
├── .env                            # Frontend environment variables
├── index.html                      # Base HTML template
└── vite.config.ts                  # Vite configuration
```

---

## ▶️ Running Locally

### 📦 Installation

```git
git clone git@github.com:galofa/minecraft-mod-downloader-frontend.git
```

```bash
cd minecraft-mod-downloader-frontend
npm install
```

### ⚙️ Setting up Environment Variables

```bash
cp .env.template .env
```

Fill it with the following values:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

### ▶️ Running the Server

```bash
npm run dev
```

Then open http://localhost:5173 in your browser.

---

## 🔐 Notes

- Only Modrinth URLs are currently supported
- The backend performs validation and download logic
- For Fabric/Forge/NeoForge/Quilt mods — make sure to select the correct loader
- You need to be running both frontend and backend in order to have the application work

---

## 📜 Example Input File

.txt file content:

```
https://modrinth.com/mod/sodium
https://modrinth.com/mod/carpet
https://modrinth.com/mod/lithium
```
