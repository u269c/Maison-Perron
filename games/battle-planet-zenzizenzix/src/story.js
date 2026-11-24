// =====================================================================
// STORY — every warrior's voice, the pairs, the villains. Each game draws
// a different version of the same story from these lines.
// {P} = partner as you'd call them, {Pn} = partner named in a sentence,
// {A} {B} = the two heroes' names (for the villain), {ME} = speaker.
// =====================================================================
const VOICE = {
  amiral: {
    voc: ['Amiral', 'Admiral'], nom: ['l’Amiral', 'the Admiral'], full: ['l’Amiral Remords', 'Admiral Remords'],
    win: [['Vingt ans à ses ordres, et c’est le plus bel ordre que j’aie jamais désobéi.', 'Ma première victoire du bon côté. Ça a un goût… salé. Ah non, c’est les embruns.'],
          ['Twenty years under his orders, and this is the finest one I ever disobeyed.', 'My first win on the right side. It tastes… salty. Oh no, that’s sea spray.']],
    clock: [['Je connais cette horloge : il voulait remonter le temps jusqu’avant ses défaites. Il en aurait eu, du trajet.', 'Une horloge qui recule ? J’en ai assez, des regrets. Jetons-la à la mer.'],
            ['I know that clock: he wanted to wind time back to before his defeats. Long trip.', 'A clock that runs backwards? I have enough regrets. Throw it overboard.']],
    medal: [['Une médaille ? Pour moi ? Je vais la porter… avec remords.', 'Elle pèse moins lourd que ma conscience. C’est déjà ça.'],
            ['A medal? For me? I’ll wear it… with remorse.', 'It weighs less than my conscience. That’s something.']],
    medalName: ['la Médaille du Demi-Tour Exemplaire', 'the Medal of the Exemplary About-Turn'],
    hide: [['Cap sur le néant, et pas de marche arrière.', 'Je l’enterre, et je ne dirai même pas où à mon perroquet.'],
           ['Course set for nowhere, and no reversing.', 'I’m burying it, and I won’t even tell my parrot where.']],
    retire: { cap: ['L’Amiral transforme son vieux navire en restaurant flottant, « Le Regret Gourmand ».', 'The Admiral turns his old ship into a floating restaurant, “The Gourmet Regret”.'],
              line: [['Le plat du jour : du remords en papillote. Avec des frites.', 'Je ne commande plus que des frites. Et elles, au moins, obéissent.'],
                     ['Today’s special: remorse en papillote. With fries.', 'I only give orders to fries now. At least they obey.']], prop: 'ship' },
    alarm: [['Des canonnières dans le ciel ? En plein service du midi ?!', 'Mes clients partent sans payer. Ça, c’est un acte de guerre.', 'Je reconnais ces bannières. J’en ai porté une, jadis. Elle me grattait.'],
            ['Gunships in the sky? During the lunch rush?!', 'My customers are leaving without paying. That is an act of war.', 'I know those banners. I used to wear one. It itched.']],
    reply: [['Tu as gardé la forme, {P}. Moi, j’ai gardé le chapeau.', 'Tiens-toi à tribord, {P}, et pas de tir dans mon dos : j’en ai eu assez pour une vie.', 'Bon. Encore une dernière bordée, et je retourne à mes frites.'],
            ['You kept in shape, {P}. I kept the hat.', 'Stay to starboard, {P}, and no shooting me in the back: I’ve had enough of that for one life.', 'Fine. One last broadside, then back to my fries.']],
    taunt: [['Villen-Hüüs ! Ton ancien amiral te salue… au canon !', 'Tu me dois vingt ans de salaire, vieux grigou !'],
            ['Villen-Hüüs! Your old admiral salutes you… with cannon!', 'You owe me twenty years’ back pay, you old miser!']],
    ff: [['Mutinerie ?! Encore ?!', 'Je sais reconnaître un tir ami : c’est celui qui fait le plus mal.'],
         ['Mutiny?! Again?!', 'I know friendly fire when I feel it: it’s the one that hurts most.']],
    insult: ['ce traître d’Amiral et sa jambe à fusée', 'that turncoat Admiral and his rocket leg']
  },
  marge: {
    voc: ['Marge', 'Marge'], nom: ['Marge', 'Marge'], full: ['Marge la Roadie', 'Marge the Roadie'],
    win: [['C’ÉTAIT QUOI, ÇA ? UN RAPPEL ? PARCE QUE J’EN REDEMANDE !', 'Pas mal pour une première partie. La tête d’affiche s’est sauvée, par contre.'],
          ['WHAT WAS THAT? AN ENCORE? BECAUSE I WANT MORE!', 'Not bad for an opening act. The headliner ran off, though.']],
    clock: [['Une horloge ? Moi, je garde le tempo à l’oreille. On la casse encore plus ?', 'Le temps qui recule, c’est un disque à l’envers. Ça cache toujours des messages louches.'],
            ['A clock? I keep tempo by ear. Can we break it more?', 'Time running backwards is a record played backwards. There’s always a creepy message in it.']],
    medal: [['QUOI ? J’ENTENDS RIEN, J’AI FAIT LA TOURNÉE DES AMPLIS !', 'Elle est belle. On peut la brancher ?'],
            ['WHAT? CAN’T HEAR A THING, I’VE BEEN ON TOUR WITH THE AMPS!', 'It’s nice. Can we plug it in?']],
    medalName: ['l’Ordre du Décibel Héroïque', 'the Order of the Heroic Decibel'],
    hide: [['Je le cache dans un caisson de basse. Personne n’ose ouvrir un caisson de basse.', 'Là. Sous la scène. Avec les vieilles setlists et les chewing-gums.'],
           ['I’m hiding it in a subwoofer. Nobody dares open a subwoofer.', 'There. Under the stage. With the old setlists and the gum.']],
    retire: { cap: ['Marge anime le bingo du centre communautaire. Au micro. Avec Big Bertha.', 'Marge calls the bingo at the community centre. On the mic. Through Big Bertha.'],
              line: [['B-QUATORZE ! … POURQUOI MAMIE GISÈLE PLEURE ?', 'O-SOIXANTE-SIX ! Silence au fond, ou je monte le volume !'],
                     ['B-FOURTEEN! … WHY IS GRANNY GISÈLE CRYING?', 'O-SIXTY-SIX! Quiet at the back, or I turn it up!']], prop: 'bingo' },
    alarm: [['ILS ONT FAIT TOMBER MES BOULES DE BINGO !', 'Des vaisseaux ? Bon. Bingo annulé. Concert improvisé.', 'Enfin un public digne de Big Bertha.'],
            ['THEY KNOCKED OVER MY BINGO BALLS!', 'Spaceships? Fine. Bingo’s cancelled. Surprise gig.', 'Finally, a crowd worthy of Big Bertha.']],
    reply: [['{P} ! Tu veux la scène de gauche ou la scène de droite ?', 'Reste pas devant l’ampli, {P}. Je dis ça pour toi.', 'Ça va faire du bruit, {P}. Bouche-toi les oreilles. Ou pas.'],
            ['{P}! You want stage left or stage right?', 'Don’t stand in front of the amp, {P}. For your own good.', 'This is gonna be loud, {P}. Plug your ears. Or don’t.']],
    taunt: [['Hé, le vieux ! T’as acheté des billets ? Non ? On t’offre le premier rang !', 'Ta musique de marche militaire, c’était nul. Voilà du VRAI son !'],
            ['Hey, old man! Got tickets? No? Front row’s on us!', 'Your marching music was lame. Here’s REAL sound!']],
    ff: [['HÉ ! On tape sur les fans, pas sur le groupe !', 'Ça, c’était hors tempo.'],
         ['HEY! You hit the fans, not the band!', 'That was off-beat.']],
    insult: ['cette brute à crête rose et son ampli de malheur', 'that pink-mohawked brute and her cursed amp']
  },
  cyborg: {
    voc: ['le Gros', 'Big Guy'], nom: ['le Gros', 'the Big Guy'], full: ['le gros cyborg', 'the big cyborg'],
    win: [['Fini.', 'Il a couru. Moi, je ne cours pas. J’arrive quand même.'],
          ['Done.', 'He ran. I don’t run. I get there anyway.']],
    clock: [['Je peux la fondre.', 'Revenir en arrière ? Je ne fais pas marche arrière. Jamais.'],
            ['I can melt it.', 'Go back? I don’t reverse. Ever.']],
    medal: [['… Elle a fondu.', 'Merci. (Il la serre trop fort. Elle se plie.)'],
            ['… It melted.', 'Thank you. (He squeezes too hard. It bends.)']],
    medalName: ['la Médaille de l’Obstination Volcanique', 'the Medal of Volcanic Stubbornness'],
    hide: [['Dans la lave. Allez la chercher.', 'Sous moi. Personne ne me soulève.'],
           ['In the lava. Go get it.', 'Under me. Nobody lifts me.']],
    retire: { cap: ['Le gros cyborg se met à la poterie. Il est son propre four.', 'The big cyborg takes up pottery. He is his own kiln.'],
              line: [['Un bol. C’est mon quatre centième bol.', 'Doucement. Doucement… (Le vase explose.) Bon.'],
                     ['A bowl. My four hundredth bowl.', 'Gently. Gently… (The vase explodes.) Fine.']], prop: 'pottery' },
    alarm: [['Ils ont cassé mon bol.', 'Des envahisseurs. Ma lave est chaude.', '… J’étais calme. J’étais si calme.'],
            ['They broke my bowl.', 'Invaders. My lava is warm.', '… I was calm. I was so calm.']],
    reply: [['{P}. Derrière moi.', 'Je passe. Pousse-toi, {P}.', 'Bien.'],
            ['{P}. Behind me.', 'Coming through. Move, {P}.', 'Good.']],
    taunt: [['Pas de détour, Villen-Hüüs.', 'Tu cours. J’arrive.'],
            ['No detours, Villen-Hüüs.', 'You run. I’m coming.']],
    ff: [['… Pourquoi.', 'Ça chatouille. Ne recommence pas.'],
         ['… Why.', 'That tickles. Don’t do it again.']],
    insult: ['ce tas de ferraille qui fume', 'that smoking heap of scrap']
  },
  papi: {
    voc: ['Papi', 'Grandpa'], nom: ['Papi', 'Grandpa'], full: ['Papi des marées', 'Grandpa Tides'],
    win: [['À soixante et un ans, je suis dans la fleur de l’âge, petit !', 'De mon temps, les tyrans tenaient plus longtemps que ça.'],
          ['Sixty-one years old and in the prime of life, kid!', 'In my day, tyrants lasted longer than that.']],
    clock: [['Une horloge qui recule ? C’est mon dentier, ça : toujours en retard.', 'Remonter le temps ? Moi, je voudrais juste remonter mes chaussettes.'],
            ['A clock that goes backwards? Like my dentures: always running late.', 'Wind back time? I’d settle for winding up my socks.']],
    medal: [['Encore une médaille ! Je vais finir par pencher à gauche.', 'Merci, mon garçon. Elle ira à côté de celle de 1977. Et de 1981. Et de…'],
            ['Another medal! I’ll end up leaning to the left.', 'Thank you, son. It’ll go next to the one from ’77. And ’81. And…']],
    medalName: ['la Croix du Mérite Maritime à Roulettes', 'the Maritime Cross of Merit, with Wheels'],
    hide: [['Au fond de la vase. Comme mes clés de voiture.', 'Je le cache là où je cache mes bonbons : personne ne les a jamais retrouvés. Moi non plus.'],
           ['Deep in the mud. Like my car keys.', 'I’ll hide it where I hide my candy: nobody ever found it. Me neither.']],
    retire: { cap: ['Papi pêche sur les estrans de Havre. Et fait des courses de bêtes-à-marée avec les jeunes.', 'Grandpa fishes the tidal flats of Havre. And races tidewalkers against the youngsters.'],
              line: [['Plus vite, la bête ! Le petit Mathis nous double !', 'Ralentir ? À quatre-vingt-onze ans ? J’ai pas le temps.'],
                     ['Faster, beast! Little Mathis is passing us!', 'Slow down? At ninety-one? I haven’t got the time.']], prop: 'flats' },
    alarm: [['Ils ont fait fuir mes poissons, les vauriens !', 'Des vaisseaux ? Ça me rappelle ma jeunesse. Ça me rappelle même trente ans en arrière, tiens.', 'Hé ! Y’a des petits jeunes en armure sur MA plage !'],
            ['They scared off my fish, the scoundrels!', 'Spaceships? Takes me back. Takes me back thirty years, in fact.', 'Hey! There are young punks in armour on MY beach!']],
    reply: [['Suis-moi, {P}, et tâche de garder le rythme !', 'De mon temps, {P}, on chargeait à pied ! Mais j’ai mal aux genoux.', 'Allez, {P}, on leur montre comment faisaient les anciens.'],
            ['Follow me, {P}, and try to keep up!', 'In my day, {P}, we charged on foot! But my knees hurt.', 'Come on, {P}, let’s show them how the old-timers did it.']],
    taunt: [['Villen-Hüüs ! T’as pris un coup de vieux, toi aussi !', 'Range-toi, gamin ! Priorité aux aînés !'],
            ['Villen-Hüüs! You got old too, I see!', 'Out of the way, sonny! Seniors first!']],
    ff: [['Respecte tes aînés, voyou !', 'Ouille ! Mon dentier !'],
         ['Respect your elders, you hooligan!', 'Ouch! My dentures!']],
    insult: ['ce vieux schnock sur sa bestiole à pattes', 'that old geezer on his stilt-legged critter']
  },
  ruby: {
    voc: ['Ruby', 'Ruby'], nom: ['Ruby', 'Ruby'], full: ['Ruby Tonnerre', 'Ruby Thunder'],
    win: [['Merci, Villen-Hüüs ! Vous avez été un public… foudroyé !', 'Ça, c’était électrisant. Encore une !'],
          ['Thank you, Villen-Hüüs! You’ve been a… thunderstruck crowd!', 'Now that was electric. One more!']],
    clock: [['Le temps, ça se joue en quatre temps, pas à l’envers.', 'Je peux la court-circuiter. Pour toujours.'],
            ['Time goes one-two-three-four, not backwards.', 'I can short-circuit it. Forever.']],
    medal: [['Elle est en métal ? Reculez tout le monde, il va y avoir de l’orage.', 'Une médaille, c’est comme une corde de guitare : faut que ça vibre.'],
            ['Is it metal? Everyone step back, there’s a storm coming.', 'A medal is like a guitar string: it has to vibrate.']],
    medalName: ['la Médaille de la Haute Tension', 'the High Voltage Medal'],
    hide: [['Au sommet d’un paratonnerre. Bonne chance pour aller le chercher.', 'Dans un étui de guitare. Personne ne vole un étui de guitare. Bon, sauf en tournée.'],
           ['On top of a lightning rod. Good luck getting it.', 'In a guitar case. Nobody steals a guitar case. Well, except on tour.']],
    retire: { cap: ['Ruby donne des cours de guitare aux enfants. Paratonnerre obligatoire.', 'Ruby teaches guitar to kids. Lightning rod required.'],
              line: [['Non, Théo, on ne tire pas sur la corde quand il pleut.', 'Allez, un, deux, trois, qua— ZAP. Bon. On reprend.'],
                     ['No, Theo, we don’t bend strings when it’s raining.', 'Okay, one, two, three, fo— ZAP. Right. From the top.']], prop: 'guitar' },
    alarm: [['Mes élèves ! Tout le monde aux abris ! Et prenez vos médiators !', 'Le ciel gronde, et ce n’est même pas moi.', 'Des vaisseaux ? En plein solo ?'],
            ['My students! Everyone take cover! And bring your picks!', 'The sky’s rumbling, and it isn’t even me.', 'Spaceships? In the middle of a solo?']],
    reply: [['On fait un duo, {P} ? Toi au rythme, moi à la foudre.', 'Reste pas trop près, {P}. Je suis… chargée.', 'Prêt·e, {P} ? Un, deux, trois, quatre !'],
            ['Duet, {P}? You on rhythm, me on lightning.', 'Don’t stand too close, {P}. I’m… charged.', 'Ready, {P}? One, two, three, four!']],
    taunt: [['Villen-Hüüs ! Je t’ai réservé un dernier rappel !', 'Ça va secouer, papy-tyran !'],
            ['Villen-Hüüs! I saved you one last encore!', 'This is gonna rock, grandpa-tyrant!']],
    ff: [['Hé ! On ne débranche pas la guitariste !', 'Aïe ! Ça, c’était une fausse note.'],
         ['Hey! Don’t unplug the guitarist!', 'Ow! That was a wrong note.']],
    insult: ['cette guitariste qui attire la foudre', 'that lightning-rod guitarist']
  },
  spora: {
    voc: ['Spora', 'Spora'], nom: ['Spora', 'Spora'], full: ['Spora', 'Spora'],
    win: [['Nous avons gagné. Nous sommes quatre mille à être contents.', 'Nous restons. Lui, non.'],
          ['We have won. Four thousand of us are pleased.', 'We stay. He does not.']],
    clock: [['Nous proposons de la planter. Les choses plantées ne bougent plus.', 'Le temps ne recule pas. Il pousse. Comme nous.'],
            ['We propose planting it. Planted things do not move.', 'Time does not go back. It grows. Like us.']],
    medal: [['Nous allons la partager. Ça fait un quatre-millième de médaille chacune.', 'Où l’accrocher ? Nous n’avons pas de devant.'],
            ['We will share it. That is one four-thousandth of a medal each.', 'Where do we pin it? We have no front.']],
    medalName: ['la Médaille de la Mousse Méritante', 'the Medal of Meritorious Moss'],
    hide: [['Nous l’avons recouvert de mousse. Il est devenu un caillou. Un caillou heureux.', 'Sous les racines. Les racines ne disent rien.'],
           ['We covered it in moss. It is a rock now. A happy rock.', 'Under the roots. Roots tell no one.']],
    retire: { cap: ['Spora s’installe au milieu d’un parc. Au bout de trente ans, Spora EST le parc.', 'Spora settles in the middle of a park. Thirty years later, Spora IS the park.'],
              line: [['Les enfants nous marchent dessus. Nous trouvons ça… chatouilleux.', 'Un écureuil vit en nous depuis douze ans. Il s’appelle Gérard.'],
                     ['Children walk on us. We find it… ticklish.', 'A squirrel has lived in us for twelve years. His name is Gérard.']], prop: 'park' },
    alarm: [['Ils ont piétiné Gérard.', 'Des bottes sur notre pelouse. Nous ne sommes pas d’accord. Aucune de nous.', 'Le parc est fermé. Pour toujours. Pour eux.'],
            ['They stepped on Gérard.', 'Boots on our lawn. We do not agree. Not one of us.', 'The park is closed. Forever. To them.']],
    reply: [['{P}, reste dans notre nuage. Nous soignons.', 'Nous sommes prêtes, {P}. Toutes.', '{P}, tu sens bon. C’est la peur ? Non, c’est nous.'],
            ['{P}, stay in our cloud. We heal.', 'We are ready, {P}. All of us.', '{P}, you smell nice. Is that fear? No, that is us.']],
    taunt: [['Villen-Hüüs. Nous nous souvenons de toi. Quatre mille fois.', 'Tu vas prendre racine.'],
            ['Villen-Hüüs. We remember you. Four thousand times.', 'You will take root.']],
    ff: [['Tu as blessé trois cent douze d’entre nous.', 'Nous ne pardonnons pas. Enfin, un peu. La moitié.'],
         ['You hurt three hundred and twelve of us.', 'We do not forgive. Well, a little. Half of us.']],
    insult: ['ce tas de mousse qui parle au pluriel', 'that pile of moss that talks in the plural']
  },
  magneto: {
    voc: ['Magnéto', 'Magneto'], nom: ['Magnéto', 'Magneto'], full: ['le Docteur Magnéto', 'Doctor Magneto'],
    win: [['Et le compte est bon ! Un, deux, trois, tombé !', 'Je l’ai attiré, je l’ai plaqué. Il a fui. Typique des polarités opposées.'],
          ['And the count is in! One, two, three, down!', 'I pulled him in, I pinned him. He fled. Typical of opposite poles.']],
    clock: [['Une horloge pleine de rouages ? Je peux tout attirer d’un coup. Mais je ne garantis pas où ça atterrit.', 'Le temps, c’est comme un combat : on ne revient pas sur un tombé.'],
            ['A clock full of gears? I can pull it all at once. No promises where it lands.', 'Time is like a match: you don’t take back a pin.']],
    medal: [['Elle colle à mon gant. Je ne peux plus la lâcher. Je suis ému.', 'Une ceinture aurait été mieux. Mais j’accepte.'],
            ['It’s stuck to my glove. I can’t let go. I’m touched.', 'A belt would have been better. But I accept.']],
    medalName: ['la Médaille de l’Attraction Universelle', 'the Medal of Universal Attraction'],
    hide: [['Je le colle sous un astéroïde. Bien aimanté. Pour l’éternité.', 'Je l’ai démagnétisé. Il ne m’attire plus. Comme mon ex.'],
           ['I’m sticking it under an asteroid. Fully magnetised. For eternity.', 'I demagnetised it. It doesn’t attract me any more. Like my ex.']],
    retire: { cap: ['Le Docteur Magnéto fabrique des aimants de frigo artisanaux. Il en a vendu trois. Il en a douze mille.', 'Doctor Magneto makes handmade fridge magnets. He has sold three. He has twelve thousand.'],
              line: [['Celui-là, c’est un aimant en forme de moi qui fait une prise. Il colle partout.', 'Mon frigo pèse deux tonnes. C’est normal.'],
                     ['This one is a magnet of me doing a suplex. It sticks to everything.', 'My fridge weighs two tons. That’s normal.']], prop: 'fridge' },
    alarm: [['Mes aimants se décrochent tout seuls. Il y a du métal qui arrive. Beaucoup.', 'Des vaisseaux en acier ? Oh, ils vont m’adorer.', 'Ils arrivent sans être invités. Ça, c’est irrespectueux. Sur le ring comme ailleurs.'],
            ['My magnets are falling off on their own. Metal’s coming. Lots of it.', 'Steel ships? Oh, they’re going to love me.', 'They came uninvited. That’s disrespectful. In the ring or out.']],
    reply: [['{P}, recule. Je vais les rassembler. Gentiment. Violemment.', 'On fait équipe, {P} ? Prise du tag ?', 'Tu as quelque chose de métallique sur toi, {P} ? Enlève-le.'],
            ['{P}, step back. I’ll gather them up. Gently. Violently.', 'Tag team, {P}?', 'Got anything metal on you, {P}? Take it off.']],
    taunt: [['Villen-Hüüs ! Viens ici. Non, sérieusement, tu n’as pas le choix.', 'Revanche ? D’accord. Sans arbitre.'],
            ['Villen-Hüüs! Come here. No, really, you don’t have a choice.', 'Rematch? Sure. No referee.']],
    ff: [['Coup bas ! Arbitre !', 'Pas de prise dans le dos entre partenaires !'],
         ['Low blow! Referee!', 'No hitting your tag partner from behind!']],
    insult: ['ce lutteur masqué et son gant d’aimant', 'that masked wrestler and his magnet glove']
  },
  doc: {
    voc: ['Doc', 'Doc'], nom: ['Doc Suture', 'Doc Suture'], full: ['Doc Suture', 'Doc Suture'],
    win: [['Diagnostic : défaite aiguë. Pronostic : il va revenir. Ils reviennent toujours.', 'Bon. Qui saigne ? Levez la main. Pas toi, Villen-Hüüs.'],
          ['Diagnosis: acute defeat. Prognosis: he’ll be back. They always come back.', 'Right. Who’s bleeding? Raise your hand. Not you, Villen-Hüüs.']],
    clock: [['Les éclats, c’est comme les échardes : on enlève tout et on ne garde rien.', 'Une horloge qui fait reculer le temps ? J’aurais aimé ça pour mes trois guerres. Non. Même pas.'],
            ['Shards are like splinters: you take them all out and keep none.', 'A clock that turns back time? I could’ve used it for my three wars. No. Not even then.']],
    medal: [['J’accepte. Et je la stérilise.', 'Ma troisième guerre, ma troisième médaille. Ma dernière. Promis. Juré.'],
            ['I accept. And I’m sterilising it.', 'My third war, my third medal. My last. I swear.']],
    medalName: ['la Croix du Point de Suture', 'the Cross of the Stitch in Time']   ,
    hide: [['Bandé, scellé, oublié. Comme un mauvais souvenir.', 'Je l’ai suturé dans la roche. Point de croix. Personne ne défait un point de croix.'],
           ['Bandaged, sealed, forgotten. Like a bad memory.', 'I stitched it into the rock. Cross-stitch. Nobody undoes a cross-stitch.']],
    retire: { cap: ['Doc Suture tricote. Elle suture des chaussettes, des écharpes, et un pull pour chaque blessé de ses trois guerres.', 'Doc Suture knits. She sutures socks, scarves, and a sweater for every wounded soldier of her three wars.'],
              line: [['Maille à l’endroit, maille à l’envers… Le tricot, c’est de la chirurgie lente.', 'Il me reste quatre mille pulls à faire. J’ai le temps. Enfin, j’avais.'],
                     ['Knit one, purl one… Knitting is slow surgery.', 'Four thousand sweaters to go. I have time. Well, I had.']], prop: 'knit' },
    alarm: [['J’ai perdu une maille. Et le ciel est plein de vaisseaux. Dans cet ordre-là.', 'Ma quatrième guerre. Je le savais. On ne range jamais vraiment la trousse.', 'Bon. Où est ma trousse ? Ah, là, sous les pelotes.'],
            ['I dropped a stitch. And the sky is full of ships. In that order.', 'My fourth war. I knew it. You never really pack the bag away.', 'Right. Where’s my bag? Ah, under the yarn.']],
    reply: [['{P}, si tu te fais mal, je recouds. Mais je juge.', 'Reste dans mon champ de vision, {P}. Et dans ma portée de lancer.', 'Prends ça, {P}. Non, pas l’aiguille. La trousse.'],
            ['{P}, if you get hurt, I’ll stitch you up. But I’ll judge.', 'Stay where I can see you, {P}. And where I can throw.', 'Take this, {P}. No, not the needle. The kit.']],
    taunt: [['Villen-Hüüs. Je t’ai déjà recousu une fois, pendant ta capture. Je n’aurais pas dû.', 'Ça va piquer.'],
            ['Villen-Hüüs. I stitched you up once, when we caught you. I shouldn’t have.', 'This will sting.']],
    ff: [['Tu sais combien de points ça va demander ?!', 'Je te soigne, et toi, tu me tapes ?'],
         ['Do you know how many stitches that’ll take?!', 'I heal you and you hit me?']],
    insult: ['cette infirmière qui ne lâche jamais sa trousse', 'that medic who never puts down her bag']
  },
  demi: {
    voc: ['Demi', 'Demi'], nom: ['Demi', 'Demi'], full: ['Demi', 'Demi'],
    win: [['Moitié victoire brûlante, moitié victoire glaciale. Au total : tiède. Comme lui.', 'Le jour ou la nuit ? Pour lui, ce sera la nuit.'],
          ['Half a burning victory, half a frozen one. All in all: lukewarm. Like him.', 'Day or night? For him, it’s night.']],
    clock: [['Le temps qui recule, c’est un coucher de soleil à l’envers. C’est contre nature.', 'Je peux la geler. Ou la fondre. Ou les deux, une moitié chacune.'],
            ['Time going backwards is a sunset in reverse. It’s unnatural.', 'I can freeze it. Or melt it. Or both, half each.']],
    medal: [['Moitié or, moitié argent ? Ah non, c’est le reflet.', 'Je la porterai côté feu. L’autre côté a froid.'],
            ['Half gold, half silver? Oh no, it’s the reflection.', 'I’ll wear it on the fire side. The other side is cold.']],
    medalName: ['la Médaille de l’Équinoxe', 'the Equinox Medal']   ,
    hide: [['Pile sur la ligne. Ni au jour, ni à la nuit. Personne ne regarde jamais au milieu.', 'Je l’ai pris dans la glace, puis dans la braise. Bon courage.'],
           ['Right on the line. Not in day, not in night. Nobody ever looks in the middle.', 'I froze it in ice, then sealed it in embers. Good luck.']],
    retire: { cap: ['Demi ouvre un spa : sauna d’un côté, bain glacé de l’autre. Elle est les deux.', 'Demi opens a spa: sauna on one side, ice bath on the other. She is both.'],
              line: [['Trop chaud ? Je retourne la cape. Trop froid ? Je retourne la cape.', 'Les clients adorent. Enfin, la moitié des clients.'],
                     ['Too hot? I flip the cloak. Too cold? I flip the cloak.', 'Customers love it. Well, half of them.']], prop: 'spa' },
    alarm: [['Mes clients fuient. Moitié en serviette, moitié en glaçon.', 'Ils arrivent à l’aube. Mauvais choix : je suis du matin ET du soir.', 'Le jour ou la nuit ? Pour eux, la nuit.'],
            ['My clients are fleeing. Half in towels, half in ice cubes.', 'They come at dawn. Bad call: I’m a morning AND evening person.', 'Day or night? For them, night.']],
    reply: [['{P}, tu les préfères grillés ou surgelés ?', 'Reste à ma gauche, {P}. Non, ma droite. Non… reste derrière.', 'On fait moitié-moitié, {P} ?'],
            ['{P}, you want them grilled or frozen?', 'Stay on my left, {P}. No, my right. No… stay behind.', 'Half and half, {P}?']],
    taunt: [['Villen-Hüüs ! Choisis : brûlé, ou gelé ?', 'Tu vas avoir des sueurs froides. Et des frissons chauds.'],
            ['Villen-Hüüs! Choose: burnt, or frozen?', 'You’re going to get cold sweats. And hot shivers.']],
    ff: [['Tu m’as fait changer de côté !', 'Ça, c’était froid. Et brûlant.'],
         ['You made me flip sides!', 'That was cold. And burning.']],
    insult: ['cette nomade à moitié flamme, à moitié givre', 'that half-flame, half-frost nomad']
  },
  bernache: {
    voc: ['Bernache', 'Bernache'], nom: ['Bernache', 'Bernache'], full: ['Bernache', 'Bernache'],
    win: [['HONK. (Traduction : « Et ne revenez pas sur mon lac. »)', 'HONK HONK. (Elle mord un soldat qui ne bougeait plus. Par principe.)'],
          ['HONK. (Translation: “And stay off my lake.”)', 'HONK HONK. (She bites a soldier who had stopped moving. On principle.)']],
    clock: [['HONK ? (Elle donne un coup de bec dans l’horloge. Un rouage tombe.)', 'HONK. (Elle s’assoit sur les morceaux, comme sur des œufs.)'],
            ['HONK? (She pecks the clock. A gear falls off.)', 'HONK. (She sits on the pieces, like eggs.)']],
    medal: [['HONK ! (Elle mange le ruban.)', '… HONK. (Elle fixe l’Empereur. L’Empereur recule.)'],
            ['HONK! (She eats the ribbon.)', '… HONK. (She stares at the Emperor. The Emperor steps back.)']],
    medalName: ['l’Ordre du Mérite Aviaire et du Sifflement', 'the Order of Avian Merit and Hissing'],
    hide: [['HONK. (Elle l’enterre au fond d’un étang. Elle reste dessus pendant trois jours.)', 'HONK HONK. (Elle le cache dans son nid. Personne ne s’approche d’un nid de bernache.)'],
           ['HONK. (She buries it at the bottom of a pond. She sits on it for three days.)', 'HONK HONK. (She hides it in her nest. Nobody goes near a goose’s nest.)']],
    retire: { cap: ['Bernache prend sa retraite au parc municipal. Le parc, lui, ne s’en est jamais remis.', 'Bernache retires to the city park. The park never recovered.'],
              line: [['HONK. (Elle poursuit un joggeur. Puis un autre. Puis un cycliste.)', 'HONK ! (Traduction : « Ce banc est à moi. Tous les bancs sont à moi. »)'],
                     ['HONK. (She chases a jogger. Then another. Then a cyclist.)', 'HONK! (Translation: “This bench is mine. All benches are mine.”)']], prop: 'pond' },
    alarm: [['HONK ! (Traduction : « Des intrus. Sur MON étang. »)', 'HOOOONK. (Elle déploie ses ailes. Le ciel entier recule un peu.)', 'HONK HONK HONK. (Traduction : non.)'],
            ['HONK! (Translation: “Intruders. On MY pond.”)', 'HOOOONK. (She spreads her wings. The whole sky backs off a little.)', 'HONK HONK HONK. (Translation: no.)']],
    reply: [['HONK. (Traduction : « Suis-moi, {P}, et ne touche pas à mon pain. »)', 'HONK ? (Elle pince {Pn}. Affectueusement. Probablement.)', 'HONK. (Elle hoche la tête. Elle est prête depuis toujours.)'],
            ['HONK. (Translation: “Follow me, {P}, and don’t touch my bread.”)', 'HONK? (She nips {Pn}. Affectionately. Probably.)', 'HONK. (She nods. She has always been ready.)']],
    taunt: [['HOOONK ! (Traduction : impolie.)', 'HONK. (Elle fixe Villen-Hüüs sans cligner des yeux. Longtemps.)'],
            ['HOOONK! (Translation: rude.)', 'HONK. (She stares at Villen-Hüüs without blinking. For a long time.)']],
    ff: [['HONK !! (Traduction : tu vas le regretter. Ce soir. Dans ton sommeil.)', 'HHHHH. (Elle siffle. C’est pire qu’un honk.)'],
         ['HONK!! (Translation: you’ll regret that. Tonight. In your sleep.)', 'HHHHH. (She hisses. Worse than a honk.)']],
    insult: ['cette oie enragée', 'that rabid goose']
  },
  raccoon: {
    voc: ['le Raton', 'Raccoon'], nom: ['le raton', 'the raccoon'], full: ['le raton de l’espace', 'the space raccoon'],
    win: [['En haut, idiots ! … Ah, c’est fini ? J’étais encore en haut.', 'J’ai récupéré trois casques, une épée et un sandwich. Victoire totale.'],
          ['Up here, idiots! … Oh, it’s over? I was still up here.', 'I salvaged three helmets, a sword and a sandwich. Total victory.']],
    clock: [['Des rouages ? Je prends ! … Non ? Personne ne garde rien ? Quel gaspillage.', 'On peut la revendre en pièces détachées. Ah, c’est déjà en pièces détachées.'],
            ['Gears? I’ll take them! … No? Nobody keeps anything? What a waste.', 'We could sell it for parts. Oh, it’s already in parts.']],
    medal: [['C’est de l’or ? Je peux la mordre ? Je la mords.', 'Elle ira dans ma collection, entre un bouchon de bouteille et une clé de 12.'],
            ['Is it gold? Can I bite it? I’m biting it.', 'It’ll go in my collection, between a bottle cap and a 12 mm wrench.']],
    medalName: ['la Médaille du Recyclage Héroïque', 'the Medal of Heroic Recycling'],
    hide: [['Dans une poubelle. La meilleure cachette de l’univers. Croyez-moi, je sais.', 'Je le planque là-haut. Personne ne regarde jamais en haut.'],
           ['In a dumpster. The best hiding place in the universe. Trust me, I know.', 'I’m stashing it up high. Nobody ever looks up.']],
    retire: { cap: ['Le raton ouvre une brocante. Tout vient des poubelles. Tout est à vendre. Rien n’est rendu.', 'The raccoon opens a junk shop. Everything comes from the trash. Everything’s for sale. No refunds.'],
              line: [['Ce grille-pain ? Une pièce de collection. Il fait aussi radio. Parfois.', 'Non, madame, je ne vole pas. Je « récupère avant les autres ».'],
                     ['This toaster? A collector’s item. It’s also a radio. Sometimes.', 'No, ma’am, I don’t steal. I “salvage before others do”.']], prop: 'junk' },
    alarm: [['Des vaisseaux ! Plein de pièces détachées qui tombent du ciel ! … Ah, et des soldats.', 'Ils piétinent ma vitrine ! J’avais soldé les lampes !', 'Bon. Je ressors le jetpack. Il fait encore « pof ». C’est bon signe.'],
            ['Ships! Loads of spare parts falling from the sky! … Oh, and soldiers.', 'They’re trampling my shop window! The lamps were on sale!', 'Right. Getting the jetpack out. It still goes “pof”. Good sign.']],
    reply: [['{P}, tu tapes en bas, je tire d’en haut. Classique.', 'Si tu trouves des trucs brillants, {P}, c’est à moi.', 'T’inquiète, {P}. J’ai un plan. Il est dans une poubelle, mais j’en ai un.'],
            ['{P}, you hit low, I shoot from above. Classic.', 'If you find anything shiny, {P}, it’s mine.', 'Relax, {P}. I have a plan. It’s in a dumpster, but I have one.']],
    taunt: [['Hé, Villen-Hüüs ! Lève les yeux ! … Trop tard.', 'Ton armure, je la revends combien, à ton avis ?'],
            ['Hey, Villen-Hüüs! Look up! … Too late.', 'How much do you think I’ll get for your armour?']],
    ff: [['Hé ! Je suis du bon côté de la poubelle, moi !', 'Aïe ! Tu tapes sur la mauvaise bestiole !'],
         ['Hey! I’m on the right side of the dumpster!', 'Ow! Wrong critter!']],
    insult: ['cette vermine à fusée', 'that rocket-powered vermin']
  },
  soldier: {
    voc: ['Jean-Louis', 'Jean-Louis'], nom: ['Jean-Louis', 'Jean-Louis'], full: ['Jean-Louis Carnage', 'Jean-Louis Carnage'],
    win: [['Secteur sécurisé ! … Bon, le chef s’est sauvé. Secteur à moitié sécurisé.', 'Pas pendant ma garde. Ni pendant celle des autres, d’ailleurs.'],
          ['Sector secured! … Well, the boss escaped. Sector half-secured.', 'Not on my watch. Or anyone else’s, come to think of it.']],
    clock: [['Procédure standard : on démonte, on disperse, on ne parle à personne.', 'Une arme, ça. Une arme qui fait des heures sup’ à l’envers.'],
            ['Standard procedure: dismantle, disperse, tell nobody.', 'That’s a weapon. A weapon working overtime in reverse.']],
    medal: [['Merci, monsieur ! (Il salue. Il salue encore. Il ne s’arrête plus de saluer.)', 'Je la dédie à mon canot.'],
            ['Thank you, sir! (He salutes. He salutes again. He can’t stop saluting.)', 'I dedicate it to my canoe.']],
    medalName: ['la Médaille de la Garde Inébranlable', 'the Medal of the Unshakeable Watch'],
    hide: [['Enterré à deux mètres. Bien droit. Comme à l’entraînement.', 'Camouflé. Même moi, je ne le vois plus. C’est ça, le métier.'],
           ['Buried six feet down. Nice and straight. Like in training.', 'Camouflaged. Even I can’t see it any more. That’s the job.']],
    retire: { cap: ['Jean-Louis Carnage se retire au chalet. Un canot, une hache, un barbecue qu’il défend comme une tranchée.', 'Jean-Louis Carnage retires to a cabin. A canoe, an axe, and a barbecue he defends like a trench.'],
              line: [['Les saucisses : à mon commandement ! … Retournez-vous !', 'Le lac est calme. Trop calme. J’aime ça. Mais je reste vigilant.'],
                     ['Sausages: on my command! … Turn!', 'The lake is calm. Too calm. I like it. But I stay alert.']], prop: 'cabin' },
    alarm: [['Mes saucisses ! Ils ont renversé mes saucisses !', 'Alerte ! Je le savais. Trente ans que je dors avec mon casque.', 'Pas pendant ma retraite !'],
            ['My sausages! They knocked over my sausages!', 'Alert! I knew it. Thirty years sleeping in my helmet.', 'Not on my retirement!']],
    reply: [['{P}, à mon signal ! … C’était le signal.', 'Couvre-moi, {P}. Je couvre tout le reste.', 'Rompez, {P}. Ah non, chargez !'],
            ['{P}, on my signal! … That was the signal.', 'Cover me, {P}. I’ll cover everything else.', 'Dismissed, {P}. No wait, charge!']],
    taunt: [['Villen-Hüüs ! Rends-toi, ou je me fâche. … Trop tard, je suis fâché.', 'Encore toi ? On a déjà fait cette mission !'],
            ['Villen-Hüüs! Surrender, or I get angry. … Too late, I’m angry.', 'You again? We already did this mission!']],
    ff: [['Tir ami ! TIR AMI ! J’ai dit AMI !', 'On ne tire pas sur l’infanterie !'],
         ['Friendly fire! FRIENDLY! I said FRIENDLY!', 'Don’t shoot the infantry!']],
    insult: ['ce soldat qui hurle', 'that screaming soldier']
  }
};

