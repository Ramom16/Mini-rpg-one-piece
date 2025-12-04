alert("Update 2 - Nessa update, eu coloquei um menu de loja de armas adicionado ao jogo")
let specialOnCooldown = false;

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
    fruitRolls: 5, // <-- ADICIONE AQUI (começa com 5)
    weapon: null, // <-- ADICIONE ESTA LINHA
};

let currentEnemy = null;

// =====================================================
// FRUITS
// =====================================================
const fruits = [
    // --- 2 COMUNS (Total 60% de chance) ---
    { 
        name: 'Bomu Bomu no Mi', 
        image: 'frutas/Bomu_Bomu_no_Mi_Infobox.webp', // (Você já tem)
        rarity: 'Comum', 
        chance: 30, // Chance reduzida (era 60)
        special: 'Explosão', 
        damage: 1.1 
    },
    { 
        name: 'Bara Bara no Mi', 
        image: 'frutas/barabara.jpg', // (IMAGEM NOVA - mude o nome)
        rarity: 'Comum', 
        chance: 30, // Nova chance
        special: 'Bara Bara Festival', 
        damage: 1.0 // Dano baixo, é o Buggy!
    },

    // --- 2 RARAS (Total 25% de chance) ---
    { 
        name: 'Mera Mera no Mi', 
        image: 'frutas/meramera.png', // (Você já tem)
        rarity: 'Rara', 
        chance: 13, // Chance reduzida (era 25)
        special: 'Chama Flamejante', 
        damage: 15
    },
    { 
        name: 'Doku Doku no Mi', 
        image: 'frutas/dokudoku.jpg', // (IMAGEM NOVA - mude o nome)
        rarity: 'Rara', 
        chance: 12, // Nova chance
        special: 'Hydra Venenosa', 
        damage: 15 // Dano um pouco menor que a Mera
    },

    // --- 2 ÉPICAS (Total 10% de chance) ---
    { 
        name: 'Goro Goro no Mi', 
        image: 'frutas/Goro_Goro_no_Mi_Infobox.webp', // (Você já tem)
        rarity: 'Épica', 
        chance: 5, // Chance reduzida (era 10)
        special: 'Relâmpago Divino', 
        damage: 20 
    },
    { 
        name: 'Mochi Mochi no Mi', 
        image: 'frutas/mochimochi.jpg', // (IMAGEM NOVA - mude o nome)
        rarity: 'Épica', 
        chance: 5, // Nova chance
        special: 'Peerless Donut', 
        damage: 25 // Dano do Katakuri
    },

    // --- 2 LENDÁRIAS (Total 8% de chance) ---
    { 
        name: 'Gura Gura no Mi', 
        image: 'frutas/guragura.jpg', // (Você já tem)
        rarity: 'Lendária', 
        chance: 4, // (Chance mantida)
        special: 'Abalo Sísmico', 
        damage: 35.0 
    },
    { 
        name: 'Pika Pika no Mi', 
        image: 'frutas/light.jpg', // (Você já tem)
        rarity: 'Lendária', 
        chance: 4, // (Chance mantida)
        special: 'Chute de Luz', 
        damage: 30.0
    },

    // --- 3 MÍTICAS (Total 3% de chance) ---
    { 
        name: 'Hito Hito no Mi, Model: Nika', 
        image: 'frutas/modelonika.jpg', // (Você já tem)
        rarity: 'Mítica', 
        chance: 1, // (Chance mantida)
        special: 'Golpe da Liberdade', 
        damage: 120.0 
    },
    { 
        name: 'Uo Uo no Mi, Model: Seiryu', 
        image: 'frutas/uouo.jpg', // (Você já tem)
        rarity:'Mítica', 
        chance: 1, // (Chance mantida)
        special: 'Boro Breath', // Mudei o nome do especial do Kaido
        damage: 100.0
    },
    { 
        name: 'Tori Tori no Mi, Model: Fênix', 
        image: 'frutas/toritori.jpg', // (IMAGEM NOVA - mude o nome)
        rarity:'Mítica', 
        chance: 1, // Nova chance
        special: 'Chamas da Fênix', // Especial do Marco
        damage: 50.0 // Dano menor, mas é mítica!
    }
];

