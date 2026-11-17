
(() => {
  'use strict';

  const catalog = [
    { name: 'Morbius', image: 'im-36.png', type: 'Movie', genres: ['Action', 'Horror', 'Sci-Fi'], page: 'movie.html', year: 2022 },
    { name: 'Bhaijaan', image: 'im-37.png', type: 'Movie', genres: ['Action', 'Drama'], page: 'movie.html', year: 2023 },
    { name: 'Suraj Pe Mangal Bhari', image: 'im-38.png', type: 'Movie', genres: ['Comedy', 'Drama'], page: 'movie.html', year: 2020 },
    { name: 'Pathaan', image: 'im-39.png', type: 'Movie', genres: ['Action', 'Thriller'], page: 'movie.html', year: 2023 },
    { name: 'Ant-Man', image: 'im-40.png', type: 'Movie', genres: ['Action', 'Adventure', 'Sci-Fi'], page: 'movie.html', year: 2015 },
    { name: 'Adipurush', image: 'im-41.png', type: 'Movie', genres: ['Action', 'Adventure', 'Fantasy'], page: 'movie.html', year: 2023 },
    { name: 'Gun Shot', image: 'im-42.png', type: 'Movie', genres: ['Action', 'Thriller'], page: 'movie.html', year: 2023 },
    { name: 'Sin City', image: 'im-43.png', type: 'Movie', genres: ['Action', 'Crime', 'Thriller'], page: 'movie.html', year: 2005 },
    { name: 'Tomorrow War', image: 'im-44.png', type: 'Movie', genres: ['Action', 'Sci-Fi'], page: 'movie.html', year: 2021 },
    { name: 'Misfire', image: 'im-45.png', type: 'Movie', genres: ['Action', 'Thriller'], page: 'movie.html', year: 2014 },
    { name: 'Kantara', image: 'im-46.png', type: 'Movie', genres: ['Drama', 'Thriller'], page: 'movies&showes.html', year: 2022 },
    { name: 'Pushpa', image: 'im-47.png', type: 'Movie', genres: ['Action', 'Drama'], page: 'movie.html', year: 2021 },
    { name: 'Blade Runner 2049', image: 'im-48.png', type: 'Movie', genres: ['Sci-Fi', 'Drama', 'Thriller'], page: 'movie.html', year: 2017 },
    { name: 'Stranger Things', image: 'im-86.png', type: 'TV Show', genres: ['Sci-Fi', 'Horror', 'Drama'], page: 'shows.html', year: 2016 },
    { name: 'Money Heist', image: 'im-87.png', type: 'TV Show', genres: ['Crime', 'Thriller', 'Drama'], page: 'shows.html', year: 2017 },
    { name: 'Lucifer', image: 'im-88.png', type: 'TV Show', genres: ['Fantasy', 'Crime', 'Drama'], page: 'shows.html', year: 2016 },
    { name: 'The Gray Man', image: 'im-89.png', type: 'Movie', genres: ['Action', 'Thriller'], page: 'movie.html', year: 2022 },
    { name: 'High Town', image: 'im-90.png', type: 'TV Show', genres: ['Crime', 'Drama'], page: 'shows.html', year: 2020 },
    { name: 'Mirzapur', image: 'im-91.png', type: 'TV Show', genres: ['Crime', 'Action', 'Drama'], page: 'shows.html', year: 2018 },
    { name: 'Breathe Into the Shadows', image: 'im-92.png', type: 'TV Show', genres: ['Crime', 'Thriller'], page: 'shows.html', year: 2020 },
    { name: 'Peaky Blinders', image: 'im-93.png', type: 'TV Show', genres: ['Crime', 'Drama'], page: 'shows.html', year: 2013 },
    { name: 'Duranga', image: 'im-94.png', type: 'TV Show', genres: ['Crime', 'Thriller', 'Drama'], page: 'shows.html', year: 2022 },
    { name: 'Mai', image: 'im-96.png', type: 'TV Show', genres: ['Drama', 'Thriller'], page: 'shows.html', year: 2022 }
  ];

  const KEYS = { favorites: 'streamvibe_favorites', watchlist: 'streamvibe_watchlist', theme: 'streamvibe_theme', chat: 'streamvibe_chat_history' };
  const isCodePage = /\/code\//i.test(location.pathname);
  const imageBase = isCodePage ? '../images2/' : './images2/';
  const pageBase = isCodePage ? '' : './code/';
  const read = key => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  let favorites = read(KEYS.favorites);
  let watchlist = read(KEYS.watchlist);

  const esc = value => String(value).replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
  const getItem = name => catalog.find(item => item.name === name);
  const toast = message => {
    let box = document.querySelector('.sv-toast');
    if (!box) { box = document.createElement('div'); box.className = 'sv-toast'; document.body.appendChild(box); }
    box.textContent = message; box.classList.add('show');
    clearTimeout(toast.timer); toast.timer = setTimeout(() => box.classList.remove('show'), 2600);
  };

  function addToList(listName, name) {
    const list = listName === 'favorites' ? favorites : watchlist;
    const key = listName === 'favorites' ? KEYS.favorites : KEYS.watchlist;
    const label = listName === 'favorites' ? 'Favorites' : 'Watchlist';
    const index = list.indexOf(name);
    if (index >= 0) { list.splice(index, 1); toast(`${name} removed from ${label}`); }
    else { list.push(name); toast(`${name} added to ${label}`); }
    if (listName === 'favorites') favorites = list; else watchlist = list;
    write(key, list);
    document.querySelector(`[data-count="${listName}"]`)?.replaceChildren(document.createTextNode(String(list.length)));
    refreshPanels();
  }

  function itemCard(item) {
    const fav = favorites.includes(item.name), saved = watchlist.includes(item.name);
    return `<article class="sv-media-card">
      <img src="${imageBase}${encodeURIComponent(item.image)}" alt="${esc(item.name)}" loading="lazy" onerror="this.style.opacity='.2'">
      <div class="sv-media-info"><strong>${esc(item.name)}</strong><small>${esc(item.type)} · ${item.year}</small>
      <div class="sv-card-actions">
        <button type="button" data-action="favorite" data-name="${esc(item.name)}" aria-label="Toggle favorite" class="${fav?'active':''}"><i class="bi ${fav?'bi-heart-fill':'bi-heart'}"></i></button>
        <button type="button" data-action="watchlist" data-name="${esc(item.name)}" aria-label="Toggle watchlist" class="${saved?'active':''}"><i class="bi ${saved?'bi-bookmark-check-fill':'bi-bookmark-plus'}"></i></button>
        <button type="button" data-action="details" data-name="${esc(item.name)}" aria-label="Open details"><i class="bi bi-arrow-up-right"></i></button>
      </div></div></article>`;
  }

  function showPanel(title, content, className = '') {
    let overlay = document.querySelector('.sv-overlay');
    if (!overlay) { overlay = document.createElement('div'); overlay.className = 'sv-overlay'; document.body.appendChild(overlay); }
    overlay.innerHTML = `<section class="sv-panel ${className}" role="dialog" aria-modal="true" aria-label="${esc(title)}"><header><h2>${esc(title)}</h2><button class="sv-close" type="button" aria-label="Close">&times;</button></header><div class="sv-panel-content">${content}</div></section>`;
    overlay.classList.add('open');
    overlay.querySelector('.sv-close').addEventListener('click', closePanel);
    overlay.addEventListener('click', e => { if (e.target === overlay) closePanel(); });
    document.addEventListener('keydown', escPanel, { once: true });
  }
  function escPanel(e) { if (e.key === 'Escape') closePanel(); }
  function closePanel() { document.querySelector('.sv-overlay')?.classList.remove('open'); }

  function renderCollection(title, names) {
    const items = names.map(getItem).filter(Boolean);
    showPanel(title, items.length ? `<div class="sv-grid">${items.map(itemCard).join('')}</div>` : `<div class="sv-empty"><i class="bi bi-film"></i><p>Your ${title.toLowerCase()} list is empty.</p><span>Add titles from Explore or the assistant.</span></div>`);
  }

  function renderExplore() {
    const content = `<div class="sv-toolbar"><input id="sv-filter-search" type="search" placeholder="Find a title..." aria-label="Find a title"><select id="sv-type-filter"><option value="all">All types</option><option>Movie</option><option>TV Show</option></select><select id="sv-genre-filter"><option value="all">All genres</option>${['Action','Adventure','Comedy','Crime','Drama','Fantasy','Horror','Sci-Fi','Thriller'].map(g=>`<option>${g}</option>`).join('')}</select><select id="sv-sort"><option value="az">Name: A–Z</option><option value="za">Name: Z–A</option><option value="new">Newest year</option><option value="old">Oldest year</option></select></div><div class="sv-grid" id="sv-explore-grid">${catalog.map(itemCard).join('')}</div>`;
    showPanel('Explore Movies & Shows', content, 'sv-explore-panel');
    const update = () => {
      const q = document.getElementById('sv-filter-search').value.toLowerCase().trim();
      const type = document.getElementById('sv-type-filter').value;
      const genre = document.getElementById('sv-genre-filter').value;
      const sort = document.getElementById('sv-sort').value;
      let list = catalog.filter(item => item.name.toLowerCase().includes(q) && (type === 'all' || item.type === type) && (genre === 'all' || item.genres.includes(genre)));
      list.sort((a,b) => sort==='za' ? b.name.localeCompare(a.name) : sort==='new' ? b.year-a.year : sort==='old' ? a.year-b.year : a.name.localeCompare(b.name));
      document.getElementById('sv-explore-grid').innerHTML = list.length ? list.map(itemCard).join('') : '<p class="sv-empty-line">No titles match your filters.</p>';
    };
    ['sv-filter-search','sv-type-filter','sv-genre-filter','sv-sort'].forEach(id => document.getElementById(id).addEventListener(id==='sv-filter-search'?'input':'change', update));
  }

  function details(item) {
    showPanel(item.name, `<div class="sv-detail"><img src="${imageBase}${esc(item.image)}" alt="${esc(item.name)}"><div><span class="sv-badge">${esc(item.type)}</span><p>${item.year} · ${item.genres.map(esc).join(' / ')}</p><p>Explore this title in StreamVibe. The current project catalog contains its poster and basic category information.</p><button class="sv-primary" data-action="favorite" data-name="${esc(item.name)}"><i class="bi bi-heart"></i> ${favorites.includes(item.name)?'Remove Favorite':'Add to Favorites'}</button> <button class="sv-secondary" data-action="watchlist" data-name="${esc(item.name)}"><i class="bi bi-bookmark-plus"></i> Watchlist</button><a class="sv-secondary sv-link" href="${pageBase}${item.page}">Open page</a></div></div>`);
  }

  const normalize = s => s.toLowerCase().replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي');
  function assistantReply(message) {
    const q = normalize(message);
    const genreMap = [
      { keys:['action','اكشن','حركه','قتال'], genre:'Action', intro:'لو بتحب الأكشن، جرّب الاختيارات دي:' },
      { keys:['comedy','كوميدي','ضحك','مضحك'], genre:'Comedy', intro:'للكوميديا، ممكن تبدأ بـ:' },
      { keys:['horror','رعب','مخيف'], genre:'Horror', intro:'لو عايز أجواء رعب وتشويق:' },
      { keys:['crime','جريمه','عصابات'], genre:'Crime', intro:'دي اختيارات من أجواء الجريمة:' },
      { keys:['sci-fi','خيال علمي','فضاء'], genre:'Sci-Fi', intro:'لو بتحب الخيال العلمي:' },
      { keys:['drama','دراما'], genre:'Drama', intro:'دي ترشيحات درامية:' },
      { keys:['thriller','تشويق','غموض'], genre:'Thriller', intro:'للتشويق والغموض:' }
    ];
    if (q.includes('hello') || q.includes('hi') || q.includes('مرحبا') || q.includes('السلام') || q.includes('ازيك')) return { text:'أهلًا بيك في StreamVibe! 🎬 أقدر أساعدك تختار فيلم أو مسلسل من العناوين الموجودة في الموقع. جرّب تقول: عايز أكشن، أو رشحلي مسلسل.' };
    if (q.includes('help') || q.includes('مساعده') || q.includes('تقدر تعمل')) return { text:'أقدر أرشح لك عناوين حسب النوع، أو أقترح مسلسلات وأفلام من مكتبة الموقع. اكتب نوع بتحبه زي الأكشن أو الجريمة أو الخيال العلمي.' };
    if (q.includes('مسلسل') || q.includes('series') || q.includes('tv show')) {
      const items = catalog.filter(x=>x.type==='TV Show').slice(0,5);
      return { text:'دي بعض المسلسلات الموجودة في مكتبة الموقع:', items };
    }
    if (q.includes('فيلم') || q.includes('movie') || q.includes('film')) {
      const items = catalog.filter(x=>x.type==='Movie').slice(0,5);
      return { text:'دي بعض الأفلام الموجودة في مكتبة الموقع:', items };
    }
    const found = genreMap.find(g=>g.keys.some(k=>q.includes(normalize(k))));
    if (found) {
      const items = catalog.filter(x=>x.genres.includes(found.genre)).slice(0,5);
      return { text:found.intro, items };
    }
    const named = catalog.find(x=>q.includes(normalize(x.name)));
    if (named) return { text:`${named.name} موجود في مكتبة الموقع. نوعه ${named.type}، وتصنيفاته ${named.genres.join('، ')}. تقدر تضيفه للمفضلة أو قائمة المشاهدة من Explore.` , items:[named] };
    if (q.includes('favorite') || q.includes('مفضله')) return { text:`عندك ${favorites.length} عنوان في المفضلة. افتح زر Favorites لمشاهدتهم.` };
    if (q.includes('watchlist') || q.includes('قائمه المشاهده')) return { text:`قائمة المشاهدة فيها ${watchlist.length} عنوان. افتح زر Watchlist لعرضها.` };
    if (q.includes('مشابه') || q.includes('similar') || q.includes('زي') || q.includes('like')) {
      const title = catalog.find(x => q.includes(normalize(x.name)));
      if (title) {
        const similar = catalog.filter(x => x.name !== title.name && x.genres.some(g => title.genres.includes(g))).slice(0,5);
        return { text:`لو عجبك ${title.name}، جرب الأعمال دي اللي بتشاركه بعض التصنيفات:`, items:similar };
      }
      return { text:'اكتب اسم فيلم أو مسلسل من مكتبة الموقع، وأنا أقترح لك أعمالًا قريبة منه.' };
    }
    if (q.includes('مزاج') || q.includes('mood') || q.includes('فرحان') || q.includes('زهقان')) {
      const genre = (q.includes('ضحك') || q.includes('مبسوط') || q.includes('happy')) ? 'Comedy' : (q.includes('توتر') || q.includes('حماس') || q.includes('excited')) ? 'Action' : (q.includes('غموض') || q.includes('mystery')) ? 'Thriller' : 'Drama';
      const picks = catalog.filter(x => x.genres.includes(genre)).slice(0,5);
      return { text:`على حسب كلامك، دي ترشيحات من تصنيف ${genre}:`, items:picks };
    }
    if (q.includes('random') || q.includes('فاجئني') || q.includes('اختارلي')) {
      const picks = [...catalog].sort(() => Math.random() - 0.5).slice(0,3);
      return { text:'دي 3 اختيارات عشوائية من مكتبة StreamVibe:', items:picks };
    }
    return { text:'لسه معرفش أجاوب على السؤال ده. أنا مساعد تجريبي بقواعد JavaScript ومخصص لمكتبة StreamVibe. اسألني عن الأكشن أو الرعب أو الكوميديا أو المسلسلات، أو اكتب اسم عمل واطلب أعمالًا مشابهة.' };
  }

  function openChat() {
    const history = read(KEYS.chat);
    const messages = history.length ? history : [{role:'bot', text:'أهلًا! أنا StreamVibe Assistant 🤖\nتحب أرشح لك فيلم ولا مسلسل؟ واكتب النوع اللي بتحبه.'}];
    const html = `<div class="sv-chat-log" id="sv-chat-log">${messages.map(renderMessage).join('')}</div><div class="sv-chat-suggestions"><button data-prompt="رشحلي فيلم أكشن">فيلم أكشن</button><button data-prompt="عايز مسلسل">مسلسلات</button><button data-prompt="رشحلي خيال علمي">خيال علمي</button></div><div class="sv-chat-tools"><button type="button" id="sv-chat-clear">مسح المحادثة</button></div><form class="sv-chat-form" id="sv-chat-form"><input id="sv-chat-input" autocomplete="off" placeholder="اكتب رسالتك..." aria-label="Chat message" maxlength="300"><button type="submit" aria-label="Send message"><i class="bi bi-send-fill"></i></button></form>
    <p class="sv-chat-note"></p>`;
    showPanel('StreamVibe Assistant', html, 'sv-chat-panel');
    const log = document.getElementById('sv-chat-log'); log.scrollTop = log.scrollHeight;
    document.getElementById('sv-chat-form').addEventListener('submit', e=>{ e.preventDefault(); sendChat(); });
    document.getElementById('sv-chat-clear').addEventListener('click',()=>{ localStorage.removeItem(KEYS.chat); openChat(); });
    document.querySelectorAll('[data-prompt]').forEach(btn=>btn.addEventListener('click',()=>{ document.getElementById('sv-chat-input').value=btn.dataset.prompt; sendChat(); }));
    document.getElementById('sv-chat-input').focus();
  }
  function renderMessage(msg) {
    const cards = (msg.items||[]).map(item=>`<div class="sv-chat-item"><img src="${imageBase}${esc(item.image)}" alt=""><span>${esc(item.name)}<small>${esc(item.type)}</small></span><button data-action="favorite" data-name="${esc(item.name)}" title="Favorite"><i class="bi bi-heart"></i></button></div>`).join('');
    return `<div class="sv-chat-message ${msg.role==='user'?'user':'bot'}"><p>${esc(msg.text).replace(/\n/g,'<br>')}</p>${cards}</div>`;
  }
  function sendChat() {
    const input = document.getElementById('sv-chat-input');
    const text = input.value.trim(); if (!text) return;
    const history = read(KEYS.chat); history.push({role:'user',text});
    const answer = assistantReply(text); history.push({role:'bot',...answer});
    write(KEYS.chat, history.slice(-30));
    const log = document.getElementById('sv-chat-log'); log.innerHTML = history.slice(-30).map(renderMessage).join(''); log.scrollTop = log.scrollHeight;
    input.value = '';
  }

  function refreshPanels() {
    const overlay = document.querySelector('.sv-overlay.open');
    if (!overlay) return;
    const title = overlay.querySelector('header h2')?.textContent;
    if (title === 'Favorites') renderCollection('Favorites', favorites);
    else if (title === 'Watchlist') renderCollection('Watchlist', watchlist);
    else if (title === 'Explore Movies & Shows') renderExplore();
  }

  function buildUI() {
    const dock = document.createElement('div'); dock.className = 'sv-dock';
    dock.innerHTML = `<button type="button" data-open="explore" title="Explore"><i class="bi bi-grid"></i><span>Explore</span></button><button type="button" data-open="favorites" title="Favorites"><i class="bi bi-heart"></i><span>Favorites</span><b data-count="favorites">${favorites.length}</b></button><button type="button" data-open="watchlist" title="Watchlist"><i class="bi bi-bookmark"></i><span>Watchlist</span><b data-count="watchlist">${watchlist.length}</b></button><button type="button" data-open="chat" class="sv-chat-launch" title="Chat assistant"><i class="bi bi-robot"></i><span>Ask AI</span></button></div>`;
    document.body.appendChild(dock);
    const top = document.createElement('button'); top.className='sv-top'; top.type='button'; top.innerHTML='<i class="bi bi-arrow-up"></i>'; top.setAttribute('aria-label','Back to top'); document.body.appendChild(top);
    dock.addEventListener('click', e=>{
      const btn=e.target.closest('[data-open]'); if(!btn)return;
      if(btn.dataset.open==='explore') renderExplore();
      if(btn.dataset.open==='favorites') renderCollection('Favorites',favorites);
      if(btn.dataset.open==='watchlist') renderCollection('Watchlist',watchlist);
      if(btn.dataset.open==='chat') openChat();
    });
    top.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
    window.addEventListener('scroll',()=>top.classList.toggle('visible',window.scrollY>450),{passive:true});
  }

  function setupTheme() {
    const saved=localStorage.getItem(KEYS.theme); if(saved==='light') document.body.classList.add('sv-light-theme');
    const theme=document.createElement('button'); theme.type='button'; theme.className='sv-theme-toggle'; theme.innerHTML='<i class="bi bi-sun"></i>'; theme.title='Toggle theme'; theme.setAttribute('aria-label','Toggle light and dark theme');
    document.body.appendChild(theme);
    theme.addEventListener('click',()=>{ document.body.classList.toggle('sv-light-theme'); const light=document.body.classList.contains('sv-light-theme'); localStorage.setItem(KEYS.theme,light?'light':'dark'); theme.innerHTML=`<i class="bi ${light?'bi-moon':'bi-sun'}"></i>`; toast(light?'Light theme enabled':'Dark theme enabled'); });
    if(saved==='light') theme.innerHTML='<i class="bi bi-moon"></i>';
  }

  function setupNotifications() {
    document.querySelectorAll('.bi-bell').forEach(icon=>{
      icon.style.cursor='pointer'; icon.setAttribute('role','button'); icon.setAttribute('aria-label','Notifications');
      icon.addEventListener('click',()=>toast('You are all caught up! No new notifications.'));
    });
  }

  function setupForms() {
    document.querySelectorAll('form').forEach(form=>{
      if (form.id === 'sv-chat-form') return;
      form.addEventListener('submit', event=>{
        event.preventDefault();
        if (!form.checkValidity()) { event.stopPropagation(); toast('Please complete the required fields correctly.'); }
        else toast('Form checked successfully. Connect a server to submit and store messages.');
        form.classList.add('was-validated');
      });
      form.querySelectorAll('input[type="email"]').forEach(input=>input.setAttribute('autocomplete','email'));
    });
  }

  function setupSliders() {
    document.querySelectorAll('.cast-slider').forEach(slider=>{
      const wrapper = slider.parentElement;
      const buttons = wrapper.parentElement.querySelectorAll('.nav-btn');
      if (buttons.length < 2) return;
      buttons[0].addEventListener('click',()=>slider.scrollBy({left:-slider.clientWidth * .75,behavior:'smooth'}));
      buttons[1].addEventListener('click',()=>slider.scrollBy({left:slider.clientWidth * .75,behavior:'smooth'}));
    });
  }

  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', event=>{
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase()==='k') {
        event.preventDefault();
        const searchIcon = document.querySelector('.nav-icons .bi-search, .icons .bi-search, .navbar .bi-search');
        searchIcon?.click();
      }
    });
  }

  document.addEventListener('click', event=>{
    const action=event.target.closest('[data-action]'); if(!action)return;
    const name=action.dataset.name; const item=getItem(name); if(!item)return;
    if(action.dataset.action==='favorite') addToList('favorites',name);
    if(action.dataset.action==='watchlist') addToList('watchlist',name);
    if(action.dataset.action==='details') details(item);
  });

  document.addEventListener('DOMContentLoaded',()=>{
    buildUI(); setupTheme(); setupNotifications(); setupForms(); setupSliders(); setupKeyboardShortcuts();
    document.addEventListener('keydown',e=>{ if(e.key==='Escape') closePanel(); });
  });
  window.StreamVibe = { catalog, get favorites(){return [...favorites];}, get watchlist(){return [...watchlist];}, openExplore:renderExplore, openAssistant:openChat };
})();
