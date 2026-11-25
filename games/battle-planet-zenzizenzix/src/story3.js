// =====================================================================
// STORY, WORLD 3 — Bouldaire. Villen-Hüüs gets a trim and leaves gear no. 3 with Calve-Hair; the warriors arrive
// on the boulevard; the salon; Calve-Hair's story as a silent film; the police; a shave in prison.
// =====================================================================
const BOULD = {
  amiral: { arrive: [['Bouldaire. Tant de boutiques… et pas une seule qui vende des boulets de canon.', 'Une planète où l’on se bat pour une coupe de cheveux. J’ai connu pire. Pas beaucoup.'], ['Bouldaire. So many shops… and not one sells cannonballs.', 'A planet where people fight over a haircut. I’ve seen worse. Not much.']], salon: [['Un salon de coiffure. Je garde mon bicorne, merci.'], ['A hair salon. I’m keeping my hat on, thank you.']], mercy: [['La mode change comme le vent, Calve-Hair. Un bon marin apprend à changer de cap.'], ['Fashion shifts like the wind, Calve-Hair. A good sailor learns to change tack.']] },
  marge: { arrive: [['Des boutiques de fringues partout. Je cherche un t-shirt de tournée. Taille ÉNORME.', 'Ça sent la laque. Ça me rappelle les loges des années quatre-vingt.'], ['Clothes shops everywhere. I want a tour shirt. Size HUGE.', 'Smells of hairspray. Takes me back to eighties backstage.']], salon: [['Mon iroquoise ne se touche pas. Prévenez le patron.'], ['Nobody touches my mohawk. Tell the boss.']], mercy: [['Moi aussi, on m’a dit que mon look était démodé. J’ai monté le son. Fais pareil.'], ['They told me my look was out of fashion too. I turned the volume up. Do the same.']] },
  cyborg: { arrive: [['Je n’ai pas de cheveux.', 'Beaucoup de vitrines. Beaucoup de reflets. Je suis beau.'], ['I have no hair.', 'Many windows. Many reflections. I look good.']], salon: [['Coupe-moi les câbles et je te coupe en deux.'], ['Cut my cables and I cut you in half.']], mercy: [['Le métal ne se démode pas. Toi non plus. Si tu le veux.'], ['Metal never goes out of style. Nor do you. If you want.']] },
  papi: { arrive: [['De mon temps, une coupe coûtait trois sous et un sourire.', 'Bouldaire ! J’y ai acheté mon premier costume. Il est encore à la mode, non ?'], ['In my day, a haircut cost three coins and a smile.', 'Bouldaire! I bought my first suit here. Still in fashion, isn’t it?']], salon: [['Juste les sourcils, petit. Le reste est parti tout seul.'], ['Just the eyebrows, kid. The rest left on its own.']], mercy: [['J’ai été démodé six fois dans ma vie, petit. On revient toujours. Comme les pattes d’éph’.'], ['I’ve gone out of fashion six times, kid. You always come back. Like flares.']] },
  ruby: { arrive: [['Une planète entière de miroirs. Mes cheveux vont adorer.', 'Ils passent du disco partout. Je vais devoir leur montrer le punk.'], ['A whole planet of mirrors. My hair is going to love it.', 'Disco everywhere. I’ll have to show them punk.']], salon: [['Si quelqu’un touche à mon rouge, ça va jouer fort.'], ['Whoever touches my red gets it loud.']], mercy: [['Le punk aussi était démodé. On l’a joué quand même. Plus fort.'], ['Punk was out of fashion too. We played it anyway. Louder.']] },
  spora: { arrive: [['Nous n’avons pas de cheveux. Nous avons des spores. Elles sont très tendance.', 'Tant de parfums… nous éternuons. Toutes les quatre mille.'], ['We have no hair. We have spores. They are very fashionable.', 'So many perfumes… we are sneezing. All four thousand of us.']], salon: [['Pas de shampoing, merci. Nous sommes un écosystème.'], ['No shampoo, thank you. We are an ecosystem.']], mercy: [['Nous changeons de forme chaque saison. C’est cela, la vraie mode.'], ['We change shape every season. That is true fashion.']] },
  magneto: { arrive: [['Des ciseaux partout. Des ciseaux en acier. Ils m’attirent.', 'Une planète de paillettes. Mon genre de ring, en plus brillant.'], ['Scissors everywhere. Steel scissors. They’re drawn to me.', 'A planet of glitter. My kind of ring, only shinier.']], salon: [['Ses ciseaux sont en or. Dommage, l’or ne m’obéit pas.'], ['His scissors are gold. Shame, gold doesn’t obey me.']], mercy: [['Sur le ring, la foule t’oublie vite. Les vrais amis, non.'], ['In the ring the crowd forgets you fast. Real friends don’t.']] },
  doc: { arrive: [['Des ciseaux, des rasoirs, des fers à friser. Je prépare les pansements.', 'Bouldaire… ma tricoteuse préférée habite ici. Elle me fait des bonnets.'], ['Scissors, razors, curling irons. I’m getting the bandages ready.', 'Bouldaire… my favourite knitter lives here. She makes me hats.']], salon: [['Un salon de coiffure. Dans dix minutes, ce sera mon infirmerie.'], ['A hair salon. In ten minutes it’s my infirmary.']], mercy: [['Les cheveux repoussent. Le cœur aussi, avec du temps.'], ['Hair grows back. So does the heart, with time.']] },
  demi: { arrive: [['Je peux faire un brushing. Côté chaud. Ou une mise en plis… côté glace.', 'Tant de laque… je garde ma flamme loin des passants.'], ['I can do a blow-dry. Hot side. Or a set… ice side.', 'So much hairspray… I’m keeping my flame away from people.']], salon: [['De la laque partout. Et moi qui suis à moitié en feu.'], ['Hairspray everywhere. And I’m half on fire.']], mercy: [['On est tous à moitié démodés, Calve-Hair. L’autre moitié décide.'], ['We’re all half out of fashion, Calve-Hair. The other half decides.']] },
  bernache: { arrive: [['HONK. (Traduction : « Mes plumes sont naturellement parfaites. »)', 'HONK ? (Elle se regarde dans une vitrine. Elle approuve.)'], ['HONK. (Translation: “My feathers are naturally perfect.”)', 'HONK? (She looks at herself in a shop window. She approves.)']], salon: [['HONK. (Elle refuse le peignoir. Elle a des principes.)'], ['HONK. (She refuses the gown. She has principles.)']], mercy: [['honk. (Elle lui lisse une mèche du bec. Doucement.)'], ['honk. (She smooths a lock of his hair with her beak. Gently.)']] },
  raccoon: { arrive: [['Des poubelles de luxe ! Elles sentent le parfum !', 'Je vais me faire faire un masque. Ah non, j’en ai déjà un.'], ['Luxury dumpsters! They smell of perfume!', 'I’ll get a face mask. Oh wait, I already have one.']], salon: [['Il y a des cheveux partout par terre. Je vais m’en faire un nid.'], ['Hair all over the floor. I’m making a nest.']], mercy: [['Moi, je suis jamais à la mode. Et je suis heureux. Avec des puces.'], ['I’m never in fashion. And I’m happy. With fleas.']] },
  soldier: { arrive: [['Planète Bouldaire, secteur commerçant. Objectif : le général. Coupe réglementaire en option.', 'Gardez vos casques, soldats. Ils visent les cheveux.'], ['Planet Bouldaire, shopping sector. Objective: the general. Regulation haircut optional.', 'Keep your helmets on, soldiers. They go for the hair.']], salon: [['Une coupe en brosse, et vite. On a une guerre à finir.'], ['A crew cut, and quick. We have a war to finish.']], mercy: [['À l’armée, tout le monde a la même coupe. Et personne n’est seul.'], ['In the army everyone has the same haircut. And nobody is alone.']] }
};
const BOULD_PAIR = {
  'marge|ruby': [['ruby', 'Marge, il y a de la laque extra-forte.', 'Marge, there’s extra-strong hairspray.'], ['marge', 'Garde-la pour mon iroquoise. On en aura besoin.', 'Save it for my mohawk. We’ll need it.']],
  'bernache|papi': [['papi', 'La bernache, tu veux une mise en plis ?', 'Goose, fancy a perm?'], ['bernache', 'HONK. (Elle le fixe jusqu’à ce qu’il retire sa question.)', 'HONK. (She stares until he takes it back.)']],
  'cyborg|raccoon': [['raccoon', 'Le Gros, ils ont des sèche-cheveux géants. Tu me sèches ?', 'Big Guy, they have giant hair dryers. Dry me?'], ['cyborg', 'Non. Tu sens le chien mouillé.', 'No. You smell of wet dog.']],
  'doc|soldier': [['soldier', 'Doc, ils ont des rasoirs. Prépare le fil.', 'Doc, they have razors. Get the thread ready.'], ['doc', 'Déjà enfilé, mon grand.', 'Already threaded, big boy.']],
  'demi|magneto': [['magneto', 'Demi, ses ciseaux sont en or. Je ne peux rien faire.', 'Demi, his scissors are gold. I can’t do a thing.'], ['demi', 'L’or fond à mille degrés. J’en ai deux mille.', 'Gold melts at a thousand degrees. I’ve got two thousand.']],
  'amiral|spora': [['amiral', 'Spora, évite la laque. Tu vas coller partout.', 'Spora, stay clear of the hairspray. You’ll stick to everything.'], ['spora', 'Trop tard. Nous sommes déjà collées à une vitrine.', 'Too late. We are already stuck to a shop window.']]
};
const BOULD_VH = {
  intro: [['Planète Bouldaire. Le Salon Calve-Hair, à l’heure de la fermeture.'], ['Planet Bouldaire. Salon Calve-Hair, at closing time.']],
  lines: [
    ['CAL', 'Monseigneur, quel volume ! Quelle tenue ! Un soupçon de laque ?', 'My Lord, what volume! What hold! A whisper of hairspray?'],
    ['VH', 'Juste les pointes, Calve-Hair. Et garde-moi ce rouage. Il est plus précieux que ma frange.', 'Just the ends, Calve-Hair. And guard this gear for me. It’s worth more than my fringe.'],
    ['CAL', 'Plus précieux que votre frange ? Je le garderai comme mes ciseaux d’or.', 'Worth more than your fringe? I’ll guard it like my golden scissors.'],
    ['MMF', '(Elle note : « Rouage n° 3, Bouldaire, gardé par Calve-Hair. Point faible : la vanité. Et la laque. »)', '(She writes: “Gear no. 3, Bouldaire, guarded by Calve-Hair. Weak spot: vanity. And hairspray.”)'],
    ['VH', 'Et si deux vieilles barbes débarquent… rase-les.', 'And if two old beards show up… shave them.'],
    ['CAL', 'Gratuitement, Monseigneur.', 'Free of charge, my Lord.']]
};
const CALVE_STORY = {
  intro: [['CAL', 'Ah, des clients ! Et quelles têtes… Il va falloir tout reprendre.', 'Ah, customers! And what heads… We’ll have to start from scratch.'],
          ['CAL', 'Le rouage ? Il est sous le séchoir. Venez le chercher… si vous osez vous faire coiffer.', 'The gear? It’s under the dryer. Come and get it… if you dare to be styled.']],
  down: [['CAL', 'Assez… Mon brushing… C’est fini.', 'Enough… My blow-dry… It’s over.'], ['CAL', 'Vous voulez savoir pourquoi ? Asseyez-vous. C’est une longue coupe.', 'You want to know why? Take a seat. It’s a long cut.']],
  film: [['Calve-Hair, vingt ans. Le plus grand coiffeur de Bouldaire.', 'Calve-Hair, twenty. The greatest hairdresser on Bouldaire.'],
         ['Toutes les stars voulaient sa coupe. Les magazines l’adoraient.', 'Every star wanted his cut. The magazines adored him.'],
         ['Puis, un soir de défilé, la mode changea : le crâne rasé.', 'Then, one show night, fashion changed: the shaved head.'],
         ['Plus personne ne voulait de cheveux. Son salon se vida.', 'Nobody wanted hair any more. His salon emptied.'],
         ['Seul devant son miroir, il pleura.', 'Alone in front of his mirror, he cried.'],
         ['Un visiteur en cape : « Chaque tête de l’Empire sera à toi. À couper. Et à coiffer. »', 'A visitor in a cape: “Every head in the Empire will be yours. To cut. And to style.”']],
  after: [['CAL', 'Alors j’ai voulu que toutes les têtes soient à moi. Pour ne plus jamais être démodé.', 'So I wanted every head to be mine. So I’d never go out of fashion again.'],
          ['CAL', 'Mais la mode passe. Le style reste. Je l’avais oublié.', 'But fashion passes. Style stays. I had forgotten.']],
  police: [['POL', 'Police impériale ! Calve-Hair, vous êtes en état d’arrestation.', 'Imperial police! Calve-Hair, you are under arrest.'],
           ['CAL', 'Tenez. Le rouage. Je l’ai gardé sous le séchoir… il est parfaitement coiffé.', 'Here. The gear. I kept it under the dryer… it’s perfectly styled.'],
           ['CAL', 'Une dernière question : en prison… il y a un coiffeur ?', 'One last question: in prison… is there a hairdresser?']],
  prison: [['NAR', 'Prison impériale. Le barbier de service est un blaireau. Il tient un blaireau.', 'Imperial prison. The barber on duty is a badger. He holds a shaving brush.'],
           ['CAL', 'Juste les pointes, s’il vous plaît…', 'Just the ends, please…'],
           ['BAD', 'Ici, c’est la boule à zéro pour tout le monde.', 'In here, it’s a full shave for everyone.'],
           ['CAL', 'NOOOOOOON !', 'NOOOOOOO!']],
  handover: [['POL', 'Police impériale ! Calve-Hair, vous êtes en état d’arrestation.', 'Imperial police! Calve-Hair, you are under arrest.'],
             ['CAL', 'Tenez. Le rouage. Je l’ai gardé sous le séchoir… il est parfaitement coiffé.', 'Here. The gear. I kept it under the dryer… it’s perfectly styled.'],
             ['CAL', 'Mais d’abord… laissez-moi vous raconter mon histoire.', 'But first… let me tell you my story.']],
  intrude: [['MMF', 'Pardon. Je coupe la séance.', 'Sorry. I’m stopping the screening.']],
  theft: [['MMF', 'Service des pièces à conviction de l’Empire. Le rouage, s’il vous plaît.', 'Imperial evidence office. The gear, please.'],
          ['MMF', 'Signature ici… et ici… et là. Merci.', 'Sign here… and here… and there. Thank you.'],
          ['POL', 'Euh… voilà ?', 'Er… there you go?'],
          ['@1', 'Attends… c’est pas l’assistante, elle ?', 'Wait… isn’t that the assistant?'],
          ['@2', 'Celle qui prend des notes ?!', 'The one who takes notes?!'],
          ['MMF', 'Bonne journée.', 'Have a nice day.'],
          ['CAL', 'Elle n’a même pas regardé mes cheveux.', 'She didn’t even look at my hair.'],
          ['@1', 'APRÈS ELLE !', 'AFTER HER!']],
  chase: [['NAR', 'Derrière le salon, le chantier de la Tour Calve-Hair. Et ses grues.', 'Behind the salon, the building site of the Tour Calve-Hair. And its cranes.']],
  climb: [['@2', 'Elle grimpe comme un écureuil !', 'She climbs like a squirrel!'], ['MMF', 'Je vous déconseille de me suivre.', 'I advise against following me.'], ['@1', 'Trop tard !', 'Too late!']],
  sky: [['@1', 'Des plateformes… pendues à des câbles.', 'Platforms… hanging from cables.'], ['@2', 'Il va falloir lancer des trucs. Et sauter loin.', 'We’ll have to throw things. And jump far.']],
  mmfIntro: [['MMF', 'Vous êtes tenaces. C’est noté.', 'You’re persistent. Noted.'], ['@1', 'Rends-nous le rouage !', 'Give us back the gear!'], ['MMF', 'Trois minutes. Pas une de plus.', 'Three minutes. Not one more.']],
  back: [['NAR', 'Un peu plus tard, au salon…', 'A little later, at the salon…'], ['@1', 'Elle s’est envolée. Avec le rouage.', 'She flew off. With the gear.'],
         ['POL', 'On a quand même le reçu ! En trois exemplaires.', 'We still have the receipt! In triplicate.'], ['@2', '…', '…'], ['CAL', 'Je peux… reprendre mon film ?', 'May I… resume my film?']],
  police2: [['POL', 'Bon. Calve-Hair, on y va.', 'Right. Calve-Hair, let’s go.'], ['CAL', 'Une dernière question : en prison… il y a un coiffeur ?', 'One last question: in prison… is there a hairdresser?']],
  end2: [['Le rouage n° 3 est perdu : Madame Metal Face l’a emporté. Et si ce n’était pas qu’une assistante ?', 'Gear no. 3 is lost: Madame Metal Face took it. What if she’s not just an assistant?']],
  end: [['Rouage n° 3 récupéré. Prochaine étape : sur la piste de Villen-Hüüs.', 'Gear no. 3 recovered. Next stop: on Villen-Hüüs’s trail.']]
};
function buildBould(aId, bId, seed) {
  const r = rngOf(seed ^ 0xB0D3), first = r() < .5 ? 'A' : 'B', second = first === 'A' ? 'B' : 'A', idOf = w => w === 'A' ? aId : bId, who = id => id === aId ? 'A' : 'B', L = (w, fr, en) => ({ who: w, fr, en });
  const pickV = (w, key) => { const v = BOULD[idOf(w)][key], i = Math.floor(r() * v[0].length); return { who: w, fr: v[0][i], en: v[1][i] }; };
  const intro = [{ who: 'NAR', fr: BOULD_VH.intro[0][0], en: BOULD_VH.intro[1][0] }, ...BOULD_VH.lines.map(([w, fr, en]) => L(w, fr, en))];
  const arrive = [pickV(first, 'arrive'), pickV(second, 'arrive')]; const pl = BOULD_PAIR[pairKey(aId, bId)]; if (pl) arrive.push(...pl.map(([id, fr, en]) => L(who(id), fr, en)));
  const salon = [pickV(second, 'salon'), pickV(first, 'salon')];
  const calve = CALVE_STORY.intro.map(([w, fr, en]) => L(w, fr, en)); const A = VOICE[idOf(first)], O = VOICE[idOf(second)], ti = Math.floor(r() * A.reply[0].length); calve.push({ who: first, fr: fill(A.reply[0][ti], { P: O.voc[0], Pn: O.nom[0] }), en: fill(A.reply[1][ti], { P: O.voc[1], Pn: O.nom[1] }) });
  const down = CALVE_STORY.down.map(([w, fr, en]) => L(w, fr, en));
  const film = CALVE_STORY.film.map(([fr, en]) => ({ who: 'NAR', card: true, fr, en }));
  const after = [...CALVE_STORY.after.map(([w, fr, en]) => L(w, fr, en)), pickV(first, 'mercy'), pickV(second, 'mercy')];
  const police = CALVE_STORY.police.map(([w, fr, en]) => L(w, fr, en)); police.push({ who: second, fr: 'On viendra te voir. Avec un peigne.', en: 'We’ll come and visit. With a comb.' });
  const prison = CALVE_STORY.prison.map(([w, fr, en]) => L(w, fr, en));
  const end = [{ who: 'NAR', fr: CALVE_STORY.end[0][0], en: CALVE_STORY.end[0][1] }];
  const W = arr => arr.map(([w, fr, en]) => L(w === '@1' ? first : w === '@2' ? second : w, fr, en));
  const handover = [...W(CALVE_STORY.handover), { who: second, fr: 'Oh non. Pas encore un film.', en: 'Oh no. Not another film.' }];
  const intrude = W(CALVE_STORY.intrude), theft = W(CALVE_STORY.theft), chase = W(CALVE_STORY.chase), climb = W(CALVE_STORY.climb), sky = W(CALVE_STORY.sky), mmfIntro = W(CALVE_STORY.mmfIntro), back = W(CALVE_STORY.back);
  const police2 = [...W(CALVE_STORY.police2), { who: second, fr: 'On viendra te voir. Avec un peigne.', en: 'We’ll come and visit. With a comb.' }];
  const end2 = [{ who: 'NAR', fr: CALVE_STORY.end2[0][0], en: CALVE_STORY.end2[0][1] }];
  return { intro, arrive, salon, calve, down, film, after, police, prison, end, handover, intrude, theft, chase, climb, sky, mmfIntro, back, police2, end2 };
}
let STORY3 = null;