// =====================================================
// WEAPON SHOP
// =====================================================
const weapons = [
    // --- 2 COMUNS ---
    { 
        name: 'Cutelo da Marinha', 
        rarity: 'Comum', 
        cost: 10_000_000, // 100 Milhões
        bonus: { atk: 50, def: 10 } 
    },
    { 
        name: 'Katana Simples', 
        rarity: 'Comum', 
        cost: 50_000_000, // 50 Milhões
        bonus: { atk: 80, def: 5 } 
    },
    // --- 2 ÉPICAS ---
    { 
        name: 'Nodachi (Lâmina Longa)', 
        rarity: 'Épica', 
        cost: 75_000_000, // 75 Bilhões
        bonus: { atk: 300, def: 100 } 
    },
    { 
        name: 'Yubashiri (Lâmina Leve)', 
        rarity: 'Épica', 
        cost: 100_000_000, // 100 Milhões
        bonus: { atk: 450, def: 50 } 
    },
    // --- 2 LENDÁRIAS ---
    { 
        name: 'Wado Ichimonji', 
        rarity: 'Lendária', 
        cost: 200_000_000, // 200 Milhões
        bonus: { atk: 1000, def: 300 } 
    },
    { 
        name: 'Shusui (Lâmina Negra)', 
        rarity: 'Lendária', 
        cost: 1_000_000_000, // 1 Bilhão
        bonus: { atk: 1500, def: 200 } 
    },
    // --- 2 MÍTICAS ---
    { 
        name: 'Gryphon (Espada do Shanks)', 
        rarity: 'Mítica', 
        cost: 5_000_000_000, // 5 Bilhões
        bonus: { atk: 3000, def: 1000 } 
    },
    { 
        name: 'Yoru (Espada do Mihawk)', 
        rarity: 'Mítica', 
        cost: 50_000_000_000, // 50 Bilhões
        bonus: { atk: 5000, def: 500 } 
    }
];

