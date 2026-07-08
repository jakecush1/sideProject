import puppeteer from 'puppeteer-core';
const CHROME='/home/claude/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome';
(async () => {
  const b = await puppeteer.launch({executablePath:CHROME,headless:'new',
    args:['--no-sandbox','--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader','--no-proxy-server','--proxy-bypass-list=*','--disable-dev-shm-usage']});
  const p = await b.newPage();
  await p.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded',timeout:20000});
  await new Promise(r=>setTimeout(r,2600));
  for (const x of await p.$$('button')){const t=await p.evaluate(e=>e.textContent,x);if(t&&t.includes('Enter the Tavern')){await x.click();break;}}
  await new Promise(r=>setTimeout(r,3000));
  const info = await p.evaluate(()=>{
    const cv=document.querySelector('canvas');
    if(!cv) return 'no canvas';
    const keys = Object.keys(cv).filter(k=>k.includes('r3f')||k.includes('R3F'));
    const r3f = cv.__r3f;
    let shape='';
    if(r3f){ shape='__r3f keys: '+Object.keys(r3f).join(','); 
      if(r3f.store) shape+=' | has store, stateKeys: '+Object.keys(r3f.store.getState()).slice(0,8).join(',');
      if(r3f.root) shape+=' | has root';
      if(r3f.fiber) shape+=' | has fiber';
    } else { shape='no __r3f; dom keys: '+keys.join(','); }
    return shape;
  });
  console.log(info);
  await b.close();
})();
