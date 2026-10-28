const initAvatar = () => {
  const $ = (s) => document.querySelector(s);
  const applyTheme = () => { const dark = localStorage.getItem('pixelPartyTheme') === 'dark'; document.body.classList.toggle('dark-mode', dark); const button = document.querySelector('.theme-toggle'); if (button) button.textContent = dark ? '☀' : '☾'; };
  const header = document.querySelector('.site-header,.game-header');
  if (header && !document.querySelector('.theme-toggle')) { const themeButton = document.createElement('button'); themeButton.className = 'theme-toggle'; themeButton.type = 'button'; themeButton.setAttribute('aria-label','Toggle dark mode'); themeButton.onclick = () => { const dark = document.body.classList.toggle('dark-mode'); localStorage.setItem('pixelPartyTheme', dark ? 'dark' : 'light'); themeButton.textContent = dark ? '☀' : '☾'; }; header.appendChild(themeButton); }
  applyTheme();
  const modal = $('#avatarModal');

  if (modal) {
    const welcome = $('#avatarWelcome'), choose = $('#avatarChoose'), next = $('#skinNext');
    let gender = '';
    const close = () => { modal.classList.remove('is-open'); modal.setAttribute('aria-hidden', 'true'); };
    if (!sessionStorage.getItem('pixelPartyAvatarPrompted')) { modal.classList.add('is-open'); modal.setAttribute('aria-hidden', 'false'); sessionStorage.setItem('pixelPartyAvatarPrompted', '1'); }
    $('#avatarStart').onclick = () => { welcome.hidden = true; choose.hidden = false; };
    $('#avatarClose').onclick = close;
    $('#avatarChooseClose').onclick = close;
    document.querySelectorAll('.avatar-option').forEach((option) => option.onclick = () => { document.querySelectorAll('.avatar-option').forEach((item) => item.classList.remove('selected')); option.classList.add('selected'); gender = option.dataset.gender; next.hidden = false; });
    next.onclick = () => { if (gender) window.location.href = `avatar.html?gender=${gender}`; };
  }

  if ($('#skinPalette')) {
    const preview = $('#skinPreview'), palette = $('#skinPalette'), save = $('#saveAvatar');
    const params = new URLSearchParams(window.location.search), gender = params.get('gender') || 'boy';
    preview.classList.add(`${gender}-preview`);
    let selectedColor = '';
    palette.querySelectorAll('button').forEach((swatch) => swatch.onclick = () => { palette.querySelectorAll('button').forEach((item) => item.classList.remove('selected')); swatch.classList.add('selected'); selectedColor = swatch.dataset.color; preview.style.setProperty('--skin-color', selectedColor); save.disabled = false; });
    save.onclick = () => { if (!selectedColor) return; localStorage.setItem('pixelPartyAvatar', JSON.stringify({ gender, skin: selectedColor })); window.location.href = 'index.html'; };
  }

  const getPoints = () => +(localStorage.getItem('pixelPartyPoints') || sessionStorage.getItem('pixelPartyPoints') || 0);
  const updatePoints = () => { document.querySelectorAll('#partyPoints,#shopPoints').forEach(el => el.textContent = getPoints()); };
  updatePoints(); window.addEventListener('pixelPartyPoints:update', updatePoints);
  if ($('#shopModal')) {
    const avatarData = JSON.parse(localStorage.getItem('pixelPartyAvatar') || '{"gender":"boy","skin":"#efb98f"}');
    const clothes = avatarData.gender === 'girl' ? [{name:'Sunset dress',price:5,color:'#ec7ba2'},{name:'Cloud dress',price:10,color:'#a08df2'},{name:'Star gown',price:25,color:'#5d70d8'},{name:'Royal party dress',price:60,color:'#d2a235'},{name:'Rainbow couture',price:90,color:'linear-gradient(90deg,#ff7698,#a08df2,#64c9b4)'}] : [{name:'Neon t-shirt',price:5,color:'#6488e3'},{name:'Pixel t-shirt',price:10,color:'#55bca5'},{name:'Galaxy tee',price:25,color:'#3d4b9b'},{name:'Golden jacket',price:60,color:'#d2a235'},{name:'Rainbow varsity',price:90,color:'linear-gradient(90deg,#ff7698,#a08df2,#64c9b4)'}];
    const hair = [{name:'Classic black',price:4,color:'#3c2c32'},{name:'Chocolate curls',price:8,color:'#704638'},{name:'Sky blue',price:15,color:'#62a9df'},{name:'Pink pop',price:20,color:'#e56d9e'},{name:'Golden crown',price:50,color:'#f1bd3e'},{name:'Galaxy glow',price:100,color:'linear-gradient(90deg,#5c4bd5,#ef75bd)'}];
    const backgrounds = [{name:'Soft mint',price:2,color:'#e4f4ec'},{name:'Warm cream',price:3,color:'#fffaf0'},{name:'Sky blue',price:5,color:'#e6f2fa'},{name:'Lavender',price:8,color:'#f0edff'},{name:'Peach glow',price:10,color:'#fff0e5'},{name:'Star ocean',price:100,color:'linear-gradient(135deg,#1d4770,#67b8c1)'}];
    const renderHistory=()=>{const history=JSON.parse(localStorage.getItem('pixelPartyPurchaseHistory')||'[]'),historyBox=$('#purchaseHistory');historyBox.innerHTML=history.length?history.slice().reverse().map(entry=>`<div class="history-row"><span>${entry.name}<small>${entry.type}</small></span><b>−${entry.price} ✦</b></div>`).join(''):'<span class="portal-muted">No purchases yet.</span>';}; renderHistory();
    const card = (item,type) => { const key=type+item.name; const alreadyOwned=()=>((JSON.parse(localStorage.getItem('pixelPartyAvatar')||'{}').owned||[]).includes(key)); const el=document.createElement('button'); el.className='shop-item'; el.dataset.action=alreadyOwned()?'Wear!':'Buy!'; el.innerHTML=`<span class="shop-swatch" style="--shop-color:${item.color}"></span><span><b>${item.name}</b><small>${item.price} ✦</small></span>`; if(alreadyOwned())el.classList.add('owned'); el.onclick=()=>{const current=JSON.parse(localStorage.getItem('pixelPartyAvatar')||'{}');current.owned=current.owned||[];if(!current.owned.includes(key)){if(getPoints()<item.price){el.classList.add('not-enough');setTimeout(()=>el.classList.remove('not-enough'),500);return}localStorage.setItem('pixelPartyPoints',getPoints()-item.price);current.owned.push(key);const history=JSON.parse(localStorage.getItem('pixelPartyPurchaseHistory')||'[]');history.push({name:item.name,type,price:item.price});localStorage.setItem('pixelPartyPurchaseHistory',JSON.stringify(history));renderHistory();el.classList.add('owned');el.dataset.action='Wear!'}current[type]=item.color;current[`${type}Name`]=item.name;localStorage.setItem('pixelPartyAvatar',JSON.stringify(current));updatePoints();if(type==='background')document.body.style.background=item.color;if(type==='hair'){const corner=document.querySelector('.corner-avatar');if(corner){corner.classList.add('has-hair');corner.style.setProperty('--hair-color',item.color)}}if(type==='clothes'){const corner=document.querySelector('.corner-avatar');if(corner)corner.style.setProperty('--clothes-color',item.color)}};return el;};
    clothes.forEach(item=>$('#clothingItems').appendChild(card(item,'clothes'))); hair.forEach(item=>$('#hairItems').appendChild(card(item,'hair'))); backgrounds.forEach(item=>$('#backgroundItems').appendChild(card(item,'background')));
    $('#shopToggle').onclick=()=>{$('#shopModal').hidden=false;updatePoints()}; document.querySelectorAll('[data-close]').forEach(btn=>btn.onclick=()=>{document.getElementById(btn.dataset.close).hidden=true});
    $('#searchToggle').onclick=()=>{$('#portalSearch').hidden=!$('#portalSearch').hidden;$('#gameSearch').focus()}; $('#gameSearch').oninput=e=>{const q=e.target.value.toLowerCase();$('#searchResults').innerHTML=[['Country Snake','snake.html','Travel with a local animal'],['Color Rush','reaction.html','Chase the right color'],['Treasure Dash','treasure.html','Explore hidden islands']].filter(g=>g[0].toLowerCase().includes(q)).map(g=>`<a href="${g[1]}"><b>${g[0]}</b><small>${g[2]}</small></a>`).join('')};
    const volumeSlider=$('#volumeSlider'),volumeValue=$('#volumeValue'),savedVolume=sessionStorage.getItem('pixelPartyVolume')||'70'; volumeSlider.value=savedVolume; volumeValue.textContent=savedVolume+'%'; $('#voiceButton').onclick=()=>{$('#voiceModal').hidden=false;}; volumeSlider.oninput=()=>{sessionStorage.setItem('pixelPartyVolume',volumeSlider.value);volumeValue.textContent=volumeSlider.value+'%';};
  }
  const saved = localStorage.getItem('pixelPartyAvatar');
  if (saved && !document.querySelector('.corner-avatar')) {
    const avatar = JSON.parse(saved), corner = document.createElement('div');
    corner.className = `corner-avatar ${avatar.gender === 'girl' ? 'corner-girl' : 'corner-boy'}${avatar.hair ? ' has-hair' : ''}`;
    corner.innerHTML = '<span class="corner-hair"></span><span class="corner-face">•ᴗ•</span><span class="corner-body"></span><span class="corner-label">your avatar</span>';
    corner.style.setProperty('--skin-color', avatar.skin); if (avatar.clothes) corner.style.setProperty('--clothes-color', avatar.clothes); if (avatar.hair) corner.style.setProperty('--hair-color', avatar.hair); if (avatar.background) document.body.style.background = avatar.background; document.body.appendChild(corner);
    const changeBubble=document.createElement('div'); changeBubble.className='avatar-change-bubble'; changeBubble.innerHTML='<b>Want a bit changing?</b><span><button class="change-yes">Yes</button><button class="change-no">No</button></span>'; corner.appendChild(changeBubble); corner.onclick=()=>changeBubble.classList.toggle('show'); changeBubble.querySelector('.change-no').onclick=(event)=>{event.stopPropagation();changeBubble.classList.remove('show')}; changeBubble.querySelector('.change-yes').onclick=(event)=>{event.stopPropagation();if(modal){modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');$('#avatarWelcome').hidden=false;$('#avatarChoose').hidden=true;changeBubble.classList.remove('show')}else{sessionStorage.removeItem('pixelPartyAvatarPrompted');window.location.href='index.html'}};
    const face = corner.querySelector('.corner-face'), hair = corner.querySelector('.corner-hair');
    document.addEventListener('mousemove', (event) => { const box = corner.getBoundingClientRect(); const lookX = Math.max(-5, Math.min(5, (event.clientX - (box.left + box.width / 2)) / 28)); const lookY = Math.max(-4, Math.min(4, (event.clientY - (box.top + 42)) / 32)); const look = `translate(${lookX}px, ${lookY}px)`; face.style.transform = look; if (hair) hair.style.transform = look; });
  }
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAvatar);
else initAvatar();
