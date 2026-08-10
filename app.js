/* MoCo League HQ engine — shared by every league page. Per-league
   config lives in each page's inline <script> before this file. */
document.body.innerHTML = `
<header>
  <div class="brand">
    <div class="logo" id="league-logo"><img src="/icon.svg" alt="MoCo Fantasy Football" /></div>
    <div class="title">
      <h1 id="site-title">League HQ</h1>
      <p id="site-sub">Trophies · Records · Votes</p>
    </div>
  </div>
  <div class="head-actions">
    <a class="btn small" id="btn-sleeper" href="https://sleeper.com" target="_blank" rel="noopener">Open Sleeper ↗</a>
    <button class="btn small" id="btn-settings">⚙</button>
  </div>
</header>

<nav id="nav" class="hidden">
  <button class="tab active" data-view="home">Home</button>
  <button class="tab" data-view="owners">Owners</button>
  <button class="tab" data-view="vote">League Vote</button>
  <button class="tab" data-view="bank">Bank</button>
  <button class="tab" data-view="lottery">Lottery</button>
  <button class="tab" data-view="draft">Draft</button>
  <button class="tab" data-view="records">Record Book</button>
  <button class="tab" data-view="champs">Hall of Champions</button>
  <button class="tab" data-view="rules">Constitution</button>
</nav>

<main>
  <!-- ============ SETUP ============ -->
  <section id="view-setup" class="hidden">
    <div class="card" style="max-width:560px;margin:30px auto">
      <h2>Connect your Sleeper league</h2>
      <p class="sub">Everything on this site is powered by Sleeper's public API — no passwords needed, ever.</p>
      <label>Your Sleeper username (or a league ID)</label>
      <input type="text" id="setup-input" placeholder="e.g. draymond  —  or  1315074…" autocomplete="off" />
      <div id="setup-msg"></div>
      <div id="setup-leagues"></div>
      <div style="margin-top:14px">
        <button class="btn gold" id="setup-go">Find my league</button>
      </div>
    </div>
  </section>

  <!-- ============ HOME ============ -->
  <section id="view-home" class="hidden">
    <div id="home-champ"></div>
    <div id="home-sacko"></div>
    <div id="home-awards"></div>
    <div class="stats" id="home-stats"></div>
    <div class="grid2">
      <div class="card">
        <h2>🗳 On the Ballot</h2>
        <div id="home-ballot"></div>
      </div>
      <div class="card">
        <h2>What lives where</h2>
        <p class="sub" style="margin-bottom:0">
          <b>Sleeper</b> is for playing — rosters, waivers, trades, matchups.<br><br>
          <b>This site</b> is the league office — the
          <a href="#" data-goto="champs">banners we've hung</a>, the
          <a href="#" data-goto="records">records we chase</a>, the
          <a href="#" data-goto="vote">rules we vote on</a>, and the
          <a href="#" data-goto="rules">constitution we argue about</a>.
        </p>
      </div>
    </div>
  </section>

  <!-- ============ OWNERS ============ -->
  <section id="view-owners" class="hidden">
    <div class="card">
      <h2>🗂 The Owners</h2>
      <p class="sub">Twelve franchises, one trophy. Career numbers pulled from every season on record — grudges included.</p>
      <div class="bio-grid" id="owners-grid"></div>
    </div>
  </section>

  <!-- ============ VOTE ============ -->
  <section id="view-vote" class="hidden">
    <div class="card">
      <h2>Rule Changes on the Ballot</h2>
      <p class="sub">Voting is live and public — pick your name, make your calls, hit submit. The board below updates for the whole league.</p>
      <div id="prop-list"></div>
    </div>

    <div class="card" id="vote-setup-card" style="display:none">
      <h2>🔌 Turn on live voting</h2>
      <div id="store-dead-note"></div>
      <p class="sub">One tap creates the league's shared ballot box. Then post the link it gives you in the league chat — anyone who opens it is connected automatically. That's the whole setup.</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn gold" id="store-create">⚡ Create the ballot box</button>
      </div>
      <div id="store-out"></div>
      <details style="margin-top:14px">
        <summary style="cursor:pointer;color:var(--muted);font-size:13px">Auto-create not working? Manual route</summary>
        <p class="sub" style="margin-top:10px">
          1. Open <a href="https://jsonblob.com" target="_blank" rel="noopener"><b>jsonblob.com</b></a> in a new tab<br>
          2. Replace the sample text with <code>{"votes":{}}</code> and hit <b>Save</b><br>
          3. Copy the URL from your browser's address bar and paste it here:
        </p>
        <input type="text" id="store-url" placeholder="https://jsonblob.com/…" autocomplete="off" />
        <div style="margin-top:12px">
          <button class="btn gold" id="store-save">Use this ballot box</button>
        </div>
      </details>
    </div>

    <div class="card" id="vote-cast-card">
      <h2>🗳 Cast Your Vote</h2>
      <label>Who are you?</label>
      <select id="ballot-who"></select>
      <div id="ballot-props"></div>
      <div style="margin-top:14px">
        <button class="btn gold" id="vote-submit">Submit my votes</button>
      </div>
      <div id="vote-out"></div>
    </div>

    <div class="card">
      <h2>📊 Live Results</h2>
      <p class="sub">Public roll call — everyone sees who voted for what. Updates automatically.</p>
      <div id="live-results"></div>
    </div>

    <div class="card">
      <h2>📜 Make a Proposal</h2>
      <p class="sub">Got an idea? Post it here — when 3 hands go up, it's on the ballot for a league vote.</p>
      <label>Your name</label>
      <select id="prop-who"></select>
      <label>What kind of proposal?</label>
      <select id="prop-kind">
        <option value="rule">League rule change</option>
        <option value="bylaw">Bylaw amendment (changes the Constitution)</option>
      </select>
      <div id="prop-article-wrap" class="hidden">
        <label>Which article does it amend?</label>
        <select id="prop-article"></select>
      </div>
      <label>Proposal title</label>
      <input type="text" id="prop-title" placeholder="e.g. Add a 3rd IR spot" />
      <label>The pitch (why should we do this?)</label>
      <textarea id="prop-details" style="min-height:70px" placeholder="Make the case…"></textarea>
      <label>Answer options — leave blank for a simple Yes/No</label>
      <input type="text" id="prop-options" placeholder="Option A, Option B, Option C" />
      <div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn gold" id="prop-gen">Write it up</button>
        <button class="btn hidden" id="prop-copy">Copy for the chat</button>
      </div>
      <div id="prop-out"></div>
    </div>

  </section>

  <!-- ============ BANK ============ -->
  <section id="view-bank" class="hidden">
    <div class="grid2">
      <div class="card">
        <h2>💵 Dues</h2>
        <div class="onclock" style="margin-top:0">💸 <span class="t" id="bank-payto"></span></div>
        <div id="dues-status" class="sub"></div>
        <div id="dues-list"></div>
        <p class="sub" style="margin-top:14px">Sent your Zelle? Tap your own status to flip it to ✓ settled — it updates for the whole league.</p>
      </div>
      <div class="card">
        <h2>🏅 Weekly $25 Awards</h2>
        <div id="whs-sub" class="sub"></div>
        <div id="whs-list"></div>
      </div>
    </div>
    <div class="card">
      <h2>🤑 Winnings Leaderboard</h2>
      <p class="sub">Weekly high-score cash collected this season.</p>
      <div id="winnings"></div>
    </div>
  </section>

  <!-- ============ LOTTERY ============ -->
  <section id="view-lottery" class="hidden">
    <div class="card">
      <h2>🎰 Rookie Draft Lottery</h2>
      <p class="sub">Per Article IV: the non-playoff teams draw for the top picks — worse record, better odds. Playoff teams pick after, in reverse playoff finish; the champ always picks last. Run it live in front of the league.</p>
      <div id="lotto-status"></div>
      <div id="lotto-odds"></div>
      <div style="margin-top:14px;display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <button class="btn gold" id="lotto-run">🎱 Run the lottery</button>
        <span class="owner" id="lotto-note"></span>
      </div>
      <div id="lotto-stage"></div>
    </div>
  </section>

  <!-- ============ DRAFT ============ -->
  <section id="view-draft" class="hidden">
    <div class="card">
      <h2>📋 The Draft</h2>
      <div id="draft-info" class="sub"></div>
      <div id="draft-board" class="scrollx"></div>
    </div>
    <div class="card" id="draft-picks-card">
      <h2>Picks</h2>
      <div id="draft-picks"></div>
    </div>
  </section>

  <!-- ============ RECORD BOOK ============ -->
  <section id="view-records" class="hidden">
    <div class="card">
      <h2>📖 The Record Book</h2>
      <p class="sub">Every game this league has ever played on Sleeper, distilled into the numbers that matter. Records update as seasons are played.</p>
      <div id="records-list"></div>
    </div>
    <div class="card">
      <h2>Franchise All-Time Standings</h2>
      <p class="sub">Career regular-season records across every Sleeper season of this league.</p>
      <div id="franchise" class="scrollx"></div>
    </div>
    <div class="card">
      <h2>⚔️ All-Time Head-to-Head</h2>
      <p class="sub">Career records against every other owner (playoffs included). Read across: row vs column.</p>
      <div id="h2h" class="scrollx"></div>
    </div>
  </section>

  <!-- ============ HALL OF CHAMPIONS ============ -->
  <section id="view-champs" class="hidden">
    <div class="card">
      <h2>🏆 Hall of Champions</h2>
      <p class="sub">Every champion gets their jersey raised to the rafters — name stitched on, season on the chest. Below each one: the runner-up, the points king, and the Sacko (dead last, forever remembered).</p>
      <div id="champs-list"></div>
    </div>
  </section>

  <!-- ============ CONSTITUTION ============ -->
  <section id="view-rules" class="hidden">
    <div class="card">
      <h2>📕 League Constitution</h2>
      <p class="sub">The law of the land. Amending it takes a ballot: propose the change, get 3 hands up, win the vote.</p>
      <div style="margin-bottom:14px"><button class="btn gold small" id="rules-propose">📜 Propose an amendment</button></div>
      <div id="rules-list"></div>
    </div>
  </section>

  <!-- ============ SETTINGS ============ -->
  <section id="view-settings" class="hidden">
    <div class="card" style="max-width:560px">
      <h2>Settings</h2>
      <p class="sub">Connected league ID: <code id="settings-league-id">—</code></p>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn" id="btn-change-league">Change league</button>
        <button class="btn" id="btn-clear-cache">Refresh history cache</button>
      </div>
      <p class="sub" style="margin-top:16px">
        Past seasons are cached in your browser so the Record Book loads instantly.
        Use "Refresh history cache" if something looks stale.
      </p>
    </div>
  </section>

  <div id="global-msg"></div>
</main>

<footer>
  <span id="footer-est"></span>Built for the league · Data from the <a href="https://docs.sleeper.com" target="_blank" rel="noopener">Sleeper API</a> · Not affiliated with Sleeper
</footer>

<div id="a2hs" class="hidden">
  <img src="/icon-180.png" alt="" />
  <div class="txt">
    <b>Put the league in your pocket 🏈</b>
    <div class="steps" id="a2hs-steps"></div>
  </div>
  <button class="btn gold small hidden" id="a2hs-install">Install</button>
  <button class="x" id="a2hs-close" aria-label="Dismiss">✕</button>
</div>
`;

/* optional per-league branding (set BRAND in the page config) */
if (typeof BRAND !== "undefined" && BRAND) {
  const li = document.querySelector("#league-logo img");
  if (li && BRAND.icon) { li.src = BRAND.icon; if (BRAND.name) li.alt = BRAND.name; }
  const ai = document.querySelector("#a2hs img");
  if (ai && BRAND.iconPng) ai.src = BRAND.iconPng;
  if (BRAND.name) document.getElementById("site-title").textContent = BRAND.name;
}

const API = "https://api.sleeper.app/v1";
const CDN = "https://sleepercdn.com/avatars/thumbs/";

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const state = {
  leagueId: null,
  nfl: null,
  league: null,
  users: null,
  rosters: null,
  history: null,      // computed season summaries, newest first
  view: "home",
};

