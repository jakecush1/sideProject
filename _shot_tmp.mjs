import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--autoplay-policy=no-user-gesture-required", "--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
page.on("pageerror", (e) => console.log("[pageerror]", e.message));

await page.goto("http://localhost:5174/", { waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 2200));
await page.evaluate(() => {
  const btn = [...document.querySelectorAll("button")].find((b) => /enter the tavern/i.test(b.textContent || ""));
  if (btn) btn.click();
});
// let camera lerp settle toward the new zoomed-out default
await new Promise((r) => setTimeout(r, 4000));
// move the mouse to exercise parallax to one side
await page.mouse.move(1150, 300);
await new Promise((r) => setTimeout(r, 1500));

await page.screenshot({ path: process.argv[2] || "shot.png" });
console.log("shot saved");
await browser.close();
