const CATS={trabalho:'Trabalho',pessoal:'Pessoal',estudos:'Estudos',saude:'Saúde',outros:'Outros'};
const KEY='agenda.v1';
const pad=n=>String(n).padStart(2,'0');
const iso=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const parse=s=>{const[a,b,c]=s.split('-').map(Number);return new Date(a,b-1,c)};
const addD=(s,n)=>{const d=parse(s);d.setDate(d.getDate()+n);return iso(d)};
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const TODAY=iso(new Date());
let items=[],sel=TODAY,anc=TODAY,view='month',cat='all',q='',shown=TODAY.slice(0,7);
const $=id=>document.getElementById(id);
const PT={prova:['Prova','--c-saude'],trabalho:['Trabalho','--c-trabalho'],viagem:['Viagem','--c-pessoal'],outro:['Outro','--c-estudos']};
let pers=[];try{pers=JSON.parse(localStorage.getItem('agenda.p1')||'[]')}catch(e){}
const saveP=()=>{try{localStorage.setItem('agenda.p1',JSON.stringify(pers))}catch(e){}};
const sf=s=>fmt(s,{day:'numeric',month:'short'});
function banners(a,b){return pers.filter(p=>p.s<=b&&p.e>=a).map(p=>{const n=Math.round((parse(p.e)-parse(p.s))/864e5)+1,x=Math.round((parse(sel)-parse(p.s))/864e5)+1;return `<div class='ban' style='--pc:var(${PT[p.k][1]})'><span class='dot' style='background:var(--pc)'></span><span><b>${PT[p.k][0]}: ${esc(p.n)}</b><br><span class='sub'>${sf(p.s)} a ${sf(p.e)}${view==='day'&&sel>=p.s&&sel<=p.e?' · dia '+x+' de '+n:''}</span></span></div>`}).join('')}
function periodsHTML(){return pers.length?pers.slice().sort((a,b)=>a.s.localeCompare(b.s)).map(p=>`<div class='pi' style='--pc:var(${PT[p.k][1]})'><button class='cat' data-d='${p.s}' style='flex:1;min-width:0'><span class='dot' style='background:var(--pc)'></span><span>${esc(p.n)}<br><span class='sub' style='font-size:12px'>${sf(p.s)} a ${sf(p.e)}</span></span></button><button class='ib' data-px='${p.id}' aria-label='Excluir período ${esc(p.n)}'>×</button></div>`).join(''):`<div class='sub'>Nenhum período ainda.</div>`}
let AC;document.addEventListener('click',()=>{try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();AC.resume()}catch(e){}});
const trig=i=>{const[h,m]=(i.h||'09:00').split(':').map(Number),d=parse(i.d);d.setHours(h,m,0,0);return d.getTime()-i.a*6e4};
function beep(){if(!AC)return;try{[0,.35,.7].forEach(t=>{const o=AC.createOscillator(),g=AC.createGain(),s=AC.currentTime+t;o.frequency.value=880;o.connect(g);g.connect(AC.destination);g.gain.setValueAtTime(.2,s);g.gain.exponentialRampToValueAtTime(.001,s+.25);o.start(s);o.stop(s+.3)})}catch(e){}}
function ring(i){beep();try{if(window.Notification&&Notification.permission==='granted')new Notification(i.t,{body:(i.h?i.h+' · ':'')+fmt(i.d,{day:'numeric',month:'long'})})}catch(e){}
const el=document.createElement('div');el.className='ring';el.innerHTML=`<span><b>${esc(i.t)}</b><br><span class='sub'>${i.h?i.h+' · ':''}${fmt(i.d,{day:'numeric',month:'long'})}</span></span><button>Soneca 10 min</button><button>Dispensar</button>`;
const[b1,b2]=el.querySelectorAll('button');b1.onclick=()=>{i.fired=false;i.sz=Date.now()+6e5;save();el.remove()};b2.onclick=()=>el.remove();$('rings').append(el)}
function tick(){const now=Date.now();let ch=false;items.forEach(i=>{if(i.a>=0&&!i.fired&&!i.done){const tr=i.sz||trig(i);if(tr<=now){i.fired=true;ch=true;if(now-tr<432e5)ring(i)}}});if(ch)save()}
function load(){try{const r=localStorage.getItem(KEY);if(r){items=JSON.parse(r);return}}catch(e){}
  items=[{t:'Reunião de planejamento',d:TODAY,h:'09:30',c:'trabalho'},{t:'Almoço com a família',d:TODAY,h:'12:30',c:'pessoal'},{t:'Consulta de rotina',d:addD(TODAY,1),h:'15:00',c:'saude'},{t:'Estudar para a prova',d:addD(TODAY,2),h:'19:00',c:'estudos'},{t:'Enviar relatório',d:addD(TODAY,-1),h:'',c:'trabalho'}].map((x,i)=>({...x,id:'s'+i,done:false}))}