/* ---------------- tiny IndexedDB kv (history cache) ---------------- */
function idb() {
  return new Promise((res, rej) => {
    const r = indexedDB.open("leaguehq", 1);
    r.onupgradeneeded = () => r.result.createObjectStore("kv");
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
async function idbGet(key) {
  try {
    const db = await idb();
    return new Promise((res) => {
      const t = db.transaction("kv").objectStore("kv").get(key);
      t.onsuccess = () => res(t.result);
      t.onerror = () => res(undefined);
    });
  } catch { return undefined; }
}
async function idbSet(key, val) {
  try {
    const db = await idb();
    return new Promise((res) => {
      const t = db.transaction("kv", "readwrite").objectStore("kv").put(val, key);
      t.onsuccess = () => res(true);
      t.onerror = () => res(false);
    });
  } catch { return false; }
}
async function idbClear() {
  try {
    const db = await idb();
    db.transaction("kv", "readwrite").objectStore("kv").clear();
  } catch {}
}

/* ---------------- fetch helpers ---------------- */
async function api(path) {
  const r = await fetch(API + path);
  if (!r.ok) throw new Error(`Sleeper API ${r.status} on ${path}`);
  return r.json();
}
function avatarImg(avatarId, cls = "avatar", fallback = "🏈") {
  if (avatarId) return `<img class="${cls}" src="${esc(CDN + avatarId)}" alt="" loading="lazy" onerror="this.style.visibility='hidden'">`;
  return `<span class="${cls}" style="display:inline-flex;align-items:center;justify-content:center">${fallback}</span>`;
}

/* ---------------- boot ---------------- */
function currentLeagueId() {
  const params = new URLSearchParams(location.search);
  const box = normalizeStoreUrl(params.get("box") || "");
  if (box) localStorage.setItem("dhq_vote_store", box);
  const fromUrl = params.get("league");
  if (fromUrl) { localStorage.setItem("dhq_league", fromUrl); return fromUrl; }
  return localStorage.getItem("dhq_league") || DEFAULT_LEAGUE_ID || null;
}

async function boot() {
  state.leagueId = currentLeagueId();
  if (!state.leagueId) { showView("setup"); return; }
  showView("home");
  $("home-champ").innerHTML = loadingHtml("Loading league…");
  try {
    const [nfl, league, users, rosters] = await Promise.all([
      api("/state/nfl"),
      api(`/league/${state.leagueId}`),
      api(`/league/${state.leagueId}/users`),
      api(`/league/${state.leagueId}/rosters`),
    ]);
    Object.assign(state, { nfl, league, users, rosters });
    $("site-title").textContent = league.name || "League HQ";
    $("site-sub").textContent = `${league.season} · ${league.total_rosters} teams · Trophies · Records · Votes`;
    $("btn-sleeper").href = `https://sleeper.com/leagues/${state.leagueId}`;
    $("nav").classList.remove("hidden");
    $("settings-league-id").textContent = state.leagueId;
    renderHome();
    renderVote();
    renderRules();
    loadHistory().then(() => {
      renderHomeChamp();
      const oldest = (state.history || []).filter((s) => s.played).slice(-1)[0];
      if (oldest) $("footer-est").textContent = `${league.name || "The league"} · Est. ${oldest.season} · `;
    });
  } catch (e) {
    showView("setup");
    setMsg("setup-msg", "err", `Couldn't load league ${esc(state.leagueId)} — ${esc(e.message)}. Double-check the ID or look it up by username below.`);
  }
}

function loadingHtml(text) {
  return `<div class="loading"><span class="spinner"></span>${esc(text)}</div>`;
}
function setMsg(id, kind, html) {
  $(id).innerHTML = html ? `<div class="msg ${kind}">${html}</div>` : "";
}

/* ---------------- views / tabs ---------------- */
const VIEWS = ["setup", "home", "owners", "vote", "bank", "lottery", "draft", "records", "champs", "rules", "settings"];
function showView(v) {
  state.view = v;
  for (const x of VIEWS) $(`view-${x}`).classList.toggle("hidden", x !== v);
  document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t.dataset.view === v));
  if (v === "owners") renderOwners();
  if (v === "vote") renderVote();
  if (v === "bank") renderBank();
  if (v === "lottery") renderLottery();
  if (v === "draft") renderDraft();
  if (v === "records") renderRecords();
  if (v === "champs") renderChamps();
}
document.querySelectorAll(".tab").forEach((t) =>
  t.addEventListener("click", () => showView(t.dataset.view)));
document.addEventListener("click", (e) => {
  const g = e.target.closest("[data-goto]");
  if (g) { e.preventDefault(); showView(g.dataset.goto); }
});

$("btn-settings").addEventListener("click", () => showView(state.leagueId ? "settings" : "setup"));
$("btn-change-league").addEventListener("click", () => {
  localStorage.removeItem("dhq_league");
  history.replaceState(null, "", location.pathname);
  location.reload();
});
$("btn-clear-cache").addEventListener("click", async () => {
  await idbClear();
  location.reload();
});

/* ---------------- setup flow ---------------- */
$("setup-go").addEventListener("click", doSetup);
$("setup-input").addEventListener("keydown", (e) => { if (e.key === "Enter") doSetup(); });

async function doSetup() {
  const val = $("setup-input").value.trim();
  if (!val) return;
  setMsg("setup-msg", "info", "Looking that up…");
  $("setup-leagues").innerHTML = "";
  try {
    if (/^\d{8,}$/.test(val)) {
      await api(`/league/${val}`);
      selectLeague(val);
      return;
    }
    const user = await api(`/user/${encodeURIComponent(val)}`);
    if (!user || !user.user_id) throw new Error("user not found");
    const nfl = await api("/state/nfl");
    const seasons = [nfl.league_season, String(Number(nfl.league_season) - 1)];
    let leagues = [];
    for (const s of seasons) {
      leagues = await api(`/user/${user.user_id}/leagues/nfl/${s}`) || [];
      if (leagues.length) break;
    }
    if (!leagues.length) throw new Error(`no NFL leagues found for “${val}”`);
    setMsg("setup-msg", "ok", `Found ${leagues.length} league${leagues.length > 1 ? "s" : ""} for <b>${esc(user.display_name)}</b> — pick yours:`);
    $("setup-leagues").innerHTML = leagues.map((l) => `
      <button class="btn" style="display:flex;width:100%;text-align:left;align-items:center;gap:10px;margin-top:8px"
              data-league="${esc(l.league_id)}">
        ${avatarImg(l.avatar)}
        <span style="flex:1">${esc(l.name)}<br><span class="owner">${esc(l.season)} · ${l.total_rosters} teams</span></span>
      </button>`).join("");
    $("setup-leagues").querySelectorAll("[data-league]").forEach((b) =>
      b.addEventListener("click", () => selectLeague(b.dataset.league)));
  } catch (e) {
    setMsg("setup-msg", "err", esc(e.message));
  }
}
function selectLeague(id) {
  localStorage.setItem("dhq_league", id);
  history.replaceState(null, "", location.pathname);
  location.reload();
}

/* =====================================================================
   HISTORY ENGINE — walks the previous_league_id chain and turns every
   season into a summary: standings, champion, sacko, and every game
   played (for the record book + head-to-head).
   ===================================================================== */
function fpts(r) { return (r.settings.fpts || 0) + (r.settings.fpts_decimal || 0) / 100; }
function fptsAgainst(r) { return (r.settings.fpts_against || 0) + (r.settings.fpts_against_decimal || 0) / 100; }

async function summarizeSeason(leagueId, preloaded) {
  const cached = await idbGet(`season_${leagueId}`);
  if (cached && (cached.done || Date.now() - cached.ts < 3600 * 1000)) return cached.data;

  const league = preloaded ? preloaded.league : await api(`/league/${leagueId}`);
  const [users, rosters] = preloaded
    ? [preloaded.users, preloaded.rosters]
    : await Promise.all([api(`/league/${leagueId}/users`), api(`/league/${leagueId}/rosters`)]);

  const owners = {};
  for (const r of rosters) {
    const u = users.find((x) => x.user_id === r.owner_id);
    owners[r.roster_id] = {
      owner_id: r.owner_id || `roster${r.roster_id}`,
      name: (u && u.display_name) || `Team ${r.roster_id}`,
      teamName: (u && u.metadata && u.metadata.team_name) || (u && u.display_name) || `Team ${r.roster_id}`,
      avatar: u && u.avatar,
    };
  }

  const standings = rosters.map((r) => ({
    ...owners[r.roster_id],
    w: r.settings.wins || 0, l: r.settings.losses || 0, t: r.settings.ties || 0,
    pf: fpts(r), pa: fptsAgainst(r),
  })).sort((a, b) => (b.w - a.w) || (b.pf - a.pf));

  const played = standings.some((s) => s.w + s.l + s.t > 0);
  const playoffStart = (league.settings && league.settings.playoff_week_start) || 15;

  // every game, week by week (stop after two consecutive empty weeks)
  const games = [];
  if (played) {
    let empties = 0;
    for (let wk = 1; wk <= 18 && empties < 2; wk++) {
      let ms = [];
      try { ms = await api(`/league/${leagueId}/matchups/${wk}`) || []; } catch { ms = []; }
      const byId = {};
      let any = false;
      for (const m of ms) {
        if (m.matchup_id == null) continue;
        (byId[m.matchup_id] = byId[m.matchup_id] || []).push(m);
      }
      for (const pair of Object.values(byId)) {
        if (pair.length !== 2) continue;
        const [a, b] = pair;
        if ((a.points || 0) === 0 && (b.points || 0) === 0) continue; // unplayed
        any = true;
        games.push({
          week: wk, playoff: wk >= playoffStart,
          a: { o: owners[a.roster_id], pts: a.points || 0 },
          b: { o: owners[b.roster_id], pts: b.points || 0 },
        });
      }
      empties = any ? 0 : empties + 1;
    }
  }

  // champion via winners bracket
  let champion = null, runnerUp = null, done = false;
  try {
    const bracket = await api(`/league/${leagueId}/winners_bracket`);
    if (bracket && bracket.length) {
      const finalRound = Math.max(...bracket.map((m) => m.r));
      const fm = bracket.find((m) => m.r === finalRound && (m.p === 1 || m.p == null));
      if (fm && fm.w != null) {
        champion = owners[fm.w] || null;
        runnerUp = owners[fm.l] || null;
        done = true;
      }
    }
  } catch {}
  if (!done && String(league.season) < String((state.nfl && state.nfl.league_season) || "9999")) done = true; // old season, bracket missing

  const pointsChamp = played ? [...standings].sort((a, b) => b.pf - a.pf)[0] : null;
  const sacko = played && done ? standings[standings.length - 1] : null;

  const data = { season: String(league.season), leagueId, done, played, standings, games, champion, runnerUp, pointsChamp, sacko };
  idbSet(`season_${leagueId}`, { ts: Date.now(), done, data });
  return data;
}

let historyPromise = null;
function loadHistory() {
  if (historyPromise) return historyPromise;
  historyPromise = (async () => {
    const seasons = [];
    let id = state.leagueId;
    let preloaded = { league: state.league, users: state.users, rosters: state.rosters };
    for (let hop = 0; hop < 15 && id && id !== "0"; hop++) {
      try {
        const s = await summarizeSeason(id, preloaded);
        seasons.push(s);
        const lg = preloaded ? preloaded.league : await api(`/league/${id}`);
        id = lg.previous_league_id;
      } catch {
        // cached path doesn't give us previous_league_id — fetch just the league
        try { const lg = await api(`/league/${id}`); id = lg.previous_league_id; } catch { id = null; }
      }
      // bridge broken chains with commish-supplied league IDs (skip any already walked)
      if (!id || id === "0") {
        const seen = new Set(seasons.map((s) => String(s.leagueId)));
        id = PREVIOUS_LEAGUE_IDS.find((x) => x && !seen.has(String(x))) || null;
      }
      preloaded = null;
    }
    state.history = seasons;
    return seasons;
  })();
  historyPromise.catch(() => { historyPromise = null; });
  return historyPromise;
}

/* aggregate helpers */
function allGames() { return (state.history || []).flatMap((s) => s.games.map((g) => ({ ...g, season: s.season }))); }
function latestName(ownerId) {
  for (const s of state.history || []) {
    const hit = s.standings.find((x) => x.owner_id === ownerId);
    if (hit) return hit.name;
  }
  return "Unknown";
}

/* ---------------- HOME ---------------- */
function renderHome() {
  const { nfl, league } = state;
  renderHomeChamp();

  const inSeason = nfl.season_type === "regular" || nfl.season_type === "post";
  let countdown = "";
  if (!inSeason && nfl.season_start_date) {
    const days = Math.ceil((new Date(nfl.season_start_date) - Date.now()) / 86400000);
    if (days > 0) countdown = `<div class="stat"><div class="k">Kickoff countdown</div><div class="v"><span data-count="${days}">0</span> <small>days</small></div></div>`;
  }
  const open = PROPOSALS.filter((p) => p.status === "open").length;
  $("home-stats").innerHTML = `
    <div class="stat"><div class="k">Season</div><div class="v">${esc(league.season)} <small>${esc(nfl.season_type)}</small></div></div>
    ${inSeason ? `<div class="stat"><div class="k">Week</div><div class="v">${nfl.display_week || nfl.week}</div></div>` : countdown}
    <div class="stat"><div class="k">Teams</div><div class="v"><span data-count="${league.total_rosters}">0</span></div></div>
    <div class="stat"><div class="k">Open votes</div><div class="v"><span data-count="${open}">0</span></div></div>
  `;
  $("home-stats").querySelectorAll("[data-count]").forEach(countUp);

  const openProps = PROPOSALS.filter((p) => p.status === "open");
  $("home-ballot").innerHTML = openProps.length
    ? openProps.map((p) => `<div style="padding:7px 0;border-bottom:1px solid rgba(40,50,85,.4)"><b style="font-size:13.5px">${esc(p.title)}</b></div>`).join("") +
      `<div style="margin-top:12px"><button class="btn gold" data-goto="vote">Vote now →</button></div>`
    : `<p class="sub" style="margin:0">Nothing on the ballot right now. Got an idea? <a href="#" data-goto="vote">Make a proposal →</a></p>`;
}

function renderHomeSacko() {
  const nfl = state.nfl;
  const reigning = (state.history || []).find((s) => s.sacko);
  const champName = reigning && reigning.champion ? reigning.champion.name : "the champ";

  // live Sacko Watch: current last place once the season is underway
  let watch = null;
  const inSeason = nfl && (nfl.season_type === "regular" || nfl.season_type === "post");
  const anyGames = (state.rosters || []).some((r) => (r.settings.wins || 0) + (r.settings.losses || 0) + (r.settings.ties || 0) > 0);
  if (inSeason && anyGames) {
    const standings = [...state.rosters].sort((a, b) =>
      (b.settings.wins - a.settings.wins) || (fpts(b) - fpts(a)));
    const last = standings[standings.length - 1];
    const u = state.users.find((x) => x.user_id === last.owner_id);
    watch = { name: (u && u.display_name) || `Team ${last.roster_id}`, avatar: u && u.avatar,
      rec: `${last.settings.wins || 0}-${last.settings.losses || 0}` };
  }

  if (!reigning && !watch) {
    $("home-sacko").innerHTML = `
      <div class="hero-sacko">
        <div class="poo">💩</div>
        <div>
          <div class="tag">The cellar</div>
          <div class="who">The Sacko throne sits empty… for now</div>
          <div class="owner">Finish last: buy the champ a jersey, live on this page for a year.</div>
        </div>
        <div class="stamp">Sacko</div>
      </div>`;
    return;
  }
  $("home-sacko").innerHTML = `
    <div class="hero-sacko">
      <div class="poo">💩</div>
      ${reigning ? avatarImg(reigning.sacko.avatar, "avatar big", "💩") : ""}
      <div>
        ${reigning ? `
          <div class="tag">Reigning Sacko · ${esc(reigning.season)}</div>
          <div class="who">${esc(reigning.sacko.name)}</div>
          <div class="owner">${reigning.sacko.w}-${reigning.sacko.l}${Number(reigning.season) >= (typeof SACKO_JERSEY_FROM !== "undefined" ? SACKO_JERSEY_FROM : 0) ? ` · owes ${esc(champName)} a jersey of the champ's choosing` : ""}</div>`
        : `<div class="tag">Sacko watch</div>`}
        ${watch ? `<div class="owner" style="margin-top:4px">📉 Sacko Watch: <b style="color:var(--bad)">${esc(watch.name)}</b> (${watch.rec}) currently holds the cellar</div>` : ""}
      </div>
      <div class="stamp">Sacko</div>
    </div>`;
}

function renderHomeChamp() {
  renderHomeSacko();
  renderHomeAwards();
  const latest = (state.history || []).find((s) => s.champion);
  if (!latest) {
    const days = state.nfl && state.nfl.season_start_date
      ? Math.ceil((new Date(state.nfl.season_start_date) - Date.now()) / 86400000) : 0;
    $("home-champ").innerHTML = `
      <div class="hero-champ hero-kick">
        <div class="cup">🏆</div>
        <div style="flex:1">
          <div class="tag">Season ${esc(state.league.season)} · the throne is empty</div>
          ${days > 0
            ? `<div class="big">${days} <small>DAYS TO KICKOFF</small></div>`
            : `<div class="big">FIRST BANNER <small>GETS HUNG THIS SEASON</small></div>`}
          <div class="owner" style="margin-top:6px">Win it all and your jersey hangs in the rafters forever. Lose it all and… see below.</div>
          <div style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap">
            <button class="btn gold small" data-goto="vote">🗳 Vote on the rules</button>
            <button class="btn small" data-goto="lottery">🎰 Try the draft lottery</button>
          </div>
        </div>
      </div>`;
    return;
  }
  $("home-champ").innerHTML = `
    <div class="hero-champ">
      <div class="cup">🏆</div>
      ${avatarImg(latest.champion.avatar, "avatar big")}
      <div>
        <div class="tag">Reigning champion · ${esc(latest.season)}</div>
        <div class="who">${esc(latest.champion.teamName)}</div>
        <div class="owner">${esc(latest.champion.name)}${latest.runnerUp ? ` · def. ${esc(latest.runnerUp.teamName)}` : ""}</div>
      </div>
    </div>`;
}

function renderHomeAwards() {
  const cur = (state.history || []).find((s) => s.leagueId === state.leagueId);
  const games = cur ? cur.games : [];
  if (!games.length) { $("home-awards").innerHTML = ""; return; }
  const wk = Math.max(...games.map((g) => g.week));
  const wg = games.filter((g) => g.week === wk);
  const sides = wg.flatMap((g) => [{ ...g.a, opp: g.b }, { ...g.b, opp: g.a }]);
  const boom = sides.reduce((m, s) => (s.pts > m.pts ? s : m));
  const stink = sides.reduce((m, s) => (s.pts < m.pts ? s : m));
  const decided = wg.filter((g) => g.a.pts !== g.b.pts);
  const massacre = decided.length ? decided.reduce((m, g) => (Math.abs(g.a.pts - g.b.pts) > Math.abs(m.a.pts - m.b.pts) ? g : m)) : null;
  const escape = decided.length ? decided.reduce((m, g) => (Math.abs(g.a.pts - g.b.pts) < Math.abs(m.a.pts - m.b.pts) ? g : m)) : null;
  const W = (g) => (g.a.pts > g.b.pts ? g.a : g.b), L = (g) => (g.a.pts > g.b.pts ? g.b : g.a);
  $("home-awards").innerHTML = `<div class="awards">
    <div class="award gold"><div class="k">💥 Boom of Week ${wk}</div><div class="v">${esc(boom.o.name)}</div><div class="c">${boom.pts.toFixed(2)} pts</div></div>
    <div class="award red"><div class="k">🗑 The Stinker</div><div class="v">${esc(stink.o.name)}</div><div class="c">${stink.pts.toFixed(2)} pts</div></div>
    ${massacre ? `<div class="award"><div class="k">🔪 The Massacre</div><div class="v">${esc(W(massacre).o.name)} over ${esc(L(massacre).o.name)}</div><div class="c">by ${Math.abs(massacre.a.pts - massacre.b.pts).toFixed(2)}</div></div>` : ""}
    ${escape ? `<div class="award green"><div class="k">😮‍💨 The Escape</div><div class="v">${esc(W(escape).o.name)} past ${esc(L(escape).o.name)}</div><div class="c">by ${Math.abs(escape.a.pts - escape.b.pts).toFixed(2)}</div></div>` : ""}
  </div>`;
}

function countUp(el) {
  const target = parseFloat(el.dataset.count);
  if (!isFinite(target)) return;
  const start = performance.now(), dur = 800;
  const step = (t) => {
    const p = Math.min(1, (t - start) / dur);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ---------------- LOTTERY ---------------- */
function weightedDrawOrder(teams, weights) {
  const pool = teams.map((t, i) => ({ t, w: weights[i] || 1 }));
  const order = [];
  while (pool.length) {
    const total = pool.reduce((s, x) => s + x.w, 0);
    let r = Math.random() * total;
    let idx = pool.findIndex((x) => (r -= x.w) < 0);
    if (idx < 0) idx = pool.length - 1;
    order.push(pool.splice(idx, 1)[0].t);
  }
  return order;   // order[0] gets pick 1.01
}

let lottoDrawing = false;
async function renderLottery() {
  $("lotto-odds").innerHTML = loadingHtml("Setting the odds…");
  try { await loadHistory(); } catch {}
  const league = state.league;
  const playoffTeams = (league.settings && league.settings.playoff_teams) || 7;
  const n = Math.max(2, Math.min(LOTTERY.weights.length, (league.total_rosters || 12) - playoffTeams));

  const cur = (state.history || []).find((s) => s.leagueId === state.leagueId);
  let entrants, official = false;
  if (cur && cur.played) {
    const bottom = cur.standings.slice(-n);
    entrants = [...bottom].reverse().map((x) => ({ name: x.name, rec: `${x.w}-${x.l}` }));
    official = cur.done;
    setMsg("lotto-status", official ? "ok" : "info", official
      ? "Final standings are in — this is the real drawing."
      : `Standings through today — an unofficial preview until the season ends.`);
  } else {
    entrants = state.users.slice(0, n).map((u) => ({ name: u.display_name, rec: "—" }));
    setMsg("lotto-status", "info", "No standings yet — demo mode with placeholder seeding. The real drawing uses final standings, worst record first.");
  }

  const w = LOTTERY.weights.slice(0, entrants.length);
  const totalW = w.reduce((s, x) => s + x, 0);
  $("lotto-odds").innerHTML = `<table>
    <thead><tr><th>Seed</th><th>Team</th><th class="num">Record</th><th class="num">Odds at 1.01</th></tr></thead>
    <tbody>${entrants.map((e, i) => `<tr>
      <td style="color:var(--muted)">${i + 1}</td>
      <td><b>${esc(e.name)}</b></td>
      <td class="num">${esc(e.rec)}</td>
      <td class="num" style="color:var(--accent)">${((w[i] / totalW) * 100).toFixed(0)}%</td>
    </tr>`).join("")}</tbody></table>`;
  $("lotto-note").textContent = official ? "Results are official when the commish says so." : "Practice runs don't count. Obviously.";

  $("lotto-run").onclick = async () => {
    if (lottoDrawing) return;
    lottoDrawing = true;
    $("lotto-run").disabled = true;
    const order = weightedDrawOrder(entrants, w);
    const stage = $("lotto-stage");
    stage.innerHTML = "";
    for (let pick = order.length; pick >= 1; pick--) {
      const spin = document.createElement("div");
      spin.className = "lotto-spin";
      stage.prepend(spin);
      for (let f = 0; f < 10; f++) {
        spin.textContent = `PICK 1.${String(pick).padStart(2, "0")} … ${entrants[Math.floor(Math.random() * entrants.length)].name.toUpperCase()}`;
        await new Promise((r) => setTimeout(r, 90 + f * 18));
      }
      const team = order[pick - 1];
      spin.outerHTML = `<div class="lotto-pick ${pick === 1 ? "first" : ""}">
        <span class="num">1.${String(pick).padStart(2, "0")}</span>
        <b style="flex:1">${pick === 1 ? "🎉 " : ""}${esc(team.name)}</b>
        <span class="owner">${esc(team.rec)}</span>
      </div>`;
      await new Promise((r) => setTimeout(r, 450));
    }
    $("lotto-run").disabled = false;
    $("lotto-run").textContent = "🎱 Run it again";
    lottoDrawing = false;
  };
}

/* ---------------- OWNERS ---------------- */
async function renderOwners() {
  $("owners-grid").innerHTML = loadingHtml("Pulling the files…");
  try { await loadHistory(); } catch {}
  const hist = state.history || [];
  const latestDone = hist.find((s) => s.done && s.played);

  // career aggregates per owner_id
  const agg = {};
  const A = (id) => agg[id] = agg[id] || { seasons: 0, w: 0, l: 0, t: 0, pf: 0, titles: 0, sackos: 0, crowns: 0, first: null };
  for (const s of hist) {
    if (!s.played) continue;
    for (const row of s.standings) {
      const a = A(row.owner_id);
      a.seasons++; a.w += row.w; a.l += row.l; a.t += row.t; a.pf += row.pf;
      a.first = s.season; // history is newest-first, so last write = earliest season
    }
    if (s.champion) A(s.champion.owner_id).titles++;
    if (s.sacko) A(s.sacko.owner_id).sackos++;
    if (s.pointsChamp) A(s.pointsChamp.owner_id).crowns++;
  }

  // head-to-head records (playoffs included)
  const h2h = {};
  const cell = (x, y) => ((h2h[x] = h2h[x] || {})[y] = h2h[x][y] || { w: 0, l: 0, t: 0 });
  for (const g of allGames()) {
    const a = g.a.o.owner_id, b = g.b.o.owner_id;
    if (g.a.pts > g.b.pts) { cell(a, b).w++; cell(b, a).l++; }
    else if (g.b.pts > g.a.pts) { cell(b, a).w++; cell(a, b).l++; }
    else { cell(a, b).t++; cell(b, a).t++; }
  }

  // auto titles: superlatives across the league
  const users = [...state.users].sort((a, b) => a.display_name.localeCompare(b.display_name));
  const withStats = users.filter((u) => agg[u.user_id]);
  const superlative = {};
  const crownIt = (uid, title) => { if (uid && !superlative[uid]) superlative[uid] = title; };
  if (withStats.length) {
    const by = (f) => [...withStats].sort((a, b) => f(agg[b.user_id]) - f(agg[a.user_id]))[0].user_id;
    const maxTitles = Math.max(...withStats.map((u) => agg[u.user_id].titles));
    if (maxTitles >= 2) crownIt(by((a) => a.titles), "The Dynasty");
    crownIt(by((a) => a.pf), "The Juggernaut");
    crownIt(by((a) => (a.w + a.l ? a.w / (a.w + a.l) : 0)), "The Machine");
    const maxSackos = Math.max(...withStats.map((u) => agg[u.user_id].sackos));
    if (maxSackos > 0) crownIt([...withStats].sort((a, b) => agg[b.user_id].sackos - agg[a.user_id].sackos)[0].user_id, "The Cellar King");
    crownIt(by((a) => -(a.w + a.l)), "The Wild Card");
  }

  const nameOf = (uid) => { const u = state.users.find((x) => x.user_id === uid); return u ? u.display_name : latestName(uid); };
  $("owners-grid").innerHTML = users.map((u, i) => {
    const a = agg[u.user_id];
    const bio = BIOS[u.display_name.toLowerCase()] || {};
    const isChamp = latestDone && latestDone.champion && latestDone.champion.owner_id === u.user_id;
    const isSacko = latestDone && latestDone.sacko && latestDone.sacko.owner_id === u.user_id;
    const badges = a ? "🏆".repeat(a.titles) + "🎯".repeat(a.crowns) + "💩".repeat(a.sackos) : "";
    const title = bio.title || (isChamp ? "Reigning Champion" : isSacko ? "Reigning Sacko" : superlative[u.user_id] || (a ? "The Contender" : "The New Blood"));

    const motto = bio.motto || "";

    // head-to-head vs everyone (current members only), best friend & nemesis
    const mine = h2h[u.user_id] || {};
    const rows = users.filter((o) => o.user_id !== u.user_id && mine[o.user_id]);
    const diff = (r) => r.w - r.l;
    let owns = null, ownedBy = null;
    for (const o of rows) {
      const r = mine[o.user_id];
      if (r.w + r.l + r.t >= 2) {
        if (!owns || diff(r) > diff(mine[owns])) owns = o.user_id;
        if (!ownedBy || diff(r) < diff(mine[ownedBy])) ownedBy = o.user_id;
      }
    }
    const h2hHtml = rows.length ? `
      <div class="bio-rivals">
        ${owns != null && diff(mine[owns]) > 0 ? `😤 Owns <b>${esc(nameOf(owns))}</b> (${mine[owns].w}-${mine[owns].l})<br>` : ""}
        ${ownedBy != null && diff(mine[ownedBy]) < 0 ? `😱 Owned by <b>${esc(nameOf(ownedBy))}</b> (${mine[ownedBy].w}-${mine[ownedBy].l})<br>` : ""}
        <details style="margin-top:5px"><summary style="cursor:pointer">All head-to-heads</summary>
          ${rows.map((o) => {
            const r = mine[o.user_id];
            const c = r.w > r.l ? "var(--good)" : r.l > r.w ? "var(--bad)" : "var(--muted)";
            return `<div style="display:flex;justify-content:space-between;padding:2px 0"><span>vs ${esc(nameOf(o.user_id))}</span><b style="color:${c}">${r.w}-${r.l}${r.t ? `-${r.t}` : ""}</b></div>`;
          }).join("")}
        </details>
      </div>` : "";

    return `<div class="bio-card" style="animation-delay:${i * 60}ms">
      <div class="bio-head">
        ${avatarImg(u.avatar, "avatar big")}
        <div style="min-width:0">
          <div class="bio-name">${esc(u.display_name)}</div>
          <div class="owner">${esc((u.metadata && u.metadata.team_name) || "—")}</div>
        </div>
        <div class="bio-badges">${badges}</div>
      </div>
      <div class="bio-title">${esc(title)}</div>
      ${motto ? `<p class="bio-motto">“${esc(motto)}”</p>` : ""}
      ${a ? `<div class="bio-stats">
        <div><div class="k">Seasons</div><div class="v">${a.seasons}</div></div>
        <div><div class="k">Record</div><div class="v">${a.w}-${a.l}</div></div>
        <div><div class="k">Win %</div><div class="v">${a.w + a.l ? Math.round((a.w / (a.w + a.l)) * 100) : 0}%</div></div>
        <div><div class="k">PF</div><div class="v">${a.pf.toFixed(0)}</div></div>
      </div>` : `<div class="bio-stats"><div style="grid-column:1/-1"><div class="k">Franchise history</div><div class="v" style="font-size:13px">Begins this season</div></div></div>`}
      ${h2hHtml}
      <div class="owner" style="margin-top:9px">Franchise est. ${esc((a && a.first) || state.league.season)}</div>
    </div>`;
  }).join("");
}

/* ---------------- DRAFT ---------------- */
let draftTimer = null;
async function renderDraft(quiet) {
  clearTimeout(draftTimer);
  if (!quiet) {
    $("draft-info").innerHTML = "";
    $("draft-board").innerHTML = loadingHtml("Loading the draft…");
    $("draft-picks").innerHTML = "";
  }
  try {
    const drafts = await api(`/league/${state.leagueId}/drafts`);
    const draft = (drafts || [])[0];
    if (!draft) {
      $("draft-board").innerHTML = `<p class="sub" style="margin:0">No draft on Sleeper yet — once the commish creates it, the board shows up here automatically.</p>`;
      return;
    }
    const [traded, picks] = await Promise.all([
      api(`/draft/${draft.draft_id}/traded_picks`).catch(() => []),
      api(`/draft/${draft.draft_id}/picks`).catch(() => []),
    ]);

    const teams = draft.settings.teams || state.league.total_rosters;
    const rounds = draft.settings.rounds || 5;
    const slotUser = {};   // slot -> user name
    for (const [uid, slot] of Object.entries(draft.draft_order || {})) {
      const u = state.users.find((x) => x.user_id === uid);
      slotUser[slot] = u ? u.display_name : "?";
    }
    const rosterName = (rid) => {
      const r = state.rosters.find((x) => x.roster_id === rid);
      const u = r && state.users.find((x) => x.user_id === r.owner_id);
      return u ? u.display_name : `Team ${rid}`;
    };
    const slotRoster = draft.slot_to_roster_id || {};
    const pickOwner = (round, slot) => {
      const origRoster = slotRoster[slot];
      if (origRoster != null) {
        const t = (traded || []).find((p) => Number(p.round) === round && p.roster_id === origRoster && String(p.season) === String(draft.season));
        if (t) return { name: rosterName(t.owner_id), traded: true };
      }
      return { name: slotUser[slot] || (origRoster != null ? rosterName(origRoster) : "?"), traded: false };
    };

    const when = draft.start_time ? new Date(draft.start_time) : null;
    const live = draft.status === "drafting" || draft.status === "paused";
    const soon = draft.status === "pre_draft" && when && when - Date.now() < 2 * 3600 * 1000;
    const statusTxt = { pre_draft: "not started", drafting: "LIVE NOW", paused: "paused", complete: "complete" }[draft.status] || draft.status;
    const days = when && draft.status === "pre_draft" ? Math.ceil((when - Date.now()) / 86400000) : null;
    $("draft-info").innerHTML =
      `${rounds} rounds · ${teams} teams · ${draft.settings.pick_timer ? Math.round(draft.settings.pick_timer / 60) + " min" : "untimed"} picks · status: <b>${live ? '<span class="live-dot"></span>' : ""}${esc(statusTxt)}</b>` +
      (when ? ` · ${when.toLocaleDateString(undefined, { month: "short", day: "numeric" })}${days > 0 ? ` (in ${days} day${days > 1 ? "s" : ""})` : ""}` : "") +
      `<br>Gold picks changed hands in trades — the board stays in sync with Sleeper automatically${live || soon ? ", and this page refreshes itself while the draft is live — throw it on a TV" : ""}.`;

    // on the clock
    const totalPicks = rounds * teams;
    const nextNo = (picks || []).length + 1;
    if (draft.status === "drafting" && nextNo <= totalPicks) {
      const round = Math.ceil(nextNo / teams);
      const inRound = nextNo - (round - 1) * teams;
      const slot = draft.type === "snake" && round % 2 === 0 ? teams - inRound + 1 : inRound;
      const o = pickOwner(round, slot);
      $("draft-info").innerHTML += `<div class="onclock">⏰ <span class="t">ON THE CLOCK: ${esc(o.name.toUpperCase())}</span><span class="owner">pick ${round}.${String(inRound).padStart(2, "0")}</span></div>`;
    }
    if (live || soon) draftTimer = setTimeout(() => { if (state.view === "draft") renderDraft(true); }, 30000);

    let board = `<table><thead><tr><th></th>${Array.from({ length: teams }, (_, i) => `<th class="num">${i + 1}</th>`).join("")}</tr></thead><tbody>`;
    for (let r = 1; r <= rounds; r++) {
      board += `<tr><td style="color:var(--muted)"><b>R${r}</b></td>` +
        Array.from({ length: teams }, (_, i) => {
          const o = pickOwner(r, i + 1);
          return `<td class="num" style="white-space:nowrap;${o.traded ? "color:var(--accent);font-weight:700" : ""}">${esc(o.name.slice(0, 9))}</td>`;
        }).join("") + `</tr>`;
    }
    $("draft-board").innerHTML = board + `</tbody></table>`;

    if (!picks || !picks.length) {
      $("draft-picks").innerHTML = `<p class="sub" style="margin:0">No picks yet. When the clock starts, they'll land here as they're made — refresh during the draft for the live feed.</p>`;
      return;
    }
    const rows = [...picks].sort((a, b) => b.pick_no - a.pick_no);
    $("draft-picks").innerHTML = rows.map((p, i) => {
      const m = p.metadata || {};
      const who = state.users.find((x) => x.user_id === p.picked_by);
      return `<div class="player-row${i === 0 && draft.status === "drafting" ? " fresh" : ""}">
        <span class="pp" style="color:var(--accent2)">${p.round}.${String(p.pick_no - (p.round - 1) * teams).padStart(2, "0")}</span>
        <span class="pp pos-${esc(m.position || "?")}">${esc(m.position || "?")}</span>
        <span class="pn">${esc([m.first_name, m.last_name].filter(Boolean).join(" ") || p.player_id)}</span>
        <span class="pm">${esc(m.team || "")} → ${esc(who ? who.display_name : "?")}</span>
      </div>`;
    }).join("");
  } catch (e) {
    $("draft-board").innerHTML = `<div class="msg err">Couldn't load the draft — ${esc(e.message)}</div>`;
  }
}

/* ---------------- BANK ---------------- */
/* weekly high-score credits for one season: owner_id -> {weeks, cash} (regular season only) */
function seasonHighCredits(sum) {
  const credits = {};
  if (!sum) return credits;
  const games = sum.games.filter((g) => !g.playoff);
  for (const wk of [...new Set(games.map((g) => g.week))]) {
    const sides = games.filter((g) => g.week === wk).flatMap((g) => [g.a, g.b]);
    const top = Math.max(...sides.map((s) => s.pts));
    const winners = sides.filter((s) => s.pts === top);
    const share = BANK.weeklyHighScore / winners.length;
    for (const w of winners) {
      const c = credits[w.o.owner_id] = credits[w.o.owner_id] || { weeks: 0, cash: 0, name: w.o.name };
      c.weeks++; c.cash += share;
    }
  }
  return credits;
}
/* the weekly award engine: compute a week's winner(s) per the slate */
function awardForWeek(sum, wk) {
  const spec = WEEKLY_AWARDS.find((a) => a.week === wk) || { key: "high", emoji: "🔥", name: "High Score", how: "Most points" };
  const games = sum.games.filter((g) => !g.playoff);
  const wg = games.filter((g) => g.week === wk);
  if (!wg.length) return null;
  const sides = wg.flatMap((g) => [
    { o: g.a.o, pts: g.a.pts, opp: g.b.pts }, { o: g.b.o, pts: g.b.pts, opp: g.a.pts },
  ]);
  const wins = sides.filter((s) => s.pts > s.opp);
  const priorAvg = (oid) => {
    const p = games.filter((g) => g.week < wk).flatMap((g) => [g.a, g.b]).filter((s) => s.o.owner_id === oid).map((s) => s.pts);
    return p.length ? p.reduce((a, b) => a + b, 0) / p.length : null;
  };
  const prevWk = (oid) => {
    const p = games.filter((g) => g.week === wk - 1).flatMap((g) => [g.a, g.b]).find((s) => s.o.owner_id === oid);
    return p ? p.pts : null;
  };
  const pickMax = (arr, f) => { if (!arr.length) return []; const m = Math.max(...arr.map(f)); return arr.filter((x) => Math.abs(f(x) - m) < 1e-9); };
  const pickMin = (arr, f) => { if (!arr.length) return []; const m = Math.min(...arr.map(f)); return arr.filter((x) => Math.abs(f(x) - m) < 1e-9); };
  const fmt = (x) => x.toFixed(2);

  let win = [], detail = "";
  switch (spec.key) {
    case "escape": win = pickMin(wins, (s) => s.pts - s.opp); if (win.length) detail = `won by ${fmt(win[0].pts - win[0].opp)}`; break;
    case "blowout": win = pickMax(wins, (s) => s.pts - s.opp); if (win.length) detail = `won by ${fmt(win[0].pts - win[0].opp)}`; break;
    case "target150": win = pickMin(sides, (s) => Math.abs(s.pts - 150)); if (win.length) detail = `${fmt(win[0].pts)} — ${fmt(Math.abs(win[0].pts - 150))} off 150`; break;
    case "uglyW": win = pickMin(wins, (s) => s.pts); if (win.length) detail = `won with just ${fmt(win[0].pts)}`; break;
    case "silver": {
      const vals = [...new Set(sides.map((s) => s.pts))].sort((a, b) => b - a);
      if (vals.length > 1) { win = sides.filter((s) => s.pts === vals[1]); detail = `${fmt(vals[1])} pts, just behind`; }
      break;
    }
    case "heartbreak": win = pickMax(sides.filter((s) => s.pts < s.opp), (s) => s.pts); if (win.length) detail = `${fmt(win[0].pts)} in a loss`; break;
    case "median": {
      const pts = sides.map((s) => s.pts).sort((a, b) => a - b);
      const med = pts.length % 2 ? pts[(pts.length - 1) / 2] : (pts[pts.length / 2 - 1] + pts[pts.length / 2]) / 2;
      win = pickMin(sides, (s) => Math.abs(s.pts - med));
      if (win.length) detail = `${fmt(win[0].pts)} vs median ${fmt(med)}`;
      break;
    }
    case "overachieve": {
      const cand = sides.filter((s) => priorAvg(s.o.owner_id) != null);
      win = pickMax(cand, (s) => s.pts - priorAvg(s.o.owner_id));
      if (win.length) detail = `+${fmt(win[0].pts - priorAvg(win[0].o.owner_id))} over their average`;
      break;
    }
    case "towers": {
      const g = pickMax(wg, (x) => x.a.pts + x.b.pts)[0];
      if (g) {
        win = g.a.pts === g.b.pts ? [{ o: g.a.o, pts: g.a.pts }, { o: g.b.o, pts: g.b.pts }]
          : [g.a.pts > g.b.pts ? { o: g.a.o, pts: g.a.pts, opp: g.b.pts } : { o: g.b.o, pts: g.b.pts, opp: g.a.pts }];
        detail = `won a ${fmt(g.a.pts + g.b.pts)}-point shootout`;
      }
      break;
    }
    case "underdog": {
      const cand = wins.filter((s) => priorAvg(s.o.owner_id) != null);
      win = pickMin(cand, (s) => priorAvg(s.o.owner_id));
      if (win.length) detail = `averaging ${fmt(priorAvg(win[0].o.owner_id))} and still won`;
      break;
    }
    case "ironwill": {
      const cand = wins.filter((s) => priorAvg(s.o.owner_id) != null && s.pts < priorAvg(s.o.owner_id));
      win = pickMax(cand, (s) => s.pts - s.opp);
      if (win.length) detail = `gutted out a W ${fmt(priorAvg(win[0].o.owner_id) - win[0].pts)} under their average`;
      break;
    }
    case "bigswing": {
      const cand = sides.filter((s) => prevWk(s.o.owner_id) != null);
      win = pickMax(cand, (s) => s.pts - prevWk(s.o.owner_id));
      if (win.length) detail = `+${fmt(win[0].pts - prevWk(win[0].o.owner_id))} on last week`;
      break;
    }
  }
  let fellBack = false;
  if (!win.length) {   // "high" key and any award with no qualifier
    win = pickMax(sides, (s) => s.pts);
    if (spec.key !== "high") fellBack = true;
    detail = `${fmt(win[0].pts)} pts`;
  }
  return { spec, winners: win.map((s) => s.o), detail, share: BANK.weeklyHighScore / win.length, fellBack };
}

/* current-season credits + display rows from the award slate */
function seasonAwardResults(sum) {
  const rows = [], credits = {};
  if (!sum) return { rows, credits };
  const weeks = [...new Set(sum.games.filter((g) => !g.playoff).map((g) => g.week))].sort((a, b) => a - b);
  for (const wk of weeks) {
    const r = awardForWeek(sum, wk);
    if (!r) continue;
    rows.push({ week: wk, ...r });
    for (const o of r.winners) {
      const c = credits[o.owner_id] = credits[o.owner_id] || { weeks: 0, cash: 0, name: o.name };
      c.weeks++; c.cash += r.share;
    }
  }
  return { rows, credits };
}

function weekRowsHtml(sum) {
  const games = sum.games.filter((g) => !g.playoff);
  return [...new Set(games.map((g) => g.week))].sort((a, b) => a - b).map((wk) => {
    const sides = games.filter((g) => g.week === wk).flatMap((g) => [g.a, g.b]);
    const top = Math.max(...sides.map((s) => s.pts));
    const winners = sides.filter((s) => s.pts === top);
    const share = BANK.weeklyHighScore / winners.length;
    return `<div class="record" style="padding:8px 4px">
      <div class="ico" style="font-size:13px;color:var(--muted)">Wk ${wk}</div>
      <div style="flex:1"><b>${winners.map((w) => esc(w.o.name)).join(" + ")}</b>
        <div class="owner">${top.toFixed(2)} pts${winners.length > 1 ? " · tie, pot split" : ""}</div></div>
      <b style="color:var(--good)">$${share % 1 ? share.toFixed(2) : share}${winners.length > 1 ? " each" : ""}</b>
    </div>`;
  }).join("");
}

async function renderBank() {
  $("bank-payto").textContent = BANK.payTo || "";
  $("dues-list").innerHTML = loadingHtml("Balancing the books…");
  $("whs-list").innerHTML = "";
  $("winnings").innerHTML = "";
  try { await loadHistory(); } catch (e) {
    $("dues-list").innerHTML = `<div class="msg err">Couldn't load scores — ${esc(e.message)}</div>`;
    return;
  }
  const cur = (state.history || []).find((s) => s.leagueId === state.leagueId);
  let prev = (state.history || []).find((s) => s.leagueId !== state.leagueId && s.played);

  // last-season credits expire when this year's draft completes (dues settle at the draft)
  let draftDone = false;
  try {
    const drafts = await api(`/league/${state.leagueId}/drafts`);
    draftDone = !!(drafts && drafts[0] && drafts[0].status === "complete");
  } catch {}
  if (draftDone || BANK.creditLastSeason === false) prev = null;

  const curAwards = seasonAwardResults(cur);
  const curCredits = curAwards.credits;
  const prevCredits = seasonHighCredits(prev);   // 2025 ran the classic high-score rule

  // paid status lives in the shared ballot box (tap to toggle); BANK.paid config still counts as paid
  let bankDoc = null;
  if (voteStore()) bankDoc = await storeGet().catch(() => null);
  const storePaid = (bankDoc && bankDoc.paid) || {};
  const paidSet = new Set(BANK.paid.map((n) => String(n).toLowerCase()));
  const isPaid = (u) => paidSet.has(u.display_name.toLowerCase()) || !!storePaid[u.user_id];

  const rows = [...state.users].sort((a, b) => a.display_name.localeCompare(b.display_name));
  const paidCount = rows.filter(isPaid).length;
  const money = (x) => `$${x % 1 ? x.toFixed(2) : x}`;
  const canToggle = !!voteStore();
  $("dues-status").innerHTML =
    `$${BANK.dues} per team · every weekly award win auto-credits $${BANK.weeklyHighScore}` +
    `${prev ? ` (last season's included)` : ""} · <b>${paidCount} of ${rows.length} settled</b>` +
    (canToggle ? `<br>Tap a status to mark someone paid — it updates for the whole league.` : "") +
    (draftDone ? `<br>🔄 Ledger reset at the draft — last season is settled, this season's highs credit from Week 1.` : "");
  $("dues-list").innerHTML = `<table>
    <thead><tr><th>Owner</th><th class="num">Dues</th><th class="num">HS credits</th><th class="num">Owes</th><th class="num">Status</th></tr></thead>
    <tbody>${rows.map((u) => {
      const credit = (prevCredits[u.user_id] ? prevCredits[u.user_id].cash : 0) + (curCredits[u.user_id] ? curCredits[u.user_id].cash : 0);
      const net = BANK.dues - credit;
      const paid = isPaid(u);
      const chip = `class="chip ${paid ? "passed" : "failed"}"`;
      return `<tr>
        <td><b>${esc(u.display_name)}</b>${u.metadata && u.metadata.team_name ? `<div class="owner">${esc(u.metadata.team_name)}</div>` : ""}</td>
        <td class="num">$${BANK.dues}</td>
        <td class="num" style="color:var(--good)">${credit ? "−" + money(credit) : "—"}</td>
        <td class="num"><b>${net >= 0 ? money(net) : `<span style="color:var(--good)">+${money(-net)} back</span>`}</b></td>
        <td class="num">${canToggle
          ? `<button ${chip} data-uid="${esc(u.user_id)}" title="Tap to toggle">${paid ? "✓ settled" : "open"}</button>`
          : `<span ${chip}>${paid ? "✓ settled" : "open"}</span>`}</td>
      </tr>`;
    }).join("")}</tbody></table>
    ${prev ? `<p class="sub" style="margin-top:10px">Credits = $${BANK.weeklyHighScore} × award wins (last season's weekly highs${cur && cur.games.length ? " + this season's weekly awards" : ""}).</p>` : ""}`;

  $("dues-list").querySelectorAll("button.chip[data-uid]").forEach((b) =>
    b.addEventListener("click", async () => {
      b.disabled = true;
      try {
        const doc = await storeGet().catch(() => ({ votes: {} }));
        doc.paid = doc.paid || {};
        const uid = b.dataset.uid;
        if (doc.paid[uid]) delete doc.paid[uid];
        else doc.paid[uid] = { ts: Date.now() };
        await storePut(doc);
        renderBank();
      } catch (e) {
        setMsg("global-msg", "err", `Couldn't save the paid status — ${esc(e.message)}. Try again in a second.`);
        b.disabled = false;
      }
    }));

  // weekly award board: winners so far, then the upcoming slate
  const variedSlate = new Set(WEEKLY_AWARDS.map((a) => a.key)).size > 1;
  const playedWeeks = new Set(curAwards.rows.map((r) => r.week));
  const upcoming = WEEKLY_AWARDS.filter((a) => !playedWeeks.has(a.week));
  const wonRows = curAwards.rows.map((r) => `
    <div class="record" style="padding:8px 4px">
      <div class="ico" style="font-size:13px;color:var(--muted)">Wk ${r.week}</div>
      <div style="flex:1">
        <div class="owner">${r.spec.emoji} ${esc(r.spec.name)}${r.fellBack ? " · no qualifier, rolled to high score" : ""}</div>
        <b>${r.winners.map((o) => esc(o.name)).join(" + ")}</b>
        <div class="owner">${esc(r.detail)}${r.winners.length > 1 ? " · tie, pot split" : ""}</div>
      </div>
      <b style="color:var(--good)">$${r.share % 1 ? r.share.toFixed(2) : r.share}${r.winners.length > 1 ? " each" : ""}</b>
    </div>`).join("");
  const slateRows = (variedSlate ? upcoming : []).map((a) => `
    <div class="record" style="padding:7px 4px;opacity:.65">
      <div class="ico" style="font-size:13px;color:var(--muted)">Wk ${a.week}</div>
      <div style="flex:1"><b>${a.emoji} ${esc(a.name)}</b><div class="owner">${esc(a.how)}</div></div>
      <span class="owner">$${BANK.weeklyHighScore}</span>
    </div>`).join("");
  if (curAwards.rows.length) {
    $("whs-sub").textContent = variedSlate
      ? `A different $${BANK.weeklyHighScore} award every week — computed automatically, credited to the ledger. Ties split; no qualifier rolls to high score.`
      : `$${BANK.weeklyHighScore} to the top scorer each week — computed automatically, credited to the ledger.`;
    $("whs-list").innerHTML = wonRows + (variedSlate && upcoming.length ? `<h2 style="font-size:13px;margin:16px 0 4px;color:var(--muted)">STILL TO PLAY FOR</h2>` + slateRows : "");
  } else if (prev && !draftDone) {
    const retro = seasonAwardResults(prev);
    const retroWinners = new Set(Object.keys(retro.credits)).size;
    const highWinners = new Set(Object.keys(prevCredits)).size;
    const retroRows = retro.rows.map((r) => `
      <div class="record" style="padding:7px 4px">
        <div class="ico" style="font-size:13px;color:var(--muted)">Wk ${r.week}</div>
        <div style="flex:1"><div class="owner">${r.spec.emoji} ${esc(r.spec.name)}${r.fellBack ? " · rolled to high score" : ""}</div>
          <b>${r.winners.map((o) => esc(o.name)).join(" + ")}</b>
          <div class="owner">${esc(r.detail)}</div></div>
        <span class="owner">$${r.share % 1 ? r.share.toFixed(2) : r.share}${r.winners.length > 1 ? " ea" : ""}</span>
      </div>`).join("");
    $("whs-sub").textContent = `A different award every week this season — the full slate below. Last season's weekly highs (also below) are credited against this year's dues.`;
    $("whs-list").innerHTML =
      (!variedSlate ? "" : `<details style="margin-bottom:14px">
          <summary style="cursor:pointer;color:var(--accent);font-size:14px;font-weight:700">🔮 What if we'd run this slate last year? Tap it</summary>
          <div class="msg info" style="margin-top:10px"><b>${retroWinners}</b> different ${retroWinners === 1 ? "person cashes" : "people cash"} under the new slate, vs <b>${highWinners}</b> under high-score-only. Same scores, same season — just more ways to win.</div>
          ${retroRows}
        </details>`)
      + (variedSlate ? `<h2 style="font-size:13px;margin:0 0 4px;color:var(--muted)">THE 2026 SLATE</h2>` + slateRows : "")
      + `<h2 style="font-size:13px;margin:16px 0 4px;color:var(--muted)">2025 WEEKLY HIGHS (CREDITED)</h2>` + weekRowsHtml(prev);
  } else {
    $("whs-sub").textContent = variedSlate
      ? `A different $${BANK.weeklyHighScore} award every week — the board opens Week 1.`
      : `$${BANK.weeklyHighScore} to the top scorer each week — the board opens Week 1.`;
    $("whs-list").innerHTML = variedSlate ? slateRows : "";
  }

  // winnings leaderboard across both credited seasons
  const totals = {};
  for (const credits of [prevCredits, curCredits])
    for (const [uid, c] of Object.entries(credits)) {
      const t = totals[uid] = totals[uid] || { name: c.name, weeks: 0, cash: 0 };
      t.weeks += c.weeks; t.cash += c.cash;
    }
  const board = Object.values(totals).sort((a, b) => b.cash - a.cash);
  $("winnings").innerHTML = board.length ? `<table>
    <thead><tr><th>Owner</th><th class="num">Weeks won</th><th class="num">Credited</th></tr></thead>
    <tbody>${board.map((w) => `<tr>
      <td><b>${esc(w.name)}</b></td>
      <td class="num">${w.weeks}</td>
      <td class="num" style="color:var(--good)">${money(w.cash)}</td>
    </tr>`).join("")}</tbody></table>` : `<p class="sub" style="margin:0">Leaderboard starts with the season.</p>`;
}

/* ---------------- RECORD BOOK ---------------- */
async function renderRecords() {
  $("records-list").innerHTML = loadingHtml("Reading every box score in league history…");
  $("franchise").innerHTML = "";
  $("h2h").innerHTML = "";
  try { await loadHistory(); } catch (e) {
    $("records-list").innerHTML = `<div class="msg err">Couldn't load history — ${esc(e.message)}</div>`;
    return;
  }

  const games = allGames();
  if (!games.length) {
    $("records-list").innerHTML = `<p class="sub" style="margin:0">No games in the books yet — the record book opens with Week 1. Every score from every season will land here automatically. 📖</p>`;
    $("franchise").innerHTML = `<p class="sub" style="margin:0">Career standings appear once games are played.</p>`;
    $("h2h").innerHTML = `<p class="sub" style="margin:0">Rivalries need games first.</p>`;
    return;
  }

  // flatten each game into two perspectives
  const persp = games.flatMap((g) => [
    { ...g, me: g.a, opp: g.b }, { ...g, me: g.b, opp: g.a },
  ]);
  const wk = (x) => `${esc(x.me.o.name)} · Wk ${x.week}, ${esc(x.season)}${x.playoff ? " (playoffs)" : ""}`;
  const score = (x) => `${x.me.pts.toFixed(2)}–${x.opp.pts.toFixed(2)} vs ${esc(x.opp.o.name)}`;

  const hi = persp.reduce((m, x) => (x.me.pts > m.me.pts ? x : m));
  const lo = persp.reduce((m, x) => (x.me.pts < m.me.pts ? x : m));
  const decided = games.filter((g) => g.a.pts !== g.b.pts);
  const blow = decided.reduce((m, g) => (Math.abs(g.a.pts - g.b.pts) > Math.abs(m.a.pts - m.b.pts) ? g : m));
  const close = decided.reduce((m, g) => (Math.abs(g.a.pts - g.b.pts) < Math.abs(m.a.pts - m.b.pts) ? g : m));
  const losses = persp.filter((x) => x.me.pts < x.opp.pts);
  const wins = persp.filter((x) => x.me.pts > x.opp.pts);
  const bestLoss = losses.length ? losses.reduce((m, x) => (x.me.pts > m.me.pts ? x : m)) : null;
  const worstWin = wins.length ? wins.reduce((m, x) => (x.me.pts < m.me.pts ? x : m)) : null;

  // longest single-season win streak
  let streak = { len: 0 };
  for (const s of state.history) {
    const byOwner = {};
    for (const g of [...s.games].sort((a, b) => a.week - b.week)) {
      for (const [me, opp] of [[g.a, g.b], [g.b, g.a]]) {
        const id = me.o.owner_id;
        byOwner[id] = byOwner[id] || { cur: 0, best: 0 };
        if (me.pts > opp.pts) { byOwner[id].cur++; byOwner[id].best = Math.max(byOwner[id].best, byOwner[id].cur); }
        else if (me.pts < opp.pts) byOwner[id].cur = 0;
      }
    }
    for (const [id, v] of Object.entries(byOwner)) {
      if (v.best > streak.len) streak = { len: v.best, owner: id, season: s.season };
    }
  }

  // best seasons
  const seasonRows = state.history.flatMap((s) => s.played ? s.standings.map((x) => ({ ...x, season: s.season })) : []);
  const bestRec = seasonRows.length ? seasonRows.reduce((m, x) => ((x.w - x.l) > (m.w - m.l) || ((x.w - x.l) === (m.w - m.l) && x.pf > m.pf) ? x : m)) : null;
  const mostPF = seasonRows.length ? seasonRows.reduce((m, x) => (x.pf > m.pf ? x : m)) : null;

  const blowMargin = Math.abs(blow.a.pts - blow.b.pts);
  const closeMargin = Math.abs(close.a.pts - close.b.pts);
  const gWinner = (g) => (g.a.pts > g.b.pts ? g.a : g.b);
  const gLoser = (g) => (g.a.pts > g.b.pts ? g.b : g.a);

  const rec = (ico, what, val, ctx) => `
    <div class="record"><div class="ico">${ico}</div>
      <div><div class="what">${what}</div><div class="val">${val}</div><div class="ctx">${ctx}</div></div>
    </div>`;

  $("records-list").innerHTML = [
    rec("🔥", "Highest score ever", `${hi.me.pts.toFixed(2)} pts`, `${wk(hi)} — ${score(hi)}`),
    rec("💀", "Lowest score ever", `${lo.me.pts.toFixed(2)} pts`, `${wk(lo)} — ${score(lo)}`),
    rec("🥊", "Biggest blowout", `by ${blowMargin.toFixed(2)}`, `${esc(gWinner(blow).o.name)} ${gWinner(blow).pts.toFixed(2)}–${gLoser(blow).pts.toFixed(2)} ${esc(gLoser(blow).o.name)} · Wk ${blow.week}, ${esc(blow.season)}`),
    rec("😅", "Closest game", `by ${closeMargin.toFixed(2)}`, `${esc(gWinner(close).o.name)} ${gWinner(close).pts.toFixed(2)}–${gLoser(close).pts.toFixed(2)} ${esc(gLoser(close).o.name)} · Wk ${close.week}, ${esc(close.season)}`),
    bestLoss ? rec("🪦", "Toughest beat (most points in a loss)", `${bestLoss.me.pts.toFixed(2)} pts`, `${wk(bestLoss)} — ${score(bestLoss)}`) : "",
    worstWin ? rec("🍀", "Luckiest win (fewest points in a win)", `${worstWin.me.pts.toFixed(2)} pts`, `${wk(worstWin)} — ${score(worstWin)}`) : "",
    streak.len > 1 ? rec("📈", "Longest win streak (one season)", `${streak.len} straight`, `${esc(latestName(streak.owner))} · ${esc(streak.season)}`) : "",
    bestRec ? rec("🏅", "Best season record", `${bestRec.w}-${bestRec.l}${bestRec.t ? `-${bestRec.t}` : ""}`, `${esc(bestRec.name)} · ${esc(bestRec.season)}`) : "",
    mostPF ? rec("🎯", "Most points, one season", `${mostPF.pf.toFixed(1)} pts`, `${esc(mostPF.name)} · ${esc(mostPF.season)}`) : "",
  ].join("");

  renderFranchise();
  renderH2H();
}

function renderFranchise() {
  const agg = {};
  for (const s of state.history) {
    if (!s.played) continue;
    for (const row of s.standings) {
      const a = agg[row.owner_id] = agg[row.owner_id] || { name: latestName(row.owner_id), seasons: 0, w: 0, l: 0, t: 0, pf: 0, titles: 0, sackos: 0 };
      a.seasons++; a.w += row.w; a.l += row.l; a.t += row.t; a.pf += row.pf;
    }
    if (s.champion) (agg[s.champion.owner_id] = agg[s.champion.owner_id] || { name: s.champion.name, seasons: 0, w: 0, l: 0, t: 0, pf: 0, titles: 0, sackos: 0 }).titles++;
    if (s.sacko) (agg[s.sacko.owner_id] = agg[s.sacko.owner_id] || { name: s.sacko.name, seasons: 0, w: 0, l: 0, t: 0, pf: 0, titles: 0, sackos: 0 }).sackos++;
  }
  const rows = Object.values(agg).sort((a, b) => (b.titles - a.titles) || ((b.w / Math.max(1, b.w + b.l)) - (a.w / Math.max(1, a.w + a.l))));
  if (!rows.length) { $("franchise").innerHTML = ""; return; }
  $("franchise").innerHTML = `<table>
    <thead><tr><th>Owner</th><th class="num">Seasons</th><th class="num">W-L${rows.some(r=>r.t)?"-T":""}</th><th class="num">Win %</th><th class="num">PF</th><th class="num">🏆</th><th class="num">💩</th></tr></thead>
    <tbody>${rows.map((r) => `<tr>
      <td><b>${esc(r.name)}</b></td>
      <td class="num">${r.seasons}</td>
      <td class="num">${r.w}-${r.l}${rows.some(x=>x.t)?`-${r.t}`:""}</td>
      <td class="num">${(r.w + r.l ? (r.w / (r.w + r.l)) * 100 : 0).toFixed(0)}%</td>
      <td class="num">${r.pf.toFixed(0)}</td>
      <td class="num">${r.titles || ""}</td>
      <td class="num">${r.sackos || ""}</td>
    </tr>`).join("")}</tbody></table>`;
}

function renderH2H() {
  const rec = {};   // rec[a][b] = {w,l,t}
  const seen = new Set();
  for (const g of allGames()) {
    const A = g.a.o.owner_id, B = g.b.o.owner_id;
    seen.add(A); seen.add(B);
    const cell = (x, y) => ((rec[x] = rec[x] || {})[y] = rec[x][y] || { w: 0, l: 0, t: 0 });
    if (g.a.pts > g.b.pts) { cell(A, B).w++; cell(B, A).l++; }
    else if (g.b.pts > g.a.pts) { cell(B, A).w++; cell(A, B).l++; }
    else { cell(A, B).t++; cell(B, A).t++; }
  }
  const ids = [...seen].sort((a, b) => latestName(a).localeCompare(latestName(b)));
  if (!ids.length) { $("h2h").innerHTML = ""; return; }
  const short = (id) => esc(latestName(id).slice(0, 6));
  $("h2h").innerHTML = `<table>
    <thead><tr><th>vs →</th>${ids.map((id) => `<th class="num">${short(id)}</th>`).join("")}</tr></thead>
    <tbody>${ids.map((a) => `<tr><td><b>${esc(latestName(a))}</b></td>${ids.map((b) => {
      if (a === b) return `<td class="num" style="color:var(--line)">—</td>`;
      const r = (rec[a] || {})[b];
      if (!r) return `<td class="num" style="color:var(--muted)">·</td>`;
      const lead = r.w > r.l, trail = r.l > r.w;
      return `<td class="num" style="color:${lead ? "var(--good)" : trail ? "var(--bad)" : "var(--text)"}">${r.w}-${r.l}${r.t ? `-${r.t}` : ""}</td>`;
    }).join("")}</tr>`).join("")}</tbody></table>`;
}

/* ---------------- HALL OF CHAMPIONS ---------------- */
async function renderChamps() {
  $("champs-list").innerHTML = loadingHtml("Walking back through the seasons…");
  try { await loadHistory(); } catch (e) {
    $("champs-list").innerHTML = `<div class="msg err">Couldn't load history — ${esc(e.message)}</div>`;
    return;
  }
  const done = state.history.filter((s) => s.done && s.played);
  if (!done.length) {
    $("champs-list").innerHTML = `<p class="sub" style="margin:0">No banners yet — the first one gets hung after this season's championship. Make it yours. 🏆</p>`;
    return;
  }
  const short = (t, n) => (t.length > n ? t.slice(0, n - 1) + "…" : t);
  $("champs-list").innerHTML = `<div class="rafters">
    <div class="beam"></div>
    <div class="jersey-row">${done.map((s, i) => `
      <div class="hang" style="animation-delay:${-(i * 1.9)}s">
        <div class="string"></div>
        <svg class="jersey" viewBox="0 0 140 132" role="img" aria-label="${esc(s.season)} championship jersey">
          <path d="M70 10 L44 16 L12 34 L20 58 L36 52 L36 114 Q70 126 104 114 L104 52 L120 58 L128 34 L96 16 Z"
                fill="#ffce3a" stroke="#101836" stroke-width="3" stroke-linejoin="round"/>
          <path d="M56 14 Q70 30 84 14" fill="none" stroke="#101836" stroke-width="4"/>
          <path d="M14 39 L23 55 M126 39 L117 55" stroke="#101836" stroke-width="2.5"/>
          <text x="70" y="46" text-anchor="middle" font-size="10" font-weight="700" fill="#101836" letter-spacing="1">${esc(short((s.champion ? s.champion.name : "—").toUpperCase(), 12))}</text>
          <text x="70" y="86" text-anchor="middle" font-size="26" fill="#101836" class="yr-num">${esc(s.season)}</text>
          <text x="70" y="103" text-anchor="middle" font-size="7.5" font-weight="600" fill="#5c4d10">${esc(short(s.champion ? s.champion.teamName : "", 18))}</text>
        </svg>
        <div class="plaque">
          <b>🏆 ${esc(s.champion ? s.champion.teamName : "not recorded")}</b>
          ${s.runnerUp ? `<div>🥈 def. ${esc(s.runnerUp.teamName)}</div>` : ""}
          ${s.pointsChamp ? `<div>🎯 Points king: ${esc(s.pointsChamp.name)} (${s.pointsChamp.pf.toFixed(1)})</div>` : ""}
          ${s.sacko ? `<div class="sacko-strip">💩 Sacko: ${esc(s.sacko.name)} (${s.sacko.w}-${s.sacko.l})</div>` : ""}
        </div>
      </div>`).join("")}
    </div>
  </div>`;
}

/* ---------------- CONSTITUTION ---------------- */
function renderRules() {
  $("rules-list").innerHTML = CONSTITUTION.map((s) => `
    <h2>${esc(s.section)}</h2>
    ${s.items.map((i) => `<div style="padding:6px 0 6px 4px;border-bottom:1px solid rgba(40,50,85,.4);font-size:13.5px;line-height:1.5">• ${esc(i)}</div>`).join("")}
  `).join("");
}

/* ---------------- VOTE (ballot + tally + proposals) ---------------- */
function propOptions(p) { return p.options || ["Yes", "No"]; }

/* official ballot (config) + league-submitted proposals (shared store) */
function allProps() { return PROPOSALS.concat(state.extraProps || []); }

function renderBallotUI() {
  const list = allProps();
  $("prop-list").innerHTML = list.length ? list.map((p) => `
    <div class="prop">
      <h3>${esc(p.title)} <span class="chip ${esc(p.status)}">${esc(p.status)}</span></h3>
      <div class="details">${esc(p.details || "")}</div>
      ${p.options ? `<div class="details" style="margin-top:4px">Options: ${p.options.map(esc).join(" · ")}</div>`
        : `<div class="details" style="margin-top:4px">Yes/No · ${(p.pass || 0.5) === 0.5 ? "needs a majority to pass" : `needs ${Math.round(p.pass * 100)}% yes to pass`}</div>`}
    </div>`).join("")
    : `<p class="sub">Nothing on the ballot right now. Use “Make a Proposal” below to get something rolling.</p>`;

  // proposals still gathering seconds
  const me = $("ballot-who").value || localStorage.getItem("dhq_me");
  const uname = (uid) => { const u = state.users.find((x) => x.user_id === uid); return u ? u.display_name : "?"; };
  const pendingList = state.pendingProps || [];
  if (pendingList.length) {
    $("prop-list").innerHTML += `<h2 style="font-size:13px;margin:18px 0 4px;color:var(--muted)">✋ NEEDS SECONDS TO HIT THE BALLOT</h2>` +
      pendingList.map((p) => {
        const secs = Object.keys(p.seconds || {});
        const iSeconded = me && secs.includes(me);
        return `<div class="prop">
          <h3 style="font-size:14px">${esc(p.title)} <span class="chip open">${secs.length} of ${SECONDS_NEEDED}</span></h3>
          <div class="details">${esc(p.details || "")}${p.options && p.options.length ? `<div style="margin-top:4px">Options: ${p.options.map(esc).join(" · ")}</div>` : ""}</div>
          <div class="owner" style="margin-top:6px">by ${esc(p.name || "?")} · hands up: ${secs.map((s) => esc(uname(s))).join(", ") || "—"}</div>
          <div style="margin-top:9px"><button class="btn small ${iSeconded ? "" : "gold"}" data-second="${esc(p.id)}">${iSeconded ? "✋ Seconded — tap to withdraw" : `🙋 Second it (${secs.length}/${SECONDS_NEEDED})`}</button></div>
        </div>`;
      }).join("");
  }

  const open = list.filter((p) => p.status === "open");
  // preserve any picks already made before rebuilding
  const kept = {};
  $("ballot-props").querySelectorAll(".prop").forEach((el) => {
    const s = el.querySelector(".vote-opt.sel");
    if (s) kept[el.dataset.prop] = s.dataset.opt;
  });
  if (!open.length) {
    $("ballot-props").innerHTML = `<p class="sub" style="margin-top:12px">No open proposals to vote on.</p>`;
  } else {
    $("ballot-props").innerHTML = open.map((p) => `
      <div class="prop" data-prop="${esc(p.id)}">
        <h3 style="font-size:14px">${esc(p.title)}</h3>
        <div class="vote-opts">
          ${propOptions(p).map((o) => `<button class="vote-opt" data-opt="${esc(o)}">${esc(o)}</button>`).join("")}
          <button class="vote-opt" data-opt="__abstain">Abstain</button>
        </div>
      </div>`).join("");
    $("ballot-props").querySelectorAll(".prop").forEach((el) => {
      el.querySelectorAll(".vote-opt").forEach((b) => {
        if (kept[el.dataset.prop] === b.dataset.opt) b.classList.add("sel");
        b.addEventListener("click", () => {
          el.querySelectorAll(".vote-opt").forEach((x) => x.classList.remove("sel"));
          b.classList.add("sel");
        });
      });
    });
  }
  $("vote-cast-card").style.display = voteStore() && open.length ? "" : "none";
}

function renderVote() {
  renderBallotUI();
  const userOpts = `<option value="">— pick your name —</option>` +
    state.users.map((u) => `<option value="${esc(u.user_id)}">${esc(u.display_name)}${u.metadata && u.metadata.team_name ? ` (${esc(u.metadata.team_name)})` : ""}</option>`).join("");
  $("ballot-who").innerHTML = userOpts;
  $("prop-who").innerHTML = userOpts;
  const me = localStorage.getItem("dhq_me");
  if (me && state.users.some((u) => u.user_id === me)) $("ballot-who").value = me;
  $("prop-article").innerHTML = CONSTITUTION.map((s) => `<option value="${esc(s.section)}">${esc(s.section)}</option>`).join("")
    + `<option value="New article">A brand-new article</option>`;

  const hasStore = !!voteStore();
  $("vote-setup-card").style.display = hasStore ? "none" : "";
  $("store-dead-note").innerHTML = state.storeDead
    ? `<div class="msg err">The league's ballot box disappeared (the free store purged it — it happens). Votes cast so far are lost; tap below for a fresh box, then share the new link and send it to Claude to bake in.</div>` : "";
  if (!hasStore) {
    $("live-results").innerHTML = `<p class="sub" style="margin:0">Live voting isn't switched on yet — commish, hit the card above and it's a 30-second job.</p>`;
  } else {
    refreshLive().catch((e) => { $("live-results").innerHTML = `<div class="msg err">Couldn't reach the ballot box — ${esc(e.message)}</div>`; });
    startLivePolling();
  }
}

/* --- live voting: shared ballot box --- */
function normalizeStoreUrl(u) {
  u = String(u || "").trim();
  const m = u.match(/jsonblob\.com\/(?:api\/jsonBlob\/)?([A-Za-z0-9-]{8,})/i);
  if (m) return `https://jsonblob.com/api/jsonBlob/${m[1]}`;
  return /^https?:\/\//i.test(u) ? u : "";
}
function voteStore() {
  // if the configured box is confirmed dead, fall back to a locally created replacement
  if (state.storeDead) return normalizeStoreUrl(localStorage.getItem("dhq_vote_store") || "");
  return normalizeStoreUrl(VOTING.store || localStorage.getItem("dhq_vote_store") || "");
}
async function storeGet() {
  const r = await fetch(voteStore(), { headers: { Accept: "application/json" } });
  if (r.status === 404 || r.status === 410) {
    if (!state.storeDead) {
      state.storeDead = true;
      if (normalizeStoreUrl(localStorage.getItem("dhq_vote_store") || "") === normalizeStoreUrl(VOTING.store)) localStorage.removeItem("dhq_vote_store");
      if (state.view === "vote") renderVote();
    }
    throw new Error(`ballot box ${r.status}`);
  }
  if (!r.ok) throw new Error(`ballot box ${r.status}`);
  const j = await r.json().catch(() => null);
  return j && typeof j === "object" && j.votes && typeof j.votes === "object" ? j : { votes: {} };
}
async function storePut(doc) {
  const r = await fetch(voteStore(), { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(doc) });
  if (!r.ok) throw new Error(`ballot box ${r.status}`);
}

let liveTimer = null;
function startLivePolling() {
  clearInterval(liveTimer);
  liveTimer = setInterval(() => {
    if (state.view === "vote" && document.visibilityState === "visible" && voteStore())
      refreshLive().catch(() => {});
  }, 20000);
}
async function refreshLive() { renderLiveResults(await storeGet()); }

function renderLiveResults(doc) {
  // league-submitted proposals: 3 seconds puts one on the ballot
  const submitted = Object.values(doc.proposals || {})
    .filter((p) => p && p.title && p.id && !PROPOSALS.some((x) => x.id === p.id))
    .sort((a, b) => (a.ts || 0) - (b.ts || 0));
  const promoted = submitted
    .filter((p) => Object.keys(p.seconds || {}).length >= SECONDS_NEEDED)
    .map((p) => ({
      id: p.id, title: p.title,
      details: (p.details || "") + (p.name ? `${p.details ? " " : ""}(proposed by ${p.name})` : ""),
      options: p.options && p.options.length ? p.options : undefined,
      pass: 0.5, status: "open",
    }));
  const pending = submitted.filter((p) => Object.keys(p.seconds || {}).length < SECONDS_NEEDED);
  if (JSON.stringify(promoted) !== JSON.stringify(state.extraProps || []) ||
      JSON.stringify(pending) !== JSON.stringify(state.pendingProps || [])) {
    state.extraProps = promoted;
    state.pendingProps = pending;
    renderBallotUI();
  }

  const open = allProps().filter((p) => p.status === "open");
  const entries = Object.entries(doc.votes || {});
  const nameOf = (uid) => {
    const u = state.users.find((x) => x.user_id === uid);
    return u ? u.display_name : ((doc.votes[uid] && doc.votes[uid].name) || "?");
  };
  if (!entries.length) {
    $("live-results").innerHTML = `<p class="sub" style="margin:0">No votes yet — be the first on the board. 🗳</p>`;
    return;
  }
  const votedIds = new Set(entries.map(([uid]) => uid));
  const waiting = state.users.filter((u) => !votedIds.has(u.user_id));

  const sections = open.map((p) => {
    const opts = propOptions(p);
    const byOpt = Object.fromEntries(opts.map((o) => [o, []]));
    const abstained = [];
    for (const [uid, rec] of entries) {
      const c = rec && rec.v ? rec.v[p.id] : null;
      if (c === "__abstain") abstained.push(nameOf(uid));
      else if (c != null && byOpt[c]) byOpt[c].push(nameOf(uid));
    }
    const totalCast = opts.reduce((s, o) => s + byOpt[o].length, 0);
    let verdict = "";
    if (!p.options) {
      const need = p.pass || 0.5;
      const yes = byOpt["Yes"] ? byOpt["Yes"].length : 0;
      const no = byOpt["No"] ? byOpt["No"].length : 0;
      const yesFrac = totalCast ? yes / totalCast : 0;
      const passing = totalCast > 0 && yesFrac > need - 1e-9 && (need !== 0.5 || yes > no);
      verdict = totalCast
        ? `<span class="chip ${passing ? "passed" : "failed"}">${passing ? "passing" : "not passing"}</span> <span class="owner">${Math.round(yesFrac * 100)}% yes, needs ${need === 0.5 ? "a majority" : Math.round(need * 100) + "%"}</span>`
        : `<span class="owner">no votes cast</span>`;
    } else {
      const max = Math.max(...opts.map((o) => byOpt[o].length));
      const leaders = opts.filter((o) => byOpt[o].length === max && max > 0);
      verdict = leaders.length === 1 ? `<span class="chip passed">leading: ${esc(leaders[0])}</span>`
        : max > 0 ? `<span class="chip open">tied</span>` : `<span class="owner">no votes cast</span>`;
    }
    return `<div class="prop">
      <h3 style="font-size:14px">${esc(p.title)} ${verdict}</h3>
      ${opts.map((o) => `<div class="tally-row">
        <div class="lbl"><span>${esc(o)}</span><span>${byOpt[o].length}</span></div>
        <div class="bar ${o === "Yes" ? "yes" : ""}"><div style="width:${totalCast ? (byOpt[o].length / totalCast) * 100 : 0}%"></div></div>
        ${byOpt[o].length ? `<div class="owner">${byOpt[o].map(esc).join(", ")}</div>` : ""}
      </div>`).join("")}
      ${abstained.length ? `<div class="owner">Abstained: ${abstained.map(esc).join(", ")}</div>` : ""}
    </div>`;
  }).join("");

  $("live-results").innerHTML = `
    <div class="msg ok">${entries.length} of ${state.users.length} in: ${entries.map(([uid]) => esc(nameOf(uid))).join(", ")}</div>
    ${waiting.length ? `<div class="msg info">Still waiting on: ${waiting.map((u) => esc(u.display_name)).join(", ")}</div>` : `<div class="msg ok">Everyone has voted. 🎉</div>`}
    ${sections}`;
}

$("vote-submit").addEventListener("click", async () => {
  const who = $("ballot-who").value;
  if (!who) { setMsg("vote-out", "err", "Pick your name first."); return; }
  const v = {};
  let missing = 0;
  $("ballot-props").querySelectorAll(".prop").forEach((el) => {
    const sel = el.querySelector(".vote-opt.sel");
    if (!sel) { missing++; return; }
    v[el.dataset.prop] = sel.dataset.opt;
  });
  if (missing) { setMsg("vote-out", "err", `You have ${missing} unanswered proposal${missing > 1 ? "s" : ""} — pick an option (or Abstain) on each.`); return; }
  const user = state.users.find((x) => x.user_id === who);
  $("vote-submit").disabled = true;
  try {
    const doc = await storeGet().catch(() => ({ votes: {} }));
    doc.votes[who] = { name: user ? user.display_name : who, ts: Date.now(), v };
    await storePut(doc);
    localStorage.setItem("dhq_me", who);
    setMsg("vote-out", "ok", `Locked in ✓ — you're on the board, <b>${esc(user ? user.display_name : "friend")}</b>. Change your mind? Vote again and it updates.`);
    renderLiveResults(doc);
  } catch (e) {
    setMsg("vote-out", "err", `Couldn't reach the ballot box — ${esc(e.message)}. Try again in a second.`);
  }
  $("vote-submit").disabled = false;
});

$("store-save").addEventListener("click", async () => {
  const raw = $("store-url").value;
  const url = normalizeStoreUrl(raw);
  if (!url) { setMsg("store-out", "err", "That doesn't look like a URL — paste the address from your browser's address bar after you hit Save on jsonblob.com."); return; }
  setMsg("store-out", "info", "Checking the ballot box…");
  localStorage.setItem("dhq_vote_store", url);
  const wasDead = state.storeDead;
  try {
    state.storeDead = VOTING.store && normalizeStoreUrl(VOTING.store) !== url ? true : false;
    await storeGet();
    renderVote();
    showBoxSuccess(url);
  } catch (e) {
    state.storeDead = wasDead;
    localStorage.removeItem("dhq_vote_store");
    setMsg("store-out", "err", `Couldn't read that ballot box (${esc(e.message)}). Double-check the URL — after you hit Save on jsonblob.com, copy what's in the address bar.`);
  }
});

function boxShareLink(url) {
  return location.origin + location.pathname + "?box=" + encodeURIComponent(url);
}
function showBoxSuccess(url) {
  const share = boxShareLink(url);
  $("vote-out").innerHTML = `
    <div class="msg ok">Ballot box created ✓ — live voting is ON for you right now.</div>
    <p class="sub" style="margin:10px 0 6px">Post this link in the league chat — everyone who opens it is connected automatically:</p>
    <div class="ballot-code" id="box-share-text">${esc(share)}</div>
    <div style="margin-top:10px;display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn gold small" id="box-copy">Copy link</button>
    </div>
    <p class="sub" style="margin-top:10px">(Send it to Claude too and it gets baked into the site permanently — then even the plain link works for new people.)</p>`;
  $("box-copy").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText($("box-share-text").textContent); $("box-copy").textContent = "Copied ✓"; } catch {}
    setTimeout(() => { const b = $("box-copy"); if (b) b.textContent = "Copy link"; }, 1500);
  });
}

async function createBoxExtendsClass() {
  const r = await fetch("https://json.extendsclass.com/bin", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ votes: {} }),
  });
  if (!r.ok) throw new Error("HTTP " + r.status);
  const j = await r.json().catch(() => null);
  const uri = (j && (j.uri || (j.id && "https://json.extendsclass.com/bin/" + j.id))) || null;
  if (!uri) throw new Error("no id in response");
  return uri;
}
async function createBoxJsonblob() {
  const r = await fetch("https://jsonblob.com/api/jsonBlob", {
    method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ votes: {} }),
  });
  if (!r.ok) throw new Error("HTTP " + r.status);
  let loc = r.headers.get("Location") || r.headers.get("X-jsonblob");
  if (!loc) throw new Error("address hidden by browser");
  if (!/^https?:/i.test(loc)) loc = loc.startsWith("/") ? "https://jsonblob.com" + loc : "https://jsonblob.com/api/jsonBlob/" + loc;
  return loc;
}

