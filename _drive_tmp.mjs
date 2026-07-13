import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--autoplay-policy=no-user-gesture-required", "--no-sandbox"],
});
const page = await browser.newPage();
page.on("console", (m) => console.log(`[console.${m.type()}]`, m.text()));
page.on("pageerror", (e) => console.log("[pageerror]", e.message));

await page.goto("http://localhost:5174/", { waitUntil: "networkidle2" });

// Wait past loading screen (1600ms) then click "Enter the Tavern"
await new Promise((r) => setTimeout(r, 2200));
const clickedEnter = await page.evaluate(() => {
  const btn = [...document.querySelectorAll("button")].find((b) =>
    /enter the tavern/i.test(b.textContent || "")
  );
  if (btn) { btn.click(); return true; }
  return false;
});
console.log(">> clicked Enter:", clickedEnter);

await new Promise((r) => setTimeout(r, 1500));

// Inspect store + directly invoke selectSong for the first song, then inspect audio
const result = await page.evaluate(async () => {
  const store = window.__store;
  const before = store.getState();
  // Trigger a song the same way a click would
  before.selectSong("serfs-and-wenches");
  await new Promise((r) => setTimeout(r, 1500));
  const after = store.getState();

  // Probe Howler global for playing sounds
  let howlerInfo = "no Howler on window";
  try {
    const H = window.Howler;
    if (H) howlerInfo = `ctx.state=${H.ctx ? H.ctx.state : "n/a"} usingWebAudio=${H.usingWebAudio} volume=${H.volume()}`;
  } catch (e) { howlerInfo = "err " + e.message; }

  // Probe Howler's internal registry of all Howl instances
  const howls = (window.Howler && window.Howler._howls || []).map((h) => {
    let node = null;
    try {
      const s = h._sounds && h._sounds[0];
      if (s && s._node) node = { paused: s._node.paused, ct: s._node.currentTime, vol: s._node.volume, ready: s._node.readyState, err: s._node.error && s._node.error.code };
    } catch (e) {}
    return {
      src: h._src,
      html5: h._html5,
      state: h._state,       // 'unloaded' | 'loading' | 'loaded'
      playing: h.playing(),
      volume: h.volume(),
      duration: h.duration(),
      node,
    };
  });

  return {
    currentSongId: after.currentSongId,
    isPlaying: after.isPlaying,
    howlerInfo,
    howls,
  };
});

console.log(">> RESULT:", JSON.stringify(result, null, 2));

await browser.close();
