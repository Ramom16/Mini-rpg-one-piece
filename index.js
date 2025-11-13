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
    { name: 'Bomu Bomu no Mi', image: 'frutas/Bomu_Bomu_no_Mi_Infobox.webp', rarity: 'Comum', chance: 60, special: 'Explosão', damage: 1.1 },
    { name: 'Mera Mera no Mi', image: 'frutas/meramera.png', rarity: 'Rara', chance: 30, special: 'Chama Flamejante', damage: 2 },
    { name: 'Goro Goro no Mi', image: 'frutas/Goro_Goro_no_Mi_Infobox.webp', rarity: 'Épica', chance: 15, special: 'Relâmpago Divino', damage: 5 },
    { name: 'Gura Gura no Mi', image: 'frutas/guragura.jpg', rarity: 'Lendária', chance: 9, special: 'Abalo Sísmico', damage: 20 },
    { name: 'Pika Pika no Mi', image: 'frutas/light.jpg', rarity: 'Lendária', chance: 9, special: 'Chute de luz', damage: 15 },
    { name: 'Hito Hito no Mi', image: 'frutas/hitothito.jpg', rarity: 'Mítica', chance: 1, special: 'Golpe da Liberdade', damage: 40 },
    { name: 'Uo Uo no Mi', image: 'frutas/uouo.jpg', rarity: 'Mítica', chance: 1, special: 'Onigashima', damage: 25 }
];

