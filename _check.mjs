import puppeteer from "puppeteer-core";
const S="/private/tmp/claude-501/-Users-jacob-Desktop-AI-websites-gilded-minstrels/722d3bf7-babe-4921-8837-be8b562248bb/scratchpad/";
const b=await puppeteer.launch({executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",headless:"new",args:["--autoplay-policy=no-user-gesture-required","--no-sandbox","--use-gl=angle","--use-angle=swiftshader","--enable-webgl","--ignore-gpu-blocklist"]});
const p=await b.newPage();await p.setViewport({width:1280,height:800});
p.on("pageerror",e=>console.log("[pageerror]",e.message));
await p.goto("http://localhost:5173/",{waitUntil:"networkidle2"});
await new Promise(r=>setTimeout(r,2200));
await p.evaluate(()=>{const x=[...document.querySelectorAll("button")].find(b=>/enter the tavern/i.test(b.textContent||""));x&&x.click();});
await new Promise(r=>setTimeout(r,3500));
// computed color of song list item + title
const colors=await p.evaluate(()=>{
  const items=[...document.querySelectorAll("*")].filter(e=>/Serfs and Wenches/.test(e.textContent)&&e.children.length===0);
  const title=[...document.querySelectorAll("*")].find(e=>/Songs of the Tavern/.test(e.textContent)&&e.children.length===0);
  const cs=e=>e?getComputedStyle(e).color:"n/a";
  return {songItem:cs(items[0]), panelTitle:cs(title)};
});
console.log("COLORS:",JSON.stringify(colors));
// spawn a burst at a clear foreground point via store
await p.evaluate(()=>window.__store.getState().spawnBottles([1.5,0,3.2]));
await new Promise(r=>setTimeout(r,700));
await p.screenshot({path:S+"b_air.png"});
await new Promise(r=>setTimeout(r,1400));
await p.screenshot({path:S+"b_set.png"});
await b.close();