// The six partner pairs get scenes of their own; a few other pairs too.
const PAIRS = {
  'amiral|spora': {
    past: [['spora', 'Amiral. Tu as changé de camp aujourd’hui. Nous trouvons ça… bien.', 'Admiral. You changed sides today. We find that… good.'], ['amiral', 'Merci, Spora. Toutes. Les quatre mille.', 'Thank you, Spora. All of you. All four thousand.']],
    home: [['spora', 'L’Amiral vient nous arroser chaque dimanche. Avec de l’eau de mer. Nous ne disons rien.', 'The Admiral waters us every Sunday. With sea water. We say nothing.']],
    battle: [['amiral', 'Spora, tu les retiens, je les canonne. Comme au bon vieux temps.', 'Spora, you hold them, I shell them. Like the good old days.'], ['spora', 'Le bon vieux temps, c’était il y a trente ans. Nous avons poussé depuis.', 'The good old days were thirty years ago. We have grown since.'], ['amiral', 'Moi, j’ai surtout rapetissé.', 'I have mostly shrunk.']]
  },
  'marge|ruby': {
    past: [['ruby', 'Marge ! C’était le meilleur concert de ma vie !', 'Marge! Best gig of my life!'], ['marge', 'C’ÉTAIT PAS UN CONCERT, C’ÉTAIT UNE GUERRE !', 'IT WASN’T A GIG, IT WAS A WAR!'], ['ruby', 'C’est pareil, avec un meilleur éclairage.', 'Same thing, better lighting.']],
    home: [['ruby', 'Marge fait le bingo, moi les cours de guitare. On se croise au centre communautaire. Personne n’ose plus jouer au bridge.', 'Marge does bingo, I teach guitar. We share the community centre. Nobody dares play bridge any more.']],
    battle: [['marge', 'Ruby ! Comme à la tournée de ’96 ?', 'Ruby! Like the ’96 tour?'], ['ruby', 'Celle où on a fait tomber le plafond ?', 'The one where we brought the ceiling down?'], ['marge', 'Cette fois, on fait tomber le ciel.', 'This time, we bring down the sky.'], ['ruby', 'UN, DEUX, TROIS, QUATRE !', 'ONE, TWO, THREE, FOUR!']]
  },
  'cyborg|raccoon': {
    past: [['raccoon', 'Le Gros ! T’as vu ? Je les attirais, tu les écrasais !', 'Big Guy! See that? I lured them, you flattened them!'], ['cyborg', 'Oui.', 'Yes.'], ['raccoon', 'On fait une sacrée équipe, hein ?', 'We make a heck of a team, huh?'], ['cyborg', '… Oui.', '… Yes.']],
    home: [['raccoon', 'Le Gros m’achète tous mes vieux grille-pain. Il en fait des bols. Je ne pose pas de questions.', 'Big Guy buys all my old toasters. He makes bowls out of them. I don’t ask.']],
    battle: [['raccoon', 'Le Gros, même tactique ? Je vole, ils me suivent, tu roules dessus ?', 'Big Guy, same plan? I fly, they chase me, you roll over them?'], ['cyborg', 'Oui. Ne te fais pas écraser.', 'Yes. Don’t get flattened.'], ['raccoon', 'Une seule fois ! C’était il y a trente ans !', 'Once! That was thirty years ago!'], ['cyborg', 'Deux fois.', 'Twice.']]
  },
  'bernache|papi': {
    past: [['papi', 'Bien joué, la bernache ! De mon temps, les oies, on les mangeait !', 'Well done, goose! In my day, we ate geese!'], ['bernache', 'HONK. (Elle mord Papi.)', 'HONK. (She bites Grandpa.)'], ['papi', '… Bon. Les temps changent.', '… Well. Times change.']],
    home: [['papi', 'La bernache vient pêcher avec moi. Elle mange tout ce que j’attrape. On est très heureux.', 'The goose fishes with me. She eats everything I catch. We’re very happy.']],
    battle: [['papi', 'Bernache ! Tu les fais fuir, je les rattrape !', 'Goose! You scare them off, I run them down!'], ['bernache', 'HONK. (Traduction : « Comme d’habitude, vieux machin. »)', 'HONK. (Translation: “As usual, old thing.”)'], ['papi', 'Qui tu traites de vieux machin ?!', 'Who are you calling old thing?!']]
  },
  'demi|magneto': {
    past: [['magneto', 'Je les ai empilés, tu les as gelés. Une pyramide de glaçons !', 'I stacked them, you froze them. A pyramid of ice cubes!'], ['demi', 'Et la moitié a fondu. Je ne fais rien à moitié. Sauf ça.', 'And half of it melted. I never do things by halves. Except that.']],
    home: [['magneto', 'Demi garde mes aimants au frais, côté glace. Elle les a tous perdus côté feu.', 'Demi keeps my magnets cool, on the ice side. She lost them all on the fire side.']],
    battle: [['magneto', 'Demi, je les mets en tas, tu choisis la cuisson ?', 'Demi, I pile them up, you pick the cooking?'], ['demi', 'Saignant d’un côté, surgelé de l’autre.', 'Rare on one side, frozen on the other.'], ['magneto', 'C’est pour ça que je t’aime bien.', 'That’s why I like you.']]
  },
  'doc|soldier': {
    past: [['doc', 'Jean-Louis, tu as encore pris une balle.', 'Jean-Louis, you took another bullet.'], ['soldier', 'Juste une petite, Doc !', 'Just a little one, Doc!'], ['doc', 'Il n’y a pas de petites balles. Il y a des petits soldats têtus.', 'There are no little bullets. There are little stubborn soldiers.']],
    home: [['soldier', 'Doc m’a tricoté un pull camouflage. Je ne le retrouve plus. C’est un excellent pull.', 'Doc knitted me a camo sweater. I can’t find it anywhere. It’s an excellent sweater.']],
    battle: [['soldier', 'Doc ! Comme au bon vieux temps ? Je fonce, tu recouds ?', 'Doc! Like old times? I charge, you stitch?'], ['doc', 'Comme au bon vieux temps : tu fonces, tu saignes, je râle, je recouds.', 'Like old times: you charge, you bleed, I grumble, I stitch.'], ['soldier', 'J’ai hâte !', 'Can’t wait!'], ['doc', 'Moi pas.', 'I can.']]
  },
  // other pairs worth a line or two
  'cyborg|ruby': { battle: [['ruby', 'Le Gros… t’es toujours en métal ?', 'Big Guy… are you still made of metal?'], ['cyborg', 'Oui.', 'Yes.'], ['ruby', 'Alors reste loin quand je joue. Très loin.', 'Then stay far away when I play. Very far.']] },
  'bernache|marge': { battle: [['marge', 'Bernache ! Concours de cris ?', 'Bernache! Shouting contest?'], ['bernache', 'HOOOOOOONK.', 'HOOOOOOONK.'], ['marge', '… D’accord. Tu as gagné. Je vais chercher un ampli plus gros.', '… Okay. You win. I’m getting a bigger amp.']] },
  'papi|raccoon': { battle: [['papi', 'Toi, le petit jeune avec ta fusée, tu me laisses passer !', 'You, young’un with the rocket, let me through!'], ['raccoon', 'Papi, j’ai quarante ans.', 'Grandpa, I’m forty.'], ['papi', 'C’est bien ce que je dis : un bébé.', 'Like I said: a baby.']] },
  'amiral|soldier': { battle: [['soldier', 'La marine et l’infanterie, côte à côte !', 'The navy and the infantry, side by side!'], ['amiral', 'Ne me saluez pas, soldat. Je n’ai pas toujours été un exemple.', 'Don’t salute me, soldier. I wasn’t always an example.'], ['soldier', 'Trop tard. Je salue tout le monde.', 'Too late. I salute everyone.']] },
  'cyborg|magneto': { battle: [['magneto', 'Le Gros, ne m’en veux pas si tu te colles à moi.', 'Big Guy, don’t blame me if you stick to me.'], ['cyborg', 'Je pèse quatre tonnes.', 'I weigh four tons.'], ['magneto', '… Alors c’est moi qui vais me coller à toi.', '… Then I’ll be the one sticking to you.']] },
  'demi|spora': { battle: [['spora', 'Demi. Côté feu, loin de nous, s’il te plaît.', 'Demi. Fire side away from us, please.'], ['demi', 'Promis. Côté glace pour toi.', 'Promise. Ice side for you.'], ['spora', 'Nous allons avoir froid. Mais nous préférons.', 'We will be cold. But we prefer it.']] },
  'bernache|raccoon': { battle: [['raccoon', 'Bernache. Tu te souviens du sandwich ?', 'Bernache. Remember the sandwich?'], ['bernache', 'HONK. (Traduction : je me souviens de tout.)', 'HONK. (Translation: I remember everything.)'], ['raccoon', 'On fait la paix pour aujourd’hui ?', 'Truce, just for today?'], ['bernache', '… honk.', '… honk.']] },
  'doc|marge': { battle: [['doc', 'Marge, combien d’accidents d’ampli depuis la dernière guerre ?', 'Marge, how many amp accidents since the last war?'], ['marge', 'QUOI ?', 'WHAT?'], ['doc', 'C’est bien ce que je pensais.', 'As I thought.']] },
  'amiral|papi': { battle: [['papi', 'Amiral ! Vous étiez déjà vieux il y a trente ans !', 'Admiral! You were already old thirty years ago!'], ['amiral', 'Et vous, Papi, vous étiez déjà en retard.', 'And you, Grandpa, were already late.'], ['papi', 'Je prenais mon temps. Nuance.', 'I was taking my time. Big difference.']] },
  'magneto|soldier': { battle: [['soldier', 'Magnéto, laissez mon casque tranquille !', 'Magneto, leave my helmet alone!'], ['magneto', 'C’est lui qui vient tout seul. Il m’aime bien.', 'It comes on its own. It likes me.']] },
  'raccoon|spora': { battle: [['raccoon', 'Spora, je peux dormir en toi après la bataille ?', 'Spora, can I nap inside you after the fight?'], ['spora', 'Gérard dit non.', 'Gérard says no.']] },
  'demi|ruby': { battle: [['ruby', 'Demi, tu me fais un feu de scène ?', 'Demi, can you give me stage pyro?'], ['demi', 'Et de la fumée glacée. Je fais les deux.', 'And dry ice. I do both.'], ['ruby', 'On ouvre quand ?', 'When do we open?']] }
};

