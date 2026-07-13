import puppeteer from "puppeteer-core";
const b=await puppeteer.launch({executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",headless:"new",args:["--autoplay-policy=no-user-gesture-required","--no-sandbox","--use-gl=angle","--use-angle=swiftshader","--enable-webgl","--ignore-gpu-blocklist"]});
const p=await b.newPage();await p.setViewport({width:1280,height:800});
p.on("console",m=>{const t=m.text(); if(/bottle|Bottle|error|Error/.test(t))console.log("[c]",t);});
p.on("pageerror",e=>console.log("[pageerror]",e.message));
await p.goto("http://localhost:5173/",{waitUntil:"networkidle2"});
await new Promise(r=>setTimeout(r,2200));
await p.evaluate(()=>{const x=[...document.querySelectorAll("button")].find(b=>/enter the tavern/i.test(b.textContent||""));x&&x.click();});
await new Promise(r=>setTimeout(r,3000));
// find r3f store handle on canvas
const keys=await p.evaluate(()=>{const c=document.querySelector("canvas"); return c?Object.keys(c).filter(k=>k.includes("r3f")||k.includes("__")):"no canvas";});
console.log("canvas keys:",JSON.stringify(keys));
await p.evaluate(()=>window.__store.getState().spawnBottles([0,0,2.5]));
await new Promise(r=>setTimeout(r,300));
// try several ways to reach the scene and count cylinder meshes (bottles) by y position
const info=await p.evaluate(()=>{
  const c=document.querySelector("canvas");
  const r3f=c && c.__r3f;
  let store=null;
  if(r3f){ store = r3f.store || (r3f.root && r3f.root.store) || (r3f.root && r3f.root); }
  let state=null;
  try{ state = store && (store.getState?store.getState():store); }catch(e){}
  if(!state||!state.scene) return {reached:false, r3fKeys: r3f?Object.keys(r3f):null};
  let cylinders=0, groups=0, ys=[];
  state.scene.traverse(o=>{
    if(o.type==="Mesh" && o.geometry && o.geometry.type==="CylinderGeometry"){cylinders++; ys.push(+o.getWorldPosition(new (state.scene.constructor)().position.constructor()).y.toFixed?0:0);}
  });
  return {reached:true, cylinders, sceneChildren: state.scene.children.length};
});
console.log("SCENE:",JSON.stringify(info));
await b.close();
