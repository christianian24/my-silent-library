/**
 * Content Data for My Silent Library
 * This file contains all the writings, novels, and notes.
 * To add new content, simply add a new object to the appropriate array.
 * 
 * Structure:
 * - id: Unique identifier
 * - title: Title of the work
 * - category: Type of content (novels, notes, quotes)
 * - spineDesign: Design style for the book spine
 * New Spine Designs - Here is the full list of all 37 available spine designs:

        banded
        gilded
        gilded-chevron
        gilded-dots
        double-band
        checkered-gilded-corners
        gilded-checkers
        diamond
        crosshatch
        leather-bound
        zigzag
        gilded-texture
        ornate-speckle
        art-deco
        cosmic
        tooled-leather
        decorated-vellum
        embossed-star-atlas
        raised-bands
        silk-brocade
        inlaid-wood
        geometric-mosaic
        moonbeam-deco
        sunburst-deco
        geometric-weave
        gilded-watercolor
        gilded-border
        crosshatch-linen
        double-band-classic
        embossed-leather
        divider-bands
        ornamental-frame
        luxury-foil
        gilded-corners
        marbled-ink
        tartan-plaid
        stitched-leather
        
 * - excerpt: Short description or preview
 * - content: Full content (can be HTML or markdown-like text)
 * - date: Publication date
 * - tags: Array of tags for filtering
 * - downloadUrl: URL to downloadable file (optional only on novels)
 * - wordCount: Approximate word count
 * - readingTime: Estimated reading time in minutes
*/

