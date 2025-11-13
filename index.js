// =====================================================
// PLAYER DATA
// =====================================================
const player = {
    name: "",
    hp: 100,
    maxHP: 100,
    atk: 10,
    def: 5,
    level: 1,
    xp: 0,
    nextXP: 100,
    bounty: 0,
    title: "Marujo",
    fruit: null,
    haki: false,
};

let currentEnemy = null;

// =====================================================
// FRUITS
// =====================================================
const fruits = [
    { name: 'Bomu Bomu no Mi', rarity: 'Comum', chance: 60, special: 'Explosão', damage: 1.1 },
    { name: 'Mera Mera no Mi', rarity: 'Rara', chance: 25, special: 'Chama Flamejante', damage: 2 },
    { name: 'Goro Goro no Mi', rarity: 'Épica', chance: 10, special: 'Relâmpago Divino', damage: 5 },
    { name: 'Gura Gura no Mi', rarity: 'Lendária', chance: 4, special: 'Abalo Sísmico', damage: 10 },
    { name: 'Pika Pika no Mi', rarity: 'Lendária', chance: 4, special: 'Chute de luz', damage: 15},
    { name: 'Hito Hito no Mi', rarity: 'Mítica', chance: 1, special: 'Golpe da Liberdade', damage: 40 },
    { name: 'Uo Uo no Mi', rarity:'Mítica', chance: 1, special: 'Onigashima', damage: 25}
];

// =====================================================
// MISSIONS
// =====================================================
const missions = [
    { name: "Derrote 2 Marinheiros Novatos", baseHP: 80, baseAtk: 8, baseDef: 3, reward: 100_000_000, xp: 100, hakiChance: 0.01 },
    { name: "Derrote 5 Marinheiros", baseHP: 120, baseAtk: 12, baseDef: 5, reward: 250_000_000, xp: 200, hakiChance: 0.03 },
    { name: "Derrote o Capitão da Marinha", baseHP: 160, baseAtk: 16, baseDef: 8, reward: 300_000_000, xp: 350, hakiChance: 0.05 },
    { name: "Derrote o Vice-Almirante", baseHP: 200, baseAtk: 20, baseDef: 10, reward: 600_000_000, xp: 500, hakiChance: 0.08 },
    { name: "Derrote o Almirante", baseHP: 260, baseAtk: 26, baseDef: 13, reward: 1_000_000_000, xp: 800, hakiChance: 0.10 },
    { name: "Derrote 2 Almirantes", baseHP: 350, baseAtk: 40, baseDef: 20, reward: 1_800_000_000, xp: 1200, hakiChance: 0.12 },
    { name: "Derrote o Gorosei", baseHP: 500, baseAtk: 60, baseDef: 35, reward: 3_000_000_000, xp: 2000, hakiChance: 0.15 },
    { name: "Derrote Imu", baseHP: 700, baseAtk: 90, baseDef: 50, reward: 5_000_000_000, xp: 3500, hakiChance: 0.20 },
    { name: "Derrote os 5 Gorosei", baseHP: 900, baseAtk: 120, baseDef: 80, reward: 10_000_000_000, xp: 5000, hakiChance: 0.25 },
    { name: "Derrote os Almirantes + Gorosei", baseHP: 1200, baseAtk: 160, baseDef: 100, reward: 20_000_000_000, xp: 8000, hakiChance: 0.30 }
];

// =====================================================
// LOG
// =====================================================
function log(msg) {
    const box = document.getElementById("log");
    box.innerHTML += `<p>${msg}</p>`;
    box.scrollTop = box.scrollHeight;
}

// =====================================================
// UPDATE UI ELEMENTS
// =====================================================
function updateStats() {
    document.getElementById("statusInfo").innerText =
        `Nível: ${player.level} | XP: ${player.xp}/${player.nextXP} | Bounty: ${player.bounty.toLocaleString()} | Título: ${player.title}`;

    document.getElementById("inventory").innerText =
        player.fruit ? player.fruit.name : "Nenhuma fruta equipada";
}

function updateHPbars() {
    document.getElementById("playerHP").innerText = `HP: ${player.hp} / ${player.maxHP}`;
    document.getElementById("enemyHP").innerText = `HP: ${currentEnemy.hp} / ${currentEnemy.maxHP}`;

    document.getElementById("playerHPfill").style.width = `${(player.hp / player.maxHP) * 100}%`;
    document.getElementById("enemyHPfill").style.width = `${(currentEnemy.hp / currentEnemy.maxHP) * 100}%`;
}

// =====================================================
// FRUIT SPIN
// =====================================================
document.getElementById("rollFruitBtn").onclick = () => {
    let total = fruits.reduce((acc, f) => acc + f.chance, 0);
    let rand = Math.random() * total;
    let count = 0;

    for (let f of fruits) {
        count += f.chance;
        if (rand <= count) {
            player.fruit = f;

            document.getElementById("fruitResult").innerText =
                `${f.name} (${f.rarity}) | Especial: ${f.special}`;

            document.getElementById("inventory").innerText = f.name;

            log(`🍏 Você ganhou a fruta ${f.name}!`);
            document.getElementById("btnStart").disabled = false;
            return;
        }
    }
};

