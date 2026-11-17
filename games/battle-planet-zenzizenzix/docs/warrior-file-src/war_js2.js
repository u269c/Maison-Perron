
// ---------------------------------------------------------------------------
// The 50 warriors
// stats: [Health, Speed, Power, Reach, Teamwork], 1 to 5
// art: b body, k scale, h head, p prop, fx special effect, w world
// ---------------------------------------------------------------------------
const R = { Tank: '#ffb84d', Bruiser: '#ff4fa3', Speedster: '#45d4ff', Ranged: '#ffd23f', Support: '#7dffc0', Trickster: '#b9a2f0' };
const WAR = [
[1,'Grand-Maman Grenade','Retired demolitions sergeant. Knits between fights.','Ranged',[3,2,4,4,3],'Knit Bomb','Lobs a ball of yarn that explodes and ties up everyone it hits for 2 seconds.',['Controls crowds from a distance','Tied-up enemies are free hits for her partner'],['Slow to get out of trouble','Long wind-up on the throw'],18,'Marge dives on the tied-up crowd',{b:'man',k:.95,h:'bun',p:'yarn',fx:'yarn',w:'h'},'BOUM!'],
[2,'Le Bûcheron','Lumberjack with a chainsaw arm.','Bruiser',[4,2,5,3,2],'Timber!','Swings a whole tree trunk across the screen, hitting everything in the row.',['Huge single hits','Long reach with the trunk'],['Very slow between swings','The trunk easily clips his partner'],40,'Bertrand walls the lane, he clears it',{b:'man',k:1.2,h:'tuque',p:'saw',fx:'trunk',w:'h'},'TIMBER!'],
[3,'Sergent Poutine','Retired army cook.','Tank',[5,2,3,3,4],'Gravy Flood','Floods the floor with gravy: enemies slip, fall and take double damage for 3 seconds.',['Turns any crowd into free hits','Gravy slows bosses too'],['His partner slips too','Weak alone, needs follow-up'],13,'Mohawk Mo spins through the slipping crowd',{b:'man',k:1.25,h:'chef',p:'ladle',fx:'gravy',w:'h'},'SPLOTCH!'],
[4,'The Enforcer','Retired hockey tough guy, still in his old jersey.','Bruiser',[4,3,4,1,2],'Gloves Off','Grabs one enemy and lands a flurry of punches. Nothing can interrupt it.',['Deletes elites and mini-bosses','Can\'t be hit during the flurry'],['Ignores crowds','Very short reach'],8,'Doc Suture keeps him in the fight',{b:'man',k:1.1,h:'helmet',p:'stick',fx:'punches',w:'c'},'POW POW!'],
[5,'Zamboni Zed','Ice-rink driver on a rocket-powered resurfacer.','Tank',[5,2,3,4,3],'Ice Lap','Drives a lap that freezes a strip of floor; enemies on it skid off the screen.',['Clears a whole lane','The ice stays 5 seconds as a trap'],['Turns slowly','Useless on ledges and towers'],6,'Two ice players lock down a whole screen',{b:'kart',k:1,h:'cap',p:'none',fx:'ice',w:'c'},'SKRRRT!'],
[6,'Capitaine Tuque','Arctic ranger on a hover snowmobile.','Speedster',[3,5,3,3,3],'Whiteout','A 4-second snowstorm: enemies lose track of both players and swing at the air.',['Great escape button','Protects a knocked-out partner'],['Low damage','The storm hides traps too'],33,'Tic-Tac freezes them, Tuque blinds them',{b:'man',k:.95,h:'tuque',p:'pistol',fx:'snow',w:'c'},'FWOOSH!'],
[7,'La Déneigeuse','Snow-plow operator in power armour with a plow blade.','Tank',[5,1,4,3,3],'Plow Through','Pushes everything in her lane off the screen, enemies and barrels included.',['Best crowd clearer in the game','The blade blocks bullets from the front'],['Slowest walker','Can push her partner into holes'],39,'Bernache scatters them, she plows them',{b:'bot',k:1.2,h:'helmet',p:'plow',fx:'plow',w:'c'},'VRRROOM!'],
[8,'Doc Suture','Retired combat medic.','Support',[2,3,2,2,5],'Field Patch','Throws a med-kit that heals her partner one heart, even across the screen.',['Keeps the team alive','Revives a knocked-out partner faster'],['Fragile','Poor damage on her own'],4,'Patches up the Enforcer mid-flurry',{b:'man',k:.9,h:'cap',p:'bag',fx:'heal',w:'h'},'PATCH!'],
[9,'Le Tireur fatigué','Old sniper with very thick glasses.','Ranged',[2,2,5,5,2],'Long Shot','One shot that goes through every enemy in the row, across the whole screen.',['Longest reach in the game','Huge damage on lined-up crowds'],['Slow to line up','Helpless up close'],15,'The Roadie knocks them into a neat line',{b:'man',k:.9,h:'glasses',p:'rifle',fx:'beam',w:'d'},'PTANG!'],
[10,'L\'Orignal','A cyborg moose: ex-army mascot turned soldier.','Bruiser',[5,3,4,3,2],'Antler Charge','Charges across the screen carrying enemies on his antlers, then throws them.',['Travels and clears at once','Thrown enemies knock down others'],['Can\'t stop once he starts','Big target'],29,'Moose and mount: a stampede',{b:'quad',k:1.2,h:'antlers',p:'none',fx:'charge',w:'h'},'BRAAAM!'],
[11,'Riff Raff Ruby','Punk guitarist.','Ranged',[3,4,3,4,3],'Power Chord','A sound wave that stuns the whole row in front for 2 seconds.',['Fast stun, short cooldown','Reaches enemies on towers'],['Light damage','Doesn\'t stun bosses'],12,'A band: she stuns, Benoît pounds',{b:'man',k:.95,h:'mohawk',p:'guitar',fx:'wave',w:'e'},'BWAAANG!'],
[12,'Benoît la Batterie','Drummer with two sticks.','Bruiser',[3,3,4,2,3],'Blast Beat','A drum roll that hits everything around him 8 times.',['Great when surrounded','Every hit refills his meter a little'],['Short range','Stands still while drumming'],11,'Ruby stuns, he finishes',{b:'man',k:1,h:'plain',p:'sticks',fx:'notes',w:'e'},'BADABOUM!'],
[13,'Mohawk Mo','His mohawk is a blade.','Speedster',[3,5,4,2,2],'Hair Spin','Spins like a top across the floor, cutting everything he touches.',['Fast and hard to pin down','Bounces off walls for more hits'],['Hard to aim','Hits his partner a lot'],3,'Spins through the gravy crowd',{b:'man',k:.95,h:'mohawk',p:'none',fx:'spin',w:'e'},'ZZZING!'],
[14,'Safety-Pin Sally','Chains and leather.','Trickster',[3,4,3,4,4],'Chain Lash','Yanks a far enemy to her, or pulls her partner out of danger.',['Picks off snipers and runners','Can rescue her partner'],['One target at a time','Weak against armour'],9,'Pulls them right into the sniper\'s line',{b:'man',k:.9,h:'fin',p:'none',fx:'chain',w:'e'},'KLANK!'],
[15,'Le Roadie','Carries amp stacks for a living.','Tank',[5,2,4,3,3],'Amp Drop','Drops a speaker stack: the shockwave knocks everyone down.',['Knocks down the whole screen','The amp stays 5 seconds as cover'],['Knocks his partner down too','Long recovery'],9,'Knocked-down rows for the sniper',{b:'man',k:1.25,h:'cap',p:'none',fx:'slam',w:'e'},'WOMP!'],
[16,'Spit Valve','Ska trumpet player.','Ranged',[2,5,2,4,3],'Brass Blast','A cone of noise that blows enemies back half a screen.',['Pushes enemies into holes and traps','Fast and nimble'],['Low health','The push can scatter a combo'],40,'Blows enemies into Bertrand\'s dam',{b:'man',k:.85,h:'hat',p:'trumpet',fx:'cone',w:'d'},'PWAAAP!'],
[17,'DJ Vinyle','Throws records.','Ranged',[2,5,3,4,2],'Scratch','Three records fly out and come back like boomerangs, hitting twice.',['Hits twice per throw','Safe from far away'],['Low health','Records bounce off armour'],20,'Two noise-makers: total chaos',{b:'man',k:.9,h:'phones',p:'record',fx:'records',w:'g'},'WIKI-WIKI!'],
[18,'Mosh Pit Marge','Big, loud and happy.','Tank',[5,3,4,2,4],'Stage Dive','Jumps onto a crowd and flattens it.',['Big area damage','Jumps over holes and traps'],['The landing hurts her partner','Easy to see coming'],1,'Dives on Grand-Maman\'s tied-up crowd',{b:'man',k:1.3,h:'plain',p:'none',fx:'dive',w:'e'},'MOSH!'],
[19,'Le Tatoueur','Tattoo artist whose tattoos come alive.','Trickster',[3,3,3,3,4],'Ink Beast','A tattoo panther jumps off his arm and fights on its own for 5 seconds.',['Adds a third fighter','The panther draws enemy attention'],['Weak while the panther is out','The panther can\'t be steered'],8,'A steady, safe team',{b:'man',k:1,h:'plain',p:'none',fx:'panther',w:'i'},'RRRAOW!'],
[20,'Feedback Fiona','Keytar player.','Trickster',[2,4,2,3,4],'Feedback Loop','The noise confuses enemies for 3 seconds, so they hit each other.',['Great against big crowds','A boss\'s minions turn on each other'],['No damage of her own','Fragile'],18,'A confused crowd, then a stage dive',{b:'man',k:.9,h:'fin',p:'keytar',fx:'confuse',w:'e'},'SKREEE!'],
[21,'Glorp','A Guimauve cloudjelly in a walking suit.','Trickster',[2,4,3,3,3],'Sting Cloud','A glowing cloud of stings that hangs in the air for 4 seconds.',['Floats over holes','Blocks off an area'],['Wind and fans push it around','Fragile'],30,'Two flyers rule the air',{b:'blob',k:1,h:'none',p:'none',fx:'cloud',w:'g'},'BZZZT!'],
[22,'Krakk','A Fumerolle kettle crab warrior.','Tank',[5,2,3,2,3],'Steam Vent','Blasts boiling steam from his shell on all sides.',['Hard shell blocks from the front','Steam hits on all sides'],['Slow and stubborn','Steam fogs the screen'],21,'Steam and stings: a no-go zone',{b:'crab',k:1,h:'none',p:'none',fx:'steam',w:'f'},'PSSSHH!'],
[23,'La Mineuse','Rig miner from Dorée with a drill arm.','Bruiser',[4,3,4,3,3],'Drill Dash','Drills forward through enemies and obstacles.',['Breaks walls and shields','Opens secret routes'],['The drill overheats','Gets stuck if she hits a boss'],24,'Écho marks them, she drills them',{b:'man',k:1.05,h:'lamp',p:'drill',fx:'drill',w:'d'},'BRRRRR!'],
[24,'Écho','A blind echo mole from L\'Inconnue who fights by sound.','Support',[3,3,2,4,5],'Sonar Ping','Marks every enemy: his partner does double damage to them for 5 seconds.',['Doubles his partner\'s damage','Sees hidden enemies and traps'],['Weak hits','Loud noises (Ruby, Spit Valve) blind him'],2,'Double-damage tree trunks',{b:'quad',k:.9,h:'mole',p:'none',fx:'sonar',w:'i'},'PING!'],
[25,'Demi','Twilight nomad from Crépuscule: half fire, half frost.','Trickster',[3,3,4,3,3],'Flip Side','Switches sides: fire burns enemies over time, frost freezes them.',['Two tools in one','Fire then frost gives bonus damage'],['Takes practice','Switching leaves her open'],5,'Frost Demi plus Zamboni ice',{b:'man',k:.95,h:'plain',p:'none',fx:'firefrost',w:'c'},'FSSSH!'],
[26,'Obsidienne','Lava-rock mercenary from Brasier.','Tank',[5,1,5,2,2],'Eruption','Lava bursts up from the floor all around her.',['Toughest body in the game','Lava hurts enemies who step in it'],['Slowest of all','Can\'t jump high'],32,'Pilote Rouille brings the speed she lacks',{b:'rock',k:1,h:'none',p:'none',fx:'lava',w:'b'},'KABLOOM!'],
[27,'Reflet','Mirror lizard from L\'Inconnue.','Support',[2,5,2,3,5],'Mirror','Copies his partner\'s special.',['Two specials for the team','Fast and slippery'],['Only as good as his partner','Fragile'],7,'Two plows at once',{b:'quad',k:.85,h:'lizard',p:'none',fx:'mirror',w:'i'},'SHING!'],
[28,'Mousse','A living patch of Havre moss in a scavenged helmet.','Support',[4,2,2,3,4],'Overgrowth','Vines grab enemies\' feet and hold them for 3 seconds.',['Holds a whole crowd','Heals slowly when standing still'],['Slow','Weak to fire: Brasier is hard'],9,'Rooted rows for the sniper',{b:'moss',k:1,h:'helmet',p:'none',fx:'vines',w:'h'},'SHHHRK!'],
[29,'Le Cavalier des marées','Rides a stilt-legged tidewalker from Havre.','Bruiser',[4,3,4,4,3],'Stomp','The mount stomps the whole floor; enemies bounce up for easy hits.',['Sits high, hits towers','Big reach from the saddle'],['Big target','The mount doesn\'t fit under low ceilings'],10,'Moose and mount: a stampede',{b:'stilt',k:1,h:'none',p:'none',fx:'stomp',w:'h'},'THOOM!'],
[30,'Smog','A smogwing from Embrume: all wings and soot.','Speedster',[2,5,3,3,3],'Soot Dive','Dives across the screen leaving blinding smoke.',['Flies over everything','The smoke blinds enemies'],['Lowest health','The smoke blinds his partner too'],21,'Two flyers, no floor needed',{b:'bird',k:1,h:'bat',p:'none',fx:'smoke',w:'e'},'WHOOSH!'],
[31,'Grand-Papa Robot','Unit 7-B: a very old, very obsolete robot.','Tank',[5,2,3,2,3],'Overclock','Very fast for 4 seconds, then smokes and stalls for 2.',['Huge burst of speed and hits','Metal body shrugs off bullets'],['Stalls after the burst','Rusts in Fumerolle\'s steam'],8,'Doc covers him while he stalls',{b:'bot',k:1.15,h:'robot',p:'none',fx:'overclock',w:'space'},'BZZRT!'],
[32,'Pilote Rouille','La Rouillarde\'s old pilot, with a jetpack.','Speedster',[2,5,3,4,3],'Strafe Run','Calls the ship in for a strafing pass across the screen.',['Damage across the whole screen','Jetpack hops over holes'],['The ship takes time to arrive','The strafe hits her partner'],26,'Speed plus the toughest rock',{b:'man',k:.9,h:'goggles',p:'pistol',fx:'strafe',w:'space'},'RATATAT!'],
[33,'Tic-Tac','A clockwork guard who deserted the Empire on Kepler-80.','Trickster',[3,3,3,3,4],'Gear Lock','Freezes enemies in place for 3 seconds.',['Stops a whole wave','Works on bosses too, for 1 second'],['Must stop to wind himself up','Low damage'],2,'Frozen crowds, giant swings',{b:'bot',k:1,h:'clock',p:'blade',fx:'gears',w:'space'},'TIC-TAC!'],
[34,'L\'Horloger','The watchmaker who built the rewind watches.','Trickster',[2,3,3,3,4],'Echo','A ghost of him replays his last 3 seconds of attacks, doubling them.',['Doubles a good combo','Ties into the rewind watch story'],['Needs a good combo first','A fragile old man'],12,'An echoed blast beat is 16 hits',{b:'man',k:.9,h:'monocle',p:'cane',fx:'echo',w:'space'},'TIC… TAC…'],
[35,'Capitaine Vieille-Branche','Retired space pirate with a rocket peg leg.','Ranged',[3,3,4,4,3],'Broadside','A cannon volley fired across the screen.',['Big ranged damage','Rocket peg-leg jump'],['Long reload','Cannonballs set off barrels near his partner'],36,'Two old villains turned good',{b:'man',k:1.05,h:'tricorn',p:'cannon',fx:'cannons',w:'space'},'BOOM BOOM!'],
[36,'Général Remords','One of Villen-Hüüs\'s old generals, now a traitor.','Support',[4,3,3,3,4],'Call in Favours','Two of his old soldiers fight on your side for 8 seconds.',['Two extra fighters','Enemies hesitate to hit their old general'],['Slow to call','His soldiers go down fast'],35,'Mutiny: the pirate and the traitor',{b:'man',k:1.1,h:'officer',p:'saber',fx:'troops',w:'space'},'À MOI!'],
[37,'Satellite Sam','Retired orbital technician with a magnet glove.','Trickster',[3,3,3,4,4],'Magnet','Pulls every enemy into one heap.',['Sets up every area attack','Pulls in coins and pick-ups too'],['No damage on its own','Pulls metal partners (robots) too'],18,'Heap them, then Marge dives',{b:'man',k:1,h:'helmet',p:'magnet',fx:'magnet',w:'space'},'KLONK!'],
[38,'Cicatrice','Last survivor of the first war against Villen-Hüüs.','Bruiser',[3,4,4,3,2],'Last Stand','Invincible and stronger while on her last heart.',['Turns losing fights around','Strong all-rounder'],['Best only when nearly dead','Risky to play'],8,'Doc keeps her at exactly one heart',{b:'man',k:1,h:'plain',p:'blade',fx:'aura',w:'b'},'PAS ENCORE!'],
[39,'Bernache','A very angry Canada goose.','Speedster',[2,5,2,2,3],'HONK','Enemies drop their guard and run for 3 seconds.',['Scatters any crowd','Tiny, fast, hard to hit'],['Tiny damage','The honk wakes sleeping enemies'],7,'Scatter them, then plow them',{b:'bird',k:.9,h:'goose',p:'none',fx:'honk',w:'h'},'HONK!'],
[40,'Bertrand le Castor','Beaver combat engineer.','Support',[3,3,3,3,5],'Dam','Builds a log wall that blocks a lane for 6 seconds.',['Shields the team from bullets','Traps enemies for area attacks'],['The wall blocks his partner too','Needs setup time'],16,'Blow them into the dam',{b:'quad',k:.95,h:'beaver',p:'none',fx:'dam',w:'h'},'TOC TOC TOC!'],
[41,'La Marmotte','A groundhog who always knows what\'s coming.','Speedster',[2,5,2,2,3],'Six More Weeks','Dodges the next 3 hits, guaranteed.',['Safest player in a tight spot','Burrows under traps'],['Low damage','Her dodges don\'t protect her partner'],4,'She survives, the Enforcer finishes',{b:'quad',k:.8,h:'hog',p:'none',fx:'dodge',w:'h'},'HOP!'],
[42,'Papi Déambulateur','Grandpa with a rocket on his walker.','Bruiser',[4,2,4,3,3],'Walker Rocket','Rams across the screen.',['Huge ram damage','The walker blocks from the front'],['Painfully slow without the rocket','Can\'t jump well'],1,'Two grandparents, one team',{b:'man',k:.95,h:'bald',p:'walker',fx:'rocket',w:'h'},'VROOOM!'],
[43,'Silence','A mime.','Trickster',[2,4,2,3,4],'Invisible Box','Traps one enemy (or a boss for 2 seconds) in a box nobody can see.',['Shuts down the most dangerous enemy','The box is a step up to towers'],['One target only','Fragile'],9,'A boxed target for the long shot',{b:'man',k:.9,h:'beret',p:'none',fx:'box',w:'g'},'. . .'],
[44,'Le Fantôme du Forum','The ghost of an old hockey legend.','Trickster',[2,4,3,3,3],'Possession','Takes control of an enemy for 5 seconds.',['Passes through walls and enemies','Turns an elite against its friends'],['His body is helpless while possessing','Fragile'],4,'A hockey reunion',{b:'ghost',k:1,h:'helmet',p:'stick',fx:'possess',w:'c'},'OOOOH!'],
[45,'Bingo Bernadette','Never misses Tuesday bingo.','Trickster',[3,3,3,3,3],'B-12!','Draws a ball for a random special each time, one of six.',['Every special is a surprise','Sometimes the best in the game'],['Sometimes the worst','Hard to plan with'],27,'Reflet copies a lucky draw',{b:'man',k:1,h:'curlers',p:'dabber',fx:'bingo',w:'h'},'BINGO!'],
[46,'Grosse Bête','A sports mascot fired for fighting.','Tank',[5,2,3,3,3],'Bounce','Inflates and bounces enemies around the screen.',['Can\'t be knocked down while inflated','Bounces enemies into each other'],['Bounces his partner too','Big, slow target'],13,'Ping-pong with a spinning blade',{b:'mascot',k:1,h:'none',p:'none',fx:'bounce',w:'h'},'BOING!'],
[47,'Le Livreur','Veteran pizza delivery driver on a moped.','Support',[3,5,2,3,5],'Hot Delivery','Throws pizzas that heal his partner and burn enemies.',['Heals and hurts at once','Fast moped'],['Weak up close','Enemies can grab the pizzas'],26,'Feeds the slow tank',{b:'man',k:.95,h:'cap',p:'pizza',fx:'pizza',w:'h'},'LIVRAISON!'],
[48,'Docteur Suplex','Retired pro wrestler.','Bruiser',[4,3,5,1,2],'Piledriver','Grabs one enemy and slams them hard enough to shake the screen.',['Best single-target damage','The slam knocks down enemies nearby'],['Must grab first','Very short reach'],37,'Sam heaps them, Suplex slams them',{b:'man',k:1.25,h:'mask',p:'none',fx:'suplex',w:'e'},'CRAAACK!'],
[49,'Météo Monique','Retired TV weather presenter.','Ranged',[2,3,4,5,3],'Forecast','A lightning storm falls on the enemies for 3 seconds.',['Hits the whole screen','Wet enemies (Fumerolle) take double'],['Fragile','Lightning hits metal partners'],28,'Vines hold them, lightning hits them',{b:'man',k:.9,h:'hair',p:'mic',fx:'bolt',w:'f'},'KRAKOOM!'],
[50,'La Sorcière du Marais','Bog witch from the fogs of Embrume.','Trickster',[2,3,3,4,3],'Hex','Turns one enemy into a frog for 6 seconds.',['Removes any normal enemy','Frogs can be kicked into other enemies'],['Bosses only shrink for 2 seconds','Fragile'],39,'Frogs and geese: a swamp party',{b:'man',k:.9,h:'witch',p:'wand',fx:'frog',w:'e'},'CRÔÔÂ!']
];

