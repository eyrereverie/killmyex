const archetypes = {
  techie: {
    key: "techie",
    name: "El Techie",
    label: "EL TECHIE",
    defaultName: "test",
    toxicPhrase: "No tengo bandwidth emocional.",
    sprite: "techie",
    projectile: ["404", "visto", "luego", "sin bandwidth", "bug emocional"],
    special: "Emotional 404"
  },
  hipster: {
    key: "hipster",
    name: "El Interesante",
    label: "EL INTERESANTE",
    defaultName: "Hipster",
    toxicPhrase: "No me gustan las etiquetas.",
    sprite: "hipster",
    projectile: ["labels", "indie", "yo antes", "qué mainstream", "no sé"],
    special: "Ironía defensiva"
  },
  casi: {
    key: "casi",
    name: "Ex Ambiguo",
    label: "EX AMBIGUO",
    defaultName: "Casi Algo",
    toxicPhrase: "A ver cuándo nos vemos.",
    sprite: "casi",
    projectile: ["algún día", "vemos", "quizá", "jaja", "te aviso"],
    special: "Señales mixtas"
  },
  fuckboy: {
    key: "fuckboy",
    name: "Charm Tóxico",
    label: "CHARM TÓXICO",
    defaultName: "Fuckboy",
    toxicPhrase: "No busco nada serio.",
    sprite: "fuckboy",
    projectile: ["bb", "no serio", "te extraño", "🔥", "mi vida"],
    special: "Love bombing"
  },
  intelectual: {
    key: "intelectual",
    name: "El Deconstruido",
    label: "EL DECONSTRUIDO",
    defaultName: "Intelectual",
    toxicPhrase: "Eso es una construcción social.",
    sprite: "intelectual",
    projectile: ["teoría", "discurso", "Foucault", "fluidez", "contexto"],
    special: "Discurso infinito"
  },
  musico: {
    key: "musico",
    name: "El Sensible",
    label: "EL SENSIBLE",
    defaultName: "Músico",
    toxicPhrase: "Estoy en un proceso creativo.",
    sprite: "musico",
    projectile: ["playlist", "audio", "canción", "proceso", "drama"],
    special: "Playlist maldita"
  },
  gym: {
    key: "gym",
    name: "Espiritual Fit",
    label: "ESPIRITUAL FIT",
    defaultName: "Gym Bro",
    toxicPhrase: "Tienes que elevar tu vibración.",
    sprite: "gym",
    projectile: ["vibra", "zen", "shaker", "ego", "sana tú"],
    special: "Gaslighting zen"
  },
  mama: {
    key: "mama",
    name: "Dependencia Premium",
    label: "DEPENDENCIA PREMIUM",
    defaultName: "Niño de Mamá",
    toxicPhrase: "Mi mamá dice que...",
    sprite: "mama",
    projectile: ["mamá dice", "culpa", "táper", "no sé", "ayúdame"],
    special: "Culpa familiar"
  }
};

const initialState = () => ({
  onboarded: false,
  activeExId: null,
  selectedExId: null,
  battleExId: null,
  tombExId: null,
  exes: [],
  resources: { rabia: 0, claridad: 0, compost: 0 }
});

let state = loadState();

const screens = [...document.querySelectorAll(".screen")];
const navItems = [...document.querySelectorAll(".nav-item")];
let selectedArchetype = "techie";