$("store-create").addEventListener("click", async () => {
  setMsg("store-out", "info", "Creating the ballot box…");
  try {
    let url;
    try { url = await createBoxExtendsClass(); }
    catch { url = await createBoxJsonblob(); }
    localStorage.setItem("dhq_vote_store", url);
    state.storeDead = VOTING.store ? true : false;   // keep ignoring a dead configured box in favor of the new one
    renderVote();
    showBoxSuccess(url);
  } catch (e) {
    setMsg("store-out", "err", `Auto-create didn't work (${esc(e.message)}) — use the manual route below, it always works.`);
  }
});

/* proposal builder */
$("prop-gen").addEventListener("click", async () => {
  const who = $("prop-who").value;
  const title = $("prop-title").value.trim();
  const details = $("prop-details").value.trim();
  const optsRaw = $("prop-options").value.trim();
  if (!who) { $("prop-out").innerHTML = `<div class="msg err">Pick your name first.</div>`; return; }
  if (!title) { $("prop-out").innerHTML = `<div class="msg err">Give it a title.</div>`; return; }
  const user = state.users.find((x) => x.user_id === who);
  const name = user ? user.display_name : "someone";
  const opts = optsRaw ? optsRaw.split(",").map((s) => s.trim()).filter(Boolean) : null;
  const year = state.nfl ? state.nfl.league_season : new Date().getFullYear();
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 30);

  const isBylaw = $("prop-kind").value === "bylaw";
  const article = isBylaw ? $("prop-article").value : null;
  const fullDetails = (isBylaw ? `⚖️ Bylaw amendment — ${article}. ` : "") + details;
  const chatText = `📜 ${isBylaw ? `BYLAW AMENDMENT (${article})` : "RULE PROPOSAL"} from ${name}:\n“${title}”\n${details ? details + "\n" : ""}${opts ? "Options: " + opts.join(" / ") : "Vote: Yes / No"}\nNeeds ${SECONDS_NEEDED} hands up to hit the ballot — second it at ${location.origin}${location.pathname}`;
  const propId = `${year}-${slug}`;

  if (voteStore()) {
    $("prop-out").innerHTML = loadingHtml("Posting it…");
    try {
      const doc = await storeGet().catch(() => ({ votes: {} }));
      doc.proposals = doc.proposals || {};
      doc.proposals[propId] = { id: propId, by: who, name, title, details: fullDetails, options: opts, ts: Date.now(), seconds: { [who]: Date.now() } };
      await storePut(doc);
      localStorage.setItem("dhq_me", who);
      renderLiveResults(doc);
      $("prop-out").innerHTML = `
        <div class="msg ok">Posted ✓ — your hand is up as 1 of ${SECONDS_NEEDED}. When ${SECONDS_NEEDED - 1} more second it, “${esc(title)}” goes live on the ballot automatically.</div>
        <p class="sub" style="margin:10px 0 6px">Drop this in the league chat to rally the seconds:</p>
        <div class="ballot-code" id="prop-chat-text">${esc(chatText)}</div>`;
      $("prop-title").value = ""; $("prop-details").value = ""; $("prop-options").value = "";
    } catch (e) {
      $("prop-out").innerHTML = `<div class="msg err">Couldn't reach the ballot box — ${esc(e.message)}. Try again in a second.</div>`;
    }
  } else {
    $("prop-out").innerHTML = `
      <div class="msg ok">Here's your proposal — paste the message in the league chat to start the debate.</div>
      <div class="ballot-code" id="prop-chat-text">${esc(chatText)}</div>`;
  }
  $("prop-copy").classList.remove("hidden");
});