// ---------------------------------------------------------------------------
// Art kit: punk trading-card combat scenes, all inline SVG
// ---------------------------------------------------------------------------
const WD = 320, HT = 220, G = 192, HX = 96, EX = 236;
const DK = '#0d0812';
const rnd = s => () => (s = (s * 9301 + 49297) % 233280) / 233280;
const WORLD = {
  h: { t: '#18285a', b: '#f4b98c', g: '#24442f', l: '#3f6e57', sun: '#fff1c9', giant: 1 },
  g: { t: '#3d2363', b: '#ffcfe3', g: '#e9a8cf', l: '#f5c0da', sun: '#ffffff' },
  f: { t: '#1f4b55', b: '#d9f5f2', g: '#1d3940', l: '#5aa3a3', sun: '#f6ffff' },
  e: { t: '#2b1008', b: '#e8784a', g: '#2a140a', l: '#7d3a22', sun: '#ffe2a8' },
  d: { t: '#3d2706', b: '#ffe08a', g: '#4f3306', l: '#b47c12', sun: '#ffffff' },
  i: { t: '#030208', b: '#3c3431', g: '#1e1a18', l: '#4b443f', sun: '#ffffff', stars: 1 },
  c: { t: '#11173a', b: '#ff8f52', g: '#1a1d3c', l: '#3a3f66', sun: '#ffd27a', stars: 1 },
  b: { t: '#330904', b: '#ffa060', g: '#160605', l: '#4a120a', sun: '#fff0bf', lava: 1 },
  space: { t: '#05030c', b: '#2a1450', g: '#1a1430', l: '#2e2550', sun: '#45d4ff', stars: 1, station: 1 }
};

