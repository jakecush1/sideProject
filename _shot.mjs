import puppeteer from "puppeteer-core";
const OUT=process.argv[2]||"/private/tmp/claude-501/-Users-jacob-Desktop-AI-websites-gilded-minstrels/722d3bf7-babe-4921-8837-be8b562248bb/scratchpad/x.png";
const enter=process.argv[3]!=="start";
const b=await puppeteer.launch({executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",headless:"new",args:["--autoplay-policy=no-user-gesture-required","--no-sandbox","--use-gl=angle","--use-angle=swiftshader","--enable-webgl","--ignore-gpu-blocklist"]});
const p=await b.newPage();await p.setViewport({width:1280,height:800});
p.on("pageerror",e=>console.log("[pageerror]",e.message));
await p.goto("http://localhost:5174/",{waitUntil:"networkidle2"});
await new Promise(r=>setTimeout(r,2200));
if(enter){await p.evaluate(()=>{const x=[...document.querySelectorAll("button")].find(b=>/enter the tavern/i.test(b.textContent||""));x&&x.click();});await new Promise(r=>setTimeout(r,3800));}
await p.screenshot({path:OUT});console.log("saved",OUT);await b.close();