$("prop-kind").addEventListener("change", () => {
  $("prop-article-wrap").classList.toggle("hidden", $("prop-kind").value !== "bylaw");
});
$("rules-propose").addEventListener("click", () => {
  showView("vote");
  $("prop-kind").value = "bylaw";
  $("prop-article-wrap").classList.remove("hidden");
  $("prop-title").scrollIntoView({ behavior: "smooth", block: "center" });
});

/* seconding: tap to raise/withdraw your hand for a pending proposal */
document.addEventListener("click", async (e) => {
  const b = e.target.closest("[data-second]");
  if (!b) return;
  const me = $("ballot-who").value || localStorage.getItem("dhq_me");
  if (!me) { setMsg("vote-out", "err", "Pick your name in “Cast Your Vote” first, then second it."); $("vote-cast-card").scrollIntoView({ behavior: "smooth" }); return; }
  b.disabled = true;
  try {
    const doc = await storeGet().catch(() => ({ votes: {} }));
    const p = (doc.proposals || {})[b.dataset.second];
    if (p) {
      p.seconds = p.seconds || {};
      if (p.seconds[me]) delete p.seconds[me];
      else p.seconds[me] = Date.now();
      await storePut(doc);
      localStorage.setItem("dhq_me", me);
      renderLiveResults(doc);
    }
  } catch (err) {
    setMsg("vote-out", "err", `Couldn't reach the ballot box — ${esc(err.message)}.`);
    b.disabled = false;
  }
});

