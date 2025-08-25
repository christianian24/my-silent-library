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
 * New Spine Designs
        Here is the full list of all 23 available spine designs you can now use:

        classic
        banded
        gilded
        striped
        faded
        split
        central-band
        diagonal-stripes
        polka-dots
        embossed
        gradient-fade
        double-band
        checkered
        thin-stripes
        gradient-split
        top-fade
        checkered-small
        horizontal-stripes
        center-glow
        corner-fade
        multi-band
        side-fade
        diamond
        
 * - excerpt: Short description or preview
 * - content: Full content (can be HTML or markdown-like text)
 * - date: Publication date
 * - tags: Array of tags for filtering
 * - downloadUrl: URL to downloadable file (optional)
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
            spineDesign: "gilded",
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
            spineDesign: 'gradient-fade',
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
            spineDesign: 'split',
            excerpt: 'How learning to truly see the world around us can transform our writing and our understanding of human nature.',
            content: `<h1>I tried.</h1><p class="quote-meta">Fragments of Me • 2025</p><p>I tried to be the safe place. The soft landing. The quiet in someone else’s storm. The light in the dark—even when it meant dimming my own so they wouldn’t feel blind.</p><p>I tried to believe that if I was kind enough, patient enough, constant enough… they would finally stay. Finally choose me. Finally see that behind every “I’m fine” was a silent scream. Behind every understanding smile was a heart begging to be heard. Behind every act of love was a quiet prayer that maybe, this time, I wouldn’t be forgotten.</p><p>I carried the weight of people who never asked me how heavy it was. I was the calm for people who never noticed how often I drowned in their storms. I stayed strong for people who never realized how much it hurt to pretend.</p><p>And still, I gave. And gave. And gave—until all I had left were faint echoes of myself: exhausted, stretched too thin, convinced that love was sacrifice, mistaking abandonment for a test of loyalty.</p><p>Even when they pushed me away, broke the parts of me they once claimed to cherish, and left without explanation, I stayed. Hands outstretched. Hoping they’d turn around. Hoping love would be enough to anchor someone who never wanted to stay.</p><p>But it wasn’t. And maybe it never could be.</p><p>Because I tried to build a home in people who only ever saw me as a temporary shelter. And now I’m standing in the ruins of what I thought was love, realizing the only person I never gave enough to… was me.</p><p>And in the quiet that follows the collapse, I am left picking up the pieces: fragments of dreams I once shared, versions of myself I no longer recognize, love that was real to me even if it was never enough for them.</p><p>I’m learning, slowly, painfully, that healing isn’t always loud or poetic. Sometimes it’s messy. Sometimes it’s just waking up and choosing not to call, not to chase, not to explain your worth to someone who never tried to understand it.</p><p>I’m learning that love should never feel like begging. That affection shouldn’t come with conditions. That being needed is not the same as being loved.</p><p>And maybe—for once—I’m done trying for everyone else. Maybe it’s finally time to try for me.</p>`,
            date: '2024-02-10',
            tags: ['writing', 'realization', 'life-lessons'],
            wordCount: 800,
            readingTime: 7,
        },

        {
            id: 'note-001',
            title: 'Choosing Through the Pain',
            category: 'notes',
            spineDesign: 'embossed',
            excerpt: 'A raw reflection on how love persists, even through pain and brokenness.',
            content: `<h1>Choosing Through the Pain</h1><p class="quote-meta">Heart in the Ache • 2025</p><blockquote class="quote-block"><p>"Love is when nothing feels okay, when everything is breaking you apart, yet your heart still chooses the same person over and over again."</p><cite>— Me</cite></blockquote><p>We often imagine love as comfort, safety, and ease. But sometimes, love reveals itself most in the ache—the choice to keep holding onto someone even when it hurts. It's not about perfection or peace, but about the persistence of the heart against all odds.</p><blockquote class="quote-block"><p>"Love is not just about joy. Sometimes, it's the stubborn longing for the same soul, even in the middle of the storm."</p><cite>— Me</cite></blockquote><p>This kind of love is not weakness. It is the quiet strength to care beyond pain, to choose beyond reason. It’s messy, imperfect, and deeply human. And though it can break you, it also proves the depth of what it means to truly feel alive.</p>`,
            date: '2025-08-22',
            tags: ['love', 'pain', 'loyalty', 'reflection', 'emotions'],
            wordCount: 295,
            readingTime: 1,
        },


        {

            id: 'note-002',
            title: 'On Choosing Without Being Chosen',
            category: 'notes',
            spineDesign: 'gradient-fade',
            excerpt: 'Sometimes the bravest love is the one that expects nothing in return.',
            content: `<h1>On Choosing Without Being Chosen</h1><p class="note-meta">Quiet Courage • 2025</p><div class="note-block"><p>Love doesn’t always mean being chosen. Sometimes, it’s about choosing someone fully, knowing they may never choose you back.</p><p>It’s about honesty—confessing not to win, but to free yourself from silence. Because silence leaves you with endless <em>what ifs</em>.</p><p>Even when it hurts, even when it feels one-sided, there’s dignity in loving openly. Love has never been about what you receive—it’s about what you’re willing to give.</p></div>`,
            date: '2025-08-22',
            tags: ['love', 'truth', 'reflection', 'pain'],
            wordCount: 92,
            readingTime: 1,
        },
        
        {
            id: 'note-003',
            title: 'The Choice That Never Came',
            category: 'notes',
            spineDesign: 'checkered-small',
            excerpt: 'The ache of realizing you were never the choice, only the option left behind.',
            content: `<h1>The Choice That Never Came</h1><p class="quote-meta">Reflections on Love • 2025</p>The hardest part isn’t that you left—it’s knowing I was never chosen in the first place. You loved me in moments, in fragments, but when it came to choosing, it was never me. And no matter how much I gave, I was always the almost, the what-if, the one you walked past on your way to someone else.`,
            date: '2025-08-22',
            tags: ['love', 'choice', 'loss', 'pain', 'truth'],
            wordCount: 83,
            readingTime: 1
        }

    ],
    



    quotes: [
        

        {
            id: 'quote-000',
            title: 'On Life and Realization',
            category: 'quotes',
            spineDesign: 'gilded',
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
            spineDesign: 'diagonal-stripes',
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
            spineDesign: 'double-band',
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
            spineDesign: 'diamond',
            excerpt: 'A harsh reflection on the imbalance of love and the pain of giving more than you ever receive.',
            content: `<h1>The Unfair Truth</h1><p class="quote-meta">Collected Thoughts • 2025</p><blockquote class="quote-block"><p>"The cruel reality of love is that you can give someone your whole world, and to them, you might still be just a passing moment."</p><cite>— The Fool</cite></blockquote><p>Love is rarely fair. It’s not measured by how much you give or how deeply you care. Sometimes, the person you’d burn for wouldn’t even light a match for you. And that realization cuts deeper than heartbreak—it makes you question your own worth.</p><blockquote class="quote-block"><p>"Loving someone doesn’t guarantee they’ll choose you. Sometimes, all it guarantees is the pain of watching them choose someone else."</p><cite>— The Fool</cite></blockquote><p>That’s the weight of reality: love is not always mutual, not always lasting, not always enough. And yet, we love anyway—because even in its cruelty, we can’t deny its pull. It hurts to realize, but maybe that’s what makes love both beautiful and tragic.</p>`,
            date: '2025-08-22',
            tags: ['love', 'truth', 'pain', 'reality', 'reflection'],
            wordCount: 310,
            readingTime: 1
        }
         
    ]
};

/// Update 8/22/2025