const VHL = { // Lord Villen-Hüüs: a long-winded tyrant. Madame Metal Face listens. And takes notes.
  defeat: [['NON ! Pas comme ça ! Pas avec l’Horloge presque finie !', 'Vous… vous avez cassé mon horloge ! Elle n’était même pas payée !'],
           ['NO! Not like this! Not with the Clock almost finished!', 'You… you broke my clock! I hadn’t even paid it off!']],
  flee: [['Je reviendrai ! Dans dix ans ! Vingt ! Trente s’il le faut !', 'Ce n’est pas une fuite ! C’est un repli… temporel !'],
         ['I’ll be back! In ten years! Twenty! Thirty if I must!', 'This isn’t running away! It’s a… temporal retreat!']],
  lair: [
    ['Trente ans. TRENTE ANS, Madame. Trente ans à manger de la soupe de comète dans cet astéroïde.',
     'Et pendant ce temps, {A} fait la sieste. Et {B}, que fait {B} ? Je ne veux pas le savoir. Si. Dites-le-moi.',
     'Ils m’ont pris mon armée, mon empire, et mon horloge. Surtout mon horloge.',
     'Vous savez ce qu’elle faisait, mon horloge, Madame ? Elle remontait le temps. Jusqu’à AVANT. Avant eux. Avant tout ça.',
     'Ils l’ont mise en pièces. Huit pièces, cachées sur huit mondes. Des amateurs !',
     'Mais ils ont oublié un détail. Un tout petit détail. Un rouage.',
     'CELUI-CI.'],
    ['Thirty years. THIRTY YEARS, Madame. Thirty years eating comet soup in this asteroid.',
     'And meanwhile {A} takes naps. And {B}, what does {B} do? I don’t want to know. Yes I do. Tell me.',
     'They took my army, my empire and my clock. Mostly my clock.',
     'Do you know what my clock did, Madame? It turned back time. To BEFORE. Before them. Before all this.',
     'They smashed it to pieces. Eight pieces, hidden on eight worlds. Amateurs!',
     'But they forgot one detail. One tiny little detail. A gear.',
     'THIS ONE.']],
  lairAlt: [ // swapped in at random, for variety
    ['Madame, notez : « Vengeance. » Soulignez deux fois.', 'Vous ne parlez pas beaucoup, Madame. C’est ce que j’apprécie chez vous. Je parle pour deux.', 'Je déteste {A}. Je déteste {B}. Je déteste les mardis. Nous sommes mardi ?'],
    ['Madame, take this down: “Revenge.” Underline it twice.', 'You don’t talk much, Madame. That’s what I like about you. I talk for two.', 'I hate {A}. I hate {B}. I hate Tuesdays. Is it Tuesday?']],
  mmf: [['…', '(Elle note.)', 'Noté, Monseigneur.', '(Elle remonte ses lunettes.)', '(Elle sourit. Juste un peu. Il ne voit rien.)'],
        ['…', '(She takes notes.)', 'Noted, my Lord.', '(She pushes up her glasses.)', '(She smiles. Just a little. He doesn’t notice.)']],
  arrive: [['Encore vous deux ?! Vous ne prenez donc jamais de retraite ?', 'Ah, {A} ! Et {B} ! Quel déplaisir !', 'Vous arrivez trop tard. Ou trop tôt. Avec une horloge, c’est pareil.'],
           ['You two again?! Do you never retire?', 'Ah, {A}! And {B}! What a displeasure!', 'You’re too late. Or too early. With a clock, it’s the same thing.']],
  escape: [['Le rouage de Havre est à moi ! Rendez-vous sur le prochain monde… si vous trouvez le chemin !', 'Madame ! Le rayon ! LE RAYON, Madame !'],
           ['The Havre gear is mine! See you on the next world… if you can find it!', 'Madame! The beam! THE BEAM, Madame!']]
};
const CEREMONY = {
  open: [['Peuple de Havre ! Citoyens des huit mondes ! Aujourd’hui, nous honorons deux héros.', 'Il y a des jours où un empereur est fier. Aujourd’hui est l’un de ces jours. Hier, pas du tout.'],
         ['People of Havre! Citizens of the eight worlds! Today we honour two heroes.', 'There are days when an emperor is proud. Today is one of them. Yesterday, not at all.']],
  give: [['À {ME}, {MEDAL} !', 'Pour {ME} : {MEDAL} !'], ['To {ME}, {MEDAL}!', 'For {ME}: {MEDAL}!']],
  close: [['Que l’histoire se souvienne de vous ! Enfin, pas trop en détail.', 'Applaudissez ! Plus fort ! L’Empereur a dit : plus fort !'],
          ['May history remember you! Well, not in too much detail.', 'Applause! Louder! The Emperor said louder!']],
  cmd: [['Bravo. Maintenant, ces morceaux d’horloge : débarrassez-vous-en. Chacun sur un monde différent. Et n’en parlez à personne.', 'Les félicitations, c’est fait. Maintenant, la corvée : semez-moi ces rouages aux quatre coins de la galaxie. Huit coins, en fait.'],
        ['Well done. Now, those clock pieces: get rid of them. Each on a different world. And tell no one.', 'Congratulations: done. Now the chore: scatter those gears to the four corners of the galaxy. Eight corners, actually.']],
  ok: [['À vos ordres, Commandant.', 'Compris.', 'On part ce soir.'], ['Yes, Commander.', 'Understood.', 'We leave tonight.']]
};
const PAST = { // shared beats of scene 1
  count: [['Huit morceaux…', 'Il en manque un ?', 'Bah. Un rouage de moins, c’est une horloge qui ne marchera jamais.'],
          ['Eight pieces…', 'Isn’t one missing?', 'Meh. One gear short, it’s a clock that’ll never work.']],
  split: [['Un morceau par monde. Huit mondes, huit cachettes. Et on n’en parle plus jamais.', 'On les sépare. Chacun sur un monde. Comme ça, plus jamais d’horloge.'],
          ['One piece per world. Eight worlds, eight hiding places. And we never speak of it again.', 'We split them up. One per world. That way, no more clock, ever.']],
  agree: [['Marché conclu.', 'D’accord. Mais c’est moi qui choisis les cachettes rigolotes.', 'Jamais. Promis.'],
          ['Deal.', 'Fine. But I pick the fun hiding places.', 'Never. Promise.']]
};
const WORLDS8 = [ // where the pieces went (the 8th is Havre, under the lighthouse)
  { id: 'doree', name: ['Dorée', 'Dorée'], spot: ['dans un nuage d’or', 'inside a cloud of gold'], col: ['#e8b84a', '#7a4a1a'] },
  { id: 'embrume', name: ['Embrume', 'Embrume'], spot: ['sous la scène d’un bar enfumé', 'under the stage of a smoky bar'], col: ['#8a7aa8', '#2a2038'] },
  { id: 'brasier', name: ['Brasier', 'Brasier'], spot: ['au fond d’un volcan', 'at the bottom of a volcano'], col: ['#e8582a', '#3a0e08'] },
  { id: 'fumerolle', name: ['Fumerolle', 'Fumerolle'], spot: ['sous un geyser', 'under a geyser'], col: ['#4ab8a8', '#0e2a2a'] },
  { id: 'crepuscule', name: ['Crépuscule', 'Crépuscule'], spot: ['pile sur la ligne du jour et de la nuit', 'right on the line between day and night'], col: ['#e88a4a', '#1a2050'] },
  { id: 'anneau', name: ['l’Anneau', 'the Ring'], spot: ['dans une poubelle de la station', 'in one of the station’s dumpsters'], col: ['#9ab0c8', '#1a2230'] },
  { id: 'havre', name: ['Havre', 'Havre'], spot: ['sous le phare', 'under the lighthouse'], col: ['#f2b880', '#2a3a5c'] },
  { id: 'inconnue', name: ['l’Inconnue', 'L’Inconnue'], spot: ['on ne sait plus où. Vraiment.', 'nobody remembers where. Really.'], col: ['#3a3a5a', '#08080e'] }
];
const RETIRE_CAP = [['Puis vinrent trente ans de paix. Ou presque.'], ['Then came thirty years of peace. Almost.']];
const LAIR_CAP = [['Aujourd’hui. Un astéroïde, quelque part dans la ceinture de Kepler.'], ['Today. An asteroid, somewhere in the Kepler belt.']];
const PAST_CAP = [['Il y a trente ans. La dernière bataille de la Guerre de l’Horloge.'], ['Thirty years ago. The last battle of the Clock War.']];
const CEREMONY_CAP = [['Le lendemain. Le Palais de l’Empereur D’Justeece.'], ['The next day. The Palace of Emperor D’Justeece.']];