const LIBRARY_CONTENT = {
    novels: 
    [          
        {
            id: "novel-000",
            title: "Where the Jacarandas Bloom",
            category: "novels",
            spineDesign: "gilded-watercolor",
            excerpt: "A story of two lifelong best friends, Zev and Celise, who have secretly been in love for years. After a tragic accident forces their feelings into the open, they must navigate the aftermath of shared trauma and learn that the hardest words to say are often the ones that matter most.",
            content: "<h1>Jacarandas Bloom</h1><p class=\"chapter-meta\">Chapter 1: Zev's POV</p><p>The sleeves of my hoodie are frayed at the edges, the fabric worn thin from years of nervous fidgeting. The left cuff has a small hole forming near the seam, and a coffee stain from last Tuesday when my hands shook too much to hold the cup steady. I pull the sleeves down over my hands now, the familiar softness a comfort against my anxiety. The fabric smells faintly of lavender detergent and something else—maybe hope, maybe fear. It's hard to tell the difference anymore.</p><p>I'm walking the same route I've taken a thousand times before, but today everything feels different. Heavier. Like the air itself knows what I'm planning to do. My backpack feels heavier too, though it's just the usual things—keys, charger, and one folded confession I've carried for too long.</p><p>Mrs. Chen's bookstore on Maple Street looks exactly the same as it did when Celise and I were eight, pressing our noses against the rain-streaked windows to peer at the new releases we couldn't afford. The owner, Mrs. Chen, still has that handwritten sign in the window: \"Books are dreams you hold in your hands.\" Celise always said that was the most beautiful thing she'd ever read. I never told her I thought the same thing about the way she looked when she read—lips slightly parted, completely lost in whatever world lived between those pages.</p><p>I should have told her a lot of things. The wind picks up, carrying the scent of approaching rain and something floral— jacaranda, maybe, though the trees won't bloom until spring. It reminds me of her perfume, light and sweet, the kind that lingers just long enough to make you lean closer without realizing you're doing it.</p><p>My phone buzzes in my pocket. A text from her: \"Wouldn't miss it, See you at 6 under our tree!!❤️\" — her reply to the one I sent a few minutes ago, confirming our 6 PM meeting. The heart emoji makes my chest tight. She uses them for everyone—her mom, her sister, the barista at the coffee shop who always remembers her order. It doesn't mean anything. I know this. But I save the message anyway, like I save all of them, because sometimes late at night I scroll through our conversations and pretend the casual affection in her words means more than it does.</p><p>The bus stop where we used to wait every morning during our senior year of high school is empty now. We're college sophomores now, but I still find myself walking past this place. I sit on the same bench where she used to do her homework, legs tucked under her, hair falling like a curtain across her face. I was always finding excuses to sit close enough to help—reaching over to point out a mistake in her calculus, leaning in to read a passage from her English essay. Any reason to be near her, to breathe in that faint sweetness that seemed to follow her everywhere.</p><p>\"You're so patient with me,\" she'd say, bumping my shoulder with hers. \"I don't know what I'd do without you, Zev.\" I wanted to tell her she'd never have to find out.</p><p>I reach into my backpack and feel the crinkled edges of the letter I've been carrying for three weeks. Twenty-seven drafts, each one thrown away, each one not quite right. This one isn't right either, but it's the closest I've come to saying what I mean:</p><blockquote><p>Celise,</p><p>I've been trying to write this for longer than you know. There are things I should have said years ago, things that have been living in the spaces between our conversations, in the moments when you laugh and I forget how to breathe.</p><p>I love you. Not the way friends love each other, but the way the ocean loves the shore—constantly, desperately, like I can't exist without touching some part of you. I love the way you hum when you're concentrating, and how you always order extra fries because you know I'll steal half of them.</p><p>I love that you see magic in ordinary things, and somehow, you've made me believe in it too.</p><p>I know I'm not brave enough to say this out loud, and I know this might change everything between us. But I can't keep pretending that what I feel for you is anything less than everything. You are my everything, Celise. You always have been.</p><p>If you're reading this, it means I finally found the courage to give it to you. Or maybe the universe decided for me. Either way, I needed you to know.</p><p>I love you.<br>Always, Zev</p></blockquote><p>I slip the letter into my backpack and zip it shut carefully, like it might fall apart if I move too fast. If I can't say it out loud, maybe this letter can do it for me.</p><p>The bench under the jacaranda tree is our spot—has been since we were fourteen and Celise declared it the most romantic place in the entire city. \"Look how the branches make a ceiling,\" she'd said, spinning with her arms outstretched. \"It's like nature's cathedral.\" I'd watched her turn in circles until she was dizzy, and when she stumbled, I caught her elbow to steady her. For just a second, she was close enough that I could count the freckles across her nose, close enough that all I would have had to do was lean down and— But I didn't. I never do.</p><p>The tree is bare now, winter-thin branches reaching toward a sky that's gone gray at the edges. Storm clouds gathering, the way they always seem to when something important is about to happen. Or maybe that's just in movies. Maybe real life doesn't give you that kind of poetry.</p><p>I check my phone again. 5:52 p.m. Eight more minutes. I'm early, like always. I find a spot on the bench across from our usual meeting place, close enough to see the jacaranda tree but not quite at our bench yet. Celise runs on what she calls \"fashionably late time,\" which usually means five to ten minutes after we agree to meet. It's one of the few things about her that drives me crazy, but I've learned to factor it into my expectations.</p><p>My hands are shaking, and I shove them deeper into my hoodie pocket, feeling the worn softness of the fabric against my knuckles. There's a hole forming near the left seam, small enough that I can poke my thumb through it. Celise noticed it last week, traced the edge with her fingertip. \"You need a new sweatshirt,\" she'd said, but she was smiling when she said it. \"This one's falling apart.\" \"I like this one,\" I'd told her, which was true. I like it because it was what I was wearing the first time she hugged me— really hugged me, not just the quick side-squeeze she gives everyone. I was seventeen and heartbroken over some girl I barely even remember now, and Celise had just sat beside me on the curb outside school without saying a word. Then, after a long silence, she'd wrapped her arms around me, warm and sure, like she could hold all the cracked pieces together if she just held tight enough. She didn't let go until I stopped shaking. And maybe that was the moment I realized: it was always her.</p><p>I see the bench across the street—our bench—waiting beneath the jacaranda tree. I check my phone again. 5:58 p.m. Two more minutes. That's when I see her.</p><p>Celise appears around the corner, walking toward our meeting spot from the other direction. Even from across the street, I can see the burgundy sweater, the cream cardigan. My heart races—this is it. This is when I finally tell her everything. I stand up, raising my hand in a small wave. She sees me and waves back, that radiant smile breaking across her face. I shift the strap of my backpack on my shoulder, fingers brushing the zipper. The letter is still there.</p><p>Time to be brave. Time to cross this street and change everything.</p><p>I step off the curb into the crosswalk. And then—</p><p>Headlights. Brakes.</p><p>The world tilts.</p>",
            date: "2025-08-16",
            tags: ["romance", "friends to lovers", "contemporary", "healing", "young adult"],
            downloadUrl: "https://mega.nz/file/qcEgGITC#VIH-ZY87Y6UBwDXHWRTOs8UcgjdiPrkjr4tgPqyNg0A",
            wordCount: 33428,
            readingTime: 180
        },

        {
            id: "novel-001",
            title: "When the Sun Fades",
            category: "novels",
            spineDesign: 'gilded-corners',
            excerpt: "A story of quiet love and slow goodbyes. Kael has a secret he's keeping from his best friend, Rhea: he's terminally ill. As he tries to protect her from the truth, Rhea senses him slipping away, forcing a confrontation that unearths buried feelings and the painful, beautiful reality of loving someone you're destined to lose.",
            content: "<h1>When the Sun Fades</h1>\n<p class=\"chapter-meta\">Chapter 1: A Normal Morning</p>\n<p>The alarm went off at 6:45 AM.</p>\n<p>Kael stared at the ceiling for two minutes before moving. Not out of sleepiness-he'd been awake since 5-but because if he got up too quickly, the dizziness might hit before he even made it to the bathroom. He sat up slowly. One hand braced against the bed frame, the other pressed against the quiet throb in his side. It always started there. A reminder. Today would be fine. Or at least manageable.</p>\n<p>The house was silent except for the soft murmur of the coffee machine downstairs. His mom had already left for her shift at the clinic. She always did. There were sticky notes by the fridge. \"Left you breakfast!\" \"Don't forget your meds!\" Little things. Normal things. He ignored the notes. Ate half a slice of toast. Didn't take the pills. Not yet. They made him drowsy at school.</p>\n<p>The walk to campus wasn't far-fifteen minutes of cracked sidewalks and sleepy traffic-but Kael took the longer way. Past the park. Past the bookstore Rhea loved, the one that always smelled like dust and minty old pages. He didn't go in. Just paused. Then kept walking.</p>\n<p>Rhea was waiting outside the school gate, pretending not to be waiting. She had that look on her face-arms crossed, kicking at the gravel, earbuds in but not playing anything. The moment she saw him, her entire expression changed. Subtle, but warm. The kind of smile that makes it harder to breathe for reasons the lungs don't explain.</p>\n<p>\"You're late,\" she said.</p>\n<p>\"You're early.\"</p>\n<p>\"Shut up.\"</p>\n<p>She fell into step beside him like she always did. Their shoulders didn't touch, but the space between them felt intentionally small-like a promise they didn't know how to word yet. The air smelled like chalk dust and damp earth. Spring trying to claw its way through.</p>\n<p>\"How's your morning?\" she asked.</p>\n<p>He shrugged. \"Same.\"</p>\n<p>\"You eat?\"</p>\n<p>\"Toast.\"</p>\n<p>\"Gross.\"</p>\n<p>\"You asked.\"</p>\n<p>She laughed, and he hated how much he loved the sound of it.</p>\n<p>In class, he sat behind her. Close enough to hear her humming when she thought no one could. Far enough that if he started coughing, she wouldn't look back too fast. He didn't want her to look concerned. Not yet. Not ever, if he could help it.</p>\n<p>His notebook had more scribbles than notes. He was supposed to be writing down formulas, but instead he was sketching the curve of her neck from memory. The way she looked when she tilted her head at something confusing. The sun caught her hair just right today. He wished it didn't.</p>\n<p>Because it made her look too perfect.</p>\n<p>And because he didn't know how many more perfect days he had left.</p>",
            date: "2025-08-16",
            tags: ["romance", "young adult", "contemporary", "sad", "illness", "friends to lovers"],
            downloadUrl: "https://mega.nz/file/TAUhBZRR#C1GK38OPnPaSG4NaMH3vCBuoImS51jcTq6nNedbsDho",
            wordCount: 21000,
            readingTime: 84,
        }
    ],
    



    notes: 
    [
        {
            id: 'note-000',
            title: 'I tried.',
            category: 'notes',
            spineDesign: 'embossed-star-atlas',
            excerpt: 'How learning to truly see the world around us can transform our writing and our understanding of human nature.',
            content: `<h1>I Tried</h1><p class="note-meta">Fragments of Me • 2025</p><p>I tried to be the safe place. The soft landing. The quiet in someone else’s storm. The light in the dark even when it meant dimming my own so they wouldn’t feel blind.<br><br>I tried to believe that if I was kind enough, patient enough, constant enough… they would finally stay. Finally choose me. Finally see that behind every “I’m fine” was a silent scream. Behind every understanding smile was a heart begging to be heard. Behind every act of love was a quiet prayer that maybe, this time, I wouldn’t be forgotten.<br><br>I carried the weight of people who never asked me how heavy it was. I was the calm for people who never noticed how often I drowned in their storms. I stayed strong for people who never realized how much it hurt to pretend.<br><br>And still, I gave. And gave. And gave until all I had left were faint echoes of myself: exhausted, stretched too thin, convinced that love was sacrifice, mistaking abandonment for a test of loyalty.<br><br>Even when they pushed me away, broke the parts of me they once claimed to cherish, and left without explanation, I stayed. Hands outstretched. Hoping they’d turn around. Hoping love would be enough to anchor someone who never wanted to stay.<br><br>But it wasn’t. And maybe it never could be.<br><br>Because I tried to build a home in people who only ever saw me as a temporary shelter. And now I’m standing in the ruins of what I thought was love, realizing the only person I never gave enough to… was me.<br><br>And in the quiet that follows the collapse, I am left picking up the pieces: fragments of dreams I once shared, versions of myself I no longer recognize, love that was real to me even if it was never enough for them.<br><br>I’m learning, slowly, painfully, that healing isn’t always loud or poetic. Sometimes it’s messy. Sometimes it’s just waking up and choosing not to call, not to chase, not to explain your worth to someone who never tried to understand it.<br><br>I’m learning that love should never feel like begging. That affection shouldn’t come with conditions. That being needed is not the same as being loved.<br><br>And maybe for once I’m done trying for everyone else. Maybe it’s finally time to try for me.</p>`,
            date: '2024-02-10',
            tags: ['writing', 'realization', 'life-lessons'],
            wordCount: 394,
            readingTime: 2,
        },

        {
            id: 'note-001',
            title: 'Choosing Through the Pain',
            category: 'notes',
            spineDesign: 'tartan-plaid',
            excerpt: 'A raw reflection on how love persists, even through pain and brokenness.',
            content: `<h1>Choosing Through the Pain</h1><p class="quote-meta">Heart in the Ache • 2025</p><blockquote class="quote-block"><p>"Love is when nothing feels okay, when everything is breaking you apart, yet your heart still chooses the same person over and over again."</p><cite>— Me</cite></blockquote><br><p>We often imagine love as comfort, safety, and ease. But sometimes, love reveals itself most in the ache—the choice to keep holding onto someone even when it hurts. It's not about perfection or peace, but about the persistence of the heart against all odds.</p><blockquote class="quote-block"><p>"Love is not just about joy. Sometimes, it's the stubborn longing for the same soul, even in the middle of the storm."</p><cite>— Me</cite></blockquote><br><p>This kind of love is not weakness. It is the quiet strength to care beyond pain, to choose beyond reason. It’s messy, imperfect, and deeply human. And though it can break you, it also proves the depth of what it means to truly feel alive.</p>`,
            date: '2025-08-22',
            tags: ['love', 'pain', 'loyalty', 'reflection', 'emotions'],
            wordCount: 295,
            readingTime: 1,
        },

        {

            id: 'note-002',
            title: 'On Choosing Without Being Chosen',
            category: 'notes',
            spineDesign: 'gilded-chevron',
            excerpt: 'Sometimes the bravest love is the one that expects nothing in return.',
            content: '<h1>On Choosing Without Being Chosen</h1><p class="note-meta">Quiet Courage • 2025</p><p>Love does not always come with a return.<br><br>Sometimes, it is about giving fully to someone<br>who may never give the same in return.<br><br>It is about honesty.<br>Confessing is not about winning their heart.<br>It is about freeing yourself from silence.<br>Silence leaves questions that never end.<br>It leaves you asking what ifs every day.<br><br>Even when it hurts.<br>Even when it feels one-sided.<br>There is dignity in loving openly.<br><br>Love is measured not by what you receive.<br>It is measured by what you are willing to give.<br>It is measured by the courage to stay vulnerable<br>even when the outcome is uncertain.<br><br>This is the quiet strength of choosing without being chosen.</p>',
            date: '2025-08-22',
            tags: ['love', 'truth', 'reflection', 'pain', 'courage', 'heartache', 'quiet-strength'],
            wordCount: 92,
            readingTime: 1,
        },
        
        {
            id:'note-003',
            title:'Loyalty Shown in Boundaries',
            category:'notes',
            spineDesign:'checkered-gilded-corners',
            excerpt:'Loyalty is not complicated—it is shown in daily decisions, boundaries, and respect.',
            content:`<h1>Loyalty Shown in Boundaries</h1><p class="quote-meta">Trust and Boundaries • 2025</p><p>A loyal woman is shown by what she allows and what she refuses.</p><br><p>She does not spend her free time entertaining men who hope for her attention.<br>She does not excuse questionable behavior by calling them brothers.<br>She does not leave you to feel uneasy and then blame you for being insecure.</p><br><p>When a woman respects the relationship, she sets clear boundaries.<br>She tells her friends what is off limits.<br>She chooses time with you over time with men who wait for your mistakes.<br>She values peace in the relationship more than validation from outside.</p><br><p>This is not about control. It is about respect.<br>You should not compete with men who only stay close because they want a chance.<br>You should not question if she is protecting what you both built.<br>You should feel safe knowing she does not keep backup options.</p><br><p>Loyalty is not complicated.<br>It is shown in daily decisions.<br>It is choosing your partner even when no one is watching.<br>It is protecting trust before it breaks.</p>`,
            date:'2025-08-31',
            tags: ['loyalty', 'relationships', 'respect', 'boundaries', 'love', 'trust', 'reflection'],
            wordCount:220,
            readingTime:2
        },

        {
            id: 'note-004',
            title: 'The Heart That Refuses to Stop',
            category: 'notes',
            spineDesign: 'leather-bound',
            excerpt: 'Sometimes love is not about waiting to receive—it is about refusing to stop giving.',
            content: "<h1>The Heart That Refuses to Stop</h1><p class=\"quote-meta\">The Cost of Loving Alone • 2025</p><p>Waiting for love that may never come is not strength, it is choice.</p><br><p>You know she does not love you back.</p><p>You know her silence is an answer.</p><p>Still, you stay.</p><p>Still, you wait.</p><br><p>The question is not why you wait.</p><p>The question is what you are waiting for.</p><br><p>It is not hope that keeps you there.</p><p>It is not the belief she will change her mind.</p><p>It is something deeper.</p><br><p>You did not fall in love with someone who could return your love.</p><p>You fell in love with someone who needed to be loved.</p><br><p>That is why you remain,</p><p>even when it hurts,</p><p>even when nothing changes.</p><br><p>Because your heart is not waiting for her love.</p><p>Because Your heart is simply refusing to stop giving yours.</p>",
            date: '2025-08-30',
            tags: ['love', 'unrequited', 'patience', 'heart', 'reflections', 'loyalty', 'quiet-heartache', 'emotional-truth'],           
            wordCount: 148,
            readingTime: 2
        },

        {
            id: 'note-005',
            title: 'A Love at the Wrong Time',
            category: 'notes',
            spineDesign: 'stitched-leather',
            excerpt: 'Meeting the love of your life at the wrong time—learning to carry it silently.',
            content: "<h1>A Love at the Wrong Time</h1><p class=\"quote-meta\">Silent Forever • 2025</p><div class='note-block'><p>I never thought I would find someone who could make me feel this way.</p><br><p>Before, I believed my future was only me.</p><p>Living my life, happy, chasing my dreams,</p><p>no tears, no one disturbing my peace.</p><p>Love was never something I planned to build my life around.</p><br><p>But then the universe shifted its path,</p><p>and I met you.</p><br><p>You were different.</p><p>With you, everything felt real.</p><p>It felt like home.</p><br><p>For the first time in my life, I wanted something permanent.</p><p>Not a fling, not a temporary escape.</p><p>I wanted to imagine a home with someone.</p><p>I saw us growing old, gray hair, wrinkled faces,</p><p>arguing about silly things, laughing at them later,</p><p>cooking together, holding each other when life was heavy.</p><br><p>With you, I was ready to stay.</p><p>With you, I wasn’t afraid of commitment.</p><p>I wanted it.</p><p>Because I saw a life worth building a life with you.</p><br><p>But life has its cruel way of reminding us that not everything lasts.</p><p>We had to let each other go.</p><p>And it broke something inside me that I don’t know will ever heal.</p><br><p>Because how do you accept it?</p><p>How do you accept meeting the love of your life at the wrong time?</p><p>How do you move on from the person who made you believe in forever?</p><br><p>I hate that I never said what I should have said.</p><p>And I know you don’t know this,</p><p>but a part of me will always love you in silence.</p><p>Even now, I still see your smile,</p><p>and in my head, I still hear you saying, “I love you.”</p><br><p>Maybe in another lifetime,</p><p>we would have had our happy ending.</p><p>But not in this one.</p><br><p>So I’ll carry you with me always.</p><p>You’ll stay in my chest every time I see something that reminds me of us.</p><p>And the mark close to my heart will remind me too</p><p>that you were the one who made me want to settle,</p><p>even if forever was never ours.</p></div>",
            date: '2025-08-31',
            tags: ['love', 'heartache', 'loss', 'reflection', 'unrequited', 'quiet-heartache', 'emotional-truth'],
            wordCount: 360,
            readingTime: 3
        },

        {
            id:'note-006',
            title:'Love That Arrives Slowly',
            category:'notes',
            spineDesign:'crosshatch',
            excerpt:'Some love does not arrive suddenly. It comes after you heal and build yourself.',
            content:`<h1>Love That Arrives Slowly</h1><p class="quote-meta">Love comes after you heal • 2025</p><p>Some love does not arrive suddenly.<br><br>It does not come to fill a gap or rescue you.<br>It comes after you build yourself.<br>After long nights alone.<br>After facing your wounds.<br>After learning to heal.<br>It comes when you are whole enough to walk beside someone who is also whole.<br><br>This love is not driven by need or desperation.<br>It comes when you stop chasing temporary affection.<br>It comes when you start wanting something steady.<br>It comes when you know yourself.<br>Your values.<br>Your needs.<br>Your worth.<br>It comes when you meet someone who respects you and matches your pace.<br><br>It stays through ordinary days.<br>Through fading excitement.<br>Through reality.<br>It does not complete you.<br>It walks with you.<br>It does not rescue you.<br>It accompanies you.<br><br>This love arrives when you are ready.<br>Ready to give and receive without conditions.<br>Ready to hold a hand out of choice, not need.<br>It asks nothing from you except presence, honesty, and a willingness to grow together.</p>`,
            date:'2025-08-31',
            tags:['love','self-growth','relationships'],
            wordCount:174,
            readingTime:2
        },

        {
            id:'note-007',
            title:'Love That Matches',
            category:'notes',
            spineDesign:'gilded',
            excerpt:'Sometimes I wonder when someone will love me the way I love them.',
            content:`<h1>Love That Matches</h1><p class="quote-meta">Waiting for a love that matches yours • 2025</p><p>Sometimes I wonder when someone will love me the way I love them.<br><br>The kind of love that is not half effort.<br>Not seasonal.<br>Whole and real.<br><br>When I love, I give everything.<br>My time, my patience, my attention.<br>Even the smallest details that I know will make the other person happy.<br><br>But it often feels like I am the one who runs out.<br>While they do not give the same depth in return.<br><br>It is hard sometimes.<br>You question if loving too much is a mistake.<br><br>But I do not want to lessen the way I love just because others cannot match it.<br>I still want to believe that someone will come.<br>Someone who will receive my love and give it back fully.<br>Without fear.<br>Without holding back.<br><br>Even when I feel tired or sad, I choose to hope.<br>Because I believe that somewhere, there is someone who will see my value.<br>Someone who will love me, not to fill a space in their life,<br>but to choose me every day in every way.</p>`,
            date:'2025-08-31',
            tags:['love','self-worth','relationships'],
            wordCount:192,
            readingTime:2
        },

        {
            id:'note-008',
            title:'Unloving the Imagined',
            category:'notes',
            spineDesign:'gilded-corners',
            excerpt:'How to let go of love that existed only in your mind.',
            content:`<h1>Unloving the Imagined</h1><p class="quote-meta">Letting go of love that never was • 2025</p><p>How do you unlove something that never existed?<br><br>No hands were held.<br>No lips were kissed.<br>No promises made.<br>No vows broken.<br><br>Yet the longing remains.<br>The ache is real.<br>The memories exist only in your mind.<br><br>You smiled.<br>You moved.<br>You existed,<br>but not with me.<br>I built a love from dreams I could not name.<br>I imagined moments that never happened.<br>I gave feelings that were never returned.<br><br>It was not betrayal.<br>It was not blindness.<br>It was timing, misaligned.<br>It was two lives moving in different rhythms.<br><br>Still, the absence leaves weight.<br>The mind holds onto what the heart created.<br>It remembers what could have been.<br>It aches for what never was.<br><br>Unloving is not forgetting.<br>It is choosing to stop building something in your mind.<br>It is letting the imagined go.<br>It is accepting that some love exists only as a lesson, not a story.<br><br>You cannot hold it.<br>You cannot touch it.<br>You cannot demand it.<br>But you can honor it by moving forward,<br>by keeping the memory without letting it control your life.<br><br>How do you unlove what was never yours?<br>You do not force it.<br>You let it fade with time.<br>You replace imagination with reality.<br>You allow yourself to be ready for the love that is real.</p>`,
            date:'2025-08-31',
            tags:['love','letting-go','self-growth'],
            wordCount:233,
            readingTime:2
        },

        {
            id:'note-009',
            title:'The Value of Risk',
            category:'notes',
            spineDesign:'gilded-checkers',
            excerpt:'Taking the risk is the only way to end uncertainty and know the answer.',
            content:`<h1>The Value of Risk</h1><p class="quote-meta">Facing fear to know the answer • 2025</p><p>Some people say, "Take the risk or lose the chance."<br><br>But taking a risk is not always simple.<br>Sometimes you want it, but fear holds you back.<br>Fear of consequences.<br>Fear of change.<br>Fear of rejection.<br>Fear that the outcome could alter everything.<br><br>If you never make a move, nothing will change.<br>The chance will remain a question mark.<br>The feelings you hide will remain unanswered.<br><br>Every risk carries the possibility of pain.<br>Not everyone will feel the same.<br>Not everyone will respond the way you hope.<br>You must be ready to face that.<br><br>Still, fear should not keep you from trying.<br>Taking the risk is the only way to end the uncertainty.<br>It is the only way to know if the chance was real.<br>It is the only way to avoid looking back and asking "what if."<br><br>Life moves forward only when you act.<br>Regret is heavier than failure.<br>The cost of doing nothing is greater than the cost of trying.<br><br>Sometimes the risk is not about winning.<br>It is about knowing.<br>It is about freeing yourself from silence.<br>It is about choosing to live fully, even when the outcome is uncertain.</p>`,
            date:'2025-08-31',
            tags:['risk','fear','self-growth'],
            wordCount:228,
            readingTime:2
        },

        {
            id:'note-010',
            title:'Effort and Boundaries',
            category:'notes',
            spineDesign:'gilded',
            excerpt:'Persistence requires reciprocity and respect in love.',
            content:`<h1>Effort and Boundaries</h1><p class="quote-meta">Love needs mutual respect • 2025</p><p>Men do not give up easily on someone they truly want.<br><br>But effort without acknowledgment wears a heart down.<br>If she continues to act like your actions mean nothing,<br>even patience has a limit.<br><br>Trying becomes painful when it is one-sided.<br>Every gift of time, attention, and care asks for respect in return.<br>When that respect is absent, exhaustion sets in.<br><br>Persistence is not weakness.<br>It is a measure of commitment.<br>But commitment without reciprocity cannot last forever.<br><br>At some point, trying stops.<br>The heart steps back to protect itself.<br>Love without boundaries becomes emptiness.<br>True connection requires choice, effort, and mutual respect.</p>`,
            date:'2025-08-31',
            tags:['love','boundaries','relationships'],
            wordCount:152,
            readingTime:1
        },

        {
            id:'note-011',
            title:'Lessons From Love',
            category:'notes',
            spineDesign:'art-deco',
            excerpt:'Love is not enough without respect, effort, and honesty.',
            content:`<h1>Lessons From Love</h1><p class="quote-meta">Letting go to find yourself • 2025</p><p>Love taught me lessons I never expected.<br>I thought giving everything was enough, but it left me empty.<br>I thought holding on proved my strength, but it only showed how afraid I was to let go.<br>I thought patience could heal what was broken, but patience without effort from both sides is only waiting for something that will never come.<br><br>There were days I blamed myself.<br>I wondered if I was too much, or not enough.<br>I replayed every word, every silence, trying to see where I went wrong.<br>But I’ve learned that sometimes it is not about being enough.<br>It is about loving someone who was never ready to meet you where you were.<br><br>I realized that real love does not ask you to shrink.<br>It does not make you question your worth.<br>It does not take your best and return only silence.<br>Real love shows up. It chooses you without hesitation.<br>And when it is right, you will not have to beg to be seen.<br><br>The hardest part was not the goodbye.<br>It was waking up to the truth that I had been carrying the weight of us alone.<br>That kind of love does not last, no matter how hard you fight for it.<br>Because love without respect, without effort, without honesty, is not love at all.<br><br>So if you are here, still hurting, still holding on, I want you to know this.<br>Letting go is not weakness.<br>It is choosing yourself after forgetting who you were.<br>It is giving yourself the chance to heal, to rebuild, to open space for the love that will not make you question your place in it.<br><br>One day you will look back and understand.<br>You did not lose when you walked away.<br>You found yourself again.<br>And that is the kind of love that will stay.</p>`,
            date:'2025-08-31',
            tags:['love','healing','self-worth'],
            wordCount:365,
            readingTime:2
        },

        {
            id:'note-012',
            title:'Silent Tears',
            category:'notes',
            spineDesign:'leather-bound',
            excerpt:'Hiding pain does not mean you are alone in it.',
            content:`<h1>Silent Tears</h1><p class="quote-meta">Your pain deserves to be heard • 2025</p><p>Nothing hurts more than wiping your own tears,<br>knowing you cannot tell anyone why you are crying.<br>So you hide it, pretend you are fine, and keep moving.<br>But inside, the silence grows heavier.<br><br>I know what it feels like to carry pain alone.<br>To smile so no one asks questions, to stay quiet so no one worries.<br>You convince yourself it is easier this way,<br>but the truth is, the weight only gets harder to bear.<br><br>You deserve to be heard.<br>You deserve someone who asks how you are and stays long enough to hear the real answer.<br>You deserve a love that does not make you feel like your sadness is a burden.<br><br>Please do not let the silence convince you you are alone.<br>Even on the nights when no one sees your tears,<br>your pain is real, and so is your strength for surviving it.<br>One day, you will meet people who do not let you cry in secret.<br>People who will sit with you in the dark until the light comes back.</p>`,
            date:'2025-08-31',
            tags:['healing','loneliness','strength'],
            wordCount:193,
            readingTime:1
        },

        {
            id:'note-013',
            title:'The Risk of Love',
            category:'notes',
            spineDesign:'stitched-leather',
            excerpt:'Opening your heart means risking both pain and joy.',
            content:`<h1>The Risk of Love</h1><p class="quote-meta">Bravery lives in vulnerability • 2025</p><p>In love, you have to be prepared to get hurt.<br>Not because every person will break you,<br>but because opening your heart always carries risk.<br><br>You give, you trust, you hope.<br>You let someone in, you allow yourself to be seen.<br>And with that comes the chance of disappointment,<br>the chance of losing someone you thought would stay forever.<br><br>But pain does not mean the love was meaningless.<br>It means you were brave enough to feel.<br>It means you had the courage to try,<br>to believe in something bigger than yourself.<br><br>Real love is never perfect.<br><br>There will be arguments, silence, mistakes, and moments of doubt.<br>Love will test your patience and expose your fears.<br>But love is not about avoiding pain.<br>It is about finding someone who makes the struggle worth it.<br><br>So yes, prepare for the hurt.<br>Prepare for the days when you will cry, when you will question, when you will feel tired.<br>But also prepare for the joy.<br>Prepare for the nights that feel like home,<br>for the laughter that makes the pain smaller,<br>for the kind of comfort that reminds you why you opened your heart in the first place.<br><br>Because love is not safe, but it is worth it.<br>And sometimes, even the hurt is proof that you lived,<br>that you cared deeply, and that your heart was strong enough to risk breaking.</p>`,
            date:'2025-08-31',
            tags:['love','courage','vulnerability'],
            wordCount:249,
            readingTime:1
        },

        {
            id:'note-014',
            title:'The Meaning of Courtship',
            category:'notes',
            spineDesign:'ornamental-frame',
            excerpt:'Courtship is not a game—it is a responsibility.',
            content:`<h1>The Meaning of Courtship</h1><p class="quote-meta">Love with purpose, not for attention • 2025</p><p>Don’t court a girl if you don’t understand the meaning of courtship.<br>Courtship is not a game. It’s not something you do because you are bored or because you want temporary attention.<br>When you decide to pursue a girl, you are choosing to step into her life.<br>You are choosing to hold her heart in your hands.<br>The purpose of courting her is to make her fall in love with you, right?<br>Then stop asking if you have a chance.<br>Because if she says “none,” are you really going to walk away that easily?<br><br>You need to ask yourself: what is your purpose?<br>Why are you courting her?<br>Is it because you see her as your future, or are you just passing time until someone else comes along?<br>Courtship should not be shallow.<br>It should not be selfish.<br>If you cannot see yourself standing beside her in the long run, why even begin?<br>Why give her hope, only to take it away later?<br><br>When you enter her life, you carry a responsibility.<br>You are not just another person texting her “good morning” or asking if she has eaten.<br>You are trying to build something.<br>You are trying to show her that she matters.<br>If you are not ready to stay, then do not start.<br>Because once you step into her world, you will leave footprints behind.<br>And if you decide to walk away, those marks can hurt more than you realize.<br><br>If you really love the girl, risk it all.<br>Pursue her with your whole heart.<br>Love her even without the assurance that she will choose you back.<br>Prove to her that you are willing to wait.<br>Waiting is not weakness.<br>Waiting is respect.<br>It shows that you are not rushing her heart but giving her space to grow and to see who you really are.<br>That is the bare minimum after choosing to enter her life and shake her peace.<br><br>Because that is what a real man does.<br>He stays.<br>He proves his love not with empty words but with consistent actions.<br>He does not run when things get hard.<br>He does not leave when answers are unclear.<br>He stays and proves that his purpose was never just to be “a part” of her life but to be her partner in it.<br><br>Be a man for her, not a boy.<br>A boy courts for attention.<br>A man courts for a future.</p>`,
            date:'2025-08-31',
            tags:['love','commitment','respect'],
            wordCount:444,
            readingTime:2
        }



    ],
    



    quotes: [
        

        {
            id: 'quote-000',
            title: 'On Life and Realization',
            category: 'quotes',
            spineDesign: 'decorated-vellum',
            excerpt: 'The tragedy of life is realizing too late that you already had what you were searching for.',
            content: `<h1>On Life and Realization</h1><p class="quote-meta">Collected Thoughts • 2025</p><blockquote class="quote-block"><p>"The tragedy of life is that you don’t notice the small moments until they’re already gone—and by then, you realize they were the very things you were searching for all along."</p><cite>— The Fool</cite></blockquote>`,
            date: '2024-02-12',
            tags: ['life', 'realization', 'time', 'truth'],
            wordCount: 53,
            readingTime: 1,
        },
        {
            id: 'quote-001',
            title: 'The Silent Drift',
            category: 'quotes',
            spineDesign: 'geometric-weave',
            excerpt: 'The cruelest goodbyes aren’t loud—they happen when someone slowly stops choosing you.',
            content: `<h1>The Silent Drift</h1><p class="quote-meta">Quiet Heartache • 2025</p><blockquote class="quote-block"><p>"The cruelest goodbye is silence—the moment someone you love stops choosing you without ever saying a word."</p><cite>— Me</cite></blockquote>`,
            date: '2025-08-22',
            tags: ['love', 'loss', 'goodbye', 'reality', 'pain'],
            wordCount: 42,
            readingTime: 1,
        },
        {
            id: 'quote-002',
            title: 'Love, Even When It Hurts',
            category: 'quotes',
            spineDesign: 'double-band-classic',
            excerpt: 'Love is choosing the same person, even when it breaks you.',
            content: `<h1>Love, Even When It Hurts</h1><p class="quote-meta">Collected Thoughts • 2025</p><blockquote class="quote-block"><p>"Love is when everything inside you is breaking, yet your heart still chooses the same person—again and again."</p><cite>— The Fool</cite></blockquote>`,
            date: '2025-08-22',
            tags: ['love', 'pain', 'loyalty', 'truth'],
            wordCount: 41,
            readingTime: 1,
        },
        {
            id: 'quote-003',
            title: 'The Unfair Truth',
            category: 'quotes',
            spineDesign: 'luxury-foil',
            excerpt: 'A harsh reflection on the imbalance of love and the pain of giving more than you ever receive.',
            content: `<h1>The Unfair Truth</h1><p class="quote-meta">Collected Thoughts • 2025</p><blockquote class="quote-block"><p>"The cruel reality of love is that you can give someone your whole world, and to them, you might still be just a passing moment."</p><cite>— The Fool</cite></blockquote><p>Love is rarely fair. It’s not measured by how much you give or how deeply you care. Sometimes, the person you’d burn for wouldn’t even light a match for you. And that realization cuts deeper than heartbreak—it makes you question your own worth.</p><blockquote class="quote-block"><p>"Loving someone doesn’t guarantee they’ll choose you. Sometimes, all it guarantees is the pain of watching them choose someone else."</p><cite>— The Fool</cite></blockquote><p>That’s the weight of reality: love is not always mutual, not always lasting, not always enough. And yet, we love anyway—because even in its cruelty, we can’t deny its pull. It hurts to realize, but maybe that’s what makes love both beautiful and tragic.</p>`,
            date: '2025-08-22',
            tags: ['love', 'truth', 'pain', 'reality', 'reflection'],
            wordCount: 310,
            readingTime: 1
        },

        {
            id:'quote-004',
            title:'Time and Attention',
            category:'quotes',
            spineDesign:'art-deco',
            excerpt:'Some people talk to you in their free time and some people free their time to talk to you.',
            content:`<h1>Time and Attention</h1><p class="quote-meta">Knowing who truly values you • 2025</p><blockquote class="quote-block"><p>Some people talk to you in <u>their free time</u> and some people <u>free their time</u> to talk to you.<br>Make sure you know the difference.</p><blockquote class="quote-block">`,
            date:'2025-08-31',
            tags:['relationships','attention','self-worth'],
            wordCount:24,
            readingTime:1
        }


         
    ]
};

/// Update 8/22/2025

/**
 * Developer utility to log available spine designs.
 * This helps keep the header comment in this file up-to-date.
 * It will only run if the libraryApp is available on the window.
 */
document.addEventListener('DOMContentLoaded', () => {
    if (window.libraryApp && typeof window.libraryApp.getSpineStyles === 'function') {
        const styles = window.libraryApp.getSpineStyles({}).map(s => s.name).sort();
        console.log("Available Spine Designs:", styles);
    }
});