// =====================================================
// MISSIONS
// =====================================================
const missions = [
    // --- SEU EAST BLUE & ALABASTA (Intacto) ---
    { levelMin: 1,    name: "Derrote 2 Marinheiros Novatos", quantity: 2, baseHP: 80, baseAtk: 8, baseDef: 3, reward: 1_000_000, xp: 700, hakiChance: 0.01 },
    { levelMin: 10,   name: "Derrote 5 Marinheiros", quantity: 5, baseHP: 120, baseAtk: 12, baseDef: 5, reward: 2_000_000, xp: 1500, hakiChance: 0.03 },
    { levelMin: 25,   name: "Derrote os piratas do Buggy", quantity: 5, baseHP: 250, baseAtk: 16, baseDef: 8, reward: 10_000_000, xp: 3500, hakiChance: 0.05 },
    { levelMin: 40,   name: "Derrote o Buggy", baseHP: 500, baseAtk: 20, baseDef: 10, reward: 25_000_000, xp: 5000, hakiChance: 0.08 },
    { levelMin: 60,   name: "Derrote o Don Krieg", baseHP: 1000, baseAtk: 26, baseDef: 13, reward: 100_000_000, xp: 8000, hakiChance: 0.15 },
    { levelMin: 80,   name: "Derrote os piratas de Arlong", quantity: 2, baseHP: 1000, baseAtk: 40, baseDef: 20, reward: 180_000_000, xp: 12000, hakiChance: 0.30 },
    { levelMin: 100,  name: "Derrote o Wapol", baseHP: 5000, baseAtk: 60, baseDef: 35, reward: 300_000_000, xp: 20000, hakiChance: 0.50 },
    { levelMin: 120,  name: "Derrote o Mr 3", baseHP: 6000, baseAtk: 90, baseDef: 50, reward: 500_000_000, xp: 35000, hakiChance: 0.70 },
    { levelMin: 150,  name: "Derrote Mr 5 & Miss Valentine", quantity: 2, baseHP: 6000, baseAtk: 120, baseDef: 80, reward: 1_000_000_000, xp: 50000, hakiChance: 1 },
    { levelMin: 200,  name: "Derrote Bellamy", baseHP: 7500, baseAtk: 160, baseDef: 100, reward: 2_000_000_000, xp: 80000, hakiChance: 1.5 },
    { levelMin: 250,  name: "Derrote o Crocodile", baseHP: 10000, baseAtk: 400, baseDef:100, reward: 3_000_000_000, xp:100000, hakiChance:10},
    
    // --- NOVO: SAGA SKYPIEA & ENIES LOBBY ---
    // (Preenchendo o buraco 250 -> 500)
    { levelMin: 300,  name: "Derrote Enel", baseHP: 12000, baseAtk: 500, baseDef: 150, reward: 4_000_000_000, xp: 150000, hakiChance: 12 },
    { levelMin: 350,  name: "Derrote Rob Lucci", baseHP: 20000, baseAtk: 650, baseDef: 250, reward: 5_000_000_000, xp: 250000, hakiChance: 15 },
    
    // --- NOVO: SAGA THRILLER BARK & NOVO MUNDO ---
    { levelMin: 400,  name: "Derrote Oars e Moriah", quantity: 2, baseHP: 15000, baseAtk: 700, baseDef: 200, reward: 7_000_000_000, xp: 300000, hakiChance: 16 },
    { levelMin: 500,  name: "Derrote 5 Pacifistas", quantity: 5, baseHP: 10000, baseAtk: 800, baseDef: 400, reward: 10_000_000_000, xp: 350000, hakiChance: 17 },
    { levelMin: 600,  name: "Derrote Hody Jones", baseHP: 25000, baseAtk: 850, baseDef: 350, reward: 15_000_000_000, xp: 420000, hakiChance: 19 },
    
    // --- NOVO: SAGA DRESSROSA & WHOLE CAKE ---
    { levelMin: 700,  name: "Derrote Doflamingo", baseHP: 40000, baseAtk: 950, baseDef: 450, reward: 20_000_000_000, xp: 490000, hakiChance: 20 },
    { levelMin: 900,  name: "Derrote o Exército de Elbaf", quantity: 10, baseHP: 50000, baseAtk: 1000, baseDef:500, reward: 30_000_000_000, xp: 500000, hakiChance: 20}, // Sua missão, movida para um nível lógico
    { levelMin: 1000,  name: "Derrote Cracker", quantity: 1, baseHP: 80000, baseAtk: 1200, baseDef: 600, reward: 60_000_000_000, xp: 700000, hakiChance: 22 },
    { levelMin: 1100,  name: "Derrote Katakuri", baseHP: 100000, baseAtk: 1500, baseDef: 700, reward: 80_000_000_000, xp: 1000000, hakiChance: 25 },
    { levelMin: 1500, name: "Derrote a Big Mom", baseHP: 250000, baseAtk: 3000, baseDef: 1000, reward: 100_000_000_000, xp: 2000000, hakiChance: 50},

    // --- NOVO: SAGA WANO ---
    { levelMin: 1700,  name: "Derrote Urashima e Holdem", quantity: 2, baseHP: 100000, baseAtk: 1600, baseDef: 750, reward: 90_000_000_000, xp: 1200000, hakiChance: 28 },
    { levelMin: 2000, name: "Derrote Kaido", baseHP: 500000, baseAtk: 5500, baseDef: 1000, reward: 150_000_000_000, xp: 5000000, hakiChance: 35 },
    { levelMin: 3000, name: "Derrote o Kaido despertado", baseHP: 1000000, baseAtk: 10000, baseDef: 2000, reward:150_000_000_000, xp: 50000000, hakiChance: 50 }
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

        document.getElementById("equipmentInfo").innerText = 
        player.weapon ? player.weapon.name : "Nenhuma arma equipada";
    
    document.getElementById("fruitRollsCount").innerText = player.fruitRolls;
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
    const titleBonus = getCurrentTitleObject().bonus.atk || 0;
    
    // Pega o bônus da arma (ou 0 se não tiver arma)
    const weaponBonus = player.weapon ? player.weapon.bonus.atk : 0;
    
    return player.atk + titleBonus + weaponBonus;
}

// Retorna a Defesa total (Base + Bônus)
function getPlayerTotalDef() {
    const titleBonus = getCurrentTitleObject().bonus.def || 0;
    
    // Pega o bônus da arma (ou 0 se não tiver arma)
    const weaponBonus = player.weapon ? player.weapon.bonus.def : 0;

    return player.def + titleBonus + weaponBonus;
}