$("prop-copy").addEventListener("click", async () => {
  const el = $("prop-chat-text");
  if (!el) return;
  try { await navigator.clipboard.writeText(el.textContent); $("prop-copy").textContent = "Copied ✓"; } catch {}
  setTimeout(() => { $("prop-copy").textContent = "Copy for the chat"; }, 1500);
});

/* ---------------- add-to-home-screen nudge (first visit, mobile only) ---------------- */
let installEvent = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  installEvent = e;
  const b = $("a2hs");
  if (b && !b.classList.contains("hidden")) {
    $("a2hs-install").classList.remove("hidden");
    $("a2hs-steps").textContent = "One tap and it lives on your home screen like an app.";
  }
});
(function a2hsNudge() {
  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/.test(ua);
  const isAndroid = /Android/.test(ua);
  const standalone = (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone;
  if (localStorage.getItem("dhq_a2hs") || standalone || (!isIOS && !isAndroid)) return;
  $("a2hs-steps").innerHTML = isIOS
    ? `In Safari: tap <span class="kbd">Share&nbsp;⎋</span> then <span class="kbd">Add to Home Screen&nbsp;➕</span> — it becomes an app icon.`
    : `In Chrome: tap <span class="kbd">⋮</span> then <span class="kbd">Add to Home screen</span> — it becomes an app icon.`;
  setTimeout(() => {
    $("a2hs").classList.remove("hidden");
    localStorage.setItem("dhq_a2hs", "1");   // one showing, ever — installed or not
    if (installEvent) {
      $("a2hs-install").classList.remove("hidden");
      $("a2hs-steps").textContent = "One tap and it lives on your home screen like an app.";
    }
  }, 1600);
  const dismiss = () => { $("a2hs").classList.add("hidden"); localStorage.setItem("dhq_a2hs", "1"); };
  $("a2hs-close").addEventListener("click", dismiss);
  $("a2hs-install").addEventListener("click", async () => {
    if (!installEvent) return dismiss();
    installEvent.prompt();
    try { await installEvent.userChoice; } catch {}
    dismiss();
  });
})();

boot();