function backdrop(w, c, seed, u = seed) {
  const W = WORLD[w], r = rnd(seed); let s = `<defs><linearGradient id="sky${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${W.t}"/><stop offset="1" stop-color="${W.b}"/></linearGradient></defs><rect width="${WD}" height="${HT}" fill="url(#sky${u})"/>`;
  if (W.stars) for (let i = 0; i < 50; i++) s += `<circle cx="${r() * WD}" cy="${r() * 130}" r="${r() * 1.1 + .2}" fill="#fff" opacity="${.3 + r() * .6}"/>`;
  const sx = 40 + r() * 240, sy = 30 + r() * 30;
  s += `<circle cx="${sx}" cy="${sy}" r="46" fill="${W.sun}" opacity=".35" filter="url(#soft)"/><circle cx="${sx}" cy="${sy}" r="${W.station ? 4 : 15}" fill="${W.sun}"/>`;
  if (W.giant) s += `<circle cx="${sx > 160 ? 70 : 250}" cy="58" r="44" fill="#e8c48a" opacity=".9"/><g opacity=".45"><rect x="${sx > 160 ? 26 : 206}" y="38" width="88" height="7" fill="#b97a46"/><rect x="${sx > 160 ? 26 : 206}" y="60" width="88" height="5" fill="#b97a46"/><rect x="${sx > 160 ? 26 : 206}" y="76" width="88" height="6" fill="#b97a46"/></g>`;
  if (W.station) { s += `<ellipse cx="250" cy="60" rx="60" ry="22" fill="none" stroke="#8a93b8" stroke-width="5" opacity=".6"/>`; for (let i = 0; i < 8; i++) s += `<rect x="${i * 44 - 10}" y="40" width="10" height="120" fill="#2a2148" opacity=".7"/>`; }
  let d = `M0 150`; for (let i = 1; i <= 8; i++) d += ` L ${i * 40 - 20} ${118 + r() * 26} L ${i * 40} ${140 + r() * 10}`;
  s += `<path d="${d} L ${WD} 160 L 0 160 Z" fill="${W.l}" opacity=".85"/>`;
  s += `<rect x="0" y="150" width="${WD}" height="${HT - 150}" fill="${W.g}"/>`;
  for (let i = 0; i < 5; i++) { const y = 150 + i * i * 3.4 + i * 4; s += `<line x1="0" y1="${y}" x2="${WD}" y2="${y}" stroke="#fff" stroke-opacity="${.05 + i * .02}"/>`; }
  for (let i = -6; i <= 6; i++) s += `<line x1="${160 + i * 14}" y1="150" x2="${160 + i * 70}" y2="${HT}" stroke="#fff" stroke-opacity=".05"/>`;
  if (W.lava) for (let i = 0; i < 3; i++) s += `<path d="M0 ${168 + i * 16} Q 90 ${160 + i * 16} 170 ${172 + i * 16} T ${WD} ${166 + i * 16}" stroke="#ff6a1f" stroke-width="${3 - i * .6}" fill="none" filter="url(#glow)" opacity=".8"/>`;
  // speed rays from the impact
  let rays = ''; for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2 + r() * .2; rays += `<path d="M${EX - 6} 128 L ${EX - 6 + Math.cos(a - .05) * 400} ${128 + Math.sin(a - .05) * 400} L ${EX - 6 + Math.cos(a + .05) * 400} ${128 + Math.sin(a + .05) * 400} Z"/>`; }
  s += `<g fill="#fff" opacity=".07">${rays}</g><rect width="${WD}" height="${HT}" fill="url(#dots)" opacity=".06"/>`;
  return s;
}

