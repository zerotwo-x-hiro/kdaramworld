import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const FONTS_DIR = path.join(process.cwd(), 'public', 'fonts');

if (!fs.existsSync(FONTS_DIR)) {
  fs.mkdirSync(FONTS_DIR, { recursive: true });
}

const FONTS = [
  // Cormorant Garamond (Latin Display)
  {
    name: 'CormorantGaramond-Regular.woff2',
    url: 'https://fonts.gstatic.com/s/cormorantgaramond/v21/co3bmX5slCNuHLi8bLeY9MK7whWMhyjYqXtK.woff2',
  },
  {
    name: 'CormorantGaramond-SemiBold.woff2',
    url: 'https://fonts.gstatic.com/s/cormorantgaramond/v21/co3bmX5slCNuHLi8bLeY9MK7whWMhyjYqXtK.woff2',
  },
  {
    name: 'CormorantGaramond-Bold.woff2',
    url: 'https://fonts.gstatic.com/s/cormorantgaramond/v21/co3bmX5slCNuHLi8bLeY9MK7whWMhyjYqXtK.woff2',
  },
  // Pretendard (UI Sans - Korean + Latin)
  {
    name: 'Pretendard-Regular.woff2',
    url: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/static/woff2/Pretendard-Regular.woff2',
  },
  {
    name: 'Pretendard-Medium.woff2',
    url: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/static/woff2/Pretendard-Medium.woff2',
  },
  {
    name: 'Pretendard-SemiBold.woff2',
    url: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/static/woff2/Pretendard-SemiBold.woff2',
  },
  {
    name: 'Pretendard-Bold.woff2',
    url: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/static/woff2/Pretendard-Bold.woff2',
  },
  // Gowun Batang (Korean Display Serif)
  {
    name: 'GowunBatang-Regular.woff2',
    url: 'https://fonts.gstatic.com/s/gowunbatang/v12/ijwNs5nhRMIjYsdSgcMa3wRZ4J7qxcEw.woff2',
  },
  {
    name: 'GowunBatang-Bold.woff2',
    url: 'https://fonts.gstatic.com/s/gowunbatang/v12/ijwNs5nhRMIjYsdSgcMa3wRZ4J7qxcEw.woff2',
  },
  // Black Han Sans (Hangul Accent)
  {
    name: 'BlackHanSans-Regular.woff2',
    url: 'https://fonts.gstatic.com/s/blackhansans/v24/ea8Aad44WunzF9a-dL6toA8r8nqQSWKmEJKy1nK6J8sYUGdTBHS2osQ.119.woff2',
  },
];

async function download(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        if (res.headers.location) {
          download(res.headers.location, dest).then(resolve).catch(reject);
          return;
        }
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: status ${res.statusCode}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlinkSync(dest);
      reject(err);
    });
  });
}

async function main() {
  console.log('Downloading self-hosted OFL fonts...');
  for (const font of FONTS) {
    const dest = path.join(FONTS_DIR, font.name);
    if (!fs.existsSync(dest) || fs.statSync(dest).size === 0) {
      console.log(`Downloading ${font.name}...`);
      try {
        await download(font.url, dest);
        console.log(`Saved ${font.name} (${fs.statSync(dest).size} bytes)`);
      } catch (e) {
        console.warn(`Warning downloading ${font.name}:`, e);
      }
    } else {
      console.log(`Using existing ${font.name}`);
    }
  }
  console.log('Font setup complete.');
}

main().catch(console.error);