function uid(){ return "ex_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2,6); }

function loadState(){
  try {
    const stored = localStorage.getItem("kmx_mvp_v1");
    if(stored) return JSON.parse(stored);
  } catch(e){}
  return initialState();
}
function saveState(){
  localStorage.setItem("kmx_mvp_v1", JSON.stringify(state));
}
function resetDemo(){
  state = initialState();
  const ex = makeEx({name:"test", archetype:"techie", toxicPhrase:archetypes.techie.toxicPhrase, epitaph:"Gracias por el update. Mi sistema ahora corre en paz."});
  state.exes.push(ex);
  state.activeExId = ex.id;
  state.onboarded = true;
  saveState();
  show("dashboard");
}
function makeEx({name, archetype, toxicPhrase, epitaph}){
  const a = archetypes[archetype] || archetypes.techie;
  return {
    id: uid(),
    name: name || a.defaultName,
    archetype: a.key,
    title: a.name,
    label: a.label,
    toxicPhrase: toxicPhrase || a.toxicPhrase,
    epitaph: epitaph || "",
    status: "active", // active | defeated | buried
    hp: 100,
    createdAt: new Date().toISOString(),
    defeatedAt: null,
    buriedAt: null,
    duelsWon: 0
  };
}
function getEx(id){ return state.exes.find(e => e.id === id); }
function activeEx(){ return getEx(state.activeExId) || state.exes.find(e => e.status !== "buried") || state.exes[0]; }
function currentDetailEx(){ return getEx(state.selectedExId) || activeEx(); }
function currentBattleEx(){ return getEx(state.battleExId) || activeEx(); }
function tombEx(){ return getEx(state.tombExId) || state.exes.find(e=>e.status==="buried") || activeEx(); }

function show(id){
  screens.forEach(s => s.classList.remove("active"));
  const screen = document.getElementById(id);
  if(!screen) return;
  screen.classList.add("active");
  navItems.forEach(n => n.classList.toggle("active", n.dataset.screen === id));
  document.getElementById("statusTitle").textContent = titleFor(id);
  stopBattle();
  render();
}
function titleFor(id){
  return ({
    splash:"Kill My Ex",
    onboarding:"Welcome",
    dashboard:"Home",
    exes:"Mis Exes",
    create:"Crear",
    exDetail:"Detalle",
    pending:"Por enterrar",
    cemetery:"Cementerio",
    tombDetail:"Tumba",
    battleIntro:"Duelo",
    battle:"Combate",
    result:"Resultado",
    settings:"Ajustes",
    concepts:"Concept"
  })[id] || "Kill My Ex";
}
function toast(msg){
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(()=>el.classList.remove("show"), 1700);
}

document.addEventListener("click", (e) => {
  const screenBtn = e.target.closest("[data-screen]");
  if(screenBtn){
    const target = screenBtn.dataset.screen;
    if(target === "create"){
      prepareCreate();
    }
    show(target);
  }
  const action = e.target.closest("[data-action]")?.dataset.action;
  if(action === "start"){
    show(state.onboarded ? "dashboard" : "onboarding");
  }
  if(action === "skip-onboarding"){
    state.onboarded = true; saveState(); show("dashboard");
  }
});

function setupArchetypePicker(){
  const picker = document.getElementById("archetypePicker");
  picker.innerHTML = Object.values(archetypes).map(a => `
    <button type="button" class="archetype-option ${a.key===selectedArchetype?'selected':''}" data-archetype="${a.key}">
      <span class="sprite ${a.sprite}"></span>
      <b>${a.defaultName}</b>
      <small>${a.label}</small>
    </button>
  `).join("");
  picker.querySelectorAll("[data-archetype]").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedArchetype = btn.dataset.archetype;
      const a = archetypes[selectedArchetype];
      document.getElementById("exName").value = selectedArchetype === "techie" ? "test" : a.defaultName;
      document.getElementById("toxicPhrase").value = a.toxicPhrase;
      setupArchetypePicker();
      renderCreatePreview();
    });
  });
}
function prepareCreate(){
  selectedArchetype = "techie";
  document.getElementById("exName").value = "test";
  document.getElementById("toxicPhrase").value = archetypes.techie.toxicPhrase;
  document.getElementById("epitaph").value = "";
  setupArchetypePicker();
  renderCreatePreview();
}
["exName","toxicPhrase","epitaph"].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener("input", renderCreatePreview);
});
document.getElementById("createSubmit").addEventListener("click", () => {
  const ex = makeEx({
    name: document.getElementById("exName").value.trim() || "test",
    archetype: selectedArchetype,
    toxicPhrase: document.getElementById("toxicPhrase").value.trim(),
    epitaph: document.getElementById("epitaph").value.trim()
  });
  state.exes.push(ex);
  state.activeExId = ex.id;
  state.selectedExId = ex.id;
  state.onboarded = true;
  saveState();
  toast("Ex creado");
  show("dashboard");
});
function renderCreatePreview(){
  const a = archetypes[selectedArchetype] || archetypes.techie;
  const name = document.getElementById("exName").value.trim() || "test";
  const phrase = document.getElementById("toxicPhrase").value.trim() || a.toxicPhrase;
  document.getElementById("createPreview").innerHTML = `
    <span class="sprite ${a.sprite} large"></span>
    <h3>${escapeHTML(name)}</h3>
    <p>${a.label}</p>
    <div class="quote">“${escapeHTML(phrase)}”</div>
  `;
}

