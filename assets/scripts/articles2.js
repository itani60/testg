// Articles2 loader - renders Articles & Guides on articles2.html

function getArticlesData() {
    return [
        {
            id: 'smartphone-camera-evolution',
            title: 'Smartphone Camera Evolution: From Megapixels to AI Photography',
            excerpt: 'How smartphone cameras have evolved from simple megapixel counts to sophisticated AI-powered photography systems that rival professional cameras.',
            category: 'Tech News',
            type: 'News',
            image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop&crop=center',
            date: '2024-01-18',
            fullContent: `
                <h2>Smartphone Camera Revolution</h2>
                <p>The evolution of smartphone cameras represents one of the most significant technological advances in mobile devices. From basic megapixel counts to AI-powered photography, we've witnessed a complete transformation.</p>
                <h3>Early Days: Megapixel Race</h3>
                <p>In the early 2000s, smartphone cameras were measured primarily by megapixel count. Manufacturers competed to offer the highest resolution, often at the expense of image quality and low-light performance.</p>
                <h3>Modern Camera Systems</h3>
                <ul>
                    <li>Multi-lens setups with specialized functions</li>
                    <li>Computational photography and AI enhancement</li>
                    <li>Advanced image stabilization</li>
                    <li>Professional-grade video recording</li>
                </ul>
                <h3>AI-Powered Photography</h3>
                <p>Today's smartphones use artificial intelligence to enhance photos automatically, adjust settings in real-time, and create professional-looking results with minimal user input.</p>
                <h3>Future Trends</h3>
                <p>Looking ahead, we can expect even more advanced AI features, improved low-light performance, and integration with augmented reality applications.</p>
            `
        },
        {
            id: '5g-network-impact',
            title: '5G Network Impact: Transforming Connectivity and IoT',
            excerpt: 'Understanding how 5G networks are revolutionizing mobile connectivity, enabling new IoT applications, and creating opportunities for smart cities and autonomous vehicles.',
            category: 'Tech News',
            type: 'Analysis',
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center',
            date: '2024-01-15',
            fullContent: `
                <h2>5G Network Revolution</h2>
                <p>5G technology represents a fundamental shift in wireless communication, offering unprecedented speed, low latency, and connectivity capacity that enables entirely new applications and services.</p>
                <h3>Key 5G Advantages</h3>
                <p><strong>Speed:</strong> Up to 100 times faster than 4G networks</p>
                <p><strong>Latency:</strong> Ultra-low latency under 1 millisecond</p>
                <p><strong>Capacity:</strong> Support for millions of connected devices</p>
                <p><strong>Reliability:</strong> 99.999% network availability</p>
                <h3>IoT and Smart Cities</h3>
                <p>5G enables massive IoT deployments with smart sensors, connected vehicles, and intelligent infrastructure that can communicate in real-time.</p>
                <h3>Autonomous Vehicles</h3>
                <p>Self-driving cars require ultra-reliable, low-latency communication for safety-critical applications, making 5G essential for autonomous vehicle deployment.</p>
                <h3>Healthcare Applications</h3>
                <p>Remote surgery, telemedicine, and real-time patient monitoring become possible with 5G's low latency and high reliability.</p>
                <h3>Challenges and Considerations</h3>
                <p>While 5G offers tremendous potential, challenges include infrastructure costs, spectrum allocation, and ensuring equitable access across all communities.</p>
            `
        },
        {
            id: 'quantum-computing-breakthrough',
            title: 'Quantum Computing Breakthrough: The Next Computing Revolution',
            excerpt: 'Exploring recent advances in quantum computing, from IBM and Google to practical applications in cryptography, drug discovery, and optimization problems.',
            category: 'Innovation',
            type: 'News',
            image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop&crop=center',
            date: '2024-01-12',
            fullContent: `
                <h2>Quantum Computing Revolution</h2>
                <p>Quantum computing represents a paradigm shift from classical computing, leveraging quantum mechanical phenomena to solve problems that are intractable for traditional computers.</p>
                <h3>How Quantum Computing Works</h3>
                <p>Unlike classical bits that exist in states of 0 or 1, quantum bits (qubits) can exist in superposition, allowing quantum computers to process vast amounts of information simultaneously.</p>
                <h3>Recent Breakthroughs</h3>
                <ul>
                    <li>IBM's 1000+ qubit processors</li>
                    <li>Google's quantum supremacy demonstrations</li>
                    <li>Error correction improvements</li>
                    <li>Commercial quantum cloud services</li>
                </ul>
                <h3>Practical Applications</h3>
                <p><strong>Cryptography:</strong> Breaking current encryption methods and developing quantum-resistant security</p>
                <p><strong>Drug Discovery:</strong> Simulating molecular interactions for pharmaceutical research</p>
                <p><strong>Optimization:</strong> Solving complex logistics and scheduling problems</p>
                <p><strong>Financial Modeling:</strong> Risk analysis and portfolio optimization</p>
                <h3>Current Limitations</h3>
                <p>Quantum computers are still in early stages, facing challenges with error rates, scalability, and the need for extreme cooling conditions.</p>
                <h3>Future Outlook</h3>
                <p>As quantum computing matures, we can expect revolutionary advances in multiple fields, though widespread adoption may take another decade.</p>
            `
        },
        {
            id: 'metaverse-reality-check',
            title: 'Metaverse Reality Check: Current State and Future Potential',
            excerpt: 'A critical analysis of the metaverse concept, examining current implementations, challenges, and realistic timelines for widespread adoption.',
            category: 'Tech Trends',
            type: 'Analysis',
            image: 'https://images.unsplash.com/photo-1592478411213-6153e4c4a0b0?w=400&h=300&fit=crop&crop=center',
            date: '2024-01-10',
            fullContent: `
                <h2>Metaverse: Hype vs Reality</h2>
                <p>The metaverse concept has captured imaginations and investment dollars, but the reality of creating a fully immersive virtual world is more complex than initial hype suggested.</p>
                <h3>Current Metaverse Implementations</h3>
                <p><strong>Virtual Reality Platforms:</strong> Meta's Horizon Worlds, VRChat, and Rec Room</p>
                <p><strong>Gaming Worlds:</strong> Fortnite, Roblox, and Minecraft as proto-metaverse experiences</p>
                <p><strong>Enterprise Solutions:</strong> Microsoft Mesh and enterprise VR applications</p>
                <h3>Technical Challenges</h3>
                <ul>
                    <li>Interoperability between platforms</li>
                    <li>Realistic avatars and environments</li>
                    <li>Latency and bandwidth requirements</li>
                    <li>Hardware accessibility and comfort</li>
                </ul>
                <h3>Business and Social Considerations</h3>
                <p>Privacy concerns, digital ownership rights, and the digital divide present significant challenges to metaverse adoption.</p>
                <h3>Realistic Timeline</h3>
                <p>While some metaverse elements are already here, a fully realized metaverse may take 10-15 years to develop, requiring advances in multiple technologies.</p>
                <h3>Investment and Development</h3>
                <p>Major tech companies continue investing billions in metaverse development, but success depends on solving fundamental technical and social challenges.</p>
            `
        },
        {
            id: 'cybersecurity-threats-2024',
            title: 'Cybersecurity Threats 2024: New Challenges in Digital Security',
            excerpt: 'An overview of emerging cybersecurity threats, from AI-powered attacks to supply chain vulnerabilities, and how organizations can protect themselves.',
            category: 'Tech News',
            type: 'Tutorial',
            image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop&crop=center',
            date: '2024-01-08',
            fullContent: `
                <h2>Cybersecurity Landscape 2024</h2>
                <p>As technology advances, so do the sophistication and frequency of cyber threats. Understanding current threats is essential for maintaining digital security.</p>
                <h3>Emerging Threat Vectors</h3>
                <p><strong>AI-Powered Attacks:</strong> Machine learning used to create more convincing phishing and social engineering attacks</p>
                <p><strong>Supply Chain Attacks:</strong> Targeting software dependencies and third-party vendors</p>
                <p><strong>IoT Vulnerabilities:</strong> Connected devices as entry points for network infiltration</p>
                <p><strong>Ransomware Evolution:</strong> More targeted and sophisticated ransomware campaigns</p>
                <h3>Protection Strategies</h3>
                <ul>
                    <li>Multi-factor authentication implementation</li>
                    <li>Regular security awareness training</li>
                    <li>Zero-trust security architecture</li>
                    <li>Automated threat detection and response</li>
                </ul>
                <h3>Industry-Specific Threats</h3>
                <p>Healthcare, financial services, and critical infrastructure face unique challenges requiring specialized security approaches.</p>
                <h3>Future Security Trends</h3>
                <p>Quantum-resistant cryptography, AI-powered defense systems, and improved security by design will shape the future of cybersecurity.</p>
            `
        },
        {
            id: 'sustainable-tech-solutions',
            title: 'Sustainable Technology: Green Solutions for a Digital Future',
            excerpt: 'Exploring how technology companies are addressing environmental challenges through sustainable design, renewable energy, and circular economy principles.',
            category: 'Tech Trends',
            type: 'Analysis',
            image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop&crop=center',
            date: '2024-01-05',
            fullContent: `
                <h2>Sustainable Technology Revolution</h2>
                <p>As environmental concerns grow, technology companies are increasingly focusing on sustainable solutions, from energy-efficient devices to carbon-neutral data centers.</p>
                <h3>Green Computing Initiatives</h3>
                <p><strong>Energy Efficiency:</strong> ARM processors and low-power designs reducing device energy consumption</p>
                <p><strong>Renewable Energy:</strong> Data centers powered by solar, wind, and other renewable sources</p>
                <p><strong>Circular Design:</strong> Modular devices designed for repair and recycling</p>
                <h3>Carbon Footprint Reduction</h3>
                <ul>
                    <li>Cloud computing optimization</li>
                    <li>Remote work technology reducing commuting</li>
                    <li>Smart grid and energy management systems</li>
                    <li>Electric vehicle charging infrastructure</li>
                </ul>
                <h3>E-Waste Management</h3>
                <p>Companies are implementing take-back programs, using recycled materials, and designing products for longer lifespans.</p>
                <h3>Industry Leadership</h3>
                <p>Apple, Google, Microsoft, and other tech giants have committed to carbon neutrality and are investing in sustainable technology solutions.</p>
                <h3>Consumer Impact</h3>
                <p>Consumers can support sustainable technology through conscious purchasing decisions and proper device disposal practices.</p>
            `
        },
        {
            id: 'edge-computing-future',
            title: 'Edge Computing: Bringing Intelligence Closer to Users',
            excerpt: 'Understanding edge computing\'s role in reducing latency, improving privacy, and enabling real-time applications in IoT, autonomous vehicles, and smart cities.',
            category: 'Tech Trends',
            type: 'Tutorial',
            image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop&crop=center',
            date: '2024-01-03',
            fullContent: `
                <h2>Edge Computing Revolution</h2>
                <p>Edge computing moves data processing closer to where it's generated, reducing latency and enabling real-time applications that weren't possible with traditional cloud computing.</p>
                <h3>What is Edge Computing?</h3>
                <p>Edge computing processes data at or near the source of data generation, rather than sending it to centralized cloud servers. This reduces latency and bandwidth usage.</p>
                <h3>Key Applications</h3>
                <p><strong>Autonomous Vehicles:</strong> Real-time decision making for safety-critical applications</p>
                <p><strong>Industrial IoT:</strong> Predictive maintenance and quality control in manufacturing</p>
                <p><strong>Smart Cities:</strong> Traffic management and emergency response systems</p>
                <p><strong>Healthcare:</strong> Real-time patient monitoring and diagnostics</p>
                <h3>Benefits of Edge Computing</h3>
                <ul>
                    <li>Reduced latency for real-time applications</li>
                    <li>Improved privacy and data security</li>
                    <li>Reduced bandwidth costs</li>
                    <li>Better reliability and offline capability</li>
                </ul>
                <h3>Challenges and Considerations</h3>
                <p>Edge computing requires distributed infrastructure, security considerations, and management complexity across multiple locations.</p>
                <h3>Future Outlook</h3>
                <p>As 5G networks expand and IoT devices proliferate, edge computing will become increasingly important for enabling next-generation applications.</p>
            `
        },
        {
            id: 'blockchain-beyond-crypto',
            title: 'Blockchain Beyond Cryptocurrency: Real-World Applications',
            excerpt: 'Exploring practical blockchain applications in supply chain management, digital identity, smart contracts, and decentralized finance beyond Bitcoin.',
            category: 'Innovation',
            type: 'Analysis',
            image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop&crop=center',
            date: '2024-01-01',
            fullContent: `
                <h2>Blockchain Technology Applications</h2>
                <p>While blockchain gained fame through cryptocurrency, its potential extends far beyond digital currencies to revolutionize various industries through decentralized, transparent, and secure systems.</p>
                <h3>Supply Chain Management</h3>
                <p>Blockchain provides end-to-end visibility in supply chains, enabling tracking of products from origin to consumer while ensuring authenticity and reducing fraud.</p>
                <h3>Digital Identity</h3>
                <p>Self-sovereign identity systems allow individuals to control their personal data while providing secure, verifiable credentials for various services.</p>
                <h3>Smart Contracts</h3>
                <ul>
                    <li>Automated contract execution without intermediaries</li>
                    <li>Real estate transactions and property management</li>
                    <li>Insurance claims processing</li>
                    <li>Intellectual property rights management</li>
                </ul>
                <h3>Decentralized Finance (DeFi)</h3>
                <p>DeFi applications provide financial services without traditional banks, including lending, borrowing, and trading through smart contracts.</p>
                <h3>Healthcare and Medical Records</h3>
                <p>Secure, interoperable medical records that patients can control while ensuring healthcare providers have access to necessary information.</p>
                <h3>Challenges and Limitations</h3>
                <p>Scalability, energy consumption, regulatory uncertainty, and user adoption remain significant challenges for blockchain implementation.</p>
                <h3>Future Potential</h3>
                <p>As technology matures and regulations clarify, blockchain could transform numerous industries by providing trust, transparency, and efficiency.</p>
            `
        },
        {
            id: 'augmented-reality-applications',
            title: 'Augmented Reality Applications: Beyond Gaming and Entertainment',
            excerpt: 'Discovering practical AR applications in education, healthcare, manufacturing, and retail, and how AR is becoming an essential business tool.',
            category: 'Innovation',
            type: 'Tutorial',
            image: 'https://images.unsplash.com/photo-1592478411213-6153e4c4a0b0?w=400&h=300&fit=crop&crop=center',
            date: '2023-12-28',
            fullContent: `
                <h2>Augmented Reality in Business</h2>
                <p>Augmented Reality is moving beyond entertainment to become a powerful tool for businesses, offering immersive experiences that enhance productivity and customer engagement.</p>
                <h3>Education and Training</h3>
                <p>AR enables interactive learning experiences, from medical training simulations to hands-on technical education that would be impossible or dangerous in real life.</p>
                <h3>Healthcare Applications</h3>
                <ul>
                    <li>Surgical planning and guidance</li>
                    <li>Medical training and education</li>
                    <li>Patient rehabilitation and therapy</li>
                    <li>Anatomy visualization for students</li>
                </ul>
                <h3>Manufacturing and Maintenance</h3>
                <p>AR provides real-time guidance for complex assembly tasks, maintenance procedures, and quality control, reducing errors and improving efficiency.</p>
                <h3>Retail and E-commerce</h3>
                <p>Virtual try-on experiences, furniture placement, and product visualization help customers make informed purchasing decisions.</p>
                <h3>Architecture and Construction</h3>
                <p>AR allows architects and builders to visualize projects in real environments, improving planning and client communication.</p>
                <h3>Future Developments</h3>
                <p>As AR hardware becomes more accessible and software more sophisticated, we can expect widespread adoption across industries.</p>
            `
        },
        {
            id: 'tech-ethics-responsibility',
            title: 'Technology Ethics: Responsible Innovation in the Digital Age',
            excerpt: 'Examining the ethical implications of emerging technologies, from AI bias to privacy concerns, and the responsibility of tech companies in shaping our digital future.',
            category: 'Tech Trends',
            type: 'Opinion',
            image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop&crop=center',
            date: '2023-12-25',
            fullContent: `
                <h2>Ethics in Technology Development</h2>
                <p>As technology becomes more powerful and pervasive, the ethical implications of innovation become increasingly important. Tech companies must balance innovation with responsibility.</p>
                <h3>AI and Algorithmic Bias</h3>
                <p>Artificial intelligence systems can perpetuate and amplify human biases, leading to unfair outcomes in hiring, lending, and criminal justice. Addressing bias requires diverse teams and careful algorithm design.</p>
                <h3>Privacy and Data Protection</h3>
                <p>With increasing data collection, companies must prioritize user privacy and implement robust data protection measures that go beyond legal compliance.</p>
                <h3>Digital Divide and Accessibility</h3>
                <ul>
                    <li>Ensuring technology benefits all communities</li>
                    <li>Designing accessible interfaces for people with disabilities</li>
                    <li>Addressing economic barriers to technology access</li>
                    <li>Supporting digital literacy and education</li>
                </ul>
                <h3>Environmental Impact</h3>
                <p>Technology companies must consider the environmental cost of their products and services, from manufacturing to data center operations.</p>
                <h3>Responsible Innovation Framework</h3>
                <p>Companies should implement ethical review processes, diverse teams, and stakeholder engagement to ensure technology serves humanity's best interests.</p>
                <h3>Regulatory and Self-Regulation</h3>
                <p>While government regulation is necessary, companies should also implement self-regulatory measures and industry standards for ethical technology development.</p>
                <h3>Future Considerations</h3>
                <p>As technologies like AI, biotechnology, and quantum computing advance, ethical considerations will become even more critical for responsible innovation.</p>
            `
        }
    ];
}

