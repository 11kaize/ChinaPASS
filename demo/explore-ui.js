/* Offline city, itinerary, guide, and personal help-card views. */
const CPExplore = (() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  let language = 'en';
  const localized = value => value && typeof value === 'object' ? (value[language] ?? value.en ?? '') : value;
  const esc = value => String(localized(value) ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const get = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  const put = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private file mode */ } };
  const source = item => `<a class="text-link" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${esc(item.label)} ↗</a>`;
  const city = id => CITIES.find(item => item.id === id);
  const guide = id => EXPLORE_GUIDES.find(item => item.id === id);
  let plan = get('cp-plan', []);
  let help = get('cp-help', { hotel: '', address: '', contact: '' });
  let cityQuery = '', cityType = 'All', guideQuery = '', guideType = 'All';
  const heading = (title, detail, tag = '') => `<div class="page-heading explore-heading">${tag ? `<span class="heading-tag">${esc(tag)}</span>` : ''}<h1>${esc(title)}</h1><p>${esc(detail)}</p></div>`;

  function cityCard(item) {
    return `<article class="city-card"><a href="#/city/${item.id}" class="city-card-main"><span class="city-kicker">${esc(item.region)} · ${esc(item.type)}</span><h2>${esc(item.name)} <small>${esc(item.zh)}</small></h2><p>${esc(item.summary)}</p><span class="city-open">Explore city <span aria-hidden="true">↗</span></span></a><div class="city-card-foot"><span>Suggested ${item.suggestedDays} days</span><button class="mini-button" data-add-city="${item.id}" aria-label="Add ${esc(item.name)} to trip">${plan.some(stop => stop.id === item.id) ? 'In your trip ✓' : 'Add to trip +'}</button></div></article>`;
  }
  function cityResults() {
    const query = cityQuery.trim().toLowerCase();
    const matches = CITIES.filter(item => (cityType === 'All' || item.type === cityType) && (`${item.name} ${item.zh} ${item.region} ${item.summary} ${item.highlights.join(' ')}`).toLowerCase().includes(query));
    return matches.length ? matches.map(cityCard).join('') : '<div class="filter-empty">No matching cities. Try another place or theme.</div>';
  }
  function citiesPage() {
    return `${heading('Find your next stop', 'Six starting points with concise, offline-friendly notes. Check current booking details with each city’s official source.', 'CITY EXPLORER')}<div class="explore-toolbar"><label class="field-search"><span>Search cities</span><input type="search" id="city-query" placeholder="City, region, or highlight" value="${esc(cityQuery)}"></label><label class="field-select"><span>Travel mood</span><select id="city-type">${['All', 'Heritage', 'City life', 'Nature'].map(type => `<option ${cityType === type ? 'selected' : ''}>${type}</option>`).join('')}</select></label></div><div class="city-grid" id="city-results">${cityResults()}</div><div class="source-note">City notes are a starting point. Opening hours, reservations, and transport can change.</div>`;
  }
  function cityPage(id) {
    const item = city(id);
    if (!item) return `${heading('City not found', 'Choose another destination from the city explorer.')}<a class="text-link" href="#/cities">Browse cities →</a>`;
    return `<a href="#/cities" class="back-link">← All cities</a><section class="city-detail-hero"><div><span class="city-kicker">${esc(item.region)} · ${esc(item.type)}</span><h1>${esc(item.name)} <small>${esc(item.zh)}</small></h1><p>${esc(item.summary)}</p><button class="button button--primary" data-add-city="${item.id}">${plan.some(stop => stop.id === item.id) ? 'In your trip ✓' : 'Add to my trip +'}</button></div><span class="city-detail-days">${item.suggestedDays}<small>suggested days</small></span></section><div class="detail-grid"><article><section class="detail-section"><h2>Start with these</h2><ol class="highlight-list">${item.highlights.map(point => `<li>${esc(point)}</li>`).join('')}</ol></section><section class="detail-section"><h2>A local taste</h2><p>${esc(item.food)}</p></section><section class="detail-section"><h2>Before you set out</h2><p>${esc(item.practical)}</p></section></article><aside class="detail-aside"><h2>Check the source</h2><p>Use official information for tickets and changing visitor rules.</p>${source(item.source)}<a class="text-link" href="#/plan">Open my trip →</a></aside></div>`;
  }

  function guideCard(item) {
    const href = item.scene ? `#/s/${item.id}` : `#/guide/${item.id}`;
    return `<a class="guide-card" href="${href}"><span class="guide-card-meta">${esc(item.category)} · ${esc(item.duration)}</span><h2>${esc(item.title)}</h2><p>${esc(item.summary)}</p><span>Read guide ↗</span></a>`;
  }
  function allGuides() {
    return [
      ...EXPLORE_GUIDES,
      ...SCENES.map(item => ({ id: item.id, title: item.title, category: item.priority === 'P0' ? 'Essentials' : 'On the trip', duration: item.eta || 'Quick guide', summary: item.subtitle, scene: true }))
    ];
  }
  function guideResults() {
    const query = guideQuery.trim().toLowerCase();
    const matches = allGuides().filter(item => (guideType === 'All' || item.category === guideType) && (`${item.title} ${item.summary} ${item.category}`).toLowerCase().includes(query));
    return matches.length ? matches.map(guideCard).join('') : '<div class="filter-empty">No matching guides. Try another topic.</div>';
  }
  function guidesPage() {
    return `${heading('A guide for the next step', 'Practical tasks and short explainers you can return to throughout the journey.', 'GUIDE LIBRARY')}<div class="explore-toolbar"><label class="field-search"><span>Search guides</span><input type="search" id="guide-query" placeholder="Payment, train, documents…" value="${esc(guideQuery)}"></label><label class="field-select"><span>Topic</span><select id="guide-type">${['All', 'Before departure', 'Essentials', 'On the trip'].map(type => `<option ${guideType === type ? 'selected' : ''}>${type}</option>`).join('')}</select></label></div><div class="guide-grid" id="guide-results">${guideResults()}</div>`;
  }
  function guidePage(id) {
    const item = guide(id);
    if (!item) return `${heading('Guide not found', 'Choose another guide from the library.')}<a class="text-link" href="#/guides">Browse guides →</a>`;
    return `<a href="#/guides" class="back-link">← All guides</a>${heading(item.title, item.summary, `${item.category.toUpperCase()} · ${item.duration.toUpperCase()}`)}<div class="guide-detail"><div class="guide-steps">${item.steps.map(([title, description], index) => `<section><span>${String(index + 1).padStart(2, '0')}</span><div><h2>${esc(title)}</h2><p>${esc(description)}</p></div></section>`).join('')}</div><aside class="detail-aside"><h2>Confirm the latest details</h2><p>Policies and booking steps can change.</p>${source(item.source)}</aside></div>`;
  }

  function totalDays() { return plan.reduce((sum, stop) => sum + Number(stop.days || 0), 0); }
  function planRows() {
    return plan.length ? plan.map((stop, index) => {
      const item = city(stop.id);
      if (!item) return '';
      return `<article class="plan-stop"><span class="plan-number">${String(index + 1).padStart(2, '0')}</span><div class="plan-stop-copy"><a href="#/city/${item.id}"><h2>${esc(item.name)} <small>${esc(item.zh)}</small></h2></a><p>${esc(item.summary)}</p></div><label class="days-input"><span>Days</span><input type="number" min="1" max="30" step="1" value="${Number(stop.days)}" data-plan-days="${item.id}" aria-label="Days in ${esc(item.name)}"></label><div class="plan-controls"><button data-plan-move="${item.id}" data-direction="-1" aria-label="Move ${esc(item.name)} up" ${index === 0 ? 'disabled' : ''}>↑</button><button data-plan-move="${item.id}" data-direction="1" aria-label="Move ${esc(item.name)} down" ${index === plan.length - 1 ? 'disabled' : ''}>↓</button><button data-plan-remove="${item.id}" aria-label="Remove ${esc(item.name)}">Remove</button></div></article>`;
    }).join('') : `<div class="plan-empty"><h2>Start with a city</h2><p>Choose a sample route below, or add individual places from the city explorer.</p><a class="button button--quiet" href="#/cities">Browse cities →</a></div>`;
  }
  function planPage() {
    return `${heading('Make the trip yours', 'Arrange stops and days in a lightweight plan saved on this device.', 'MY TRIP')}<div class="plan-summary"><div><span>YOUR ROUTE</span><strong>${plan.length ? plan.map(stop => city(stop.id)?.name).filter(Boolean).join(' → ') : 'Your route starts here'}</strong></div><b>${totalDays()} <small>days</small></b></div><div class="plan-layout"><div><div id="plan-rows">${planRows()}</div><div class="plan-add"><label for="add-city-select">Add another stop</label><select id="add-city-select"><option value="">Choose a city…</option>${CITIES.filter(item => !plan.some(stop => stop.id === item.id)).map(item => `<option value="${item.id}">${esc(item.name)}</option>`).join('')}</select><button class="button button--quiet" id="add-selected-city">Add city</button></div></div><aside class="plan-side"><h2>Try a starting route</h2><p>Sample pacing only. Adjust any stop or day to fit your interests.</p><button data-preset="classic">7 days · first-timer route <span>Beijing · Xi’an · Shanghai</span></button><button data-preset="extended">10 days · food and history <span>Beijing · Xi’an · Chengdu · Shanghai</span></button><p class="plan-data-note">Stored locally on this device. No account or booking is created.</p></aside></div>`;
  }

  function helpWords() {
    return {
      en: { title: 'A card for getting help', desc: 'Keep your destination in Chinese and show it to a driver, station staff member, or passerby.', tag: 'PERSONAL HELP CARD', hotel: 'Hotel or destination name in Chinese', address: 'Full address in Chinese', contact: 'Contact phone (optional)', phone: 'Phone number', show: 'Show full-screen card', clear: 'Clear my details', note: 'Add a Chinese address to enable the full-screen card. Details are saved only on this device; clear them when using a shared device. Avoid adding sensitive medical or passport information.', preview: 'SHOW TO SOMEONE NEARBY', hotelExample: 'Your hotel name in Chinese', addressExample: 'Your destination address in Chinese', emergency: 'Emergency numbers', police: 'Police', ambulance: 'Ambulance', fire: 'Fire', guide: 'Open emergency guide' },
      zh: { title: '随身地址求助卡', desc: '保存中文目的地，向司机、车站工作人员或附近的人全屏出示。', tag: '个人求助卡', hotel: '酒店或目的地中文名称', address: '中文完整地址', contact: '联系电话（可选）', phone: '电话号码', show: '全屏展示', clear: '清除我的信息', note: '填写中文地址后才能全屏展示。信息仅保存在本设备；共用设备请及时清除。不要填写病历或护照等敏感信息。', preview: '向身边的人展示', hotelExample: '酒店中文名称', addressExample: '目的地中文地址', emergency: '紧急电话', police: '报警', ambulance: '急救', fire: '火警', guide: '打开紧急求助指南' },
      ja: { title: '住所を見せるカード', desc: '目的地の中国語住所を保存し、運転手や駅員に全画面で見せられます。', tag: '個人用住所カード', hotel: 'ホテル・目的地の中国語名', address: '中国語の住所', contact: '連絡先電話番号（任意）', phone: '電話番号', show: '全画面で表示', clear: '情報を消去', note: '中国語の住所を入力すると表示できます。情報はこの端末にのみ保存されます。共有端末では消去してください。', preview: '近くの人に見せる', hotelExample: 'ホテルの中国語名', addressExample: '目的地の中国語住所', emergency: '緊急電話', police: '警察', ambulance: '救急', fire: '消防', guide: '緊急時のガイド' },
      ko: { title: '주소 도움 카드', desc: '중국어 목적지를 저장하고 운전기사나 역 직원에게 전체 화면으로 보여주세요.', tag: '개인 주소 카드', hotel: '호텔 또는 목적지의 중국어 이름', address: '중국어 전체 주소', contact: '연락처 전화번호(선택)', phone: '전화번호', show: '전체 화면으로 보기', clear: '내 정보 지우기', note: '중국어 주소를 입력하면 전체 화면으로 볼 수 있습니다. 정보는 이 기기에만 저장됩니다. 공용 기기에서는 삭제하세요.', preview: '주변 사람에게 보여주기', hotelExample: '호텔의 중국어 이름', addressExample: '목적지의 중국어 주소', emergency: '긴급 전화', police: '경찰', ambulance: '구급', fire: '소방', guide: '긴급 도움 안내 열기' }
    }[language] || {};
  }
  function helpPreview() {
    const w = helpWords();
    const hotel = help.hotel.trim() || w.hotelExample;
    const address = help.address.trim() || w.addressExample;
    const contact = help.contact.trim();
    return `<span>${esc(w.preview)}</span><strong>请带我去这里</strong><b>${esc(hotel)}</b><p>${esc(address)}</p>${contact ? `<small>联系电话：${esc(contact)}</small>` : ''}`;
  }
  function helpPage() {
    const w = helpWords();
    return `${heading(w.title, w.desc, w.tag)}<div class="help-layout"><section class="help-form"><label><span>${esc(w.hotel)}</span><input id="help-hotel" autocomplete="off" maxlength="80" placeholder="例如：北京国际饭店" value="${esc(help.hotel)}"></label><label><span>${esc(w.address)}</span><textarea id="help-address" rows="4" maxlength="220" placeholder="例如：北京市东城区…">${esc(help.address)}</textarea></label><label><span>${esc(w.contact)}</span><input id="help-contact" inputmode="tel" maxlength="35" placeholder="${esc(w.phone)}" value="${esc(help.contact)}"></label><div class="help-actions"><button class="button button--primary" id="show-help-card" ${help.address.trim() ? '' : 'disabled'}>${esc(w.show)}</button><button class="button button--quiet" id="clear-help-card">${esc(w.clear)}</button></div><p class="privacy-note">${esc(w.note)}</p></section><aside><div class="help-preview" id="help-preview">${helpPreview()}</div><div class="help-emergency"><h2>${esc(w.emergency)}</h2><p>${esc(w.police)} <a href="tel:110">110</a> · ${esc(w.ambulance)} <a href="tel:120">120</a> · ${esc(w.fire)} <a href="tel:119">119</a></p><a class="text-link" href="#/s/emergency">${esc(w.guide)} →</a></div></aside></div>`;
  }
  function helpPhrase() {
    const lines = ['请带我去这里', help.hotel.trim(), help.address.trim(), help.contact.trim() ? `联系电话：${help.contact.trim()}` : ''].filter(Boolean);
    return { zh: lines.join('\n'), en: 'Please take me to this address.', ja: 'この住所まで連れて行ってください。', ko: '이 주소로 데려다 주세요.' };
  }
  function home(code = 'en') {
    language = code;
    const copy = {
      en: { eyebrow: 'YOUR CHINA TRAVEL COMPANION', lead: 'Feel ready for', accent: 'what’s next.', intro: 'Explore places, shape your route, and keep useful phrases close for the moments that matter.', cities: 'Explore cities', trip: 'Plan my trip', offline: 'Useful on the web, desktop, and offline after your first visit.', caption: 'A calmer way to travel through China', discover: '01 / DISCOVER', discoverTitle: 'Choose your next stop', discoverBody: 'Six city starting points, local highlights, and links to official visitor information.', discoverLink: 'Explore cities', organize: '02 / ORGANIZE', organizeTitle: 'Keep a simple route', organizeBody: 'Reorder stops and adjust days whenever plans change.', organizeLink: 'Open my trip', prepare: '03 / FEEL PREPARED', prepareTitle: 'Show where you need to go', prepareBody: 'Save a Chinese address as a clear, full-screen card for getting help nearby.', prepareLink: 'Create help card' },
      zh: { eyebrow: '你的中国旅行助手', lead: '下一站，', accent: '从容出发。', intro: '探索城市、安排行程，并把实用中文短句放在手边。', cities: '探索城市', trip: '规划行程', offline: '网页、桌面端均可使用；首次访问后可离线查看。', caption: '更从容地游历中国', discover: '01 / 探索', discoverTitle: '选择下一站', discoverBody: '从六座城市出发，查看亮点及官方游览信息。', discoverLink: '查看城市', organize: '02 / 规划', organizeTitle: '保留一份简单行程', organizeBody: '随时调整城市顺序和停留天数。', organizeLink: '打开行程', prepare: '03 / 准备', prepareTitle: '展示你要去的地方', prepareBody: '保存中文地址，在需要时全屏出示。', prepareLink: '制作地址卡' },
      ja: { eyebrow: '中国旅行のパートナー', lead: '次の旅へ、', accent: '安心して。', intro: '都市を探し、旅程を組み、必要な中国語フレーズを手元に。', cities: '都市を探す', trip: '旅程を作る', offline: 'ウェブとデスクトップで利用でき、初回アクセス後はオフラインでも使えます。', caption: '落ち着いて中国を旅する', discover: '01 / 発見', discoverTitle: '次の目的地を選ぶ', discoverBody: '6都市の見どころと公式の観光情報を確認。', discoverLink: '都市を見る', organize: '02 / 計画', organizeTitle: 'シンプルな旅程', organizeBody: '都市の順番や滞在日数をいつでも変更できます。', organizeLink: '旅程を開く', prepare: '03 / 準備', prepareTitle: '行き先を見せる', prepareBody: '中国語の住所を保存し、全画面で表示できます。', prepareLink: '住所カードを作る' },
      ko: { eyebrow: '중국 여행 동반자', lead: '다음 여행도', accent: '든든하게.', intro: '도시를 살펴보고 일정을 짜며 필요한 중국어 표현을 가까이 두세요.', cities: '도시 둘러보기', trip: '일정 만들기', offline: '웹과 데스크톱에서 이용하며 처음 방문한 뒤에는 오프라인에서도 볼 수 있습니다.', caption: '더 여유로운 중국 여행', discover: '01 / 탐색', discoverTitle: '다음 목적지 선택', discoverBody: '6개 도시의 볼거리와 공식 방문 정보를 확인하세요.', discoverLink: '도시 보기', organize: '02 / 계획', organizeTitle: '간단한 여행 일정', organizeBody: '도시 순서와 머무는 날짜를 언제든 조정하세요.', organizeLink: '일정 열기', prepare: '03 / 준비', prepareTitle: '목적지 보여주기', prepareBody: '중국어 주소를 저장하고 전체 화면으로 보여주세요.', prepareLink: '주소 카드 만들기' }
    }[language] || {};
    const saved = plan.length ? {
      en: `${plan.length} stops · ${totalDays()} days saved`, zh: `已保存 ${plan.length} 站 · ${totalDays()} 天`,
      ja: `${plan.length}都市・${totalDays()}日を保存`, ko: `${plan.length}곳 · ${totalDays()}일 저장`
    }[language] : '';
    const notice = language === 'en' ? '' : `<p class="explore-language-note">${esc({ zh: '城市与新增攻略的详细摘要目前为英文。', ja: '都市情報と追加ガイドの詳細は現在英語です。', ko: '도시 정보와 추가 가이드의 자세한 내용은 현재 영어로 제공됩니다.' }[language])}</p>`;
    return `<section class="travel-hero"><div class="travel-hero-copy"><span class="eyebrow">${esc(copy.eyebrow)}</span><h1>${esc(copy.lead)} <em>${esc(copy.accent)}</em></h1><p>${esc(copy.intro)}</p><div class="welcome-actions"><a class="button button--primary" href="#/cities">${esc(copy.cities)} <span>↗</span></a><a class="button button--quiet" href="#/plan">${esc(copy.trip)}</a></div><span class="hero-footnote">${esc(copy.offline)}</span></div><div class="travel-hero-image"><img src="hero-rail.png" alt="Traveler beside a high-speed train at a mountain station"><span class="hero-image-caption">${esc(copy.caption)}</span></div></section><section class="home-paths"><a href="#/cities" class="home-path"><span>${esc(copy.discover)}</span><h2>${esc(copy.discoverTitle)}</h2><p>${esc(copy.discoverBody)}</p><b>${esc(copy.discoverLink)} ↗</b></a><a href="#/plan" class="home-path"><span>${esc(copy.organize)}</span><h2>${esc(copy.organizeTitle)}</h2><p>${saved ? `${esc(saved)}${language === 'en' ? '. ' : '。'}` : ''}${esc(copy.organizeBody)}</p><b>${esc(copy.organizeLink)} ↗</b></a><a href="#/help" class="home-path"><span>${esc(copy.prepare)}</span><h2>${esc(copy.prepareTitle)}</h2><p>${esc(copy.prepareBody)}</p><b>${esc(copy.prepareLink)} ↗</b></a></section>${notice}`;
  }

  function render(route, code = 'en') {
    language = code;
    const [first, id] = route.split('/');
    if (first === 'cities') return { html: citiesPage(), active: 'cities' };
    if (first === 'city') return { html: cityPage(id), active: 'cities' };
    if (first === 'guides') return { html: guidesPage(), active: 'guides' };
    if (first === 'guide') return { html: guidePage(id), active: 'guides' };
    if (first === 'plan') return { html: planPage(), active: 'plan' };
    if (first === 'help') return { html: helpPage(), active: 'help' };
    return null;
  }
  function bind(refresh, openCards) {
    const rerenderList = (target, renderList) => { const node = $(target); if (node) node.innerHTML = renderList(); bind(refresh, openCards); };
    if ($('#city-query')) $('#city-query').oninput = event => { cityQuery = event.target.value; rerenderList('#city-results', cityResults); };
    if ($('#city-type')) $('#city-type').onchange = event => { cityType = event.target.value; rerenderList('#city-results', cityResults); };
    if ($('#guide-query')) $('#guide-query').oninput = event => { guideQuery = event.target.value; rerenderList('#guide-results', guideResults); };
    if ($('#guide-type')) $('#guide-type').onchange = event => { guideType = event.target.value; rerenderList('#guide-results', guideResults); };
    $$('[data-add-city]').forEach(button => button.onclick = () => {
      const id = button.dataset.addCity;
      if (!plan.some(stop => stop.id === id)) plan.push({ id, days: city(id).suggestedDays });
      put('cp-plan', plan); refresh();
    });
    $$('[data-plan-days]').forEach(input => input.onchange = () => {
      const stop = plan.find(item => item.id === input.dataset.planDays);
      if (stop) stop.days = Math.min(30, Math.max(1, Number.parseInt(input.value, 10) || 1));
      put('cp-plan', plan); refresh();
    });
    $$('[data-plan-remove]').forEach(button => button.onclick = () => { plan = plan.filter(stop => stop.id !== button.dataset.planRemove); put('cp-plan', plan); refresh(); });
    $$('[data-plan-move]').forEach(button => button.onclick = () => {
      const index = plan.findIndex(stop => stop.id === button.dataset.planMove);
      const next = index + Number(button.dataset.direction);
      if (index < 0 || next < 0 || next >= plan.length) return;
      [plan[index], plan[next]] = [plan[next], plan[index]]; put('cp-plan', plan); refresh();
    });
    $$('[data-preset]').forEach(button => button.onclick = () => {
      plan = button.dataset.preset === 'classic' ? [{ id: 'beijing', days: 3 }, { id: 'xian', days: 2 }, { id: 'shanghai', days: 2 }] : [{ id: 'beijing', days: 3 }, { id: 'xian', days: 2 }, { id: 'chengdu', days: 3 }, { id: 'shanghai', days: 2 }];
      put('cp-plan', plan); refresh();
    });
    if ($('#add-selected-city')) $('#add-selected-city').onclick = () => {
      const id = $('#add-city-select').value;
      if (!city(id) || plan.some(stop => stop.id === id)) return;
      plan.push({ id, days: city(id).suggestedDays }); put('cp-plan', plan); refresh();
    };
    [['hotel', '#help-hotel'], ['address', '#help-address'], ['contact', '#help-contact']].forEach(([field, selector]) => {
      if ($(selector)) $(selector).oninput = event => { help[field] = event.target.value; put('cp-help', help); $('#help-preview').innerHTML = helpPreview(); $('#show-help-card').disabled = !help.address.trim(); };
    });
    if ($('#show-help-card')) $('#show-help-card').onclick = () => openCards([helpPhrase()], 'PERSONAL HELP CARD');
    if ($('#clear-help-card')) $('#clear-help-card').onclick = () => { help = { hotel: '', address: '', contact: '' }; put('cp-help', help); refresh(); };
  }
  function search(q) {
    if (!q) return [];
    const term = q.toLowerCase();
    return [
      ...CITIES.filter(item => `${item.name} ${item.zh} ${item.region} ${item.summary}`.toLowerCase().includes(term)).map(item => ({ html: `<a class="explore-search-result" href="#/city/${item.id}"><b>${esc(item.name)} · ${esc(item.zh)}</b><small>City · ${esc(item.region)}</small></a>` })),
      ...allGuides().filter(item => !item.scene && `${item.title} ${item.summary}`.toLowerCase().includes(term)).map(item => ({ html: `<a class="explore-search-result" href="#/guide/${item.id}"><b>${esc(item.title)}</b><small>Guide · ${esc(item.category)}</small></a>` }))
    ];
  }
  return { home, render, bind, search };
})();
