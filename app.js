(function(){
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const density = document.getElementById('density');
  const charsetSel = document.getElementById('charset');
  const invert = document.getElementById('invert');
  const color = document.getElementById('color');
  const snapshotBtn = document.getElementById('snapshot');
  const fullscreenBtn = document.getElementById('fullscreen');

  const video = document.getElementById('video');
  const hiddenCanvas = document.getElementById('hiddenCanvas');
  const output = document.getElementById('output');

  let ctx, rafId, stream;

  async function start(){
    try{
      stream = await navigator.mediaDevices.getUserMedia({video:true,audio:false});
      video.srcObject = stream;
      await video.play();
      hiddenCanvas.width = video.videoWidth;
      hiddenCanvas.height = video.videoHeight;
      ctx = hiddenCanvas.getContext('2d');
      startBtn.disabled = true; stopBtn.disabled = false;
      loop();
    }catch(e){
      alert('Could not access camera. Make sure you allow camera access and you are running on localhost.');
      console.error(e);
    }
  }

  function stop(){
    if(stream){
      stream.getTracks().forEach(t=>t.stop());
      stream = null;
    }
    cancelAnimationFrame(rafId);
    startBtn.disabled = false; stopBtn.disabled = true;
  }

  function mapChar(bright, chars){
    const idx = Math.floor((bright/255) * (chars.length - 1));
    return chars[idx];
  }

  function loop(){
    const sampleSize = Math.max(2, Number(density.value));
    const chars = (charsetSel.value || '@%#*+=-:. ').split('').reverse();
    const w = video.videoWidth;
    const h = video.videoHeight;
    if(!w || !h) { rafId = requestAnimationFrame(loop); return; }

    // Draw scaled down image to sample grid
    const cols = Math.floor(w / sampleSize);
    const rows = Math.floor(h / sampleSize);
    // draw at same size then sample blocks
    ctx.drawImage(video, 0, 0, w, h);

    const img = ctx.getImageData(0, 0, w, h).data;
    let html = '';

    if(color.checked){
      // build HTML with colored spans
      for(let y=0;y<rows;y++){
        for(let x=0;x<cols;x++){
          const px = ( (y*sampleSize) * w + (x*sampleSize) ) * 4;
          const r = img[px];
          const g = img[px+1];
          const b = img[px+2];
          const bright = (r+g+b)/3;
          const ch = mapChar(invert.checked ? 255-bright : bright, chars);
          html += `<span style="color:rgb(${r},${g},${b})">${ch}</span>`;
        }
        html += '\n';
      }
      output.innerHTML = html;
    }else{
      // build plain text
      let lines = [];
      for(let y=0;y<rows;y++){
        let line = '';
        for(let x=0;x<cols;x++){
          const px = ( (y*sampleSize) * w + (x*sampleSize) ) * 4;
          const r = img[px];
          const g = img[px+1];
          const b = img[px+2];
          const bright = (r+g+b)/3;
          const ch = mapChar(invert.checked ? 255-bright : bright, chars);
          line += ch;
        }
        lines.push(line);
      }
      // Use textContent to avoid accidental rendering
      output.textContent = lines.join('\n');
    }

    rafId = requestAnimationFrame(loop);
  }

  snapshotBtn.addEventListener('click', ()=>{
    try{
      const s = document.createElement('a');
      const d = document.createElement('canvas');
      const ctx2 = d.getContext('2d');
      d.width = hiddenCanvas.width;
      d.height = hiddenCanvas.height;
      ctx2.drawImage(hiddenCanvas,0,0);
      s.href = d.toDataURL('image/png');
      s.download = 'ascii-snapshot.png';
      s.click();
    }catch(e){console.error(e)}
  });

  fullscreenBtn.addEventListener('click', ()=>{
    if(document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen();
  });

  startBtn.addEventListener('click', start);
  stopBtn.addEventListener('click', stop);

  // keyboard shortcuts: space toggles start/stop
  window.addEventListener('keydown', e=>{
    if(e.code === 'Space'){
      e.preventDefault();
      if(startBtn.disabled) stop(); else start();
    }
  });

  // When page hides, stop camera to save resources
  document.addEventListener('visibilitychange', ()=>{ if(document.hidden) stop(); });
})();