function save(){try{localStorage.setItem(KEY,JSON.stringify(items))}catch(e){}}
const fmt=(s,o)=>parse(s).toLocaleDateString('pt-BR',o);
const byTime=(a,b)=>(a.h||'99').localeCompare(b.h||'99')||a.t.localeCompare(b.t);
const vis=i=>(cat==='all'||i.c===cat)&&(!q||i.t.toLowerCase().includes(q));
function itemHTML(i){return `<div class="item${i.done?' done':''}" style="--cc:var(--c-${i.c})"><input type="checkbox" data-t="${i.id}" ${i.done?'checked':''} aria-label="Concluir ${esc(i.t)}"><span class="tx">${esc(i.t)}</span>${i.h?`<time>${i.h}</time>`:''}${i.a>=0?`<span title='Alarme' aria-label='Alarme ativo'>🔔</span>`:''}<button class="x" data-x="${i.id}" aria-label="Excluir ${esc(i.t)}">×</button></div>`}
function group(title,arr,cls=''){return arr.length?`<section class="grp ${cls}"><h3>${title}</h3>${arr.sort(byTime).map(itemHTML).join('')}</section>`:''}
function render(){
  const [y,m]=shown.split('-').map(Number);
  $('mt').textContent=new Date(y,m-1,1).toLocaleDateString('pt-BR',{month:'long',year:'numeric'});
  let h=['D','S','T','Q','Q','S','S'].map(x=>`<div class="wd">${x}</div>`).join('');
  const first=new Date(y,m-1,1);const start=new Date(y,m-1,1-first.getDay());
  for(let k=0;k<42;k++){const d=new Date(start);d.setDate(start.getDate()+k);const s=iso(d);
    const has=items.some(i=>i.d===s&&!i.done);const p=pers.find(p=>p.s<=s&&s<=p.e);
    h+=`<button class="d${p?' per':''}${d.getMonth()!==m-1?' out':''}${s===TODAY?' today':''}${s===sel?' sel':''}" data-d="${s}"${p?` style='--pc:var(${PT[p.k][1]})' title='${esc(p.n)}'`:''} aria-label="${fmt(s,{day:'numeric',month:'long'})}">${d.getDate()}${has?'<i></i>':''}</button>`}
  $('cal').innerHTML=h;
  $('cats').innerHTML=`<button class="cat" data-c="all" aria-pressed="${cat==='all'}"><span class="dot" style="background:var(--ink)"></span>Todas<span class="n">${items.filter(i=>!i.done).length}</span></button>`+
    Object.entries(CATS).map(([k,v])=>`<button class="cat" data-c="${k}" aria-pressed="${cat===k}"><span class="dot" style="background:var(--c-${k})"></span>${v}<span class="n">${items.filter(i=>i.c===k&&!i.done).length}</span></button>`).join('');
  $('vd').setAttribute('aria-pressed',view==='day');$('vw').setAttribute('aria-pressed',view==='week');$('vm').setAttribute('aria-pressed',view==='month');$('vg').setAttribute('aria-pressed',view==='goals');document.body.dataset.v=view;
  let out='';
  if(q){const r=items.filter(vis);$('title').textContent='Busca';$('sub').textContent=r.length+' resultado(s)';
    const ds=[...new Set(r.map(i=>i.d))].sort();out=ds.map(d=>group(fmt(d,{weekday:'long',day:'numeric',month:'long'}),r.filter(i=>i.d===d))).join('')}
  else if(view==='goals'){out=goalsHTML()}
  else if(view==='month'){out=monthHTML()}
  else if(view==='day'){
    $('title').textContent=sel===TODAY?'Hoje':fmt(sel,{weekday:'long'});
    const day=items.filter(i=>i.d===sel&&vis(i));const done=day.filter(i=>i.done).length;
    $('sub').innerHTML=fmt(sel,{day:'numeric',month:'long',year:'numeric'})+' · '+(day.length?`${done} de ${day.length} concluídos`:'sem compromissos')+(day.length?`<div class="prog"><b style="width:${done/day.length*100}%"></b></div>`:'');
    const late=sel===TODAY?items.filter(i=>i.d<TODAY&&!i.done&&vis(i)):[];
    out=group('Atrasados',late,'late')+(day.length?group('Agenda do dia',day):'<div class="empty">Nada marcado para este dia. Use o campo acima para adicionar.</div>')}
  else{
    const ws=addD(sel,-parse(sel).getDay());
    $('title').textContent='Semana';$('sub').textContent=fmt(ws,{day:'numeric',month:'short'})+' a '+fmt(addD(ws,6),{day:'numeric',month:'short'});
    for(let k=0;k<7;k++){const s=addD(ws,k);const day=items.filter(i=>i.d===s&&vis(i));
      out+=`<section class="grp"><h3>${fmt(s,{weekday:'long',day:'numeric'})}${s===TODAY?' (hoje)':''}</h3>${day.length?day.sort(byTime).map(itemHTML).join(''):'<div class="empty" style="padding:10px">Livre</div>'}</section>`}}
  const ra=view==='day'?sel:addD(sel,-parse(sel).getDay()),rb=view==='day'?sel:addD(ra,6);
  $('pl').innerHTML=periodsHTML();
  $('list').innerHTML=(q||view==='month'||view==='goals'?'':banners(ra,rb))+out;if(edit){const e=$('ed');if(e){e.focus();e.setSelectionRange(e.value.length,e.value.length)}}
}
document.addEventListener('click',e=>{const t=e.target.closest('[data-d],[data-c],[data-t],[data-x],[data-px],[data-a],[data-i],[data-ga],[data-gx],[data-v]');if(!t)return;
  if(t.dataset.d){sel=anc=t.dataset.d;shown=sel.slice(0,7);q='';$('q').value='';$('nd').value=sel}
  else if(t.dataset.c)cat=t.dataset.c;
  else if(t.dataset.t){const i=items.find(x=>x.id===t.dataset.t);i.done=t.checked;save()}
  else if(t.dataset.x){items=items.filter(x=>x.id!==t.dataset.x);save()}
  else if(t.dataset.px){pers=pers.filter(x=>x.id!==t.dataset.px);saveP()}
  else if(t.dataset.a){t.blur();act(t.dataset.a)}
  else if(t.dataset.i){chipClick(t.dataset.i)}
  else if(t.dataset.ga){addGoal(t.dataset.ga)}
  else if(t.dataset.gx){goals=goals.filter(g=>g.id!==t.dataset.gx);saveG()}
  else if(t.dataset.v){view=t.dataset.v}
  render()});