// =====================================================
// MISSIONS
// =====================================================
const missions = [
    { name: "Derrote 2 Marinheiros Novatos", quantity: 2, baseHP: 80, baseAtk: 8, baseDef: 3, reward: 10_000_000, xp: 100, hakiChance: 0.01 },
    { name: "Derrote 5 Marinheiros", quantity: 5, baseHP: 120, baseAtk: 12, baseDef: 5, reward: 25_000_000, xp: 200, hakiChance: 0.03 },
    { name: "Derrote o Capitão da Marinha", baseHP: 250, baseAtk: 16, baseDef: 8, reward: 100_000_000, xp: 350, hakiChance: 0.05 },
    { name: "Derrote o Vice-Almirante", baseHP: 500, baseAtk: 20, baseDef: 10, reward: 250_000_000, xp: 500, hakiChance: 0.08 },
    { name: "Derrote o Almirante", baseHP: 800, baseAtk: 26, baseDef: 13, reward: 1_000_000_000, xp: 800, hakiChance: 0.15 },
    { name: "Derrote 2 Almirantes", quantity: 2, baseHP: 800, baseAtk: 40, baseDef: 20, reward: 1_800_000_000, xp: 1200, hakiChance: 0.30 },
    { name: "Derrote o Gorosei", baseHP: 1000, baseAtk: 60, baseDef: 35, reward: 3_000_000_000, xp: 2000, hakiChance: 0.50 },
    { name: "Derrote Imu", baseHP: 2000, baseAtk: 90, baseDef: 50, reward: 5_000_000_000, xp: 3500, hakiChance: 0.70 },
    { name: "Derrote os 5 Gorosei", quantity: 5, baseHP: 1000, baseAtk: 120, baseDef: 80, reward: 10_000_000_000, xp: 5000, hakiChance: 1 },
    { name: "Derrote o Xebec", baseHP: 4000, baseAtk: 400, baseDef:100, reward: 30_000_000_000, xp:10000, hakiChance:10},
    { name: "Derrote os Almirantes + Gorosei", quantity: 8, baseHP: 1200, baseAtk: 160, baseDef: 100, reward: 20_000_000_000, xp: 8000, hakiChance: 1.5 }
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
// =====================================================
// CALCULADORA DE STATUS (GETTERS)
// =====================================================

// Pega o objeto do título atual do jogador
function getCurrentTitleObject() {
    for (const t of titles) {
        if (player.bounty >= t.limit) {
            return t; // Retorna o primeiro (mais alto) que o jogador alcançou
        }
    }
    return titles[titles.length - 1]; // Retorna Marujo se algo der errado
}

// Retorna o MaxHP total (Base + Bônus)
function getPlayerTotalMaxHP() {
    return player.maxHP + getCurrentTitleObject().bonus.hp;
}

// Retorna o Ataque total (Base + Bônus)
function getPlayerTotalAtk() {
    return player.atk + getCurrentTitleObject().bonus.atk;
}

// Retorna a Defesa total (Base + Bônus)
function getPlayerTotalDef() {
    return player.def + getCurrentTitleObject().bonus.def;
}

function updateHPbars() {
    document.getElementById("playerHP").innerText = `\HP: ${player.hp} / ${getPlayerTotalMaxHP()}`;
    document.getElementById("enemyHP").innerText = `HP: ${currentEnemy.hp} / ${currentEnemy.maxHP}`;

    document.getElementById("playerHPfill").style.width = `\${(player.hp / getPlayerTotalMaxHP()) * 100}%`;
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

            const imgElement = document.getElementById("fruitImage");
            imgElement.src = f.image; // Define a imagem
            imgElement.style.display = "block"; // Mostra a imagem

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

    // Multiplicador baseado no nível do jogador.
    // Nível 1 = 0, Nível 2 = 1, Nível X = X-1
    const levelFactor = player.level - 1;

    currentEnemy = {
        name: m.name,

        // --- NOVO: Escalamento EXPONENCIAL para HP do Inimigo ---
        // A cada nível do jogador, o HP do inimigo base aumenta em 25% (composto)
        maxHP: Math.floor(m.baseHP * Math.pow(1.25, levelFactor)),
        hp: Math.floor(m.baseHP * Math.pow(1.25, levelFactor)),

        // --- NOVO: Escalamento EXPONENCIAL para ATK do Inimigo ---
        // A cada nível do jogador, o ATK do inimigo base aumenta em 15% (composto)
        atk: Math.floor(m.baseAtk * Math.pow(1.15, levelFactor)),

        // A defesa pode permanecer linear ou ter um multiplicador menor
        def: Math.floor(m.baseDef * (1 + levelFactor * 0.1)), // Defesa ainda um pouco mais linear

        reward: m.reward,
        xp: m.xp,
        hakiChance: m.hakiChance,
        count: m.quantity || 1
    };

    document.getElementById("enemyName").innerText = `${currentEnemy.name} (${currentEnemy.count})`;
    document.getElementById("missionInfo").innerText = m.name;

    log(`⚔️ Missão iniciada: ${m.name}`);

    // Certifique-se de que o HP do jogador seja restaurado ao máximo total (incluindo bônus de título)
    player.hp = getPlayerTotalMaxHP();

    updateStats();
    updateHPbars();
}
// =====================================================
// BATTLE SYSTEM
// =====================================================
document.getElementById("attackBtn").onclick = () => {
    if (!currentEnemy) return;

    let dmg = Math.max(1, getPlayerTotalAtk() - currentEnemy.def);

    if (player.haki) dmg *= 2;

    currentEnemy.hp -= dmg;
    log(`🗡 Você causou ${dmg} de dano!`);

    if (currentEnemy.hp <= 0) return winBattle();

    enemyTurn();
    updateHPbars();
};

document.getElementById("specialBtn").onclick = () => {
    if (!currentEnemy) return;

    let dmg = getPlayerTotalAtk() * (player.fruit.damage || 1.3);

    if (player.haki) dmg *= 2;

    currentEnemy.hp -= dmg;

    log(`🔥 ${player.fruit.special} causou ${dmg} de dano!`);

    if (currentEnemy.hp <= 0) return winBattle();

    enemyTurn();
    updateHPbars();
};

document.getElementById("defendBtn").onclick = () => {
    if (!currentEnemy) return;

    let dmg = Math.max(1, currentEnemy.atk - getPlayerTotalDef() * 1.5);

    player.hp -= dmg;
    log(`🛡 Você defendeu! Sofreu apenas ${dmg} de dano.`);

    if (player.hp <= 0) return loseBattle();

    updateHPbars();
};

function enemyTurn() {
    let dmg = Math.max(1, currentEnemy.atk - getPlayerTotalDef());

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
    currentEnemy.count--; 

    // CASO 1: Ainda faltam inimigos
    if (currentEnemy.count > 0) {
        // ... (seu código de "inimigos restantes" continua o mesmo)
        log(`⚔️ Um inimigo foi derrotado! Faltam ${currentEnemy.count}.`);
        currentEnemy.hp = currentEnemy.maxHP; 
        document.getElementById("enemyName").innerText = `${currentEnemy.name} (${currentEnemy.count})`; 
        updateHPbars();
        return; 
    }

    // CASO 2: Este era o ÚLTIMO inimigo
    log("🏆 Você venceu a missão!");

    // --- A MUDANÇA É AQUI ---

    // 1. Pega o XP base do inimigo
    const baseXP = currentEnemy.xp;
    
    // 2. Pega o bônus de XP do título atual (ex: 0.20)
    //    (Usamos a função que já criamos!)
    const titleXpBonus = getCurrentTitleObject().bonus.xp || 0;
    
    // 3. Calcula o XP final
    const totalXP = Math.floor(baseXP * (1 + titleXpBonus));

    // 4. (Opcional) Mostra ao jogador que ele ganhou bônus!
    if (titleXpBonus > 0) {
        log(`⭐ Bônus de Título: +${Math.floor(baseXP * titleXpBonus)} XP! (+${titleXpBonus * 100}%)`);
    }
    
    // 5. Adiciona o XP TOTAL
    addXP(totalXP); 
    
    // --- FIM DA MUDANÇA ---
    
    addBounty(currentEnemy.reward);

    if (!player.haki && Math.random() < currentEnemy.hakiChance) {
        player.haki = true;
        log("⚡ Você despertou o Haki do Armamento!");
    }

    // ... (resto da sua função para limpar o inimigo)
    currentEnemy = null; 
    document.getElementById("enemyName").innerText = "Inimigo";
    document.getElementById("enemyHP").innerText = "HP: 0 / 0";
    document.getElementById("enemyHPfill").style.width = "0%";

    updateStats();
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
        player.hp = getPlayerTotalMaxHP();

        log(`⬆️ Você subiu para nível ${player.level}!`);
    }
}