// ---- the generator ---------------------------------------------------
function rngOf(seed) { let s = seed >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }
const LI = () => (typeof LANG !== 'undefined' && LANG === 'en') ? 1 : 0;
function pairKey(a, b) { return [a, b].sort().join('|'); }
function fill(s, ctx) { return s.replace(/\{(\w+)\}/g, (m, k) => ctx[k] ?? m); }
// Builds the whole story for a pair: returns { past, ceremony, hide, retire, lair, battle, boss, escape, ff }
// Each line: { who: 'A' | 'B' | 'VH' | 'MMF' | 'CEL' | 'CMD' | 'NAR', fr, en }
function buildStory(aId, bId, seed) {
  const r = rngOf(seed), pick = arr => arr[Math.floor(r() * arr.length)], chance = p => r() < p;
  const A = VOICE[aId], B = VOICE[bId], P = PAIRS[pairKey(aId, bId)] || {}, partners = !!P.past;
  const who = id => id === aId ? 'A' : 'B';
  const L = (w, fr, en, ctx = {}) => ({ who: w, fr: fill(fr, ctx), en: fill(en, ctx) });
  const fromVoice = (w, key, ctxFor) => { const v = w === 'A' ? A : B, o = w === 'A' ? B : A, i = Math.floor(r() * v[key][0].length); const ctx = { P: v === A ? B.voc[0] : A.voc[0], Pn: o.nom[0], ...ctxFor }; const ctxE = { P: o.voc[1], Pn: o.nom[1], ...ctxFor }; return { who: w, fr: fill(v[key][0][i], ctx), en: fill(v[key][1][i], ctxE) }; };
  const shared = (tbl, i) => ({ fr: tbl[0][i ?? Math.floor(r() * tbl[0].length)], en: tbl[1][i ?? Math.floor(r() * tbl[1].length)] });
  const pairLines = key => (P[key] || []).map(([id, fr, en]) => L(who(id), fr, en));
  const first = chance(.5) ? 'A' : 'B', second = first === 'A' ? 'B' : 'A';
  const names = { A: [A.full[0], A.full[1]], B: [B.full[0], B.full[1]] };
  const vhCtx = (i) => ({ A: names.A[i], B: names.B[i] });
  // 1. the past
  const vi = Math.floor(r() * 2);
  const past = [{ who: 'NAR', ...shared(PAST_CAP, 0) }, { who: 'VH', fr: VHL.defeat[0][vi], en: VHL.defeat[1][vi] }, fromVoice(first, 'win'), fromVoice(second, 'win'), ...pairLines('past')];
  const fi = Math.floor(r() * 2); past.push({ who: 'VH', fr: VHL.flee[0][fi], en: VHL.flee[1][fi], ev: 'flee' });
  past.push({ who: first, fr: PAST.count[0][0], en: PAST.count[1][0], ev: 'pieces' }, { who: second, fr: PAST.count[0][1], en: PAST.count[1][1] }, { who: first, fr: PAST.count[0][2], en: PAST.count[1][2] });
  past.push(fromVoice(second, 'clock'), fromVoice(first, 'clock'));
  if (!partners || chance(.5)) { const si = Math.floor(r() * 2); past.push({ who: second, fr: PAST.split[0][si], en: PAST.split[1][si] }); const ai = Math.floor(r() * 3); past.push({ who: first, fr: PAST.agree[0][ai], en: PAST.agree[1][ai] }); }
  else { const si = Math.floor(r() * 2); past.push({ who: first, fr: PAST.split[0][si], en: PAST.split[1][si] }); }
  // 2. the ceremony
  const cer = [{ who: 'NAR', ...shared(CEREMONY_CAP, 0) }, { who: 'CEL', ...shared(CEREMONY.open) }];
  for (const w of [first, second]) { const v = w === 'A' ? A : B, gi = Math.floor(r() * 2); cer.push({ who: 'CEL', fr: fill(CEREMONY.give[0][gi], { ME: v.full[0], MEDAL: v.medalName[0] }), en: fill(CEREMONY.give[1][gi], { ME: v.full[1], MEDAL: v.medalName[1] }), ev: 'medal' + w }); cer.push(fromVoice(w, 'medal')); }
  cer.push({ who: 'CEL', ...shared(CEREMONY.close), ev: 'cheer' });
  cer.push({ who: 'CMD', ...shared(CEREMONY.cmd), ev: 'aside' });
  const oi = Math.floor(r() * 3); cer.push({ who: first, fr: CEREMONY.ok[0][oi], en: CEREMONY.ok[1][oi] });
  // 3. the hiding montage: the two take turns; their own quips on two worlds
  const hide = WORLDS8.map((w, k) => { const sp = k % 2 ? second : first; let line = null;
    if (k === 1 || k === 4) line = fromVoice(sp, 'hide');
    else if (w.id === 'anneau' && (aId === 'raccoon' || bId === 'raccoon')) line = { who: who('raccoon'), fr: VOICE.raccoon.hide[0][0], en: VOICE.raccoon.hide[1][0] };
    else if (w.id === 'brasier' && (aId === 'cyborg' || bId === 'cyborg')) line = { who: who('cyborg'), fr: VOICE.cyborg.hide[0][0], en: VOICE.cyborg.hide[1][0] };
    else if (w.id === 'crepuscule' && (aId === 'demi' || bId === 'demi')) line = { who: who('demi'), fr: VOICE.demi.hide[0][0], en: VOICE.demi.hide[1][0] };
    else if (w.id === 'embrume' && (aId === 'marge' || bId === 'marge')) line = { who: who('marge'), fr: VOICE.marge.hide[0][0], en: VOICE.marge.hide[1][0] };
    else if (w.id === 'inconnue') line = { who: sp, fr: 'Où est-ce qu’on l’a mis, celui-là, déjà ?', en: 'Where did we put that one again?' };
    return { world: w, cap: { fr: w.name[0] + ' : ' + w.spot[0], en: w.name[1] + ': ' + w.spot[1] }, line }; });
  // 4. retirement
  const ret = { cap: { who: 'NAR', ...shared(RETIRE_CAP, 0) }, A: { cap: { fr: A.retire.cap[0], en: A.retire.cap[1] }, line: fromVoice('A', 'retire_line') }, B: { cap: { fr: B.retire.cap[0], en: B.retire.cap[1] }, line: fromVoice('B', 'retire_line') }, pair: pairLines('home') };
  // 5. the lair
  const lair = [{ who: 'NAR', ...shared(LAIR_CAP, 0) }];
  const mono = VHL.lair, alt = VHL.lairAlt; const mmf = (i) => ({ who: 'MMF', fr: VHL.mmf[0][i], en: VHL.mmf[1][i] });
  for (let k = 0; k < mono[0].length; k++) { lair.push({ who: 'VH', fr: fill(mono[0][k], vhCtx(0)), en: fill(mono[1][k], vhCtx(1)), ev: k === mono[0].length - 1 ? 'gear' : null });
    if (k === 1) { lair.push({ who: 'VH', fr: `Et ${A.insult[0]}, et ${B.insult[0]}… ils vont regretter d’avoir pris leur retraite.`, en: `And ${A.insult[1]}, and ${B.insult[1]}… they’ll regret ever retiring.` }); lair.push(mmf(0)); } if (k === 2 && chance(.6)) { const j = Math.floor(r() * alt[0].length); lair.push({ who: 'VH', fr: fill(alt[0][j], vhCtx(0)), en: fill(alt[1][j], vhCtx(1)) }); lair.push(mmf(chance(.5) ? 1 : 2)); }
    if (k === 4) lair.push(mmf(3)); }
  lair.push(mmf(4));
  // 6. before the battle: their alarms, then the pair's chemistry, length varies
  const battle = [fromVoice(first, 'alarm'), fromVoice(second, 'alarm')];
  const pl = pairLines('battle');
  if (pl.length) battle.push(...pl); else { battle.push(fromVoice(first, 'reply')); if (chance(.6)) battle.push(fromVoice(second, 'reply')); }
  if (chance(.5)) battle.push(fromVoice(chance(.5) ? first : second, 'taunt'));
  // 7. the boss, the escape
  const ai2 = Math.floor(r() * 3);
  const boss = [{ who: 'VH', fr: fill(VHL.arrive[0][ai2], vhCtx(0)), en: fill(VHL.arrive[1][ai2], vhCtx(1)) }, fromVoice(first, 'taunt')];
  if (chance(.5)) boss.push(fromVoice(second, 'taunt'));
  const ei = Math.floor(r() * 2); const escape = [{ who: 'VH', fr: VHL.escape[0][ei], en: VHL.escape[1][ei] }, fromVoice(second, 'reply')];
  return { first, second, partners, past, cer, hide, ret, lair, battle, boss, escape };
}
// retire lines live under retire.line; expose them like the others
for (const k in VOICE) VOICE[k].retire_line = VOICE[k].retire.line;
function ffLine(id) { const v = VOICE[id], i = Math.floor(Math.random() * v.ff[0].length); return { fr: v.ff[0][i], en: v.ff[1][i] }; }