// --- Hero parts, drawn in local coords: feet at (0,0), facing right
const L = (pts, w) => `<path d="M${pts.map(p => p.join(' ')).join(' L ')}" stroke="${DK}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
const C0 = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${DK}"/>`;
const HEAD = { x: 14, y: -96, r: 11 };
const HAND = [52, -86];
function humanoid(o) {
  let s = L([[0, -42], [-18, -22], [-30, 0]], 11) + L([[0, -42], [20, -24], [34, 0]], 11) + L([[0, -42], [8, -80]], 24) + L([[8, -80], [-8, -66], [-16, -78]], 8) + L([[8, -80], [30, -82], HAND], 8);
  if (o.box) s = L([[0, -42], [-18, -22], [-30, 0]], 12) + L([[0, -42], [20, -24], [34, 0]], 12) + `<rect x="-12" y="-88" width="30" height="50" rx="3" fill="${DK}"/>` + L([[8, -80], [-8, -66], [-16, -78]], 9) + L([[8, -80], [30, -82], HAND], 9);
  if (o.ghost) s = `<path d="M-14 -40 Q -26 -10 -40 4 Q -10 -6 8 -10 Q 18 -24 18 -40 Z" fill="${DK}"/>` + L([[2, -42], [8, -80]], 24) + L([[8, -80], [-8, -66], [-16, -78]], 8) + L([[8, -80], [30, -82], HAND], 8);
  s += o.box ? `<rect x="2" y="-108" width="24" height="22" rx="3" fill="${DK}"/>` : C0(HEAD.x, HEAD.y, HEAD.r);
  return s;
}
const HEADS = {
  plain: '', none: '', bald: '',
  bun: `<circle cx="6" cy="-108" r="7" fill="${DK}"/>`,
  tuque: `<path d="M2 -98 Q 4 -116 16 -114 Q 28 -112 27 -98 Z" fill="${DK}"/><circle cx="16" cy="-118" r="5" fill="${DK}"/>`,
  chef: `<rect x="4" y="-126" width="20" height="22" fill="${DK}"/><circle cx="9" cy="-126" r="7" fill="${DK}"/><circle cx="20" cy="-127" r="7" fill="${DK}"/>`,
  helmet: `<path d="M1 -96 Q 2 -112 15 -112 Q 29 -112 28 -96 Z" fill="${DK}"/>`,
  cap: `<path d="M3 -100 Q 6 -110 16 -110 Q 25 -109 26 -101 L 36 -100 L 26 -98 Z" fill="${DK}"/>`,
  mohawk: `<path d="M4 -104 L 2 -122 L 9 -108 L 10 -128 L 15 -109 L 19 -126 L 20 -107 L 27 -118 L 24 -101 Z" fill="${DK}"/>`,
  fin: `<path d="M6 -104 Q 4 -130 26 -132 Q 18 -118 24 -104 Z" fill="${DK}"/>`,
  glasses: '', hat: `<rect x="2" y="-112" width="25" height="10" fill="${DK}"/><rect x="-2" y="-104" width="33" height="3" fill="${DK}"/>`,
  phones: `<path d="M3 -96 Q 14 -122 26 -96" stroke="${DK}" stroke-width="4" fill="none"/><rect x="0" y="-102" width="7" height="12" rx="2" fill="${DK}"/>`,
  lamp: `<path d="M1 -96 Q 2 -112 15 -112 Q 29 -112 28 -96 Z" fill="${DK}"/><rect x="22" y="-110" width="7" height="6" fill="${DK}"/>`,
  goggles: `<path d="M1 -96 Q 2 -112 15 -112 Q 29 -112 28 -96 Z" fill="${DK}"/>`,
  monocle: `<path d="M4 -104 Q 14 -110 24 -104" stroke="${DK}" stroke-width="5" fill="none"/>`,
  tricorn: `<path d="M-4 -102 L 14 -122 L 33 -102 Q 14 -108 -4 -102 Z" fill="${DK}"/>`,
  officer: `<path d="M2 -104 L 4 -114 L 28 -116 L 27 -104 Z" fill="${DK}"/><rect x="0" y="-105" width="32" height="4" fill="${DK}"/>`,
  beret: `<ellipse cx="13" cy="-106" rx="15" ry="6" fill="${DK}" transform="rotate(-12 13 -106)"/>`,
  curlers: `<circle cx="4" cy="-104" r="5" fill="${DK}"/><circle cx="12" cy="-109" r="5" fill="${DK}"/><circle cx="21" cy="-108" r="5" fill="${DK}"/>`,
  mask: '', hair: `<path d="M0 -92 Q -2 -116 15 -114 Q 32 -112 30 -92 Q 26 -102 15 -104 Q 4 -102 0 -92 Z" fill="${DK}"/>`,
  witch: `<path d="M-6 -102 L 34 -104 L 20 -106 L 4 -136 L 8 -106 Z" fill="${DK}"/>`,
  robot: `<line x1="14" y1="-108" x2="14" y2="-120" stroke="${DK}" stroke-width="3"/><circle cx="14" cy="-122" r="4" fill="${DK}"/>`,
  clock: `<circle cx="14" cy="-116" r="9" fill="${DK}"/>`,
  raccoon: `<path d="M3 -103 L 1 -120 L 12 -107 Z M17 -107 L 27 -120 L 27 -101 Z" fill="${DK}"/><path d="M-12 -50 Q -40 -40 -44 -16" stroke="${DK}" stroke-width="9" fill="none" stroke-linecap="round"/><rect x="-24" y="-86" width="14" height="30" rx="4" fill="${DK}"/>`
};
// colour details drawn on top (eyes, glasses, stripes)
function headLights(h, c) {
  const e = `<circle cx="20" cy="-98" r="2.2" fill="${c}" filter="url(#glow)"/>`;
  const extra = {
    glasses: `<circle cx="19" cy="-98" r="5" fill="none" stroke="${c}" stroke-width="2"/><circle cx="9" cy="-98" r="5" fill="none" stroke="${c}" stroke-width="2"/>`,
    goggles: `<rect x="8" y="-103" width="18" height="7" rx="3" fill="${c}" filter="url(#glow)"/>`,
    monocle: `<circle cx="20" cy="-97" r="5" fill="none" stroke="${c}" stroke-width="2"/>${e}`,
    lamp: `<path d="M29 -108 L 70 -122 L 70 -94 Z" fill="${c}" opacity=".25"/>${e}`,
    helmet: `<rect x="14" y="-100" width="14" height="4" fill="${c}" filter="url(#glow)"/>`,
    mask: `<path d="M5 -100 L 26 -100 L 22 -94 L 9 -94 Z" fill="${c}" opacity=".9"/>${e}`,
    robot: `<rect x="10" y="-101" width="14" height="5" fill="${c}" filter="url(#glow)"/><circle cx="14" cy="-122" r="2" fill="${c}"/>`,
    clock: `<circle cx="14" cy="-116" r="6" fill="none" stroke="${c}" stroke-width="1.5"/><path d="M14 -116 L 14 -120 M14 -116 L 17 -116" stroke="${c}" stroke-width="1.5"/><rect x="10" y="-101" width="14" height="5" fill="${c}" filter="url(#glow)"/>`,
    raccoon: `<rect x="5" y="-102" width="22" height="6" rx="3" fill="none" stroke="${c}" stroke-width="1.5"/>${e}`,
    none: ''
  };
  return extra[h] ?? e;
}
const PROPS = {
  none: '', yarn: C0(62, -92, 8),
  saw: `<rect x="48" y="-92" width="40" height="11" rx="2" fill="${DK}"/><path d="M50 -81 l4 5 l4 -5 l4 5 l4 -5 l4 5 l4 -5 l4 5 l4 -5 l4 5" fill="${DK}"/>`,
  ladle: L([HAND, [76, -104]], 4) + C0(80, -106, 7),
  stick: L([[44, -88], [66, -30], [86, -26]], 5),
  guitar: `<ellipse cx="30" cy="-66" rx="16" ry="11" fill="${DK}" transform="rotate(-25 30 -66)"/>` + L([[38, -72], [78, -102]], 5),
  sticks: L([HAND, [76, -110]], 3) + L([[-16, -78], [-26, -104]], 3),
  rifle: L([[34, -86], [104, -92]], 5) + `<rect x="30" y="-88" width="22" height="9" fill="${DK}"/>`,
  pistol: L([HAND, [70, -88]], 6),
  bag: `<rect x="50" y="-96" width="20" height="16" rx="2" fill="${DK}"/>`,
  trumpet: L([HAND, [70, -88]], 5) + `<path d="M68 -88 L 84 -98 L 84 -78 Z" fill="${DK}"/>`,
  record: C0(62, -88, 9),
  keytar: L([[10, -60], [70, -96]], 12),
  drill: `<path d="M48 -96 L 92 -86 L 48 -76 Z" fill="${DK}"/>`,
  blade: `<path d="M50 -90 L 100 -92 L 50 -84 Z" fill="${DK}"/>`,
  cannon: `<rect x="38" y="-96" width="44" height="16" rx="3" fill="${DK}"/><circle cx="44" cy="-76" r="7" fill="${DK}"/>`,
  cane: L([[-16, -78], [-12, 0]], 4),
  saber: `<path d="M50 -88 Q 80 -110 98 -100" stroke="${DK}" stroke-width="4" fill="none"/>`,
  magnet: `<path d="M50 -96 L 70 -96 Q 80 -88 70 -78 L 50 -78 L 50 -82 L 66 -82 Q 70 -87 66 -92 L 50 -92 Z" fill="${DK}"/>`,
  walker: L([[40, 0], [44, -60], [74, -60], [78, 0]], 4) + L([[44, -30], [74, -30]], 3),
  pizza: `<path d="M50 -96 L 78 -88 L 54 -74 Z" fill="${DK}"/>`,
  dabber: `<rect x="50" y="-100" width="10" height="22" rx="3" fill="${DK}"/>`,
  wand: L([HAND, [78, -100]], 3),
  mic: L([HAND, [64, -98]], 4) + C0(66, -100, 5),
  plow: `<path d="M40 0 Q 52 -40 44 -78 L 66 -76 Q 74 -36 62 0 Z" fill="${DK}"/>`
};
// other bodies
function body(a) {
  switch (a.b) {
    case 'man': return humanoid({}) + (HEADS[a.h] || '') + (PROPS[a.p] || '');
    case 'bot': return humanoid({ box: 1 }) + (HEADS[a.h] || '') + (PROPS[a.p] || '');
    case 'ghost': return humanoid({ ghost: 1 }) + (HEADS[a.h] || '') + (PROPS[a.p] || '');
    case 'kart': return `<rect x="-40" y="-46" width="84" height="36" rx="6" fill="${DK}"/><circle cx="-24" cy="-8" r="9" fill="${DK}"/><circle cx="28" cy="-8" r="9" fill="${DK}"/><rect x="-30" y="-64" width="6" height="20" fill="${DK}"/>` + C0(4, -64, 10) + `<path d="M-6 -66 Q -4 -80 4 -78 Q 14 -78 16 -68 L 24 -66 Z" fill="${DK}"/>`;
    case 'quad': { let s = `<ellipse cx="0" cy="-36" rx="34" ry="18" fill="${DK}"/>` + L([[-22, -26], [-28, 0]], 8) + L([[-10, -26], [-6, 0]], 8) + L([[14, -26], [10, 0]], 8) + L([[24, -26], [32, 0]], 8) + L([[26, -42], [40, -54]], 12) + C0(42, -56, 12);
      if (a.h === 'antlers') s += L([[38, -66], [30, -92], [18, -100]], 5) + L([[30, -86], [38, -100]], 4) + L([[46, -66], [58, -92], [70, -98]], 5) + L([[58, -88], [54, -104]], 4) + L([[50, -54], [64, -48]], 10);
      if (a.h === 'beaver') s += `<ellipse cx="-44" cy="-22" rx="14" ry="6" fill="${DK}"/>` + C0(36, -66, 4) + C0(48, -66, 4);
      if (a.h === 'mole') s += `<path d="M50 -60 L 70 -54 L 50 -50 Z" fill="${DK}"/>`;
      if (a.h === 'lizard') s += `<path d="M-30 -36 Q -60 -30 -70 -10" stroke="${DK}" stroke-width="7" fill="none" stroke-linecap="round"/>` + `<path d="M48 -60 L 66 -54 L 48 -50 Z" fill="${DK}"/>`;
      if (a.h === 'hog') s += C0(36, -66, 4) + C0(48, -66, 4) + `<ellipse cx="-34" cy="-38" rx="8" ry="5" fill="${DK}"/>`;
      return s; }
    case 'bird': { if (a.h === 'goose') return `<ellipse cx="-4" cy="-30" rx="30" ry="16" fill="${DK}"/>` + L([[18, -36], [30, -70], [38, -86]], 9) + C0(40, -88, 8) + `<path d="M46 -90 L 62 -86 L 46 -82 Z" fill="${DK}"/><path d="M-10 -40 Q -30 -90 -60 -96 Q -40 -70 -26 -40 Z" fill="${DK}"/>` + L([[-6, -16], [-10, 0]], 4) + L([[6, -16], [10, 0]], 4);
      return `<g transform="translate(0 -40)"><ellipse cx="0" cy="-30" rx="16" ry="12" fill="${DK}"/><path d="M-8 -34 L -70 -80 L -54 -50 L -74 -40 L -50 -30 L -10 -26 Z M8 -34 L 70 -80 L 54 -50 L 74 -40 L 50 -30 L 10 -26 Z" fill="${DK}"/>${C0(14, -40, 8)}</g>`; }
    case 'blob': { let s = `<path d="M-34 -50 Q -34 -96 0 -96 Q 34 -96 34 -50 Q 0 -40 -34 -50 Z" fill="${DK}"/>`; for (let i = 0; i < 7; i++) s += `<path d="M${-28 + i * 9} -48 q ${(i % 2 ? 8 : -8)} 20 ${(i % 2 ? -4 : 4)} 44" stroke="${DK}" stroke-width="4" fill="none" stroke-linecap="round"/>`; return s + L([[-12, -10], [-16, 0]], 6) + L([[12, -10], [16, 0]], 6); }
    case 'moss': return `<path d="M-30 0 Q -40 -30 -26 -50 Q -30 -76 -6 -78 Q 4 -98 22 -80 Q 42 -74 34 -46 Q 44 -20 30 0 Z" fill="${DK}"/><path d="M-12 -80 Q -10 -100 6 -100 Q 24 -100 24 -82 Z" fill="${DK}"/>` + L([[30, -50], [56, -60]], 8);
    case 'crab': { let s = `<ellipse cx="0" cy="-34" rx="44" ry="22" fill="${DK}"/>`; for (let i = 0; i < 3; i++) s += L([[-20 + i * 6, -20], [-40 + i * 4, -8], [-44 + i * 6, 0]], 5) + L([[20 - i * 6, -20], [40 - i * 4, -8], [44 - i * 6, 0]], 5); return s + L([[30, -44], [56, -66]], 8) + `<path d="M50 -76 L 78 -82 L 64 -70 L 80 -62 L 56 -58 Z" fill="${DK}"/>` + L([[-30, -44], [-50, -70]], 8) + `<circle cx="-54" cy="-76" r="10" fill="${DK}"/>` + L([[8, -54], [8, -66]], 3) + L([[18, -54], [20, -66]], 3) + C0(8, -68, 3) + C0(20, -68, 3); }
    case 'rock': return `<path d="M-30 0 L -36 -40 L -20 -46 L -26 -84 L 2 -96 L 24 -86 L 22 -48 L 38 -42 L 32 0 Z" fill="${DK}"/><path d="M22 -70 L 60 -78 L 64 -62 L 26 -58 Z" fill="${DK}"/><path d="M-4 -96 L 0 -118 L 22 -116 L 22 -94 Z" fill="${DK}"/>`;
    case 'stilt': return L([[-14, -90], [-30, -40], [-24, 0]], 5) + L([[0, -90], [10, -50], [-2, 0]], 5) + L([[14, -90], [36, -46], [34, 0]], 5) + L([[24, -90], [52, -50], [62, 0]], 5) + `<ellipse cx="6" cy="-96" rx="34" ry="14" fill="${DK}"/>` + L([[36, -102], [56, -110]], 8) + C0(60, -112, 8) + L([[4, -108], [8, -132]], 16) + C0(10, -146, 9) + L([[8, -128], [38, -136]], 6);
    case 'mascot': return `<circle cx="0" cy="-52" r="40" fill="${DK}"/>` + C0(16, -100, 22) + C0(2, -120, 8) + C0(30, -120, 8) + L([[-14, -14], [-20, 0]], 12) + L([[14, -14], [22, 0]], 12) + L([[34, -64], [58, -78]], 12);
  }
  return '';
}
function heroLights(a, c) {
  if (a.b === 'man' || a.b === 'bot' || a.b === 'ghost') return headLights(a.h, c) + (a.b === 'bot' ? `<rect x="-6" y="-76" width="18" height="4" fill="${c}" opacity=".9"/><rect x="-6" y="-66" width="10" height="4" fill="${c}" opacity=".6"/>` : '');
  const eye = { kart: [10, -66], quad: [48, -58], bird: a.h === 'goose' ? [42, -90] : [17, -82], blob: [10, -74], moss: [12, -86], crab: [8, -68], rock: [14, -106], stilt: [14, -148], mascot: [24, -102] }[a.b] || [0, 0];
  let s = `<circle cx="${eye[0]}" cy="${eye[1]}" r="2.6" fill="${c}" filter="url(#glow)"/>`;
  if (a.b === 'blob') for (let i = 0; i < 5; i++) s += `<circle cx="${-18 + i * 9}" cy="-66" r="2" fill="${c}" filter="url(#glow)"/>`;
  if (a.b === 'rock') s += `<path d="M-20 -70 L -6 -60 L -12 -40 M6 -80 L 14 -58 L 6 -30" stroke="#ff6a1f" stroke-width="2.5" fill="none" filter="url(#glow)"/>`;
  if (a.b === 'mascot') s += `<path d="M6 -90 Q 18 -82 30 -90" stroke="${c}" stroke-width="2.5" fill="none"/>`;
  return s;
}

