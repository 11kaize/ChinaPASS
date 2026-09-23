/* Offline views for the arrival notes, the guide library, and the personal
   address card.

   Deliberately small. This file used to also render a home-page travel hero and
   an itinerary planner ("7 days, first-timer route"); both were removed because
   the product is about clearing your first days in China, not about where to go
   or how long to stay. What is left is content you need *while arriving*:
   which airport or station your ticket actually names, and a Chinese address
   card you can hold up for a driver.

   The city module keeps no search or filter — six entries do not need one, and
   the travel-themed filters (Heritage / City life / Nature) went with the rest.

   Chrome strings live in cityWords()/helpWords() rather than the UI dict in
   data.js, because app.js's t() is sealed inside its own IIFE and this file
   cannot reach it. That mirrors how helpWords() already worked. */
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
  let help = get('cp-help', { hotel: '', address: '', contact: '' });
  let guideQuery = '', guideType = 'All';
  const heading = (title, detail, tag = '') => `<div class="page-heading explore-heading">${tag ? `<span class="heading-tag">${esc(tag)}</span>` : ''}<h1>${esc(title)}</h1><p>${esc(detail)}</p></div>`;

  /* Airport and station names are shown as <bdi> chips: they are Chinese text
     sitting inside a left-to-right sentence, and a few of them mix Latin
     letters (PEK, PKX) in. bdi keeps the bidi ordering sane without forcing a
     direction on the whole page. */
  const nameChip = value => `<span class="name-chip"><bdi>${esc(value)}</bdi></span>`;

  function cityWords() {
    return {
      en: { tag: 'ARRIVAL NOTES', title: 'Which airport, which station', detail: 'A city can have two airports and several railway stations, and the Chinese names look nothing alike. Keep the one on your ticket in front of you.', airport: 'Airport', stations: 'Railway stations', note: 'What catches people out', back: 'All cities', notFound: 'City not found', notFoundBody: 'Pick another city from the list.', browse: 'Browse cities →', sourceNote: 'Names and codes change. Confirm with the operator before you travel.', sourceTitle: 'Official source', homeTitle: 'Airport and station names', homeBody: 'Six cities, with the Chinese names you may need to show someone.', homeLink: 'See the names', open: 'Details' },
      zh: { tag: '落地提示', title: '哪个机场，哪个车站', detail: '一座城市可能有两个机场、好几个火车站，中文名看着完全不同。把票上的那一个留在眼前。', airport: '机场', stations: '火车站', note: '最容易踩的坑', back: '全部城市', notFound: '没有这座城市', notFoundBody: '从列表里另选一个。', browse: '浏览城市 →', sourceNote: '名称与代码会变，出行前请与承运方确认。', sourceTitle: '官方来源', homeTitle: '机场与车站中文名', homeBody: '六座城市，以及可能需要出示给别人的中文名。', homeLink: '查看中文名', open: '查看详情' },
      ja: { tag: '到着メモ', title: 'どの空港、どの駅か', detail: '一つの都市に空港が二つ、駅が複数あることがあり、中国語名は全く似ていません。チケットに書かれた名前を手元に。', airport: '空港', stations: '鉄道駅', note: 'つまずきやすい点', back: 'すべての都市', notFound: '都市が見つかりません', notFoundBody: '一覧から選び直してください。', browse: '都市を見る →', sourceNote: '名称とコードは変わります。移動前に事業者へ確認してください。', sourceTitle: '公式情報', homeTitle: '空港と駅の中国語名', homeBody: '6都市と、見せる必要があるかもしれない中国語名。', homeLink: '中国語名を見る', open: '詳細を見る' },
      ko: { tag: '도착 메모', title: '어느 공항, 어느 역', detail: '한 도시에 공항이 둘, 기차역이 여럿일 수 있고 중국어 이름은 전혀 다릅니다. 표에 적힌 이름을 확인하세요.', airport: '공항', stations: '기차역', note: '가장 자주 하는 실수', back: '모든 도시', notFound: '도시를 찾을 수 없습니다', notFoundBody: '목록에서 다시 선택하세요.', browse: '도시 보기 →', sourceNote: '이름과 코드는 바뀝니다. 이동 전에 운영사에 확인하세요.', sourceTitle: '공식 출처', homeTitle: '공항·역 중국어 이름', homeBody: '6개 도시와 보여줘야 할 수 있는 중국어 이름.', homeLink: '중국어 이름 보기', open: '자세히 보기' }
    }[language] || {};
  }

  /* The list card is a lookup table, not an article: name, then the names you
     may have to show someone. The "what catches people out" note lives on the
     detail page — carrying it here made each card tall enough that a phone
     showed barely one city at a time. */
  function cityCard(item) {
    const w = cityWords();
    return `<article class="city-card"><a href="#/city/${item.id}" class="city-card-main"><h2>${esc(item.name)} <small><bdi>${esc(item.zh)}</bdi></small></h2><div class="name-row">${item.airport.map(nameChip).join('')}</div><div class="name-row">${item.stations.map(nameChip).join('')}</div></a><div class="city-card-foot"><a class="city-open" href="#/city/${item.id}">${esc(w.open)} <span aria-hidden="true">↗</span></a></div></article>`;
  }
  function citiesPage() {
    const w = cityWords();
    return `${heading(w.title, w.detail, w.tag)}<div class="city-grid">${CITIES.map(cityCard).join('')}</div><div class="source-note">${esc(w.sourceNote)}</div>`;
  }
  function cityPage(id) {
    const item = city(id);
    const w = cityWords();
    if (!item) return `${heading(w.notFound, w.notFoundBody)}<a class="text-link" href="#/cities">${esc(w.browse)}</a>`;
    return `<a href="#/cities" class="back-link">← ${esc(w.back)}</a>
      <section class="city-detail-hero"><div><h1>${esc(item.name)}</h1><p class="city-zh"><bdi>${esc(item.zh)}</bdi></p></div></section>
      <div class="detail-grid"><article>
        <section class="detail-section"><h2>${esc(w.airport)}</h2><div class="name-row">${item.airport.map(nameChip).join('')}</div></section>
        <section class="detail-section"><h2>${esc(w.stations)}</h2><div class="name-row">${item.stations.map(nameChip).join('')}</div></section>
        <section class="detail-section"><h2>${esc(w.note)}</h2><p>${esc(item.note)}</p></section>
      </article><aside class="detail-aside"><h2>${esc(w.sourceTitle)}</h2><p>${esc(w.sourceNote)}</p>${source(item.source)}</aside></div>`;
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

  /* A small block for the home page, sitting below the task grid rather than
     above it. It replaced a full-width travel hero.

     No "some of this is still English" banner here, unlike every other explore
     route: the block's own text is Chinese city names, which are the payload
     rather than a gloss, so there is nothing on this screen that falls back. */
  function homeBlock(code = 'en') {
    language = code;
    const w = cityWords();
    return `<section class="section"><div class="section__h"><h2>${esc(w.homeTitle)}</h2><a href="#/cities">${esc(w.homeLink)} →</a></div><button class="panel city-teaser" data-go="/cities"><span class="city-teaser__body"><span class="city-teaser__d">${esc(w.homeBody)}</span><span class="city-teaser__names">${CITIES.slice(0, 6).map(item => nameChip(item.zh)).join('')}</span></span><span class="city-teaser__go" aria-hidden="true">›</span></button></section>`;
  }

  function render(route, code = 'en') {
    language = code;
    const [first, id] = route.split('/');
    if (first === 'cities') return { html: citiesPage(), active: 'cities' };
    if (first === 'city') return { html: cityPage(id), active: 'cities' };
    if (first === 'guides') return { html: guidesPage(), active: 'guides' };
    if (first === 'guide') return { html: guidePage(id), active: 'guides' };
    if (first === 'help') return { html: helpPage(), active: 'help' };
    return null;
  }
  function bind(refresh, openCards) {
    const rerenderList = (target, renderList) => { const node = $(target); if (node) node.innerHTML = renderList(); bind(refresh, openCards); };
    if ($('#guide-query')) $('#guide-query').oninput = event => { guideQuery = event.target.value; rerenderList('#guide-results', guideResults); };
    if ($('#guide-type')) $('#guide-type').onchange = event => { guideType = event.target.value; rerenderList('#guide-results', guideResults); };
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
      ...CITIES.filter(item => `${item.name} ${item.zh} ${item.airport} ${item.stations.join(' ')}`.toLowerCase().includes(term)).map(item => ({ html: `<a class="explore-search-result" href="#/city/${item.id}"><b>${esc(item.name)} · ${esc(item.zh)}</b><small>Airport &amp; station names</small></a>` })),
      ...allGuides().filter(item => !item.scene && `${item.title} ${item.summary}`.toLowerCase().includes(term)).map(item => ({ html: `<a class="explore-search-result" href="#/guide/${item.id}"><b>${esc(item.title)}</b><small>Guide · ${esc(item.category)}</small></a>` }))
    ];
  }
  return { homeBlock, render, bind, search };
})();
