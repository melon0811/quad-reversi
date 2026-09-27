// Original procedural music and effects. No external recordings or audio assets.
export function createAudio(){
  let ctx=null, musicBus=null, effectBus=null, enabled=false, ticker=null, nextNote=0, beat=0;
  const musicNodes=new Set(), effectNodes=new Set();
  try{enabled=localStorage.getItem('quad-reversi-bgm')==='on'}catch{}
  const notes=[72,76,79,76,74,77,81,77,71,74,79,74,69,72,76,72,72,76,79,83,74,77,81,77,71,74,79,74,69,72,76,67];
  const hz=n=>440*2**((n-69)/12);
  function init(){
    if(ctx)return true;
    const Audio=globalThis.AudioContext||globalThis.webkitAudioContext;if(!Audio)return false;
    ctx=new Audio();musicBus=ctx.createGain();effectBus=ctx.createGain();musicBus.gain.value=.2;effectBus.gain.value=.45;
    musicBus.connect(ctx.destination);effectBus.connect(ctx.destination);return true;
  }
  function track(node,set){set.add(node);node.onended=()=>{set.delete(node);node.disconnect()};return node}
  function tone(freq,t,duration,volume,type,bus,set,endFreq){
    const osc=track(ctx.createOscillator(),set),gain=ctx.createGain();osc.type=type;osc.frequency.setValueAtTime(freq,t);
    if(endFreq)osc.frequency.exponentialRampToValueAtTime(endFreq,t+duration);
    gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(volume,t+.012);gain.gain.exponentialRampToValueAtTime(.0001,t+duration);
    osc.connect(gain);gain.connect(bus);osc.start(t);osc.stop(t+duration+.02);osc.addEventListener('ended',()=>gain.disconnect());
  }
  function noise(t,duration,volume,frequency,q=1){
    const buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*duration),ctx.sampleRate),data=buffer.getChannelData(0);
    for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;
    const source=track(ctx.createBufferSource(),effectNodes),filter=ctx.createBiquadFilter(),gain=ctx.createGain();source.buffer=buffer;
    filter.type='bandpass';filter.frequency.value=frequency;filter.Q.value=q;
    gain.gain.setValueAtTime(.0001,t);gain.gain.linearRampToValueAtTime(volume,t+Math.min(.025,duration/3));gain.gain.exponentialRampToValueAtTime(.0001,t+duration);
    source.connect(filter);filter.connect(gain);gain.connect(effectBus);source.start(t);source.stop(t+duration+.02);
    source.addEventListener('ended',()=>{filter.disconnect();gain.disconnect()});
  }
  function stopNodes(set){for(const node of set){try{node.stop();node.disconnect()}catch{}}set.clear()}
  function stopMusic(){if(ticker!==null)clearInterval(ticker);ticker=null;stopNodes(musicNodes)}
  function pump(){
    while(nextNote<ctx.currentTime+.18){
      tone(hz(notes[beat%notes.length]),nextNote,.44,.12,'sine',musicBus,musicNodes);
      if(beat%4===0)tone(hz([48,50,43,45][Math.floor(beat/8)%4]),nextNote,1.1,.10,'triangle',musicBus,musicNodes);
      beat++;nextNote+=1/3;
    }
  }
  function startMusic(){if(!enabled||!ctx||ctx.state!=='running'||document.hidden||ticker!==null)return;nextNote=ctx.currentTime+.04;beat=0;pump();ticker=setInterval(pump,100)}
  async function unlock(){try{if(!init())return false;if(ctx.state==='suspended')await ctx.resume();startMusic();return ctx.state==='running'}catch{return false}}
  async function toggle(){enabled=!enabled;try{localStorage.setItem('quad-reversi-bgm',enabled?'on':'off')}catch{}if(!enabled)stopMusic();await unlock();return enabled}
  function click(){if(!ctx||ctx.state!=='running'||document.hidden)return;const t=ctx.currentTime;noise(t,.055,.28,2600,.8);tone(950,t,.065,.18,'sine',effectBus,effectNodes,360)}
  function cheer(){
    if(!ctx||ctx.state!=='running'||document.hidden)return;const t=ctx.currentTime;
    // Layered claps and ascending voices create a short crowd-like celebration.
    for(let i=0;i<26;i++)noise(t+Math.random()*1.45,.08+Math.random()*.12,.07,1000+Math.random()*2300,.7);
    for(let i=0;i<9;i++){const f=220+Math.random()*170;tone(f,t+.08+Math.random()*.35,1.2,.013,'triangle',effectBus,effectNodes,f*1.35)}
    [72,76,79,84].forEach((n,i)=>tone(hz(n),t+i*.12,.55,.075,'sine',effectBus,effectNodes));
  }
  function stopEffects(){stopNodes(effectNodes)}
  document.addEventListener('visibilitychange',()=>{if(document.hidden){stopMusic();stopEffects();if(ctx)ctx.suspend().catch(()=>{})}else if(ctx)unlock()});
  return {unlock,toggle,click,cheer,stopEffects,get enabled(){return enabled}};
}