function goon(x, y, rot = 18, sc = 1, eye = '#ff2b2b', id = '') {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${-sc} ${sc})"${id}>${['<g fill="#2b2340" stroke="#8a7aa8" stroke-width="1.5" stroke-linejoin="round">',
    `<path d="M-6 -40 L -16 0 L -8 0 L 0 -26 L 8 0 L 16 0 L 8 -40 Z"/>`, `<rect x="-11" y="-80" width="24" height="42" rx="5"/>`, `<path d="M10 -74 L 28 -60 L 24 -56 L 8 -66 Z"/><path d="M-8 -74 L -24 -84 L -26 -78 L -10 -68 Z"/>`,
    `<path d="M-8 -98 Q -8 -110 2 -110 Q 13 -110 13 -98 L 13 -86 L -8 -86 Z"/></g>`, `<rect x="-6" y="-100" width="18" height="5" fill="${eye}" filter="url(#glow)"/>`].join('')}</g>`;
}
function burst(x, y, r, c1 = '#ffd23f', c2 = '#fff') {
  let d = ''; for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2, rr = i % 2 ? r : r * .45; d += `${i ? 'L' : 'M'}${(x + Math.cos(a) * rr).toFixed(1)} ${(y + Math.sin(a) * rr).toFixed(1)} `; }
  return `<path d="${d}Z" fill="${c1}" stroke="${DK}" stroke-width="2"/><circle cx="${x}" cy="${y}" r="${r * .28}" fill="${c2}"/>`;
}

// Special-move effects. h = hand position (absolute), c = colour
function fx(name, c, h, k, r) {
  const ex = EX, ey = G - 70, glow = 'filter="url(#glow)"';
  const sp = (n, x0, y0, w, hh, col) => { let s = ''; for (let i = 0; i < n; i++) s += `<circle cx="${x0 + r() * w}" cy="${y0 + r() * hh}" r="${.8 + r() * 2.2}" fill="${col}" ${glow}/>`; return s; };
  const lines = (n, x0, y0, len, col) => { let s = ''; for (let i = 0; i < n; i++) { const y = y0 + i * 9 + r() * 4; s += `<line x1="${x0 - len - r() * 20}" y1="${y}" x2="${x0}" y2="${y}" stroke="${col}" stroke-width="2" stroke-opacity=".6"/>`; } return s; };
  switch (name) {
    case 'yarn': { let s = `<path d="M${h[0]} ${h[1]} Q ${(h[0] + ex) / 2} ${h[1] - 70} ${ex} ${ey - 20}" stroke="${c}" stroke-width="2" stroke-dasharray="5 4" fill="none"/>` + burst(ex, ey - 14, 34); for (let i = 0; i < 6; i++) s += `<ellipse cx="${ex + (r() - .5) * 26}" cy="${G - 40 - i * 10}" rx="${20 + r() * 8}" ry="5" fill="none" stroke="${c}" stroke-width="2.5" transform="rotate(${(r() - .5) * 40} ${ex} ${G - 40})" ${glow}/>`; return { pre: '', post: s }; }
    case 'trunk': return { pre: burst(ex, ey, 40), post: `<g transform="rotate(-14 ${h[0]} ${h[1]})"><rect x="${h[0] - 10}" y="${h[1] - 14}" width="190" height="26" rx="12" fill="#5a3a22" stroke="${DK}" stroke-width="3"/><path d="M${h[0] + 20} ${h[1] - 4} h 140 M${h[0] + 40} ${h[1] + 4} h 110" stroke="#3a2412" stroke-width="2"/><circle cx="${h[0] + 180}" cy="${h[1] - 1}" r="12" fill="#c9a06a" stroke="${DK}" stroke-width="3"/></g>` + `<path d="M${h[0] - 10} ${h[1] - 60} A 120 120 0 0 1 ${h[0] + 160} ${h[1] - 40}" stroke="#fff" stroke-width="3" fill="none" opacity=".5"/>`, erot: 40 };
    case 'gravy': return { pre: `<ellipse cx="${ex - 20}" cy="${G + 4}" rx="110" ry="14" fill="#7a4a1e" stroke="#4a2a0e" stroke-width="2"/><ellipse cx="${ex - 40}" cy="${G + 1}" rx="40" ry="4" fill="#b97a46" opacity=".7"/>` + sp(8, ex - 60, G - 50, 80, 40, '#b97a46'), post: '', erot: 70 };
    case 'punches': { let s = burst(ex - 4, ey - 10, 30); for (let i = 0; i < 5; i++) s += `<circle cx="${ex - 22 + r() * 30}" cy="${ey - 40 + r() * 50}" r="9" fill="${c}" stroke="${DK}" stroke-width="2"/>`; return { pre: '', post: s + lines(5, ex - 26, ey - 40, 40, '#fff') }; }
    case 'ice': { let s = `<path d="M0 ${G - 4} L ${WD} ${G - 8} L ${WD} ${G + 12} L 0 ${G + 14} Z" fill="#bfefff" opacity=".7"/>`; for (let i = 0; i < 10; i++) { const x = 20 + i * 30 + r() * 10; s += `<path d="M${x} ${G + 4} L ${x + 5} ${G - 18 - r() * 18} L ${x + 10} ${G + 4} Z" fill="#e8fbff" stroke="${c}" stroke-width="1.5"/>`; } return { pre: s, post: sp(14, 140, 110, 160, 80, '#fff') + burst(ex, ey, 28, '#9fe7ff'), erot: 55 }; }
    case 'snow': { let s = ''; for (let i = 0; i < 70; i++) { const x = r() * WD, y = r() * HT; s += `<line x1="${x}" y1="${y}" x2="${x - 14}" y2="${y + 6}" stroke="#fff" stroke-width="${1 + r() * 2}" opacity="${.4 + r() * .5}"/>`; } return { pre: '', post: `<rect width="${WD}" height="${HT}" fill="#fff" opacity=".18"/>` + s, erot: 8, eye: '#666' }; }
    case 'plow': return { pre: '', post: `<path d="M${h[0] + 30} ${G} Q ${h[0] + 60} ${G - 60} ${h[0] + 100} ${G - 30} Q ${h[0] + 120} ${G - 10} ${h[0] + 130} ${G} Z" fill="#f3f6ff" stroke="${c}" stroke-width="2"/>` + goon(ex + 30, G - 80, 70, .7) + goon(ex + 60, G - 30, 110, .6) + sp(20, h[0] + 30, G - 80, 160, 70, '#fff'), erot: 40, ex: 20 };
    case 'heal': { let s = `<path d="M${h[0]} ${h[1]} Q ${h[0] + 50} ${h[1] - 80} ${h[0] + 110} ${h[1] - 20}" stroke="#7dffc0" stroke-width="2" stroke-dasharray="4 4" fill="none"/><rect x="${h[0] + 100}" y="${h[1] - 34}" width="22" height="18" rx="3" fill="#fff" stroke="${DK}" stroke-width="2"/><path d="M${h[0] + 111} ${h[1] - 31} v 12 M${h[0] + 105} ${h[1] - 25} h 12" stroke="#ff2b2b" stroke-width="3"/>`; for (let i = 0; i < 8; i++) { const x = 20 + r() * 120, y = 40 + r() * 100; s += `<path d="M${x} ${y - 5} v 10 M${x - 5} ${y} h 10" stroke="#7dffc0" stroke-width="2.5" ${glow}/>`; } return { pre: '', post: s, erot: 0 }; }
    case 'beam': return { pre: '', post: `<line x1="${h[0] + 50}" y1="${h[1] - 6}" x2="${WD}" y2="${h[1] - 12}" stroke="${c}" stroke-width="10" opacity=".45" filter="url(#soft)"/><line x1="${h[0] + 50}" y1="${h[1] - 6}" x2="${WD}" y2="${h[1] - 12}" stroke="#fff" stroke-width="2.5" ${glow}/>` + burst(h[0] + 56, h[1] - 6, 14) + goon(ex + 60, G, 10, .75) };
    case 'charge': return { pre: lines(7, 40, G - 90, 90, '#fff') + `<g filter="url(#blur2)" fill="#d9c8a8" opacity=".6"><circle cx="20" cy="${G - 6}" r="16"/><circle cx="44" cy="${G - 2}" r="12"/><circle cx="0" cy="${G}" r="14"/></g>`, post: burst(ex - 10, ey - 6, 32), erot: 50, ex: -10 };
    case 'wave': { let s = ''; for (let i = 1; i <= 5; i++) s += `<path d="M${h[0] + i * 26} ${h[1] - 20 - i * 9} Q ${h[0] + 14 + i * 30} ${h[1] - 6} ${h[0] + i * 26} ${h[1] + 8 + i * 9}" stroke="${c}" stroke-width="${5 - i * .6}" fill="none" ${glow} opacity="${1 - i * .12}"/>`; return { pre: '', post: s + sp(10, ex - 20, ey - 40, 50, 60, '#fff'), erot: 14 }; }
    case 'notes': { let s = ''; for (let i = 0; i < 9; i++) s += `<text x="${30 + r() * 220}" y="${50 + r() * 100}" font-size="${16 + r() * 14}" fill="${c}" ${glow} font-family="serif">${i % 2 ? '♪' : '♫'}</text>`; return { pre: '', post: s + burst(ex, ey, 30) }; }
    case 'spin': { let s = ''; for (let i = 0; i < 4; i++) s += `<ellipse cx="${HX + 10}" cy="${G - 60 + i * 10}" rx="${70 - i * 6}" ry="${16 - i}" fill="none" stroke="${c}" stroke-width="2.5" opacity="${.9 - i * .18}" ${glow}/>`; return { pre: '', post: s + sp(16, ex - 50, ey - 30, 60, 60, '#ffd23f') + burst(ex - 8, ey, 26), erot: 30 }; }
    case 'chain': { let s = '', x0 = h[0] + 4, y0 = h[1]; const x1 = ex - 6, y1 = ey - 24; for (let i = 0; i <= 14; i++) { const t = i / 14, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * -18; s += `<ellipse cx="${x}" cy="${y}" rx="5" ry="3" fill="none" stroke="${c}" stroke-width="2.5" transform="rotate(${i % 2 ? 30 : -30} ${x} ${y})"/>`; } return { pre: '', post: s + lines(4, ex + 40, ey - 30, 30, '#fff'), erot: -22, ex: -20 }; }
    case 'slam': { let s = `<g transform="translate(${ex - 74} ${G - 64}) rotate(-6)"><rect width="44" height="60" fill="${DK}" stroke="${c}" stroke-width="2.5"/><circle cx="22" cy="18" r="10" fill="none" stroke="${c}" stroke-width="2"/><circle cx="22" cy="42" r="12" fill="none" stroke="${c}" stroke-width="2"/></g>`; for (let i = 1; i < 4; i++) s += `<ellipse cx="${ex - 52}" cy="${G}" rx="${30 * i}" ry="${6 * i}" fill="none" stroke="#fff" stroke-width="2" opacity="${.8 - i * .2}"/>`; return { pre: '', post: s + `<path d="M${ex - 40} ${G - 70} l -8 -20 M${ex - 60} ${G - 70} l -4 -26 M${ex - 30} ${G - 66} l 6 -20" stroke="#fff" stroke-width="2"/>`, erot: 75 }; }
    case 'cone': { const id = 'cn' + Math.floor(r() * 1e6); return { pre: '', post: `<defs><linearGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity=".9"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></linearGradient></defs><path d="M${h[0] + 32} ${h[1] - 2} L ${WD} ${h[1] - 70} L ${WD} ${h[1] + 70} Z" fill="url(#${id})"/>` + lines(6, WD, h[1] - 30, 60, '#fff'), erot: 34, ex: 26 }; }
    case 'records': { let s = ''; for (let i = 0; i < 3; i++) { const x = h[0] + 40 + i * 42, y = h[1] - 30 + i * 18 - (i === 1 ? 20 : 0); s += `<path d="M${x - 30} ${y + 6} q 14 -8 26 -2" stroke="${c}" stroke-width="2" fill="none" opacity=".6"/><circle cx="${x}" cy="${y}" r="10" fill="${DK}" stroke="${c}" stroke-width="2" ${glow}/><circle cx="${x}" cy="${y}" r="3" fill="${c}"/>`; } return { pre: '', post: s + burst(ex, ey - 8, 22) }; }
    case 'dive': return { pre: `<ellipse cx="${ex - 20}" cy="${G}" rx="90" ry="10" fill="#fff" opacity=".25"/>` + goon(ex + 30, G - 6, 86, .7) + goon(ex - 60, G - 4, -84, .7), post: burst(ex - 30, G - 30, 30), hero: [70, -40, 30], erot: 80 };
    case 'panther': return { pre: '', post: `<g transform="translate(${ex - 70} ${G - 90}) rotate(-12)" filter="url(#glow)"><path d="M0 30 Q 20 4 56 10 Q 70 0 82 8 L 90 4 L 88 16 Q 92 28 78 30 Q 60 40 40 36 L 20 52 L 14 46 L 24 34 Q 10 38 0 30 Z M0 30 Q -24 20 -34 34" fill="#2a0f4a" stroke="${c}" stroke-width="2.5"/><circle cx="80" cy="12" r="2.5" fill="#fff"/></g>` + `<path d="M${h[0] - 20} ${h[1] + 6} Q ${h[0] + 10} ${h[1] - 30} ${ex - 70} ${G - 70}" stroke="${c}" stroke-width="2" stroke-dasharray="3 5" fill="none"/>` };
    case 'confuse': { let s = goon(ex + 44, G, -14, .85); for (let i = 0; i < 2; i++) s += `<path d="M${ex + i * 44 - 6} ${G - 124} q 8 -10 16 0 q 8 10 0 14" stroke="${c}" stroke-width="2.5" fill="none" ${glow}/><text x="${ex + i * 44 + 8}" y="${G - 128}" fill="${c}" font-size="18" font-family="Archivo Black">?</text>`; return { pre: '', post: s + burst(ex + 20, ey - 20, 22), erot: -6 }; }
    case 'cloud': { let s = ''; for (let i = 0; i < 10; i++) s += `<circle cx="${ex - 30 + r() * 70}" cy="${ey - 40 + r() * 60}" r="${10 + r() * 14}" fill="${c}" opacity=".35" filter="url(#blur2)"/>`; return { pre: '', post: s + sp(24, ex - 40, ey - 50, 90, 80, '#fff'), erot: 8 }; }
    case 'steam': { let s = ''; for (let i = 0; i < 12; i++) s += `<circle cx="${HX - 50 + r() * 140}" cy="${G - 20 - r() * 110}" r="${12 + r() * 16}" fill="#fff" opacity=".35" filter="url(#blur2)"/>`; return { pre: '', post: s + burst(ex - 10, ey + 10, 22, '#ff8a5a'), erot: 30 }; }
    case 'drill': return { pre: '', post: sp(26, h[0] + 30, h[1] - 20, 50, 40, '#ffd23f') + burst(h[0] + 46, h[1] - 2, 18) + `<path d="M${ex - 12} ${G} l 6 -30 l -10 -16 l 12 -18" stroke="#fff" stroke-width="2" fill="none"/>`, ex: -36, erot: 40 };
    case 'sonar': { let s = ''; for (let i = 1; i < 6; i++) s += `<circle cx="${HX + 40}" cy="${G - 56}" r="${i * 30}" fill="none" stroke="${c}" stroke-width="2" opacity="${1 - i * .16}"/>`; const t = (x, y) => `<g stroke="#ff2b6a" stroke-width="2" fill="none" ${glow}><circle cx="${x}" cy="${y}" r="16"/><path d="M${x - 22} ${y} h 10 M${x + 12} ${y} h 10 M${x} ${y - 22} v 10 M${x} ${y + 12} v 10"/></g>`; return { pre: '', post: s + t(ex - 4, G - 60) + goon(ex + 56, G, 0, .7) + t(ex + 56, G - 42), erot: 0 }; }
    case 'firefrost': { let s = ''; for (let i = 0; i < 7; i++) s += `<path d="M${h[0] + 20 + i * 14} ${h[1] - 10} q ${6} ${-20 - r() * 20} ${14} 0" fill="#ff7a3d" ${glow}/>`; for (let i = 0; i < 6; i++) s += `<path d="M${ex - 10 + i * 8} ${G - 40 - i * 12} l 6 -14 l 6 14 z" fill="#bfefff" stroke="#9fc3ff"/>`; return { pre: '', post: s + burst(ex, ey, 26, '#ff7a3d', '#bfefff'), erot: 22 }; }
    case 'lava': { let s = ''; for (let i = 0; i < 4; i++) { const x = 70 + i * 60 + r() * 20, hh = 60 + r() * 60; s += `<path d="M${x - 10} ${G + 4} Q ${x - 14} ${G - hh / 2} ${x} ${G - hh} Q ${x + 14} ${G - hh / 2} ${x + 10} ${G + 4} Z" fill="#ff6a1f" ${glow}/><path d="M${x - 4} ${G} Q ${x - 4} ${G - hh / 2} ${x} ${G - hh + 10} Q ${x + 4} ${G - hh / 2} ${x + 4} ${G} Z" fill="#fff0bf"/>`; } return { pre: '', post: s + sp(20, 40, 60, 240, 100, '#ffc04d'), erot: 50 }; }
    case 'mirror': return { pre: '', post: `<path d="M${HX + 36} 40 L ${HX + 36} ${G}" stroke="${c}" stroke-width="3" ${glow}/>` + sp(14, HX + 20, 40, 40, 150, '#fff') + burst(ex, ey, 24), mirror: 1 };
    case 'vines': { let s = ''; for (let i = 0; i < 7; i++) { const x = ex - 40 + i * 14; s += `<path d="M${x} ${G + 2} q ${(r() - .5) * 30} -30 ${(r() - .5) * 20} -${40 + r() * 40} q 10 -10 4 -18" stroke="#3fae6a" stroke-width="${3 + r() * 2}" fill="none" stroke-linecap="round"/><circle cx="${x}" cy="${G - 30 - r() * 40}" r="3" fill="${c}" ${glow}/>`; } return { pre: '', post: s, erot: 4 }; }
    case 'stomp': { let s = ''; for (let i = 1; i < 4; i++) s += `<ellipse cx="${HX + 40}" cy="${G}" rx="${50 * i}" ry="${8 * i}" fill="none" stroke="#fff" stroke-width="2.5" opacity="${.8 - i * .2}"/>`; return { pre: s, post: burst(ex, ey - 30, 24), ey: -46, erot: 30 }; }
    case 'smoke': { let s = ''; for (let i = 0; i < 16; i++) s += `<circle cx="${10 + i * 18 + r() * 10}" cy="${80 + Math.sin(i * .6) * 20 + r() * 10}" r="${12 + r() * 12}" fill="#1a1414" opacity=".55" filter="url(#blur2)"/>`; return { pre: '', post: s + sp(10, 180, 60, 120, 100, '#7dffc0'), eye: '#555', erot: 10 }; }
    case 'overclock': { let s = lines(8, HX - 30, G - 110, 60, c); for (let i = 0; i < 5; i++) { const x = HX - 20 + r() * 80, y = G - 130 + r() * 100; s += `<path d="M${x} ${y} l 8 6 l -6 4 l 10 8" stroke="#ffd23f" stroke-width="2" fill="none" ${glow}/>`; } return { pre: s, post: `<circle cx="${HX + 6}" cy="${G - 150}" r="10" fill="#bbb" opacity=".5" filter="url(#blur2)"/><circle cx="${HX - 6}" cy="${G - 164}" r="8" fill="#bbb" opacity=".4" filter="url(#blur2)"/>` + burst(ex - 6, ey, 28), erot: 36 }; }
    case 'strafe': { let s = `<path d="M10 30 L 80 22 L 92 32 L 80 42 L 10 38 Z" fill="${DK}" stroke="${c}" stroke-width="2"/><ellipse cx="4" cy="34" rx="10" ry="3" fill="#45d4ff" ${glow}/>`; for (let i = 0; i < 6; i++) { const x = 120 + i * 32; s += `<line x1="${x - 40}" y1="40" x2="${x}" y2="${G}" stroke="#ffd23f" stroke-width="2" ${glow}/><circle cx="${x}" cy="${G}" r="5" fill="#fff" ${glow}/>`; } return { pre: '', post: s, erot: 30 }; }
    case 'gears': { const gear = (x, y, R) => { let d = ''; for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, rr = i % 2 ? R : R * .78; d += `${i ? 'L' : 'M'}${(x + Math.cos(a) * rr).toFixed(1)} ${(y + Math.sin(a) * rr).toFixed(1)} `; } return `<path d="${d}Z" fill="none" stroke="${c}" stroke-width="2.5" ${glow}/><circle cx="${x}" cy="${y}" r="${R * .3}" fill="none" stroke="${c}" stroke-width="2"/>`; }; return { pre: '', post: `<rect x="${ex - 34}" y="${G - 126}" width="70" height="130" fill="#9fc3ff" opacity=".25"/>` + gear(ex - 30, G - 110, 18) + gear(ex + 26, G - 60, 14) + gear(ex - 26, G - 30, 12), erot: 4, eye: '#9fc3ff' }; }
    case 'echo': return { pre: '', post: '', echo: 1, erot: 30 };
    case 'cannons': { let s = ''; for (let i = 0; i < 3; i++) { const x = h[0] + 60 + i * 50, y = h[1] - 10 + i * 6; s += `<circle cx="${x}" cy="${y}" r="7" fill="${DK}" stroke="${c}" stroke-width="1.5"/><line x1="${x - 30}" y1="${y}" x2="${x - 8}" y2="${y}" stroke="#fff" stroke-width="2" opacity=".5"/>`; } return { pre: '', post: `<g filter="url(#blur2)" fill="#ccc" opacity=".55"><circle cx="${h[0] + 36}" cy="${h[1] - 14}" r="14"/><circle cx="${h[0] + 48}" cy="${h[1] - 2}" r="10"/></g>` + s + burst(ex + 4, ey, 34, '#ff7a3d'), erot: 44 }; }
    case 'troops': { const ally = x => `<g transform="translate(${x} ${G}) scale(.6)" filter="url(#glow)"><g fill="${DK}" stroke="${c}" stroke-width="2.5">${['<path d="M-6 -40 L -18 0 L -8 0 L 0 -24 L 10 0 L 20 0 L 8 -40 Z"/>', '<rect x="-10" y="-80" width="22" height="42" rx="4"/>', '<circle cx="2" cy="-92" r="10"/>', '<path d="M10 -72 L 40 -76 L 40 -70 L 10 -66 Z"/>'].join('')}</g></g>`; return { pre: ally(HX - 50) + ally(HX + 70), post: burst(ex, ey, 26) }; }
    case 'magnet': { let s = ''; for (let i = 1; i < 5; i++) s += `<path d="M${h[0] + 20} ${h[1] - 20} Q ${h[0] + 60 + i * 20} ${h[1] - 60 - i * 10} ${ex + 40} ${G - 50}" stroke="${c}" stroke-width="2" fill="none" stroke-dasharray="4 6" opacity="${1 - i * .15}"/>`; return { pre: '', post: s + goon(ex + 30, G - 14, -30, .7) + goon(ex - 20, G - 30, 40, .65) + lines(5, WD, G - 90, 40, '#fff'), erot: -20 }; }
    case 'aura': return { pre: `<ellipse cx="${HX + 10}" cy="${G - 70}" rx="${50 * k}" ry="${85 * k}" fill="#ff2b2b" opacity=".45" filter="url(#soft)"/>`, post: `<path d="M${HX - 30} ${G - 150} c -6 -8 -18 -2 -12 8 l 12 12 l 12 -12 c 6 -10 -6 -16 -12 -8 z" fill="#ff2b2b" stroke="#fff" stroke-width="2" ${glow}/>` + burst(ex, ey, 30) };
    case 'honk': { let s = ''; for (let i = 1; i < 5; i++) s += `<path d="M${h[0] + 40 + i * 18} ${h[1] - 40 - i * 8} Q ${h[0] + 56 + i * 22} ${h[1] - 14} ${h[0] + 40 + i * 18} ${h[1] + 12 + i * 8}" stroke="#fff" stroke-width="${5 - i}" fill="none"/>`; return { pre: '', post: s + goon(ex + 50, G, -20, .7) + lines(5, WD, G - 100, 50, '#fff'), erot: -24, ex: 30 }; }
    case 'dam': { let s = ''; for (let i = 0; i < 5; i++) s += `<rect x="${ex - 60}" y="${G - 22 - i * 20}" width="26" height="20" rx="8" fill="#6a4426" stroke="${DK}" stroke-width="2" transform="rotate(${(r() - .5) * 8} ${ex - 47} ${G - 12 - i * 20})"/><circle cx="${ex - 34}" cy="${G - 12 - i * 20}" r="7" fill="#c9a06a" stroke="${DK}" stroke-width="2"/>`; return { pre: '', post: s + burst(ex - 30, G - 70, 18), erot: 10, ex: 16 }; }
    case 'dodge': { return { pre: '', post: `<text x="${HX + 6}" y="${G - 110}" fill="#fff" font-family="Archivo Black" font-size="16" transform="rotate(-10 ${HX} ${G - 110})">MISS!</text><path d="M${ex - 30} ${G - 80} A 60 60 0 0 0 ${HX + 50} ${G - 60}" stroke="#fff" stroke-width="3" fill="none" opacity=".6"/>`, ghosts: 1, erot: -10, ex: -40 }; }
    case 'rocket': return { pre: `<path d="M${HX + 20} ${G - 30} L ${HX - 60} ${G - 40} L ${HX - 30} ${G - 30} L ${HX - 70} ${G - 20} L ${HX + 20} ${G - 22} Z" fill="#ff7a3d" ${glow}/><path d="M${HX + 20} ${G - 28} L ${HX - 20} ${G - 30} L ${HX + 20} ${G - 24} Z" fill="#fff0bf"/>` + lines(6, HX - 40, G - 120, 60, '#fff'), post: burst(ex - 14, ey + 10, 30), erot: 48, ex: -14 };
    case 'box': return { pre: '', post: `<g fill="none" stroke="#fff" stroke-width="2.5" ${glow}><path d="M${ex - 34} ${G} L ${ex - 34} ${G - 120} L ${ex + 34} ${G - 120} L ${ex + 34} ${G} Z"/><path d="M${ex - 34} ${G - 120} L ${ex - 22} ${G - 132} L ${ex + 46} ${G - 132} L ${ex + 34} ${G - 120} M${ex + 46} ${G - 132} L ${ex + 46} ${G - 12} L ${ex + 34} ${G}"/></g>`, erot: 0 };
    case 'possess': return { pre: '', post: `<path d="M${HX + 20} ${G - 100} Q ${(HX + ex) / 2} ${G - 170} ${ex} ${G - 100}" stroke="${c}" stroke-width="10" fill="none" opacity=".35" filter="url(#blur2)"/><path d="M${HX + 20} ${G - 100} Q ${(HX + ex) / 2} ${G - 170} ${ex} ${G - 100}" stroke="${c}" stroke-width="2" fill="none" ${glow}/>`, erot: 0, eye: c, ghostHero: 1 };
    case 'bingo': { let s = ''; [['B', 12], ['I', 22], ['N', 40], ['G', 51], ['O', 70]].forEach(([l, n], i) => { const x = h[0] + 20 + i * 34, y = h[1] - 50 + Math.sin(i * 1.3) * 26; s += `<circle cx="${x}" cy="${y}" r="13" fill="#fff" stroke="${DK}" stroke-width="2"/><circle cx="${x}" cy="${y}" r="8" fill="${['#ff4fa3', '#45d4ff', '#ffd23f', '#7dffc0', '#b9a2f0'][i]}"/><text x="${x}" y="${y + 3}" text-anchor="middle" font-family="Archivo Black" font-size="8" fill="${DK}">${l}${n}</text>`; }); return { pre: '', post: s + burst(ex, ey + 20, 22) }; }
    case 'bounce': return { pre: '', post: `<path d="M${HX + 20} ${G - 60} Q ${HX + 100} ${G - 180} ${ex + 20} ${G - 120}" stroke="#fff" stroke-width="2" stroke-dasharray="5 5" fill="none"/>` + burst(HX + 60, G - 70, 18), ey: -70, erot: 140 };
    case 'pizza': { let s = ''; for (let i = 0; i < 3; i++) { const x = h[0] + 40 + i * 46, y = h[1] - 26 + i * 10; s += `<g transform="rotate(${i * 40} ${x} ${y})"><path d="M${x - 10} ${y - 8} L ${x + 12} ${y} L ${x - 8} ${y + 10} Z" fill="#ffc04d" stroke="#b9561e" stroke-width="2"/><circle cx="${x - 3}" cy="${y}" r="2" fill="#d23a2a"/></g>`; } return { pre: '', post: s + `<path d="M${ex - 12} ${ey - 30} q 6 -14 0 -26 M${ex} ${ey - 30} q 6 -14 0 -26" stroke="#ff7a3d" stroke-width="3" fill="none" ${glow}/>` + burst(ex, ey, 22, '#ff7a3d') }; }
    case 'suplex': return { pre: `<path d="M${HX - 60} ${G + 2} l 30 -6 l 10 8 l 30 -10 l 14 6 l 40 -4" stroke="#fff" stroke-width="2.5" fill="none"/>` + lines(4, 30, 40, 26, '#fff'), post: burst(HX - 30, G - 10, 28), enemyAt: [HX - 54, G - 136, 90, .9] };
    case 'bolt': { let s = '<g fill="#2a2a3a" opacity=".85">'; for (let i = 0; i < 9; i++) s += `<circle cx="${130 + i * 24}" cy="${14 + (i % 2) * 6}" r="${20 + (i % 3) * 4}"/>`; s += '</g>'; const zz = x => `<path d="M${x} 20 L ${x - 10} 70 L ${x + 6} 74 L ${x - 8} 130 L ${x + 4} 132 L ${x - 6} ${G - 40}" stroke="#fff" stroke-width="3" fill="none" ${glow}/><path d="M${x} 20 L ${x - 10} 70 L ${x + 6} 74 L ${x - 8} 130 L ${x + 4} 132 L ${x - 6} ${G - 40}" stroke="${c}" stroke-width="8" fill="none" opacity=".4" filter="url(#blur2)"/>`; return { pre: s, post: zz(ex + 8) + zz(ex + 60) + burst(ex, G - 40, 24), erot: 26 }; }
    case 'roll': { let s = ''; for (let i = 0; i < 3; i++) s += `<path d="M${HX - 40 - i * 14} ${G - 130 + i * 10} A 80 80 0 0 0 ${HX - 50 - i * 14} ${G - 10}" stroke="${c}" stroke-width="${3 - i * .7}" fill="none" opacity="${.8 - i * .2}" ${glow}/>`; return { pre: lines(7, HX - 50, G - 120, 70, '#fff') + `<g filter="url(#blur2)" fill="#d9c8a8" opacity=".6"><circle cx="30" cy="${G - 6}" r="18"/><circle cx="56" cy="${G - 2}" r="12"/></g>`, post: s + goon(ex - 6, G - 78, -64, .85) + goon(ex + 44, G - 2, 96, .75) + burst(ex - 18, G - 50, 28), noEnemy: 1, hero: [16, 0, 8] }; }
    case 'rocketpack': { const sx0 = h[0] + 10, sy0 = h[1] - 70; let s = ''; for (let i = 0; i < 4; i++) { const ex2 = sx0 + (G - sy0) / Math.tan(Math.PI / 6) * (.55 + i * .14); s += `<line x1="${sx0}" y1="${sy0}" x2="${ex2}" y2="${G}" stroke="#ffd23f" stroke-width="2" ${glow}/><circle cx="${ex2}" cy="${G}" r="5" fill="#fff" ${glow}/>`; } return { pre: `<path d="M${HX - 30} ${G - 150} L ${HX - 20} ${G - 80} L ${HX - 10} ${G - 150} Z" fill="#45d4ff" ${glow} transform="translate(0 70) rotate(-8 ${HX} ${G})"/>`, post: s + burst(ex, ey + 10, 24), hero: [10, -70, -8], erot: 36 }; }
    case 'rage': { let s = ''; for (let i = 1; i <= 4; i++) s += `<path d="M${HX + 40 + i * 24} ${G - 140 - i * 6} Q ${HX + 60 + i * 30} ${G - 70} ${HX + 40 + i * 24} ${G + 2}" stroke="#ff2b2b" stroke-width="${6 - i}" fill="none" opacity="${1 - i * .15}" ${glow}/>`; return { pre: `<ellipse cx="${HX + 10}" cy="${G - 70}" rx="60" ry="96" fill="#ff2b2b" opacity=".4" filter="url(#soft)"/>`, post: s + goon(ex + 62, G, -36, .8) + lines(6, WD, G - 110, 40, '#fff'), erot: -34, ex: 22 }; }
    case 'frog': return { pre: '', post: `<path d="M${h[0] + 26} ${h[1] - 14} Q ${(h[0] + ex) / 2} ${h[1] - 60} ${ex - 10} ${G - 30}" stroke="${c}" stroke-width="2" stroke-dasharray="3 4" fill="none" ${glow}/><path d="M${h[0] + 26} ${h[1] - 22} l 3 6 l 7 1 l -5 5 l 1 7 l -6 -3 l -6 3 l 1 -7 l -5 -5 l 7 -1 z" fill="#ffd23f" ${glow}/>` + `<g transform="translate(${ex} ${G})"><ellipse cx="0" cy="-16" rx="26" ry="16" fill="#3fae6a" stroke="${DK}" stroke-width="2.5"/><circle cx="-10" cy="-32" r="8" fill="#3fae6a" stroke="${DK}" stroke-width="2.5"/><circle cx="10" cy="-32" r="8" fill="#3fae6a" stroke="${DK}" stroke-width="2.5"/><circle cx="-10" cy="-33" r="3" fill="${DK}"/><circle cx="10" cy="-33" r="3" fill="${DK}"/><path d="M-12 -12 Q 0 -4 12 -12" stroke="${DK}" stroke-width="2" fill="none"/><path d="M-26 -4 l -8 6 M26 -4 l 8 6" stroke="${DK}" stroke-width="4" stroke-linecap="round"/></g>` + sp(16, ex - 40, G - 80, 80, 70, c), noEnemy: 1 };
  }
  return { pre: '', post: '' };
}

let ARTU = 0;
function art(wr) {
  const [n, , , role, , , , , , , , a, sfx] = wr; const c = R[role]; const r = rnd(n * 131 + 7); const k = a.k || 1; const u = n + '_' + (ARTU++);
  const F = fx(a.fx, c, [HX + HAND[0] * k, G + HAND[1] * k], k, r);
  const ho = F.hero || [0, 0, 0];
  const heroT = `translate(${HX + ho[0]} ${G + ho[1]}) rotate(${ho[2]}) scale(${k})`;
  const hero = body(a), lights = heroLights(a, c);
  const filt = `<filter id="rim${u}" x="-30%" y="-30%" width="160%" height="160%"><feMorphology in="SourceAlpha" operator="dilate" radius="2" result="d"/><feFlood flood-color="${c}"/><feComposite in2="d" operator="in" result="o"/><feGaussianBlur in="o" stdDeviation="3.2" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
  let s = `<svg viewBox="0 0 ${WD} ${HT}" role="img" aria-label="Concept art: ${wr[1]} using ${wr[5]}"><defs>${filt}</defs>` + backdrop(a.w, c, n, u);
  s += `<ellipse cx="${HX + 4}" cy="${G + 3}" rx="${40 * k}" ry="6" fill="#000" opacity=".4"/>`;
  s += F.pre;
  // enemy
  if (!F.noEnemy) { if (F.enemyAt) s += goon(F.enemyAt[0], F.enemyAt[1], F.enemyAt[2], F.enemyAt[3]); else { s += `<ellipse cx="${EX + (F.ex || 0)}" cy="${G + 3}" rx="26" ry="5" fill="#000" opacity=".35"/>`; s += goon(EX + (F.ex || 0), G + (F.ey || 0), F.erot ?? 24, 1, F.eye || '#ff2b2b'); } }
  if (F.echo || F.ghosts || F.mirror) { const offs = F.mirror ? [[64, 1]] : F.echo ? [[-46, 0], [-24, 0]] : [[-40, 0], [-20, 0]]; offs.forEach(([dx, flip], i) => { s += `<g transform="translate(${HX + dx + (flip ? 30 : 0)} ${G}) scale(${flip ? -k : k} ${k})" opacity="${.22 + i * .14}" filter="url(#rim${u})">${hero}</g>`; }); }
  s += `<g transform="${heroT}" filter="url(#rim${u})"${F.ghostHero ? ' opacity=".6"' : ''}>${hero}</g><g transform="${heroT}">${lights}</g>`;
  s += F.post;
  // onomatopoeia
  const big = sfx.length > 9 ? 20 : 27;
  s += `<text x="${WD - 12}" y="40" text-anchor="end" font-family="Archivo Black" font-size="${big}" fill="#ffd23f" stroke="${DK}" stroke-width="5" paint-order="stroke" transform="rotate(-7 ${WD - 12} 40)">${sfx}</text>`;
  s += `<rect width="${WD}" height="${HT}" fill="none" stroke="#000" stroke-width="10" opacity=".35"/></svg>`;
  return s;
}

