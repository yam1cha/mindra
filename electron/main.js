// electron/main.js
import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

// ESモジュールで __dirname を使うための呪文
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false, // セキュリティのためfalse
      contextIsolation: true, // セキュリティのためtrue
      // WebGPUを許可するための設定（通常はデフォルトでOKだけど念の為）
    },
  });

  // 開発中は Vite のサーバー (localhost:5173) を読み込む
  // 本番ビルド時は作成された index.html を読み込む
  const isDev = process.env.NODE_ENV !== 'production';
  
  if (isDev) {
    win.loadURL('http://localhost:5173');
    // 開発ツール（デベロッパーツール）を最初から開いておく
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});