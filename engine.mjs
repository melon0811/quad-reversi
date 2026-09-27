export const N=10, COLORS=['赤','青','黄','緑'];
export const DIR=[-1,0,1].flatMap(y=>[-1,0,1].filter(x=>x||y).map(x=>[x,y]));
export const zone=i=>{const x=i%10,y=Math.floor(i/10);return x>=3&&x<=6&&y>=3&&y<=6};
export function flips(board,i,color){if(board[i]!==-1)return [];const x=i%10,y=Math.floor(i/10),out=[];for(const [dx,dy] of DIR){let xx=x+dx,yy=y+dy,run=[];while(xx>=0&&xx<10&&yy>=0&&yy<10){const p=yy*10+xx,v=board[p];if(v===-1)break;if(v===color){if(run.length)out.push(...run);break}run.push(p);xx+=dx;yy+=dy}}return out}
export function legal(board,color){const out=[];for(let i=0;i<100;i++)if(board[i]===-1&&flips(board,i,color).length)out.push(i);return out}
export function play(board,i,color){const f=flips(board,i,color);if(!f.length)return null;const b=board.slice();b[i]=color;for(const p of f)b[p]=color;return b}
export function counts(board){return [0,1,2,3].map(c=>board.reduce((n,v)=>n+(v===c),0))}
export function nextTurn(board,order,from){for(let k=1;k<=4;k++){let ix=(from+k)%4;if(legal(board,order[ix]).length)return ix}return -1}
const edges=i=>{const x=i%10,y=Math.floor(i/10);return x===0||x===9||y===0||y===9};
const corners=new Set([0,9,90,99]);
function positional(i){const x=i%10,y=Math.floor(i/10);if(corners.has(i))return 45;if((x===1||x===8)&&(y===1||y===8))return -18;if(edges(i))return 10;if((x===1||x===8||y===1||y===8))return -3;return 0}
function evaluate(board,color,level){const ct=counts(board),mine=ct[color],rivals=Math.max(...ct.filter((_,j)=>j!==color));const occupied=ct.reduce((a,n)=>a+n,0);let score=(mine-rivals)*(level>=6?(occupied>=75?2:1.2):level>=5?1.15:1);if(level>=3){let pos=0;for(let i=0;i<100;i++)if(board[i]!==-1)pos+=positional(i)*(board[i]===color?1:-.34);score+=pos*(level===3?.45:.75);let myMoves=legal(board,color).length,other=0;for(let c=0;c<4;c++)if(c!==color)other+=legal(board,c).length;score+=(myMoves-other/3)*(level===3?1.5:2.4)}return score}
export function chooseMove(board,color,phase,level=3,random=Math.random,order=[0,1,2,3]){
 const options=phase==='placement'?board.map((v,i)=>v===-1&&zone(i)?i:-1).filter(i=>i>=0):legal(board,color);
 if(!options.length)return -1;
 // Placement deliberately ignores difficulty and proximity: every vacant zone cell is equally likely.
 if(phase==='placement')return options[Math.floor(random()*options.length)];
 const strength=Math.min(6,Math.max(2,level+1));let best=-Infinity,candidates=[];
 for(const i of options){const b=play(board,i,color);let score;
  if(strength===2)score=flips(board,i,color).length+positional(i)*.13+random()*2;
  else{score=evaluate(b,color,strength);
   if(strength>=4){const opp=order[(order.indexOf(color)+1)%4],response=legal(b,opp);
    if(response.length){let worst=Infinity;for(const j of response)worst=Math.min(worst,evaluate(play(b,j,opp),color,strength));
     score=strength===4?.65*score+.35*worst:strength===5?.4*score+.6*worst:.25*score+.75*worst}
   }score+=random()*.001;
  }
  if(score>best+1e-8){best=score;candidates=[i]}else if(Math.abs(score-best)<1e-8)candidates.push(i);
 }return candidates[Math.floor(random()*candidates.length)];
}
export function rankings(board){
 const scores=counts(board);
 return scores.map((score,color)=>({color,score,rank:1+scores.filter(n=>n>score).length})).sort((a,b)=>b.score-a.score||a.color-b.color);
}
export function newGame(random=Math.random){const order=[0,1,2,3];for(let i=3;i>0;i--){let j=Math.floor(random()*(i+1));[order[i],order[j]]=[order[j],order[i]]}return {board:Array(100).fill(-1),order,turn:0,phase:'placement',moves:0}}
export function step(game,i){const g={...game,board:game.board.slice()},c=g.order[g.turn];if(g.phase==='placement'){if(!zone(i)||g.board[i]!==-1)return null;g.board[i]=c;g.moves++;if(g.moves===16){g.phase='play';g.turn=nextTurn(g.board,g.order,3);if(g.turn<0)g.phase='end'}else g.turn=(g.turn+1)%4}else{const b=play(g.board,i,c);if(!b)return null;g.board=b;g.moves++;g.turn=nextTurn(g.board,g.order,g.turn);if(g.turn<0)g.phase='end'}return g}