function updateHPbars() {
    // CORRIGIDO: Removido o '\' antes de HP:
    document.getElementById("playerHP").innerText = `HP: ${player.hp} / ${getPlayerTotalMaxHP()}`;
    
    document.getElementById("enemyHP").innerText = `HP: ${currentEnemy.hp} / ${currentEnemy.maxHP}`;

    // CORRIGIDO: Removido o '\' antes de '${'
    document.getElementById("playerHPfill").style.width = `${(player.hp / getPlayerTotalMaxHP()) * 100}%`;
    
    document.getElementById("enemyHPfill").style.width = `${(currentEnemy.hp / currentEnemy.maxHP) * 100}%`;
}

// =====================================================
// FRUIT SPIN
// =====================================================
document.getElementById("rollFruitBtn").onclick = () => {
    
    // 1. Pega o bônus de 'roll' do título atual do jogador
    const titleObject = getCurrentTitleObject();
    const rollBonus = titleObject.bonus.rollBonus || {}; // Pega o {legendary, mythic}
    const legendaryBonus = rollBonus.legendary || 0;
    const mythicBonus = rollBonus.mythic || 0;

    if (player.fruitRolls <= 0) {
        log("❌ Você não tem mais rolagens! Suba de nível para ganhar mais.");
        return; // Para a função aqui
    }
    
    player.fruitRolls--; // Gasta a rolagem!
    updateStats(); // Atualiza o contador na tela

    // 2. Calcula o NOVO 'total' de chances, incluindo os bônus
    let total = 0;
    for (const f of fruits) {
        total += f.chance; // Adiciona a chance base
        if (f.rarity === 'Lendária') {
            total += legendaryBonus; // Adiciona o bônus lendário ao total
        }
        if (f.rarity === 'Mítica') {
            total += mythicBonus; // Adiciona o bônus mítico ao total
        }
    }

    // 3. Sorteia o número aleatório com base no novo total
    let rand = Math.random() * total;
    let count = 0;

    // 4. Loop para encontrar a fruta
    for (let f of fruits) {
        // Pega a chance base da fruta
        let currentChance = f.chance; 
        
        // Adiciona o bônus do título APENAS para esta fruta
        if (f.rarity === 'Lendária') {
            currentChance += legendaryBonus;
        }
        if (f.rarity === 'Mítica') {
            currentChance += mythicBonus;
        }

        // Adiciona ao contador
        count += currentChance; 

        if (rand <= count) {
            player.fruit = f;

            document.getElementById("fruitResult").innerText =
                `${f.name} (${f.rarity}) | Especial: ${f.special}`;

            document.getElementById("inventory").innerText = f.name;

            const imgElement = document.getElementById("fruitImage");
            imgElement.src = f.image; // Define a imagem
            imgElement.style.display = "block"; // Mostra a imagem

            log(`🍏 Você ganhou a fruta ${f.name}!`);
            
            // Log especial se o bônus ajudou!
            if (currentChance > f.chance) {
                log(`👑 Seu Título aumentou suas chances!`);
            }
            
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
// SHOP MENU LOGIC
// =====================================================
document.getElementById("openShopBtn").onclick = () => {
    const menu = document.getElementById("shopMenu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";

    const list = document.getElementById("shopList");
    list.innerHTML = ""; // Limpa a lista

    weapons.forEach((w, index) => {
        const btn = document.createElement("button");
        
        // Formata o bônus para mostrar (ex: ATK+50, DEF+10)
        let bonusText = `(ATK+${w.bonus.atk}, DEF+${w.bonus.def})`;
        
        // Texto principal do botão
        btn.innerHTML = `${w.name} [${w.rarity}] <br>
                         <span class="shop-item-details">
                           Custo: ${w.cost.toLocaleString()} | ${bonusText}
                         </span>`;
        
        // Verifica se o jogador já tem esta arma
        if (player.weapon && player.weapon.name === w.name) {
            btn.disabled = true;
            btn.innerHTML += `<br><span class="shop-item-details">(Equipado)</span>`;
        } 
        // Verifica se o jogador pode pagar
        else if (player.bounty < w.cost) {
            btn.disabled = true;
            btn.style.opacity = "0.5";
        } 
        // Se puder comprar
        else {
            btn.onclick = () => buyWeapon(index);
        }
        
        list.appendChild(btn);
    });
};

function buyWeapon(index) {
    const weapon = weapons[index];

    // Checagem dupla de segurança
    if (player.bounty < weapon.cost) {
        return log("❌ Você não tem Bounty o suficiente!");
    }

    player.bounty -= weapon.cost; // Subtrai o custo
    player.weapon = weapon; // Equipa a arma

    log(`⚔️ Você comprou e equipou a ${weapon.name}!`);

    // Fecha o menu da loja e atualiza as stats
    document.getElementById("shopMenu").style.display = "none";
    updateStats();
}
// =====================================================
// MISSION MENU OPEN
// =====================================================
document.getElementById("openMissionMenu").onclick = () => {
    const menu = document.getElementById("missionMenu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";

    const list = document.getElementById("missionList");
    list.innerHTML = ""; // Limpa a lista

    missions.forEach((m, index) => {
        const btn = document.createElement("button");
        
        // Mostra o nome e o nível da missão
        btn.innerText = `${m.name} (Req: Nv ${m.levelMin})`; 
        btn.classList.add("choice-btn");

        // Verifica se o jogador tem o nível
        if (player.level >= m.levelMin) {
            // Se sim, habilita o botão
            btn.disabled = false;
            btn.onclick = () => {
                startMission(index);
                menu.style.display = "none"; // Fecha o menu ao escolher
            };
        } else {
            // Se não, desabilita o botão
            btn.disabled = true; 
            btn.style.opacity = "0.5"; // Deixa mais claro
            btn.style.cursor = "not-allowed";
        }
        
        list.appendChild(btn);
    });
};

// =====================================================
// START MISSION
// =====================================================
function startMission(i) {
    const m = missions[i];

    // Verifica se o jogador tem o nível (embora o menu já deva fazer isso)
    if (player.level < m.levelMin) {
        return log(`❌ Você precisa ser Nível ${m.levelMin} para esta missão.`);
    }

    currentEnemy = {
        name: m.name,

        // --- A MUDANÇA ESTÁ AQUI ---
        // Removemos o 'levelFactor' e 'Math.pow()'
        // Os stats agora são FIXOS, lidos direto da missão
        maxHP: m.baseHP,
        hp: m.baseHP,
        atk: m.baseAtk,
        def: m.baseDef,
        // --- FIM DA MUDANÇA ---

        reward: m.reward,
        xp: m.xp,
        hakiChance: m.hakiChance,
        count: m.quantity || 1
    };

    document.getElementById("enemyName").innerText = `${currentEnemy.name} (${currentEnemy.count})`;
    document.getElementById("missionInfo").innerText = m.name;

    log(`⚔️ Missão iniciada: ${m.name}`);

    player.hp = getPlayerTotalMaxHP(); // Cura o jogador
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
    if (specialOnCooldown) {
        log("❌ Especial está recarregando, aguarde!");
        return;
    }
    if (!currentEnemy) return;

    // --- MUDANÇA NA LÓGICA DO DANO ---
    // ANTES: getPlayerTotalAtk() * player.fruit.damage
    // AGORA: getPlayerTotalAtk() + player.fruit.damage
    let dmg = getPlayerTotalAtk() + (player.fruit.damage || 50); // ATK + Dano da Fruta
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
    // 1. Calcula o dano "cru" (sem mínimo)
    let rawDmg = getPlayerTotalDef() - currentEnemy.atk;

    // 2. Aplica a redução do Haki PRIMEIRO
    if (player.haki) {
        rawDmg *= 0.7; // Reduz o dano em 30%
    }

    // 3. AGORA, garante que o dano final seja no mínimo 1
    //    E arredonda o dano para um número inteiro.
    let dmg = Math.floor(Math.max(1, rawDmg));

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

    let levelsGained = 0;
    let totalHpGained = 0;
    let totalAtkGained = 0;
    let totalDefGained = 0;

    // --- Stats por nível ---
    const hpGain = 30;
    const atkGain = 8;
    const defGain = 2;

    // 1. Este loop agora roda em memória, sem chamar log(). É super rápido.
    while (player.xp >= player.nextXP) {
        levelsGained++; // Conta o nível
        
        player.xp -= player.nextXP;
        player.level++;
        player.nextXP = Math.floor(player.nextXP + 50);

        // Soma os stats totais
        totalHpGained += hpGain;
        totalAtkGained += atkGain;
        totalDefGained += defGain;

        // Adiciona os stats ao jogador
        player.maxHP += hpGain;
        player.atk += atkGain;
        player.def += defGain;
    }

    // 2. SÓ DEPOIS que o loop termina, mostramos o log UMA VEZ.
    if (levelsGained > 0) {
        
        const rollsGained = levelsGained * 5; // 5 rolagens por nível
        player.fruitRolls += rollsGained;

        if (levelsGained === 1) {
            // Se foi só 1 nível, mostramos a mensagem normal
            log(`⬆️ Você subiu para nível (HP+${hpGain}, ATK+${atkGain}, DEF+${defGain}, Rolagens+${rollsGained})`);
        } else {
            // Se foram vários níveis, mostramos um RESUMO
            log(`✨ UAU! Você subiu ${levelsGained} níveis de uma vez!`);
            log(`(HP+${totalHpGained}, ATK+${totalAtkGained}, DEF+${totalDefGained}, Rolagens+${rollsGained})`);
        }

        // Cura o jogador UMA VEZ
        player.hp = getPlayerTotalMaxHP(); 
    }
}

// =====================================================
// BOUNTY
// =====================================================
const titles = [
    // Bônus: hp, atk, def, xp, e agora rollBonus (chance extra)
    { 
        limit: 5_000_000_000, 
        title: 'Rei dos Piratas', 
        bonus: { hp: 1000, atk: 250, def: 100, xp: 3.00, rollBonus: { legendary: 15, mythic: 8 } } 
    },
    { 
        limit: 3_000_000_000, 
        title: 'Yonkou', 
        bonus: { hp: 500, atk: 150, def: 75, xp: 2, rollBonus: { legendary: 10, mythic: 5 } } 
    },
    { 
        limit: 2_000_000_000, 
        title: 'Comandante de Yonkou', 
        bonus: { hp: 300, atk: 100, def: 50, xp: 1.5, rollBonus: { legendary: 5, mythic: 2 } } 
    },
    { 
        limit: 1_000_000_000, 
        title: 'Shichibukai', 
        bonus: { hp: 200, atk: 70, def: 35, xp: 1.4, rollBonus: { legendary: 2, mythic: 1 } } 
    },
    { 
        limit: 300_000_000, 
        title: 'Supernova', 
        bonus: { hp: 100, atk: 40, def: 20, xp: 1.3, rollBonus: { legendary: 1, mythic: 0 } } 
    },
    { 
        limit: 100_000_000, 
        title: 'Pirata', 
        bonus: { hp: 50, atk: 15, def: 5, xp: 1.2, rollBonus: { legendary: 0, mythic: 0 } } // Sem bônus
    },
    { 
        limit: 0, 
        title: 'Marujo', 
        bonus: { hp: 0, atk: 0, def: 0, xp: 1.1, rollBonus: { legendary: 0, mythic: 0 } } // Sem bônus
    }
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
    const savedData = localStorage.getItem("onePieceRPG_playerSave");
    if (savedData) {
        const loadedPlayer = JSON.parse(savedData);

        // 1. Carrega os dados PRIMEIRO
        Object.assign(player, loadedPlayer);
        log("📂 Jogo carregado!");

        // 2. AGORA sim, checamos a fruta e mostramos a imagem
        if (player.fruit && player.fruit.image) {
            const imgElement = document.getElementById("fruitImage");
            imgElement.src = player.fruit.image;
            imgElement.style.display = "block";
        }

        // 3. Atualiza o resto da UI
        document.getElementById("playerName").value = player.name;
        document.getElementById("fruitResult").innerText = player.fruit ?
            `${player.fruit.name} (${player.fruit.rarity})` : "Nenhuma fruta girada";

        document.getElementById("gameArea").style.display = "block";
        updateStats();
        document.getElementById("btnStart").disabled = true;
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