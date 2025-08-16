/**
 * Content Data for My Silent Library
 * This file contains all the writings, novels, and notes.
 * To add new content, simply add a new object to the appropriate array.
 * 
 * Structure:
 * - id: Unique identifier
 * - title: Title of the work
 * - category: Type of content (novels, notes, quotes)
 * - excerpt: Short description or preview
 * - content: Full content (can be HTML or markdown-like text)
 * - date: Publication date
 * - tags: Array of tags for filtering
 * - downloadUrl: URL to downloadable file (optional)
 * - wordCount: Approximate word count
 * - readingTime: Estimated reading time in minutes
 */

const LIBRARY_CONTENT = {
    novels: [
        {
            id: 'novel-001',
            title: 'The Silent Echo',
            category: 'novels',
            excerpt: 'A haunting tale of memory and loss, set against the backdrop of a forgotten coastal town where the past refuses to stay buried.',
            content: `
                <h1>The Silent Echo</h1>
                <p class="chapter-meta">Chapter 1: The Arrival</p>
                
                <p>The rain fell like forgotten memories, each drop carrying the weight of things left unsaid. Sarah stepped off the bus into the small coastal town of Haven's Rest, her suitcase heavy with more than just clothes.</p>
                
                <p>Twenty years had passed since she'd last seen these weathered buildings, these cobblestone streets that wound their way down to the sea. The town looked smaller now, or perhaps she had grown larger in the world beyond its borders.</p>
                
                <p>The old inn where she'd booked a room stood at the end of Main Street, its whitewashed walls now a dull gray from years of salt air and neglect. The sign above the door still read "The Mariner's Rest," though the paint had faded to a ghostly whisper.</p>
                
                <p>Sarah pulled her coat tighter around her shoulders and stepped inside. The interior was warm, lit by a crackling fire in the stone hearth. The smell of wood smoke and something sweet—perhaps cinnamon—filled the air, and for a moment, she was twelve years old again, sitting at her grandmother's kitchen table.</p>
                
                <p>"Welcome to the Mariner's Rest," said a voice from behind the counter. Sarah turned to see a woman in her sixties, her silver hair pulled back in a neat bun, her eyes bright with curiosity. "I'm Eleanor. You must be Sarah."</p>
                
                <p>"Yes, that's me," Sarah replied, setting her suitcase down. "I have a reservation for the week."</p>
                
                <p>"Of course. Room 3, upstairs on the right. It has the best view of the harbor." Eleanor smiled, but there was something in her expression—a recognition, perhaps, or a memory of her own. "You know, you look familiar. Have you been here before?"</p>
                
                <p>Sarah felt her heart skip a beat. "A long time ago," she said carefully. "When I was a child."</p>
                
                <p>"Ah, that explains it then. The town has a way of remembering its visitors, even the little ones." Eleanor handed her a key attached to a brass tag. "Breakfast is served from seven to nine. The harbor view is quite spectacular at sunrise."</p>
                
                <p>Sarah took the key and climbed the narrow staircase to her room. The door creaked open to reveal a cozy space with a four-poster bed, a small writing desk by the window, and a view that took her breath away.</p>
                
                <p>Through the rain-streaked glass, she could see the harbor stretching out before her, the fishing boats bobbing gently on the choppy water. Beyond that, the ocean stretched to the horizon, gray and restless under the storm clouds.</p>
                
                <p>She set her suitcase down and sat at the desk, pulling out a small notebook. The first page was already filled with her neat handwriting, a list of questions she'd been asking herself for two decades:</p>
                
                <ul>
                    <li>Why did my grandmother leave this town so suddenly?</li>
                    <li>What happened to the lighthouse keeper?</li>
                    <li>Why do I dream of the sound of waves when I'm nowhere near the ocean?</li>
                    <li>What secrets does this town hold?</li>
                </ul>
                
                <p>Sarah closed the notebook and looked out at the harbor again. Somewhere out there, in the depths of the ocean or the recesses of memory, lay the answers she'd come to find.</p>
                
                <p>The rain continued to fall, and somewhere in the distance, she thought she heard the mournful cry of a foghorn—or was it just the echo of her own unanswered questions?</p>
            `,
            date: '2024-01-15',
            tags: ['mystery', 'coastal', 'memory', 'family'],
            downloadUrl: 'content/novels/the-silent-echo.pdf',
            wordCount: 2500,
            readingTime: 10
        },
        {
            id: 'novel-002',
            title: 'Whispers in the Wind',
            category: 'novels',
            excerpt: 'A young woman discovers she can hear the thoughts of others, leading her on a journey of self-discovery and moral complexity.',
            content: `
                <h1>Whispers in the Wind</h1>
                <p class="chapter-meta">Chapter 1: The Gift</p>
                
                <p>Emma had always been different. Not in the way that made her stand out in a crowd, but in the way that made her feel like she was living in a world slightly askew from everyone else's.</p>
                
                <p>It started when she was eight years old. She was sitting in her third-grade classroom, listening to Mrs. Thompson explain the water cycle, when suddenly she heard something that made her blood run cold.</p>
                
                <p>"I hope Emma doesn't get called on. She never knows the answers."</p>
                
                <p>The voice was clear as day, but when Emma looked around, no one had spoken. Mrs. Thompson was still pointing at the diagram on the board, her mouth moving but the words not quite matching what Emma was hearing.</p>
                
                <p>Then she realized—the voice belonged to Mrs. Thompson. But it wasn't what she was saying out loud. It was what she was thinking.</p>
                
                <p>Emma's heart pounded in her chest. She looked around the classroom, and suddenly she was bombarded with thoughts from every direction:</p>
                
                <p>"I'm so hungry. I hope Mom packed me a good lunch today."</p>
                <p>"Why does Tommy keep looking at me? Does he like me?"</p>
                <p>"I can't wait to get home and play my new video game."</p>
                <p>"I hope Dad doesn't drink too much tonight."</p>
                
                <p>The last thought made Emma's stomach clench. She turned to see who had thought it, and her eyes met with Jake, the quiet boy who sat two rows behind her. His face was expressionless, but his thoughts were filled with worry and fear.</p>
                
                <p>Emma wanted to help him, to tell him that everything would be okay, but how could she explain that she knew what he was thinking? How could she explain any of this?</p>
                
                <p>That night, Emma lay in bed, staring at the ceiling, trying to make sense of what had happened. She could still hear the thoughts of her parents downstairs, though they were muffled by distance and the floor between them.</p>
                
                <p>Her mother was thinking about work, about a presentation she had to give tomorrow. Her father was thinking about the bills, about how they were going to make ends meet this month.</p>
                
                <p>But there was something else, something darker that Emma couldn't quite make out. It was like trying to hear a conversation through a thick wall—the words were there, but they were distorted, twisted into something she couldn't understand.</p>
                
                <p>Emma closed her eyes and tried to sleep, but the thoughts kept coming. They were like whispers in the wind, impossible to ignore, impossible to escape.</p>
                
                <p>She had a gift, she realized. Or maybe it was a curse. Either way, her life would never be the same again.</p>
            `,
            date: '2024-02-03',
            tags: ['fantasy', 'psychic', 'coming-of-age', 'moral-dilemma'],
            downloadUrl: 'content/novels/whispers-in-the-wind.pdf',
            wordCount: 1800,
            readingTime: 7
        }
    ],
    
    notes: [
        {
            id: 'note-001',
            title: 'On the Nature of Creativity',
            category: 'notes',
            excerpt: 'Personal reflections on what drives creative expression and how to nurture the creative spirit in an increasingly digital world.',
            content: `
                <h1>On the Nature of Creativity</h1>
                <p class="note-meta">Personal Reflection • January 2024</p>
                
                <p>Creativity is not a finite resource that can be depleted, but rather a muscle that grows stronger with use. Yet, in our modern world of instant gratification and endless distractions, we often find ourselves struggling to access that wellspring of imagination that once flowed so freely.</p>
                
                <h2>The Creative Process</h2>
                
                <p>I've found that creativity follows a rhythm, much like the seasons. There are times of abundance, when ideas flow like water from a spring, and times of drought, when the well seems to have run dry. The key is to recognize that both states are natural and necessary.</p>
                
                <p>During periods of creative abundance, I try to capture as much as possible. I keep notebooks everywhere—by my bed, in my bag, on my desk. Ideas come at the most unexpected moments, and if I don't write them down immediately, they vanish like morning mist.</p>
                
                <p>But it's during the droughts that the real work happens. This is when I must dig deeper, when I must trust that the creative well hasn't dried up, but has simply moved underground. It's during these times that I return to the fundamentals: reading widely, observing the world around me, and most importantly, showing up to work even when inspiration seems absent.</p>
                
                <h2>The Digital Dilemma</h2>
                
                <p>Technology has made it easier than ever to create and share our work, but it has also introduced new challenges. The constant stream of information, the pressure to produce content quickly, the temptation to compare our work to others—all of these can stifle creativity rather than enhance it.</p>
                
                <p>I've learned to set boundaries with technology. I designate specific times for checking social media and email, and I try to spend at least an hour each day completely disconnected from screens. This is when I do my best thinking, when my mind is free to wander and make unexpected connections.</p>
                
                <h2>Nurturing the Creative Spirit</h2>
                
                <p>Creativity thrives in environments that are both structured and flexible. I maintain a daily writing practice, but I allow myself the freedom to write about anything that interests me, whether it's related to my current project or not.</p>
                
                <p>I also make time for activities that have nothing to do with writing but everything to do with living a rich, full life. Walking in nature, cooking meals from scratch, having conversations with friends, reading books outside my usual genres—all of these experiences feed the creative well.</p>
                
                <p>Perhaps most importantly, I've learned to be patient with myself. Creativity cannot be forced, and sometimes the best thing I can do is step away from my work and trust that the ideas will come when they're ready.</p>
                
                <h2>Conclusion</h2>
                
                <p>Creativity is not a talent that some people have and others don't. It's a way of seeing the world, of being open to possibility, of allowing ourselves to play and experiment and make mistakes. It's about finding our own unique voice and having the courage to share it with the world.</p>
                
                <p>In the end, creativity is not about producing perfect work—it's about staying curious, staying open, and staying true to the stories that only we can tell.</p>
            `,
            date: '2024-01-20',
            tags: ['creativity', 'writing', 'reflection', 'digital-age'],
            downloadUrl: 'content/notes/on-creativity.pdf',
            wordCount: 1200,
            readingTime: 5
        },
        {
            id: 'note-002',
            title: 'The Art of Observation',
            category: 'notes',
            excerpt: 'How learning to truly see the world around us can transform our writing and our understanding of human nature.',
            content: `
                <h1>The Art of Observation</h1>
                <p class="note-meta">Writing Technique • February 2024</p>
                
                <p>Good writing begins with good observation. The ability to see the world clearly, to notice the small details that others might miss, to understand the subtle nuances of human behavior—these are the foundation stones upon which compelling stories are built.</p>
                
                <h2>Learning to See</h2>
                
                <p>Most of us go through life with our eyes half-closed. We see what we expect to see, what we've been conditioned to see, rather than what's actually there. To become better writers, we must first become better observers.</p>
                
                <p>I've developed a practice I call "the observation exercise." I choose a public place—a coffee shop, a park, a subway station—and I sit quietly for thirty minutes, doing nothing but watching and listening. I don't take notes, I don't try to analyze what I'm seeing, I simply observe.</p>
                
                <p>What I've discovered is that when I truly open my eyes, the world becomes infinitely more interesting. I notice the way a woman absently twists her wedding ring while talking on the phone, the way a child's face lights up when they see a dog, the way an elderly man carefully folds his newspaper before standing up.</p>
                
                <h2>The Details Matter</h2>
                
                <p>It's the small details that bring characters to life, that make scenes feel real and immediate. The way someone clears their throat before speaking, the way they adjust their glasses, the way they hold their coffee cup—these are the things that reveal character without exposition.</p>
                
                <p>I keep a notebook specifically for character details. When I see something interesting, I write it down immediately. I don't worry about how I might use it later; I simply collect these observations like a magpie collecting shiny objects.</p>
                
                <p>Later, when I'm writing, I can draw from this collection to create characters who feel authentic and three-dimensional. A character who always touches their face when they're nervous, who has a particular way of walking, who uses certain phrases repeatedly—these details make them memorable and real.</p>
                
                <h2>Beyond the Visual</h2>
                
                <p>Good observation involves all the senses, not just sight. The way a room smells, the texture of fabric, the sound of footsteps on different surfaces, the taste of food—all of these sensory details can enrich our writing and make our worlds more immersive.</p>
                
                <p>I practice sensory observation by focusing on one sense at a time. I might spend an afternoon paying attention only to sounds, or I might focus on textures and how things feel to the touch. This practice has made me more aware of the sensory richness of the world around me.</p>
                
                <h2>Human Nature</h2>
                
                <p>Perhaps the most valuable thing I've learned from observation is how to read people. Not in a manipulative way, but in a way that helps me understand human nature and create more believable characters.</p>
                
                <p>I've learned to recognize the signs of nervousness, of confidence, of sadness, of joy. I've learned to understand how people communicate not just with words, but with their bodies, their expressions, their gestures.</p>
                
                <p>This understanding has made my dialogue more natural, my character interactions more realistic, and my stories more compelling.</p>
                
                <h2>Conclusion</h2>
                
                <p>Observation is a skill that can be developed and refined. It requires patience, attention, and a willingness to slow down and truly see the world around us. But the rewards are immense.</p>
                
                <p>When we learn to observe well, we not only become better writers, we become more present in our own lives. We notice the beauty in ordinary moments, we understand people better, and we develop a deeper appreciation for the complexity and wonder of the world.</p>
                
                <p>And isn't that what good writing is ultimately about—helping others see the world more clearly, more deeply, more beautifully?</p>
            `,
            date: '2024-02-10',
            tags: ['observation', 'writing', 'character-development', 'sensory-details'],
            downloadUrl: 'content/notes/art-of-observation.pdf',
            wordCount: 1500,
            readingTime: 6
        },
        {
            id: 'note-003',
            title: 'I tried.',
            category: 'notes',
            excerpt: 'How learning to truly see the world around us can transform our writing and our understanding of human nature.',
            content: `
                <h1>I tried.</h1>
                <p>I tried to be the safe place. The soft landing. The quiet in someone else’s storm. The light in the dark—even when it meant dimming my own so they wouldn’t feel blind.</p>

                <p>I tried to believe that if I was kind enough, patient enough, constant enough… they would finally stay. Finally choose me. Finally see that behind every “I’m fine” was a silent scream. Behind every understanding smile was a heart begging to be heard. Behind every act of love was a quiet prayer that maybe, this time, I wouldn’t be forgotten.</p>

                <p>I carried the weight of people who never asked me how heavy it was. I was the calm for people who never noticed how often I drowned in their storms. I stayed strong for people who never realized how much it hurt to pretend.</p>

                <p>And still, I gave. And gave. And gave—until all I had left were faint echoes of myself: exhausted, stretched too thin, convinced that love was sacrifice, mistaking abandonment for a test of loyalty.</p>

                <p>Even when they pushed me away, broke the parts of me they once claimed to cherish, and left without explanation, I stayed. Hands outstretched. Hoping they’d turn around. Hoping love would be enough to anchor someone who never wanted to stay.</p>

                <p>But it wasn’t. And maybe it never could be.</p>

                <p>Because I tried to build a home in people who only ever saw me as a temporary shelter. And now I’m standing in the ruins of what I thought was love, realizing the only person I never gave enough to… was me.</p>

                <p>And in the quiet that follows the collapse, I am left picking up the pieces: fragments of dreams I once shared, versions of myself I no longer recognize, love that was real to me even if it was never enough for them.</p>

                <p>I’m learning, slowly, painfully, that healing isn’t always loud or poetic. Sometimes it’s messy. Sometimes it’s just waking up and choosing not to call, not to chase, not to explain your worth to someone who never tried to understand it.</p>

                <p>I’m learning that love should never feel like begging. That affection shouldn’t come with conditions. That being needed is not the same as being loved.</p>

                <p>And maybe—for once—I’m done trying for everyone else. Maybe it’s finally time to try for me.</p>
            `,
            date: '2024-02-10',
            tags: ['writing', 'realization', 'life-lessons'],
            wordCount: 800,
            readingTime: 7
        }
    ],
    
    quotes: [
        {
            id: 'quote-001',
            title: 'On Writing and Life',
            category: 'quotes',
            excerpt: 'A collection of thoughts and insights about the writing life, creativity, and the human condition.',
            content: `
                <h1>On Writing and Life</h1>
                <p class="quote-meta">Collected Thoughts • 2024</p>
                
                <blockquote class="quote-block">
                    <p>"The first draft is just you telling yourself the story."</p>
                    <cite>— Terry Pratchett</cite>
                </blockquote>
                
                <p>This simple truth has freed me from the paralysis of perfectionism more times than I can count. The first draft isn't meant to be perfect—it's meant to exist. It's the raw material from which something beautiful can be crafted.</p>
                
                <blockquote class="quote-block">
                    <p>"Write what you know, but write what you want to know about."</p>
                    <cite>— Me</cite>
                </blockquote>
                
                <p>I've always believed that writing should be both a reflection of our experiences and an exploration of our curiosities. We write from what we know, but we also write to discover what we don't know, to explore the boundaries of our understanding.</p>
                
                <blockquote class="quote-block">
                    <p>"The difference between the almost right word and the right word is really a large matter—'tis the difference between the lightning bug and the lightning."</p>
                    <cite>— Mark Twain</cite>
                </blockquote>
                
                <p>Word choice matters. Every word we choose either brings our meaning closer or pushes it further away. This is why revision is so important—it's not just about fixing mistakes, it's about finding the exact right words to express our thoughts.</p>
                
                <blockquote class="quote-block">
                    <p>"We write to taste life twice, in the moment and in retrospection."</p>
                    <cite>— Anaïs Nin</cite>
                </blockquote>
                
                <p>Writing allows us to experience life more deeply. We live it once as it happens, and then we live it again as we write about it. This double experience gives us a richer understanding of our lives and the world around us.</p>
                
                <blockquote class="quote-block">
                    <p>"The scariest moment is always just before you start."</p>
                    <cite>— Stephen King</cite>
                </blockquote>
                
                <p>Every writer knows this truth. The blank page is terrifying because it represents infinite possibility and infinite potential for failure. But once we begin, once we put the first word on the page, the fear begins to recede.</p>
                
                <blockquote class="quote-block">
                    <p>"You can't wait for inspiration. You have to go after it with a club."</p>
                    <cite>— Jack London</cite>
                </blockquote>
                
                <p>Inspiration is not a passive thing that happens to us—it's something we must actively pursue. We must show up to work every day, whether we feel inspired or not, and trust that inspiration will find us there.</p>
                
                <h2>Personal Reflections</h2>
                
                <p>These quotes have guided me through my own writing journey, but I've also learned some lessons of my own:</p>
                
                <ul>
                    <li><strong>Write regularly:</strong> Even if it's just a few sentences, write something every day. Consistency is more important than quantity.</li>
                    <li><strong>Read widely:</strong> The best writing teachers are other writers. Read everything you can get your hands on.</li>
                    <li><strong>Trust your voice:</strong> No one else can tell your stories the way you can. Don't try to sound like someone else.</li>
                    <li><strong>Embrace failure:</strong> Every failed story, every rejected manuscript, every awkward sentence is a step toward becoming a better writer.</li>
                    <li><strong>Write for yourself first:</strong> If you don't love what you're writing, no one else will either.</li>
                </ul>
                
                <p>Writing is not just a craft or a profession—it's a way of being in the world. It's about paying attention, asking questions, and finding meaning in the chaos of human experience.</p>
                
                <p>And perhaps most importantly, it's about having the courage to share our stories with the world, knowing that they might not be perfect, but they are ours, and that makes them worth telling.</p>
            `,
            date: '2024-01-25',
            tags: ['writing', 'inspiration', 'creativity', 'life-lessons'],
            downloadUrl: 'content/quotes/writing-and-life.pdf',
            wordCount: 800,
            readingTime: 3
        }
    ]
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LIBRARY_CONTENT;
}
