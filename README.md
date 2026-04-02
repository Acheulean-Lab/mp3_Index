# Audio_index

A simple audio index web app built with Next.js that loads MP3 files from `public/audio/` and displays them in an interactive list. Click an entry to expand it, then playback starts with a minimal progress bar.


<img width="2633" height="1046" alt="Screenshot 2026-04-02 at 10-18-07 Audioindex" src="https://github.com/user-attachments/assets/23f0f752-3aad-46b6-8966-6ac01cb3273c" />


## Prerequisites

- Node.js 18+
- npm

## Installation & Running

```bash
git clone https://github.com/Acheulean-Lab/mp3_Index.git
cd mp3_Index
npm install

npm run dev
```

Open [http://localhost:3000](http://localhost:3000).


## Auto Generate Index Items


Drop `.mp3` files into `public/audio/` and run:

```bash
npm run generate-index
```

This generates `src/data/index.json` from audio metadata / filename values. If you want custom titles/descriptions, edit `src/data/index.json` directly.

## Project Structure

- `src/app/page.tsx`: Main index list UI and expand/collapse behavior
- `src/components/AudioPlayer.tsx`: Minimal player element
- `src/data/index.json`: Auto-generated list of audio entries
- `public/audio/`: MP3 files

## Commands

- `npm run generate-index` - regenerate audio metadata index
- `npm run dev` - local dev server
- `npm run build` - build production bundle
- `npm run start` - run production server