// =====================================================
// START GAME
// =====================================================
document.getElementById("btnStart").onclick = () => {
    const name = document.getElementById("playerName").value.trim();

    if (!name) return alert("Digite seu nome!");
    if (!player.fruit) return alert("Gire uma fruta primeiro!");

    player.name = name;

    document.getElementById("gameArea").style.display = "block";
    log(`🏴‍☠️ ${name} iniciou sua jornada!`);

    updateStats();
};

// =====================================================
// MISSION MENU OPEN
// =====================================================
document.getElementById("openMissionMenu").onclick = () => {
    const menu = document.getElementById("missionMenu");

    menu.style.display = menu.style.display === "block" ? "none" : "block";

    const list = document.getElementById("missionList");
    list.innerHTML = "";

    missions.forEach((m, index) => {
        const btn = document.createElement("button");
        btn.innerText = m.name;
        btn.classList.add("choice-btn");

        btn.onclick = () => startMission(index);

        list.appendChild(btn);
    });
};

// =====================================================
// START MISSION
// =====================================================
function startMission(i) {
    const m = missions[i];

    currentEnemy = {
        name: m.name,
        maxHP: m.baseHP * (1 + (player.level - 1) * 0.3),
        hp: m.baseHP * (1 + (player.level - 1) * 0.3),
        atk: m.baseAtk * (1 + (player.level - 1) * 0.2),
        def: m.baseDef,
        reward: m.reward,
        xp: m.xp,
        hakiChance: m.hakiChance,

    };

    document.getElementById("enemyName").innerText = currentEnemy.name;
    document.getElementById("missionInfo").innerText = m.name;

    log(`⚔️ Missão iniciada: ${m.name}`);

    updateStats();
    updateHPbars();
    player.hp = player.maxHP;
    updateHPbars();
}

// =====================================================
// BATTLE SYSTEM
// =====================================================
document.getElementById("attackBtn").onclick = () => {
    if (!currentEnemy) return;

    let dmg = Math.max(1, player.atk - currentEnemy.def);

    if (player.haki) dmg *= 2;

    currentEnemy.hp -= dmg;
    log(`🗡 Você causou ${dmg} de dano!`);

    if (currentEnemy.hp <= 0) return winBattle();

    enemyTurn();
    updateHPbars();
};

document.getElementById("specialBtn").onclick = () => {
    if (!currentEnemy) return;

    let dmg = player.atk * (player.fruit.damage || 1.3);

    if (player.haki) dmg *= 2;

    currentEnemy.hp -= dmg;

    log(`🔥 ${player.fruit.special} causou ${dmg} de dano!`);

    if (currentEnemy.hp <= 0) return winBattle();

    enemyTurn();
    updateHPbars();
};

document.getElementById("defendBtn").onclick = () => {
    if (!currentEnemy) return;

    let dmg = Math.max(1, currentEnemy.atk - player.def * 1.5);

    player.hp -= dmg;
    log(`🛡 Você defendeu! Sofreu apenas ${dmg} de dano.`);

    if (player.hp <= 0) return loseBattle();

    updateHPbars();
};

function enemyTurn() {
    let dmg = Math.max(1, currentEnemy.atk - player.def);

    if (player.haki) dmg *= 0.7;

    player.hp -= dmg;

    log(`💥 O inimigo causou ${dmg} de dano!`);

    if (player.hp <= 0) loseBattle();
    updateHPbars();
}

// =====================================================
// WIN / LOSE
// =====================================================
function winBattle() {
    log("🏆 Você venceu!");

    addXP(currentEnemy.xp);
    addBounty(currentEnemy.reward);

    if (!player.haki && Math.random() < currentEnemy.hakiChance) {
        player.haki = true;
        log("⚡ Você despertou o Haki do Armamento!");
    }

    // Limpa o inimigo
    currentEnemy = {
        name: "Nenhum",
        hp: 0,
        maxHP: 1
    };

    updateStats();
    updateHPbars(); // <-- ESSENCIAL PARA ZERAR BARRA
}

function loseBattle() {
    log("💀 Você perdeu a luta...");
    currentEnemy = null;
}

// =====================================================
// XP / LEVEL
// =====================================================
function addXP(amount) {
    player.xp += amount;

    while (player.xp >= player.nextXP) {
        player.xp -= player.nextXP;
        player.level++;
        player.nextXP = Math.floor(player.nextXP * 1.5);
        player.maxHP = Math.floor(player.maxHP * 1.25);
        player.atk = Math.floor(player.atk * 1.20);
        player.hp = player.maxHP;

        log(`⬆️ Você subiu para nível ${player.level}!`);
    }
}

// =====================================================
// BOUNTY
// =====================================================
const titles = [
    { limit: 50_000_000, title: 'Marujo' },
    { limit: 100_000_000, title: 'Pirata' },
    { limit: 300_000_000, title: 'Supernova' },
    { limit: 1_000_000_000, title: 'Shichibukai' },
    { limit: 2_000_000_000, title: 'Comandante de Yonkou' },
    { limit: 5_000_000_000, title: 'Yonkou' },
    { limit: Infinity, title: 'Rei dos Piratas' }
];

function addBounty(amount) {
    player.bounty += amount;

    for (const t of titles) {
        if (player.bounty < t.limit) {
            player.title = t.title;
            break;
        }
    }

    log(`💰 Nova recompensa: ${player.bounty.toLocaleString()} — ${player.title}`);
    updateStats();
}

// =====================================================
// RESET GAME
// =====================================================
document.getElementById("resetBtn").onclick = () => {
    location.reload();
};
