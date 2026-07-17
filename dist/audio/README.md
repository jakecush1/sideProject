# Audio files go here

Drop your real (or royalty-free placeholder) audio files in this folder.
The app expects these filenames by default (see `src/data/songs.ts`):

- `candlelit-jig.mp3` — The Candlelit Jig
- `broken-goblet.mp3` — Ballad of the Broken Goblet
- `tavern-moon.mp3` — Dance of the Tavern Moon
- `drunken-minstrel.mp3` — The Drunken Minstrel's March

Optional:

- `tavern-ambience.mp3` — ambient background loop (plays after "Enter the Tavern")
- `clink.mp3` — glass clink sound effect when bottles spawn

**Missing files won't crash the app** — it logs a console warning and keeps
the UI and animations running. Update the paths in `src/data/songs.ts` if you
use different filenames.