// =====================================================
// BOUNTY
// =====================================================
const titles = [
    // Bônus: +HP, +Ataque, +Defesa, +XP
    { limit: 5_000_000_000, title: 'Rei dos Piratas', bonus: { hp: 1000, atk: 250, def: 100, xp: 0.20 } }, // +20% XP
    { limit: 3_000_000_000, title: 'Yonkou', bonus: { hp: 500, atk: 150, def: 75, xp: 0.15 } }, // +15% XP
    { limit: 2_000_000_000, title: 'Comandante de Yonkou', bonus: { hp: 300, atk: 100, def: 50, xp: 0.10 } }, // +10% XP
    { limit: 1_000_000_000, title: 'Shichibukai', bonus: { hp: 200, atk: 70, def: 35, xp: 0.08 } }, // +8% XP
    { limit: 300_000_000, title: 'Supernova', bonus: { hp: 100, atk: 40, def: 20, xp: 0.05 } }, // +5% XP
    { limit: 100_000_000, title: 'Pirata', bonus: { hp: 50, atk: 15, def: 5, xp: 0.02 } }, // +2% XP
    { limit: 0, title: 'Marujo', bonus: { hp: 0, atk: 0, def: 0, xp: 0.0 } } // 0% XP
];

function addBounty(amount) {
    player.bounty += amount;
    let newTitle = player.title; // Pega o título atual

    // Loop do mais alto para o mais baixo
    for (const t of titles) {
        if (player.bounty >= t.limit) {
            newTitle = t.title;
            break; // Achou o título mais alto que o jogador merece
        }
    }

    // Se o título mudou, mostre um log especial
    if (newTitle !== player.title) {
        player.title = newTitle;
        log(`👑 Seu título foi atualizado para ${player.title}!`);
        player.hp = getPlayerTotalMaxHP();
    }

    log(`💰 Nova recompensa: ${player.bounty.toLocaleString()}`);
    updateStats(); // Atualiza a UI uma vez no final
}


// =====================================================
// RESET GAME
// =====================================================
document.getElementById("resetBtn").onclick = () => {
    location.reload();
};

// =====================================================
// SAVE / LOAD SYSTEM (LocalStorage)
// =====================================================

// Seleciona o botão de salvar
document.getElementById("saveBtn").onclick = saveGame;

// Tenta carregar o jogo assim que a página abre
window.onload = loadGame;

function saveGame() {
    // Converte o objeto 'player' em um texto JSON e salva
    localStorage.setItem("onePieceRPG_playerSave", JSON.stringify(player));
    log("💾 Jogo salvo!");
}

function loadGame() {
    // Pega o texto salvo do localStorage
    const savedData = localStorage.getItem("onePieceRPG_playerSave");

    // Se existir um save...
    if (savedData) {
        // Converte o texto de volta para um objeto
        const loadedPlayer = JSON.parse(savedData);

        if (player.fruit && player.fruit.image) {
            const imgElement = document.getElementById("fruitImage");
            imgElement.src = player.fruit.image;
            imgElement.style.display = "block";
        }

        // Atualiza o 'player' principal com os dados salvos
        // Object.assign é uma forma segura de fundir os dois objetos
        Object.assign(player, loadedPlayer);

        log("📂 Jogo carregado!");

        // Atualiza a UI para mostrar os dados carregados
        document.getElementById("playerName").value = player.name;
        document.getElementById("fruitResult").innerText = player.fruit ?
            `${player.fruit.name} (${player.fruit.rarity})` : "Nenhuma fruta girada";

        // Mostra o jogo e atualiza status/inventário
        document.getElementById("gameArea").style.display = "block";
        updateStats();
        document.getElementById("btnStart").disabled = true; // Desabilita o "Iniciar" pois o jogo já começou
    } else {
        log("🏴‍☠️ Novo jogo. Gire uma fruta e digite seu nome.");
    }
}

// Modifique seu botão de Reset para limpar o save
document.getElementById("resetBtn").onclick = () => {
    if (confirm("Tem certeza que quer apagar seu progresso?")) {
        localStorage.removeItem("onePieceRPG_playerSave"); // Limpa o save
        location.reload(); // Recarrega a página
    }
};