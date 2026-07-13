import puppeteer from "puppeteer-core";
const S="/private/tmp/claude-501/-Users-jacob-Desktop-AI-websites-gilded-minstrels/722d3bf7-babe-4921-8837-be8b562248bb/scratchpad/";
const b=await puppeteer.launch({executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",headless:"new",args:["--autoplay-policy=no-user-gesture-required","--no-sandbox","--use-gl=angle","--use-angle=swiftshader","--enable-webgl","--ignore-gpu-blocklist"]});
const p=await b.newPage();await p.setViewport({width:1280,height:800});
p.on("pageerror",e=>console.log("[pageerror]",e.message));
await p.goto("http://localhost:5174/",{waitUntil:"networkidle2"});
await new Promise(r=>setTimeout(r,2200));
await p.evaluate(()=>{const x=[...document.querySelectorAll("button")].find(b=>/enter the tavern/i.test(b.textContent||""));x&&x.click();});
await new Promise(r=>setTimeout(r,3800));
// click empty floor area (foreground, below stage)
await p.mouse.click(950,620);
await new Promise(r=>setTimeout(r,450));
await p.screenshot({path:S+"bottle_air.png"});
await new Promise(r=>setTimeout(r,1600));
await p.screenshot({path:S+"bottle_settled.png"});
const n=await p.evaluate(()=>window.__store.getState().bottleSpawnNonce);
console.log("nonce after click:",n);
await b.close();
