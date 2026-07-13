import puppeteer from "puppeteer-core";
const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist", "--window-size=1280,800"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 800 });
await page.goto("https://susurrus.vercel.app/", { waitUntil: "networkidle2", timeout: 45000 }).catch(e=>console.log("nav:",e.message));
await new Promise((r) => setTimeout(r, 6000));
await page.screenshot({ path: "/private/tmp/claude-501/-Users-jacob-Desktop-AI-websites-gilded-minstrels/722d3bf7-babe-4921-8837-be8b562248bb/scratchpad/ref1.png" });
// try clicking to enter if there's a gate
await page.mouse.click(640, 400);
await new Promise((r) => setTimeout(r, 5000));
await page.screenshot({ path: "/private/tmp/claude-501/-Users-jacob-Desktop-AI-websites-gilded-minstrels/722d3bf7-babe-4921-8837-be8b562248bb/scratchpad/ref2.png" });
console.log("done");
await browser.close();