function render(){
  setupArchetypePicker();
  renderCreatePreview();
  renderDashboard();
  renderExList();
  renderDetail();
  renderPending();
  renderCemetery();
  renderTombDetail();
  renderBattleIntro();
}

function renderDashboard(){
  const has = state.exes.length > 0;
  document.getElementById("dashboardEmpty").hidden = has;
  document.getElementById("dashboardContent").hidden = !has;
  if(!has) return;
  const ex = activeEx();
  if(!state.activeExId && ex) state.activeExId = ex.id;
  const a = archetypes[ex.archetype] || archetypes.techie;
  document.getElementById("activeSprite").className = `sprite ${a.sprite} large`;
  document.getElementById("activeExName").textContent = ex.name;
  document.getElementById("activeExType").textContent = ex.label;
  document.getElementById("activeExStatus").textContent = statusLabel(ex);
  document.getElementById("statExes").textContent = state.exes.length;
  document.getElementById("statBuried").textContent = state.exes.filter(e=>e.status==="buried").length;
  document.getElementById("statPending").textContent = state.exes.filter(e=>e.status==="defeated").length;

  const battleBtn = document.getElementById("dashboardBattleBtn");
  battleBtn.textContent = ex.status === "defeated" ? "Ver resultado / Enterrar" : ex.status === "buried" ? "Desenterrar para jugar" : "Iniciar duelo";
  battleBtn.onclick = () => {
    if(ex.status === "defeated"){
      state.battleExId = ex.id; saveState(); show("result");
    } else if(ex.status === "buried"){
      state.tombExId = ex.id; saveState(); show("tombDetail");
    } else {
      state.battleExId = ex.id; saveState(); show("battleIntro");
    }
  };

  const pending = state.exes.filter(e=>e.status==="defeated").slice(0,2);
  document.getElementById("dashPendingList").innerHTML = pending.length ? pending.map(e => `
    <div class="mini-item"><span>${escapeHTML(e.name)}</span><button onclick="selectAndShow('${e.id}','result')">Enterrar</button></div>
  `).join("") : `<div class="mini-item"><span>No hay pendientes</span><span>♥</span></div>`;
}
function statusLabel(ex){
  if(ex.status === "buried") return "descansando en el cementerio";
  if(ex.status === "defeated") return "listo para enterrar";
  return "listo para duelo";
}
function renderExList(){
  const list = document.getElementById("exList");
  if(!state.exes.length){
    list.innerHTML = `<div class="empty-state"><div class="empty-heart">♡</div><p>Aún no hay exes.</p></div>`;
    return;
  }
  list.innerHTML = state.exes.map(e => {
    const a = archetypes[e.archetype] || archetypes.techie;
    return `
      <article class="ex-row">
        <span class="sprite ${a.sprite}"></span>
        <div class="info">
          <h3>${escapeHTML(e.name)}</h3>
          <p>${e.label}</p>
          <small>${statusLabel(e)}</small>
          ${state.activeExId===e.id ? `<span class="badge">ACTIVO</span>` : ``}
        </div>
        <button onclick="selectAndShow('${e.id}','exDetail')">Ver</button>
      </article>
    `;
  }).join("");
}
function renderDetail(){
  const ex = currentDetailEx();
  const card = document.getElementById("exDetailCard");
  if(!ex){ card.innerHTML = `<p>No hay ex seleccionado.</p>`; return; }
  const a = archetypes[ex.archetype] || archetypes.techie;
  card.innerHTML = `
    <span class="sprite ${a.sprite} large"></span>
    <h2>${escapeHTML(ex.name)}</h2>
    <p>${ex.label}</p>
    <div class="quote">“${escapeHTML(ex.toxicPhrase)}”</div>
    <small>Estado: ${statusLabel(ex)}</small><br/>
    <small>Duelos ganados: ${ex.duelsWon || 0}</small>
  `;
  document.getElementById("setActiveBtn").onclick = () => {
    state.activeExId = ex.id; saveState(); toast("Ex activo actualizado"); show("dashboard");
  };
  document.getElementById("detailBattleBtn").onclick = () => {
    if(ex.status==="buried"){ state.tombExId = ex.id; saveState(); show("tombDetail"); return; }
    state.battleExId = ex.id; state.activeExId = ex.id; saveState();
    show(ex.status==="defeated" ? "result" : "battleIntro");
  };
  document.getElementById("detailBuryBtn").style.display = ex.status === "defeated" ? "block" : "none";
  document.getElementById("detailBuryBtn").onclick = () => buryEx(ex.id);
  document.getElementById("deleteExBtn").onclick = () => {
    if(confirm(`¿Borrar a ${ex.name}?`)){
      state.exes = state.exes.filter(x=>x.id!==ex.id);
      if(state.activeExId === ex.id) state.activeExId = state.exes[0]?.id || null;
      saveState(); toast("Ex borrado"); show("exes");
    }
  };
}
function renderPending(){
  const pending = state.exes.filter(e => e.status === "defeated");
  const list = document.getElementById("pendingList");
  if(!pending.length){
    list.innerHTML = `<div class="empty-state"><div class="empty-heart">♡</div><h2>No hay entierros pendientes.</h2><p>Rompe un patrón en duelo para desbloquear una tumba.</p></div>`;
    return;
  }
  list.innerHTML = pending.map(e => {
    const a = archetypes[e.archetype] || archetypes.techie;
    return `
      <article class="ex-row">
        <span class="sprite ${a.sprite}"></span>
        <div class="info">
          <h3>${escapeHTML(e.name)}</h3>
          <p>${e.label}</p>
          <small>Listo para descansar.</small>
        </div>
        <button onclick="buryEx('${e.id}')">Enterrar</button>
      </article>
    `;
  }).join("");
}
function renderCemetery(){
  const grid = document.getElementById("cemeteryGrid");
  const buried = state.exes.filter(e=>e.status==="buried");
  const pending = state.exes.filter(e=>e.status==="defeated");
  let items = [];
  items.push(...buried.map(e => `<button class="grave buried" onclick="openTomb('${e.id}')">${escapeHTML(e.name)}<br/><small>${e.label}</small><br/>♥</button>`));
  items.push(...pending.map(e => `<button class="grave pending" onclick="selectAndShow('${e.id}','result')">${escapeHTML(e.name)}<br/><small>por enterrar</small></button>`));
  const futureCount = Math.max(4, 6 - items.length);
  for(let i=0;i<futureCount;i++) items.push(`<div class="grave empty">Futuro<br/>ex #${items.length+1}</div>`);
  grid.innerHTML = items.join("");
}
function renderTombDetail(){
  const ex = tombEx();
  const card = document.getElementById("tombDetailCard");
  if(!ex){ card.innerHTML = `<p>No hay tumba seleccionada.</p>`; return; }
  card.innerHTML = `
    <div class="tombstone">
      RIP<br/>
      ${escapeHTML(ex.name)}<br/>
      <small>${ex.label}</small>
    </div>
    <div class="quote">${escapeHTML(ex.epitaph || ex.toxicPhrase)}</div>
    <p>Enterrado: ${ex.buriedAt ? new Date(ex.buriedAt).toLocaleDateString() : "—"}</p>
  `;
  document.getElementById("unburyBtn").onclick = () => {
    ex.status = "active"; ex.buriedAt = null; state.activeExId = ex.id; saveState(); toast("Desenterrado"); show("dashboard");
  };
  document.getElementById("editEpitaphBtn").onclick = () => {
    const next = prompt("Editar epitafio:", ex.epitaph || ex.toxicPhrase);
    if(next !== null){ ex.epitaph = next.trim(); saveState(); renderTombDetail(); toast("Epitafio guardado"); }
  };
}
function renderBattleIntro(){
  const ex = currentBattleEx();
  if(!ex) return;
  const a = archetypes[ex.archetype] || archetypes.techie;
  document.getElementById("versusBossSprite").className = `sprite ${a.sprite} large`;
  document.getElementById("versusBossName").textContent = ex.name;
  document.getElementById("versusBossType").textContent = ex.label;
  document.getElementById("battleBossLabel").textContent = `${ex.name} / ${ex.label}`;
}
function selectAndShow(id, screen){
  state.selectedExId = id;
  state.activeExId = screen === "battleIntro" ? id : state.activeExId;
  state.battleExId = id;
  saveState();
  show(screen);
}
function openTomb(id){
  state.tombExId = id; saveState(); show("tombDetail");
}
function buryEx(id){
  const ex = getEx(id);
  if(!ex) return;
  ex.status = "buried";
  ex.buriedAt = new Date().toISOString();
  state.resources.compost += 1;
  if(state.activeExId === id) {
    state.activeExId = state.exes.find(e=>e.status==="active")?.id || id;
  }
  saveState();
  toast("Ex enterrado");
  state.tombExId = id;
  show("tombDetail");
}