function shift(n){if(view==='day')sel=addD(sel,n);else if(view==='week')sel=addD(sel,7*n);else{const d=new Date(+sel.slice(0,4),+sel.slice(5,7)-1+n,1),last=new Date(d.getFullYear(),d.getMonth()+1,0).getDate();sel=iso(d).slice(0,8)+pad(Math.min(+sel.slice(8),last))}anc=sel;shown=sel.slice(0,7);render()}
$('prev').onclick=()=>shift(-1);$('next').onclick=()=>shift(1);
$('today').onclick=()=>{sel=anc=TODAY;shown=TODAY.slice(0,7);$('nd').value=TODAY;render()};
$('vd').onclick=()=>{view='day';render()};$('vw').onclick=()=>{view='week';render()};
$('q').oninput=e=>{q=e.target.value.trim().toLowerCase();render()};
function add(){const t=$('nt').value.trim();if(!t){$('nt').focus();return}
  const it={id:'i'+Date.now(),t,d:$('nd').value||sel,h:$('nh').value,c:$('nc').value,done:false,a:+$('na').value};
  if(it.a>=0){it.fired=trig(it)<=Date.now();try{if(window.Notification&&Notification.permission==='default')Notification.requestPermission()}catch(e){}}
  items.push(it);
  sel=anc=$('nd').value||sel;shown=sel.slice(0,7);$('nt').value='';$('nh').value='';save();render();$('nt').focus()}