function formatDate(iso) {
    try { return new Date(iso).toLocaleDateString(); } catch { return iso; }
}

function renderArticles2(list) {
    const grid = document.getElementById('articlesGrid');
    if (!grid) return;
    if (!list || list.length === 0) {
        grid.innerHTML = '<div class="text-center text-muted py-5">No articles found.</div>';
        return;
    }
    grid.innerHTML = list.map(a => `
        <article class="article-card">
            <img class="article-thumb" src="${a.image}" alt="${a.title}" loading="lazy" />
            <div class="article-body">
                <h3 class="article-title">${a.title}</h3>
                <div class="article-meta">${formatDate(a.date)} · ${a.type} · ${a.category}</div>
                <p class="article-excerpt">${a.excerpt}</p>
                <button class="btn btn-primary" onclick="location.href='articles-info.html?id=${a.id}'">Read</button>
            </div>
        </article>
    `).join('');
}

function applySortArticles2(list, value) {
    const arr = [...list];
    if (value === 'newest') arr.sort((a,b)=> new Date(b.date)-new Date(a.date));
    if (value === 'popular') arr.sort((a,b)=> (b.views||0)-(a.views||0));
    if (value === 'az') arr.sort((a,b)=> a.title.localeCompare(b.title));
    return arr;
}

document.addEventListener('DOMContentLoaded', () => {
    const data = getArticlesData();
    const search = document.getElementById('articlesSearch');
    const sortSel = document.getElementById('articlesSort');
    const btn = document.getElementById('articlesSearchBtn');

    function run() {
        const q = (search?.value || '').toLowerCase();
        const filtered = data.filter(a => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q));
        const sorted = applySortArticles2(filtered, sortSel?.value || 'newest');
        renderArticles2(sorted);
    }

    run();
    search?.addEventListener('input', run);
    btn?.addEventListener('click', run);
    sortSel?.addEventListener('change', run);
});