document.getElementById("startBattleBtn").onclick = () => show("battle");
document.getElementById("battleExitBtn").onclick = () => show("dashboard");
document.getElementById("resultBuryBtn").onclick = () => {
  const ex = currentBattleEx();
  if(ex) buryEx(ex.id);
};
document.getElementById("seedBtn").onclick = resetDemo;
document.getElementById("resetBtn").onclick = () => {
  if(confirm("¿Borrar todo el progreso local?")){
    localStorage.removeItem("kmx_mvp_v1");
    state = initialState();
    toast("Progreso borrado");
    show("splash");
  }
};

function escapeHTML(str=""){
  return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

// Battle engine
const canvas = document.getElementById("battleCanvas");
const ctx = canvas.getContext("2d");
let raf = null, pointer = null, keys = {}, battle = null;

document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);
canvas.addEventListener("pointerdown", e => pointer = pointerPos(e));
canvas.addEventListener("pointermove", e => { if(pointer) pointer = pointerPos(e); });
canvas.addEventListener("pointerup", () => pointer = null);
canvas.addEventListener("pointercancel", () => pointer = null);

function pointerPos(e){
  const r = canvas.getBoundingClientRect();
  return { x: (e.clientX-r.left)*canvas.width/r.width, y: (e.clientY-r.top)*canvas.height/r.height };
}
function stopBattle(){
  if(raf) cancelAnimationFrame(raf);
  raf = null;
}
function startBattle(){
  const ex = currentBattleEx();
  if(!ex){ show("dashboard"); return; }
  const a = archetypes[ex.archetype] || archetypes.techie;
  battle = {
    exId: ex.id,
    archetype: a,
    p: {x:180,y:500,hp:100,cd:0,hitCd:0,clarity:0},
    b: {x:180,y:105,hp:100,cd:0,specialCd:230},
    shots: [],
    bullets: [],
    particles: [],
    t: 0,
    running: true
  };
  document.getElementById("powerBtn").classList.remove("ready");
  loopBattle();
}
function loopBattle(){
  if(!document.getElementById("battle").classList.contains("active")) return;
  if(!battle) startBattle();
  updateBattle();
  drawBattle();
  raf = requestAnimationFrame(loopBattle);
}
function updateBattle(){
  const p = battle.p, b = battle.b, a = battle.archetype;
  battle.t++;

  if(pointer){ p.x += (pointer.x - p.x)*0.18; p.y += (pointer.y - p.y)*0.13; }
  const speed = 4.2;
  if(keys.arrowleft || keys.a) p.x -= speed;
  if(keys.arrowright || keys.d) p.x += speed;
  if(keys.arrowup || keys.w) p.y -= speed;
  if(keys.arrowdown || keys.s) p.y += speed;
  p.x = clamp(p.x, 18, 342); p.y = clamp(p.y, 155, 535);

  b.x = 180 + Math.sin(battle.t/42)*80 + Math.sin(battle.t/15)*8;
  b.y = 105 + Math.sin(battle.t/60)*8;

  if(--p.cd <= 0){
    battle.shots.push({x:p.x, y:p.y-22, vx:0, vy:-7.2, power:1});
    if(p.clarity >= 100){
      battle.shots.push({x:p.x-13, y:p.y-22, vx:-0.3, vy:-7, power:0.7});
      battle.shots.push({x:p.x+13, y:p.y-22, vx:0.3, vy:-7, power:0.7});
    }
    p.cd = p.clarity >= 100 ? 7 : 10;
  }

  if(--b.cd <= 0){
    const txt = a.projectile[Math.floor(Math.random()*a.projectile.length)];
    const spread = Math.min(105, 55 + (100-b.hp)*0.5);
    battle.bullets.push({
      x:b.x+rand(-spread,spread), y:b.y+38, vx:rand(-1.2,1.2), vy:rand(1.9,3.3), w:42+Math.random()*16, txt
    });
    b.cd = Math.max(13, 36 - Math.floor((100-b.hp)/5));
  }

  if(--b.specialCd <= 0){
    for(let i=0;i<7;i++){
      battle.bullets.push({
        x:40+i*46, y:b.y+35, vx:(i-3)*0.18, vy:2.8, w:54, txt:a.special.slice(0,10)
      });
    }
    b.specialCd = 260;
  }

  battle.shots.forEach(s => {s.x += s.vx; s.y += s.vy;});
  battle.bullets.forEach(u => {u.x += u.vx; u.y += u.vy;});
  battle.particles.forEach(pt => {pt.x+=pt.vx; pt.y+=pt.vy; pt.life--;});

  for(const s of battle.shots){
    if(rectHit(s.x-4,s.y-12,8,18,b.x-43,b.y-45,86,92)){
      s.dead = true;
      b.hp -= 2.2 * s.power;
      p.clarity = clamp(p.clarity + 1.8, 0, 100);
      for(let i=0;i<3;i++) battle.particles.push({x:s.x,y:s.y,vx:rand(-1.5,1.5),vy:rand(-1.5,1.5),life:18});
    }
  }
  if(--p.hitCd < 0){
    for(const u of battle.bullets){
      if(rectHit(u.x-u.w/2,u.y-10,u.w,20,p.x-16,p.y-30,32,58)){
        u.dead = true;
        p.hp -= 8;
        p.clarity = clamp(p.clarity + 6, 0, 100);
        p.hitCd = 34;
      }
    }
  }

  battle.shots = battle.shots.filter(s=>!s.dead && s.y>-30);
  battle.bullets = battle.bullets.filter(u=>!u.dead && u.y<590);
  battle.particles = battle.particles.filter(pt=>pt.life>0);

  document.getElementById("bossHpBar").style.width = `${clamp(b.hp,0,100)}%`;
  document.getElementById("playerHpBar").style.width = `${clamp(p.hp,0,100)}%`;
  document.getElementById("clarityCount").textContent = Math.floor(p.clarity);
  document.getElementById("powerBtn").classList.toggle("ready", p.clarity >= 100);

  if(b.hp <= 0){
    const ex = getEx(battle.exId);
    if(ex){
      ex.status = "defeated";
      ex.defeatedAt = new Date().toISOString();
      ex.duelsWon = (ex.duelsWon || 0) + 1;
      state.activeExId = ex.id;
      state.battleExId = ex.id;
      state.resources.rabia += 20;
      state.resources.claridad += 35;
      saveState();
    }
    stopBattle();
    show("result");
  }
  if(p.hp <= 0){
    stopBattle();
    toast("Luz necesita un respiro");
    show("dashboard");
  }
}
document.getElementById("powerBtn").onclick = () => {
  if(!battle || battle.p.clarity < 100) return;
  battle.bullets = [];
  battle.b.hp -= 14;
  battle.p.clarity = 0;
  for(let i=0;i<18;i++) battle.particles.push({x:battle.p.x,y:battle.p.y-60,vx:rand(-4,4),vy:rand(-5,1),life:28});
};
function drawBattle(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = "#101510";
  ctx.fillRect(0,0,360,560);

  // Stars / scanlines
  ctx.fillStyle = "#b7c1a1";
  for(let i=0;i<50;i++){
    const x = (i*73 + battle.t*0.16) % 360;
    const y = (i*41) % 560;
    if(i%6===0) ctx.fillRect(x,y,2,2);
  }
  ctx.fillStyle = "rgba(255,255,255,.025)";
  for(let y=0;y<560;y+=12) ctx.fillRect(0,y,360,2);

  const b = battle.b, p = battle.p;
  // Boss sprite
  ctx.fillStyle="#050705";
  ctx.fillRect(b.x-38,b.y-18,76,72);
  ctx.fillStyle="#b7c1a1";
  ctx.fillRect(b.x-21,b.y-44,42,29);
  ctx.fillStyle="#111811";
  ctx.fillRect(b.x-31,b.y-51,62,18);
  ctx.fillStyle="#f6f6f0";
  ctx.fillRect(b.x-18,b.y-31,14,7);
  ctx.fillRect(b.x+5,b.y-31,14,7);
  ctx.fillStyle="#6e7566";
  ctx.fillRect(b.x-45,b.y+13,90,34);
  ctx.fillStyle="#0f140f";
  ctx.font="18px monospace";
  ctx.fillText("☠",b.x-9,b.y+38);

  // Player shots
  for(const s of battle.shots){
    ctx.fillStyle="#ff6b8e";
    ctx.fillRect(s.x-3,s.y-13,6,19);
    ctx.fillStyle="#f6f6f0";
    ctx.fillRect(s.x-1,s.y-18,2,5);
  }

  // Projectiles
  ctx.font="10px monospace";
  for(const u of battle.bullets){
    ctx.fillStyle="#f6f6f0";
    ctx.fillRect(u.x-u.w/2,u.y-10,u.w,20);
    ctx.strokeStyle="#050705";
    ctx.strokeRect(u.x-u.w/2,u.y-10,u.w,20);
    ctx.fillStyle="#050705";
    const txt = String(u.txt).slice(0,10);
    ctx.fillText(txt, u.x-u.w/2+4, u.y+4);
  }

  // Particles
  ctx.fillStyle="#ff6b8e";
  for(const pt of battle.particles) ctx.fillRect(pt.x,pt.y,3,3);

  // Player Luz
  ctx.fillStyle = p.hitCd > 0 ? "#ff6b8e" : "#101510";
  ctx.fillRect(p.x-15,p.y-8,30,36);
  ctx.fillStyle="#151a13";
  ctx.fillRect(p.x-19,p.y-31,38,26);
  ctx.fillStyle="#d7d2af";
  ctx.fillRect(p.x-12,p.y-22,24,15);
  ctx.fillStyle="#ff6b8e";
  ctx.font="16px monospace";
  ctx.fillText("♥",p.x-7,p.y+15);

  if(p.clarity >= 100){
    ctx.strokeStyle="#ff6b8e";
    ctx.lineWidth=2;
    ctx.strokeRect(p.x-24,p.y-38,48,72);
  }
}
function rectHit(ax,ay,aw,ah,bx,by,bw,bh){
  return ax < bx+bw && ax+aw > bx && ay < by+bh && ay+ah > by;
}
function rand(a,b){ return Math.random()*(b-a)+a; }
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }

// Start
if(!state.onboarded) show("splash");
else show("dashboard");