$('go').onclick=add;$('nt').onkeydown=e=>{if(e.key==='Enter')add()};
$('nc').innerHTML=Object.entries(CATS).map(([k,v])=>`<option value="${k}">${v}</option>`).join('');
$('nd').value=TODAY;
$('pk').innerHTML=Object.entries(PT).map(([k,v])=>`<option value='${k}'>${v[0]}</option>`).join('');
$('ps').value=TODAY;$('pe').value=addD(TODAY,6);
$('ps').onchange=()=>{if($('pe').value<$('ps').value)$('pe').value=addD($('ps').value,6)};
$('pa').onclick=()=>{const n=$('pn').value.trim(),s=$('ps').value,e=$('pe').value;if(!n||!s||!e||e<s){$('pm').textContent='Informe o nome e um intervalo válido (o fim não pode ser antes do início).';return}$('pm').textContent='';pers.push({id:'p'+Date.now(),n,k:$('pk').value,s,e});saveP();sel=anc=s;shown=s.slice(0,7);$('pn').value='';render()};
let clip=[],hist=[],edit=null,editInit='',stMsg='',dn=false,lastC=0,lastD='';
const dd=(a,b)=>Math.round((parse(b)-parse(a))/864e5);
const rng=()=>anc<=sel?[anc,sel]:[sel,anc];
const snap=()=>{hist.push(JSON.stringify(items));if(hist.length>40)hist.shift()};
const newId=()=>'i'+Date.now()+Math.random().toString(36).slice(2,7);
const chip=i=>`<div class='chip${i.done?' done':''}' draggable='true' data-i='${i.id}' title='Clique para concluir · arraste para mover (Ctrl copia)' style='--cc:var(--c-${i.c})'>${i.h?`<b>${i.h}</b> `:''}${esc(i.t)}${i.a>=0?' 🔔':''}</div>`;
function monthHTML(){const[y,m]=shown.split('-').map(Number),f=new Date(y,m-1,1),st=addD(iso(f),-f.getDay()),[a,b]=rng(),n=dd(a,b)+1,k=items.filter(i=>i.d>=a&&i.d<=b&&vis(i)).length;
$('title').textContent=f.toLocaleDateString('pt-BR',{month:'long',year:'numeric'});
$('sub').textContent='Arraste para selecionar dias · digite para adicionar · Ctrl+C, V e Z funcionam';
let g=['dom','seg','ter','qua','qui','sex','sáb'].map(x=>`<div class='mh'>${x}</div>`).join('');
for(let j=0;j<42;j++){const s=addD(st,j),p=pers.find(p=>p.s<=s&&s<=p.e),day=items.filter(i=>i.d===s&&vis(i)).sort(byTime);
g+=`<div class='mc${s.slice(0,7)!==shown?' out':''}${s===TODAY?' today':''}${s>=a&&s<=b?' in':''}${s===sel?' cur':''}' data-m='${s}'${p?` style='--pc:var(${PT[p.k][1]})' title='${esc(p.n)}'`:''}><div class='mn'>${+s.slice(8)}${p?`<i class='pt'></i>`:''}</div>${day.slice(0,3).map(chip).join('')}${day.length>3?`<div class='more'>+${day.length-3}</div>`:''}${edit===s?`<input class='ed' id='ed' value='${esc(editInit)}' placeholder='Ex.: 14:30 Reunião' aria-label='Novo item'>`:''}</div>`}
const bar=[['copy','Copiar'],['cut','Recortar'],['paste','Colar'],['clear','Limpar'],['done','Concluir'],['per','Criar período'],['undo','Desfazer']].map(([k,v])=>`<button data-a='${k}'>${v}</button>`).join('');
return goalStrip()+`<div class='bar'>${bar}</div><div class='fx'><b>${sf(a)}${a!==b?' a '+sf(b):''}</b><span>${n} dia(s) · ${k} item(ns)${stMsg?' · '+esc(stMsg):''}</span></div><div class='mgrid'>${g}</div>`}
function act(a){const[x,y]=rng(),inR=items.filter(i=>i.d>=x&&i.d<=y&&vis(i));
if(a==='undo'){const h=hist.pop();if(h){items=JSON.parse(h);save();stMsg='Desfeito'}else stMsg='Nada para desfazer'}
else if(a==='copy'||a==='cut'){clip=inR.map(i=>({...i,o:dd(x,i.d)}));stMsg=clip.length+(a==='copy'?' item(ns) copiado(s)':' item(ns) recortado(s)');if(a==='cut'&&clip.length){snap();items=items.filter(i=>!inR.includes(i));save()}}
else if(a==='paste'){if(!clip.length)stMsg='Copie algo primeiro';else{snap();clip.forEach(c=>{const n={...c,id:newId(),d:addD(x,c.o),done:false};delete n.o;delete n.sz;n.fired=n.a>=0?trig(n)<=Date.now():false;items.push(n)});save();stMsg=clip.length+' item(ns) colado(s)'}}
else if(a==='clear'){if(inR.length){snap();items=items.filter(i=>!inR.includes(i));save();stMsg=inR.length+' item(ns) removido(s) · Ctrl+Z desfaz'}else stMsg='Nada para limpar'}
else if(a==='done'){if(inR.length){snap();const all=inR.every(i=>i.done);inR.forEach(i=>i.done=!all);save();stMsg=all?'Reabertos':'Concluídos'}}
else if(a==='per'){$('ps').value=x;$('pe').value=y;$('pm').textContent='Dê um nome ao período e clique em Criar período.';$('pn').focus()}
render()}
function chipClick(id){const i=items.find(x=>x.id===id);if(i){snap();i.done=!i.done;save()}}
function commit(v){const[x,y]=rng();edit=null;v=v.trim();if(!v){render();return}
let h='',t=v;const m=v.match(/^(\d{1,2})[:h](\d{2})\s+(.+)/);if(m&&+m[1]<24&&+m[2]<60){h=pad(m[1])+':'+m[2];t=m[3]}
snap();let c=0;for(let d=x;d<=y;d=addD(d,1),c++){const it={id:newId(),t,d,h,c:$('nc').value,done:false,a:+$('na').value};if(it.a>=0)it.fired=trig(it)<=Date.now();items.push(it)}
save();stMsg='Adicionado em '+c+' dia(s)';render()}
document.addEventListener('mousedown',e=>{const c=e.target.closest('.mc');if(!c||e.button||e.target.closest('.chip,.ed'))return;
const s=c.dataset.m,now=Date.now();e.preventDefault();if(edit){const el=$('ed');commit(el?el.value:'')}
if(s===lastD&&now-lastC<400){edit=s;editInit='';sel=anc=s;lastC=0;render();return}
lastD=s;lastC=now;stMsg='';sel=s;if(!e.shiftKey)anc=s;shown=s.slice(0,7);dn=true;render()});
document.addEventListener('mouseover',e=>{if(!dn)return;const c=e.target.closest('.mc');if(c&&c.dataset.m!==sel){sel=c.dataset.m;render()}});
document.addEventListener('mouseup',()=>{dn=false});
document.addEventListener('focusout',e=>{if(e.target.id==='ed'&&edit)commit(e.target.value)});
document.addEventListener('keydown',e=>{const T=e.target,k=e.key;
if(T.id==='ed'){if(k==='Enter'){e.preventDefault();commit(T.value)}else if(k==='Escape'){edit=null;render()}return}
if(view!=='month'||q||/^(INPUT|SELECT|TEXTAREA)$/.test(T.tagName)||(T.tagName==='BUTTON'&&(k==='Enter'||k===' ')))return;
const c=e.ctrlKey||e.metaKey,mv={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7}[k];
if(mv){e.preventDefault();sel=addD(sel,mv);if(!e.shiftKey)anc=sel;shown=sel.slice(0,7);stMsg='';render()}
else if(c&&'cxvz'.includes(k)){e.preventDefault();act({c:'copy',x:'cut',v:'paste',z:'undo'}[k])}
else if(k==='Delete'||k==='Backspace'){e.preventDefault();act('clear')}
else if(k==='Enter'||k==='F2'){e.preventDefault();edit=sel;editInit='';render()}
else if(k==='Escape'){anc=sel;render()}
else if(k.length===1&&!c&&!e.altKey){e.preventDefault();edit=sel;editInit=k;render()}});
document.addEventListener('dragstart',e=>{const c=e.target.closest&&e.target.closest('.chip');if(c){e.dataTransfer.setData('text/plain',c.dataset.i);e.dataTransfer.effectAllowed='copyMove'}});
document.addEventListener('dragover',e=>{if(e.target.closest&&e.target.closest('.mc'))e.preventDefault()});
document.addEventListener('drop',e=>{const c=e.target.closest&&e.target.closest('.mc');if(!c)return;e.preventDefault();const it=items.find(x=>x.id===e.dataTransfer.getData('text/plain'));if(!it)return;snap();
if(e.ctrlKey||e.altKey){const n={...it,id:newId(),d:c.dataset.m,done:false};delete n.sz;n.fired=n.a>=0?trig(n)<=Date.now():false;items.push(n);stMsg='Item copiado'}else{it.d=c.dataset.m;if(it.a>=0){delete it.sz;it.fired=trig(it)<=Date.now()}stMsg='Item movido'}
sel=anc=c.dataset.m;save();render()});
$('vm').onclick=()=>{view='month';render()};
$('vg').onclick=()=>{view='goals';render()};
let goals=[];try{goals=JSON.parse(localStorage.getItem('agenda.g1')||'[]')}catch(e){}
const saveG=()=>{try{localStorage.setItem('agenda.g1',JSON.stringify(goals))}catch(e){}};
const GN={year:'do ano',month:'do mês',week:'da semana'};
const goalKey=s=>s==='year'?sel.slice(0,4):s==='month'?sel.slice(0,7):addD(sel,-parse(sel).getDay());
function goalsHTML(){const ws=goalKey('week'),cap=s=>s[0].toUpperCase()+s.slice(1);
$('title').textContent='Metas';$('sub').textContent='Metas do ano, do mês e da semana da data selecionada. Use ‹ › para navegar.';
return [['year','Ano · '+sel.slice(0,4)],['month',cap(fmt(sel,{month:'long',year:'numeric'}))],['week','Semana · '+sf(ws)+' a '+sf(addD(ws,6))]].map(([s,label])=>{const k=goalKey(s),L=goals.filter(g=>g.s===s&&g.k===k),avg=L.length?Math.round(L.reduce((a,g)=>a+g.p,0)/L.length):0;
return `<section class='gs'><div class='gh'><h3>${label}</h3><span>${L.length?avg+'% concluído':'sem metas'}</span></div>${L.length?`<div class='prog'><b style='width:${avg}%'></b></div>`:''}${L.map(g=>`<div class='gi'><span class='gt'>${esc(g.t)}</span><input type='range' min='0' max='100' step='5' value='${g.p}' data-gp='${g.id}' aria-label='Progresso: ${esc(g.t)}'><span class='gp'>${g.p}%</span><button class='ib' data-gx='${g.id}' aria-label='Excluir meta ${esc(g.t)}'>×</button></div>`).join('')}<div class='ga'><input data-gn='${s}' placeholder='Nova meta ${GN[s]}' aria-label='Nova meta ${GN[s]}'><button data-ga='${s}'>Adicionar</button></div></section>`}).join('')}
function goalStrip(){const L=goals.filter(g=>(g.s==='month'&&g.k===sel.slice(0,7))||(g.s==='year'&&g.k===sel.slice(0,4)));return `<div class='gstrip'>🎯 <b>Metas</b>${L.length?L.map(g=>`<span class='gc'>${esc(g.t)}<i>${g.p}%</i></span>`).join(''):`<span class='sub' style='margin:0'>nenhuma para este mês</span>`}<button class='tb' data-v='goals'>Gerenciar</button></div>`}
function addGoal(s){const el=document.querySelector(`[data-gn='${s}']`),t=el?el.value.trim():'';if(!t){if(el)el.focus();return}goals.push({id:'g'+Date.now(),t,s,k:goalKey(s),p:0});saveG();render();const n=document.querySelector(`[data-gn='${s}']`);if(n)n.focus()}
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.dataset&&e.target.dataset.gn)addGoal(e.target.dataset.gn)});
document.addEventListener('input',e=>{const id=e.target.dataset&&e.target.dataset.gp,g=id&&goals.find(x=>x.id===id);if(g){g.p=+e.target.value;e.target.nextElementSibling.textContent=g.p+'%'}});
document.addEventListener('change',e=>{if(e.target.dataset&&e.target.dataset.gp){saveG();render()}});
const PG=['inicio','agenda','pesquisar','acessibilidade','contato','entrar'];let cur='inicio',stab='c',ci=0,cp=false,ctm,reg=false;
const LS={get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const S={theme:matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light',fs:1,hc:0,lf:0,ls:0,rm:matchMedia('(prefers-reduced-motion:reduce)').matches?1:0,...LS.get('agenda.a11y',{})};
let sess=LS.get('agenda.s',null);
function applyS(){const r=document.documentElement;r.dataset.theme=S.theme;r.style.setProperty('--fs',S.fs);['hc','lf','ls','rm'].forEach(k=>r.dataset[k]=S[k]);document.querySelectorAll('[data-s]').forEach(c=>c.checked=c.dataset.s==='dark'?S.theme==='dark':!!S[c.dataset.s]);$('fsv').textContent=Math.round(S.fs*100)+'%';LS.set('agenda.a11y',S);if(cur==='acessibilidade')contrast();carStart()}
document.addEventListener('change',e=>{const k=e.target.dataset&&e.target.dataset.s;if(!k)return;if(k==='dark')S.theme=e.target.checked?'dark':'light';else S[k]=+e.target.checked;applyS()});
document.addEventListener('click',e=>{const t=e.target.closest('[data-fs],#tt,#a-rs,[data-go],[data-st],[data-k],#ub');if(!t)return;
if(t.dataset.fs!==undefined){S.fs=t.dataset.fs==='0'?1:Math.min(1.6,Math.max(.8,Math.round((S.fs+.1*t.dataset.fs)*10)/10));applyS()}
else if(t.id==='tt'){S.theme=S.theme==='dark'?'light':'dark';applyS()}
else if(t.id==='a-rs'){Object.assign(S,{theme:'light',fs:1,hc:0,lf:0,ls:0,rm:0});applyS()}
else if(t.dataset.go){sel=anc=t.dataset.go;shown=sel.slice(0,7);view='day'}
else if(t.dataset.st){stab=t.dataset.st;search()}
else if(t.dataset.k!==undefined){const k=t.dataset.k;if(k==='p')cp=!cp;else ci=(k==='1'||k==='-1')?(ci+ +k+4)%4:+k;carRender();carStart()}
else if(t.id==='ub'){if(sess){sess=null;LS.set('agenda.s',null);userUI()}else location.hash='entrar'}});
const FE=[['Calendário tipo planilha','Selecione vários dias, digite direto na célula, copie, cole e desfaça com atalhos.'],['Períodos','Marque semanas de prova, trabalho ou viagem e veja tudo colorido no mês.'],['Metas','Defina metas do ano, do mês e da semana com barra de progresso.'],['Alarmes','Lembretes com soneca e notificação do navegador.'],['Modo claro e escuro','Tema que acompanha o sistema ou a sua escolha.'],['Acessibilidade','Fonte maior, alto contraste, espaçamento ampliado e menos animações.']];
const HS=[['Selecione','Clique ou arraste sobre os dias do mês.'],['Digite','Comece a digitar para criar um item. Ex.: 14:30 Reunião.'],['Organize','Arraste itens entre dias e use Ctrl+C, V e Z.'],['Acompanhe','Veja metas e períodos e ajuste o progresso.']];
$('fc').innerHTML=FE.map(([t,p])=>`<article class='card'><h3>${t}</h3><p>${p}</p></article>`).join('');
$('hc').innerHTML=HS.map(([t,p],i)=>`<article class='card'><span class='n' aria-hidden='true'>${i+1}</span><h3>${t}</h3><p>${p}</p></article>`).join('');
const R=(x,y,w,h,f,r=6)=>`<rect x='${x}' y='${y}' width='${w}' height='${h}' rx='${r}' fill='${f}'/>`;
const SV=[Array.from({length:28},(_,i)=>R(20+i%7*54,20+(i/7|0)*42,48,36,[3,9,10,17,22].includes(i)?'var(--accent)':'var(--line)')).join(''),[80,55,30].map((w,i)=>R(20,30+i*50,360,24,'var(--line)',12)+R(20,30+i*50,3.6*w,24,'var(--c-pessoal)',12)).join(''),`<circle cx='200' cy='100' r='70' fill='var(--accent)'/><path d='M200 55a30 30 0 0 1 30 30v25l10 15h-80l10-15V85a30 30 0 0 1 30-30z' fill='var(--accent-ink)'/><circle cx='200' cy='150' r='8' fill='var(--accent-ink)'/>`,`<rect width='200' height='200' fill='#0F161D'/><rect x='200' width='200' height='200' fill='#EEF2F5'/><text x='100' y='118' text-anchor='middle' font-size='60' fill='#E8EEF3'>Aa</text><text x='300' y='118' text-anchor='middle' font-size='60' fill='#16222E'>Aa</text>`];
const CT=['Calendário mensal em formato de planilha','Metas com barras de progresso','Alarmes com soneca','Modo claro e escuro com bom contraste'];
function carRender(){$('car').innerHTML=`<figure style='margin:0' aria-live='${cp?'polite':'off'}'><svg viewBox='0 0 400 200' role='img' aria-label='Ilustração: ${CT[ci]}'>${SV[ci]}</svg><figcaption>${CT[ci]}</figcaption></figure><div class='cc'><button data-k='-1' aria-label='Slide anterior'>‹</button><button data-k='1' aria-label='Próximo slide'>›</button><button data-k='p'>${cp?'Reproduzir':'Pausar'}</button><span class='dots'>${CT.map((_,i)=>`<button data-k='${i}' aria-label='Ir para o slide ${i+1}' aria-current='${i===ci}'></button>`).join('')}</span></div>`}
function carStart(){clearInterval(ctm);if(!S.rm&&!cp)ctm=setInterval(()=>{ci=(ci+1)%4;carRender()},6000)}
function search(){const q=$('sq').value.trim().toLowerCase(),m=s=>!q||s.toLowerCase().includes(q),sb=`class='sub' style='margin:0 0 0 auto'`;
const L={c:items.filter(i=>m(i.t)).sort((a,b)=>a.d.localeCompare(b.d)).map(i=>`<div class='row'><span class='dot' style='background:var(--c-${i.c});margin-top:7px'></span><a href='#agenda' data-go='${i.d}'>${esc(i.t)}</a><span ${sb}>${fmt(i.d,{day:'numeric',month:'short'})}${i.h?' · '+i.h:''}</span></div>`),m:goals.filter(g=>m(g.t)).map(g=>`<div class='row'><span>${esc(g.t)}</span><span ${sb}>${{year:'Ano',month:'Mês',week:'Semana'}[g.s]} · ${g.p}%</span></div>`),p:pers.filter(p=>m(p.n)).map(p=>`<div class='row'><span>${esc(p.n)}</span><span ${sb}>${PT[p.k][0]} · ${sf(p.s)} a ${sf(p.e)}</span></div>`),r:FE.concat(HS).filter(([t,p])=>m(t+' '+p)).map(([t,p])=>`<div class='row'><b>${t}</b><span class='sub' style='margin:0'>${p}</span></div>`)};
const N={c:'Compromissos',m:'Metas',p:'Períodos',r:'Recursos'};
$('st').innerHTML=Object.keys(N).map(k=>`<button role='tab' data-st='${k}' aria-selected='${k===stab}'>${N[k]} (${L[k].length})</button>`).join('');
$('sres').innerHTML=L[stab].join('')||`<div class='empty'>Nenhum resultado.</div>`}
$('sq').oninput=search;
const rgb=v=>{const e=document.createElement('i');e.style.color=`var(${v})`;document.body.append(e);const c=getComputedStyle(e).color.match(/[\d.]+/g).slice(0,3).map(Number);e.remove();return c};
const lum=c=>{const[r,g,b]=c.map(v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4});return .2126*r+.7152*g+.0722*b};
const cr=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const hex=c=>'#'+c.map(v=>Math.round(v).toString(16).padStart(2,'0')).join('').toUpperCase();
function contrast(){const P=[['Texto principal / fundo','--ink','--bg',4.5],['Texto principal / cartão','--ink','--surface',4.5],['Texto secundário / cartão','--muted','--surface',4.5],['Texto do botão / destaque','--accent-ink','--accent',4.5],['Destaque / cartão (componente)','--accent','--surface',3],['Trabalho / cartão','--c-trabalho','--surface',3],['Pessoal / cartão','--c-pessoal','--surface',3],['Estudos / cartão','--c-estudos','--surface',3],['Saúde / cartão','--c-saude','--surface',3],['Outros / cartão','--c-outros','--surface',3],['Alerta / fundo','--danger','--bg',4.5]];
$('ct').innerHTML=`<tr><th>Par de cores</th><th>Amostra</th><th>Razão</th><th>Mínimo AA</th><th>AA</th><th>AAA</th></tr>`+P.map(([n,f,b,min])=>{const r=cr(rgb(f),rgb(b));return `<tr><td>${n}</td><td><span style='color:var(${f});background:var(${b});padding:2px 10px;border:1px solid var(--line);border-radius:6px;font-weight:600'>Aa</span></td><td>${r.toFixed(2)}:1</td><td>${min}:1</td><td>${r>=min?'✓ Passa':'✗ Falha'}</td><td>${min===4.5?(r>=7?'✓ Passa':'✗ Não'):'n/a'}</td></tr>`}).join('');
const M=[['Fundo','--bg','Neutro frio: reduz o cansaço visual e dá espaço ao conteúdo.'],['Texto','--ink','Alto contraste com o fundo para leitura prolongada.'],['Destaque','--accent','Azul: confiança, foco e organização.'],['Pessoal','--c-pessoal','Verde: equilíbrio e bem-estar.'],['Estudos','--c-estudos','Violeta: criatividade e concentração.'],['Saúde','--c-saude','Vermelho-rosado: atenção e cuidado.'],['Alerta','--danger','Laranja: urgência moderada, usada em atrasos.']];
$('pal').innerHTML=M.map(([n,v,t])=>`<article class='card'><div style='height:44px;border-radius:8px;border:1px solid var(--line);background:var(${v});margin-bottom:8px'></div><h3>${n} · ${hex(rgb(v))}</h3><p>${t}</p></article>`).join('')}
const fld=(id,ok,msg)=>{const el=$(id);el.setAttribute('aria-invalid',!ok);el.setAttribute('aria-describedby','e-'+id);$('e-'+id).textContent=ok?'':msg;return ok};
$('cf').onsubmit=e=>{e.preventDefault();const v=id=>$(id).value.trim();
const r=[fld('nm',v('nm').length>=3,'Informe seu nome (mínimo 3 letras).'),fld('em',/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v('em')),'Informe um e-mail válido.'),fld('as',!!v('as'),'Escolha um assunto.'),fld('ms',v('ms').length>=10,'Escreva ao menos 10 caracteres.')];
const bad=['nm','em','as','ms'].find((_,i)=>!r[i]);if(bad){$(bad).focus();return}
const L=LS.get('agenda.msgs',[]);L.push({n:v('nm'),e:v('em'),a:v('as'),m:v('ms'),t:Date.now()});LS.set('agenda.msgs',L);e.target.reset();$('cok').hidden=false;$('cok').textContent='Mensagem registrada neste navegador. Obrigado!'};
const sha=async s=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(x=>x.toString(16).padStart(2,'0')).join('');
function userUI(){$('ub').textContent=sess?'Sair ('+sess.n+')':'Entrar'}
function loginMode(){$('ln').hidden=!reg;$('lt').textContent=reg?'Criar conta':'Entrar';$('l-b').textContent=reg?'Criar conta':'Entrar';$('l-m').textContent=reg?'Já tem conta? Entrar':'Não tem conta? Criar conta';$('l-err').textContent=''}
$('l-m').onclick=()=>{reg=!reg;loginMode()};
$('l-s').onchange=e=>{$('l-p').type=e.target.checked?'text':'password'};
$('lf').onsubmit=async e=>{e.preventDefault();const n=$('l-n').value.trim(),em=$('l-e').value.trim().toLowerCase(),p=$('l-p').value,er=$('l-err'),U=LS.get('agenda.users',{});
if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)||p.length<6||(reg&&n.length<2)){er.textContent='Preencha um e-mail válido, senha com 6+ caracteres'+(reg?' e seu nome.':'.');return}
try{const h=await sha(p);if(reg){if(U[em]){er.textContent='Este e-mail já tem conta.';return}U[em]={n,h};LS.set('agenda.users',U)}else if(!U[em]||U[em].h!==h){er.textContent='E-mail ou senha incorretos.';return}
sess={n:U[em].n,e:em};LS.set('agenda.s',sess);userUI();e.target.reset();reg=false;loginMode();location.hash='agenda'}catch(x){er.textContent='Seu navegador não permite criptografia aqui.'}};
function route(){const h=location.hash.slice(1);if(PG.includes(h))cur=h;PG.forEach(p=>$('pg-'+p).classList.toggle('on',p===cur));document.querySelectorAll('.top nav a').forEach(a=>a.getAttribute('href')==='#'+cur?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current'));if(cur==='agenda')render();if(cur==='pesquisar')search();if(cur==='acessibilidade')contrast();window.scrollTo(0,0)}
addEventListener('hashchange',route);
load();render();tick();setInterval(tick,15000);
applyS();carRender();userUI();loginMode();route();