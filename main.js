// main.js
const WORKER_URL = "https://airwavebase-kick-api.neonator-4d6.workers.dev";
let currentMember = "";
const listContainer = document.getElementById('team-list');
const player = document.getElementById('main-player');
const currentNameSpan = document.getElementById('current-member-name');

document.getElementById("year").textContent = new Date().getFullYear();

async function buildTeamList() {
    const promises = TEAM_DATA.MITGLIEDER.map(name =>
        fetch(`${WORKER_URL}?username=${encodeURIComponent(name)}`)
            .then(r => r.json())
            .then(raw => {
                const data = raw.data || raw;
                const stream = data.livestream;
                const user = data.user || {};
                return {
                    name,
                    avatar: user.profile_pic || user.avatar,
                    viewers: stream?.viewer_count || 0,
                    isLive: !!stream
                };
            })
            .catch(() => ({ name, avatar: null, viewers: 0, isLive: false }))
    );

    const members = await Promise.all(promises);
    const live = members.filter(m => m.isLive).sort((a,b) => b.viewers - a.viewers);
    const offline = members.filter(m => !m.isLive).sort(() => Math.random() - 0.5);
    const sorted = [...live, ...offline];

    listContainer.innerHTML = '';
    sorted.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'member-btn';
        const avatarHTML = item.avatar
            ? `<img class="avatar" src="${item.avatar}" onerror="this.style.display='none';this.parentElement.insertAdjacentHTML('afterbegin','<div class=\\'avatar\\' style=\\'background:#333;color:white;display:flex;align-items:center;justify-content:center;font-size:13px;\\'>${item.name[0]}</div>')">`
            : `<div class="avatar" style="background:#333;color:white;display:flex;align-items:center;justify-content:center;font-size:13px;">${item.name[0]}</div>`;
        
        btn.innerHTML = `
            <div class="member-left">
                ${avatarHTML}
                <span>${item.name}</span>
            </div>
            ${item.viewers >= 1 ? `<span class="viewer-count ${item.isLive ? 'live' : ''}">${item.viewers.toLocaleString('de-DE')}</span>` : ''}
        `;
        btn.onclick = () => loadStream(item.name, btn);
        listContainer.appendChild(btn);
        
        if (!currentMember) loadStream(item.name, btn);
    });
    document.getElementById('member-count').textContent = TEAM_DATA.MITGLIEDER.length;
}

function loadStream(name, element) {
    currentMember = name.trim();
    currentNameSpan.textContent = currentMember;
    player.src = `https://player.kick.cx/${currentMember}?fullscreen=false&quality=false&muted=false&reload=false&pip=false`;
    
    document.querySelectorAll('.member-btn').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
}

function openAboutPage() {
    if (!currentMember) return;
    const username = currentMember.trim();
    window.open(`https://kick.com/${username}/about`, '_blank', 'noopener,noreferrer');
}

function init() {
    const logoUrl = TEAM_DATA.TEAM_LOGO_URL || "logo.png";
    const bannerUrl = TEAM_DATA.TEAM_BANNER_URL || "banner.jpg";
    
    document.getElementById('team-logo').style.backgroundImage = `url('${logoUrl}')`;
    document.getElementById('team-banner').style.backgroundImage = `url('${bannerUrl}')`;
    document.getElementById('mobile-logo').style.backgroundImage = `url('${logoUrl}')`;
    document.getElementById('mobile-banner').style.backgroundImage = `url('${bannerUrl}')`;
    
    document.getElementById('team-name-display').textContent = TEAM_DATA.TEAM_NAME;
    document.getElementById('team-desc-container').innerHTML = TEAM_DATA.TEAM_BESCHREIBUNG;
    
    buildTeamList();
}

function scrollToTop() {
    listContainer.scrollTo({ top: 0, behavior: 'smooth' });
}

listContainer.onscroll = function() {
    document.getElementById('scroll-top-btn').style.display =
        this.scrollTop > 100 ? "block" : "none";
};

window.onload = init;