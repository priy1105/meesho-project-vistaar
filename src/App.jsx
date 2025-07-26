import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chart, registerables } from 'chart.js';

// Register all necessary components for Chart.js
Chart.register(...registerables);

// --- Define new color palette based on Vercel App ---
const Colors = {
    // Primary palette
    primaryDarkPurple: '#430747', // Very dark purple/indigo for main headings, footers
    secondaryPurple: '#3F007D',  // Slightly less dark, for sub-headings, key text
    lightPurple: '#FAF8FF',      // Very light purple for main backgrounds/hero
    palePurple: '#F3EDF9',       // Even paler for some card backgrounds/gradients

    // Accent colors
    accentPink: '#FF4081',       // Bright pink for highlights, active states
    accentBlue: '#430747',       // Blue accent (e.g., for some chart bars)
    accentGreen: '#8BC34A',      // Green accent (e.g., for some chart bars)

    // Text & UI colors
    textDark: '#1a1a1a',         // Near black for dark text
    textMedium: '#4a4a4a',       // Medium grey for regular text
    textLight: '#ffffff',        // White for text on dark backgrounds
    white: '#ffffff',            // Pure white for cards/elements
    borderLight: '#e0e0e0',      // Light grey for borders/dividers
};


// --- Data Store (Updated with full report details & GTM phases) ---
const reportData = {
    solutions: {
        saathi: {
            title: "The 'Meesho Saathi' Onboarding Program",
            points: [
                "Partner with established local Self-Help Groups (SHGs) and NGOs.",
                "Train a digitally savvy local youth ('Saathi') as a Meesho ambassador.",
                "Conduct in-person workshops in local dialects covering account setup, app usage, and quality control.",
                "The Saathi provides ongoing, trusted local support for a cluster of artisans."
            ]
        },
        tools: {
            title: "Simplified Seller Tools",
            points: [
                "Voice-First Cataloging: Artisans list products by recording a voice note; AI transcribes and populates details.",
                "<strong>AI-Powered Pricing:</strong> Suggests a fair, competitive price range based on the product image and description.",
                "<strong>Icon-Based Dashboard:</strong> Replaces complex text menus with simple, intuitive icons for key actions.",
                "<strong>Vernacular Video Guides:</strong> A library of short, 1-minute tutorials explaining every feature in local languages."
            ]
        },
        partnerships: {
            title: "Ecosystem Partnerships",
            points: [
                "Logistics: A strategic national partnership with India Post for reliable 'doorstep pickup' service from any village.",
                "<strong>Finance:</strong> Collaborate with a leading Micro-Finance Institution (MFI) to offer 'Meesho Quick Loans'.",
                "<strong>Capital Access:</strong> Based on sales history, artisans get pre-approved for small working capital loans (e.g., ₹5,000 - ₹10,000).",
                "<strong>Ecosystem Approach:</strong> Solves the core operational barriers of logistics and finance, enabling artisans to focus on their craft."
            ]
        }
    },
    kpis: {
        activation: { target: 80 }, // % Artisans listing 1st product in 7 days
        engagement: { listings: 5, gmv: 2500 }, // Avg # of Listings, Avg Monthly GMV (₹)
        health: { catalogIncrease: 10, cpa: 300 } // % Increase in Unique Catalog, CPA (₹)
    },
    financials: {
        years: ['Year 1', 'Year 2'],
        investment: [12.0, 15.0], // in Crore
        revenue: [4.8, 15.2], // in Crore (4% take rate of GMV)
        netProfit: [-7.2, 0.2] // in Crore
    },
    // Adding GTM strategy details for use in Timeline component (Blueprint)
    gtm: {
        phase1: {
            title: "Phase 1: Pilot",
            duration: "Months 1-3",
            description: "Validate the model and test assumptions in two craft-rich districts: Jaipur, Rajasthan (for jewelry and textiles) and Bishnupur, West Bengal (for terracotta and Baluchari sarees). Target: Onboard 5,000 artisans. Key Activities: Finalize NGO partnerships, develop the first version of training modules, and set up the India Post logistics pilot."
        },
        phase2: {
            title: "Phase 2: Scale",
            duration: "Months 4-12",
            description: "Rapidly expand based on the successful pilot playbook to the top 20 craft clusters in India (e.g., Kutch, Varanasi, Mysore, Madhubani, Bihar craft clusters like Bhagalpur/Mithilanchal). Target: Onboard an additional 400,000 artisans. Key Activities: Scale the 'Meesho Saathi' program, launch a regional marketing campaign, and integrate the MFI partnership."
        },
        phase3: {
            title: "Phase 3: Nationwide Rollout",
            duration: "Months 13-18",
            description: "Make Project Vistaar a core part of Meesho's seller acquisition strategy, expanding to all remaining states and territories. Target: Onboard the remaining 600,000 artisans to reach the 1 million goal. Key Activities: Fully automate the onboarding process where possible and introduce new features to the simplified tools based on user feedback."
        }
    },
    // Adding placeholder for Risks section content
    risks: {
        title: "Potential Risks & Mitigation Strategies",
        points: [
            { risk: "Low Digital Literacy / Adoption", mitigation: "Intensive Saathi-led training; Simplified Voice-First Tools." },
            { risk: "Logistical Challenges in Remote Areas", mitigation: "Strategic India Post partnership for doorstep pickup." },
            { risk: "Working Capital Access for Artisans", mitigation: "MFI partnership for 'Meesho Quick Loans' based on sales history." },
            { risk: "Quality Control / Standardization", mitigation: "Saathi training on product descriptions & photos; Feedback loops." },
            { risk: "Cultural & Linguistic Barriers", mitigation: "Local dialect support via Saathis & Vernacular Video Guides." },
            { risk: "Competition from Existing Supply Chains", mitigation: "Unique inventory; Fair pricing; Direct artisan relationships." }
        ]
    }
};


// --- Reusable Components ---

const AnimatedCounter = ({ target, prefix = '', suffix = '' }) => {
    const ref = useRef(null);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    let start = 0;
                    const end = target;
                    if (start === end) return;

                    let duration = 1500;
                    let startTime = null;

                    const step = (timestamp) => {
                        if (!startTime) startTime = timestamp;
                        const progress = Math.min((timestamp - startTime) / duration, 1);
                        setCount(Math.floor(progress * (end - start) + start));
                        if (progress < 1) {
                            window.requestAnimationFrame(step);
                        }
                    };
                    window.requestAnimationFrame(step);
                    observer.unobserve(ref.current);
                }
            },
            { threshold: 0.5 }
        );
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => observer.disconnect();
    }, [target]);

    return <p ref={ref}>{prefix}{count.toLocaleString('en-IN')}{suffix}</p>;
};


// Helper function to create and destroy charts
const createChart = (chartRef, chartInstanceRef, type, data, options) => {
    const ctx = chartRef.current.getContext('2d');
    if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null; // Ensure it's explicitly null
    }
    chartInstanceRef.current = new Chart(ctx, { type, data, options });
};

// Chart Components (Updated colors)
const MarketSizeChart = () => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        createChart(chartRef, chartInstance, 'bar', {
            labels: ['Indian Handicrafts Market'],
            datasets: [{
                label: 'Total Market Size ($B)',
                data: [100],
                backgroundColor: Colors.secondaryPurple, // Changed
                borderColor: Colors.primaryDarkPurple, // Changed
                borderWidth: 1
            }, {
                label: 'Online Penetration ($B)',
                data: [2],
                backgroundColor: Colors.accentPink, // Changed
                borderColor: Colors.accentPink,
                borderWidth: 1
            }]
        }, {
            responsive: true, maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, title: { display: true, text: 'Value in $ Billions' } } },
            plugins: { legend: { position: 'bottom', labels: { color: Colors.textMedium } } } // Added label color
        });
        return () => { if (chartInstance.current) { chartInstance.current.destroy(); chartInstance.current = null; } };
    }, []);
    return <canvas ref={chartRef}></canvas>;
}

const ActivationChart = () => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        createChart(chartRef, chartInstance, 'doughnut', {
            labels: ['Activated', 'Not Activated'],
            datasets: [{
                data: [reportData.kpis.activation.target, 100 - reportData.kpis.activation.target],
                backgroundColor: [Colors.accentPink, Colors.palePurple], // Changed
                borderColor: Colors.white,
                borderWidth: 4,
            }]
        }, {
            responsive: true, maintainAspectRatio: false, cutout: '70%',
            plugins: { legend: { display: false }, tooltip: { enabled: false } }
        });
        return () => { if (chartInstance.current) { chartInstance.current.destroy(); chartInstance.current = null; } };
    }, []);
    return <canvas ref={chartRef}></canvas>;
}

const EngagementChart = () => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        createChart(chartRef, chartInstance, 'bar', {
            labels: ['Avg. Listings', 'Avg. Monthly GMV (₹)'],
            datasets: [{
                label: 'Target',
                data: [reportData.kpis.engagement.listings, reportData.kpis.engagement.gmv],
                backgroundColor: [Colors.primaryDarkPurple, Colors.accentBlue], // Changed
                barPercentage: 0.6,
            }]
        }, {
            responsive: true, maintainAspectRatio: false, indexAxis: 'y',
            scales: { x: { beginAtZero: true } },
            plugins: { legend: { display: false } }
        });
        return () => { if (chartInstance.current) { chartInstance.current.destroy(); chartInstance.current = null; } };
    }, []);
    return <canvas ref={chartRef}></canvas>;
}

const HealthChart = () => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        createChart(chartRef, chartInstance, 'bar', {
            labels: ['Unique Catalog ↑ (%)', 'CPA (₹) ↓'],
            datasets: [{
                label: 'Target',
                data: [reportData.kpis.health.catalogIncrease, reportData.kpis.health.cpa],
                backgroundColor: [Colors.accentPink, Colors.accentGreen], // Changed
                barPercentage: 0.6,
            }]
        }, {
            responsive: true, maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } },
            plugins: { legend: { display: false } }
        });
        return () => { if (chartInstance.current) { chartInstance.current.destroy(); chartInstance.current = null; } };
    }, []);
    return <canvas ref={chartRef}></canvas>;
}

const FinancialsChart = () => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        createChart(chartRef, chartInstance, 'bar', {
            labels: reportData.financials.years,
            datasets: [
                { label: 'Investment', data: reportData.financials.investment.map(v => -v), backgroundColor: Colors.accentPink }, // Changed
                { label: 'Net Revenue', data: reportData.financials.revenue, backgroundColor: Colors.primaryDarkPurple }, // Changed
                {
                    type: 'line', label: 'Net Profit/Loss', data: reportData.financials.netProfit,
                    borderColor: Colors.secondaryPurple, // Changed
                    backgroundColor: Colors.secondaryPurple,
                    borderWidth: 3, fill: false, tension: 0.1
                }
            ]
        }, {
            responsive: true, maintainAspectRatio: false,
            scales: { x: { stacked: true }, y: { stacked: true, title: { display: true, text: 'Amount in ₹ Crore' } } },
            plugins: { legend: { position: 'bottom', labels: { color: Colors.textMedium } } } // Added label color
        });
        return () => { if (chartInstance.current) { chartInstance.current.destroy(); chartInstance.current = null; } };
    }, []);
    return <canvas ref={chartRef}></canvas>;
}

// --- Section Components ---

const Header = ({ onNavClick, activeSection }) => {
    // Updated nav items to match Vercel app's structure
    const navItems = [
        { name: 'The Opportunity', id: 'the-opportunity' }, // Renamed to match report's section
        { name: 'The Solution', id: 'the-solution' },
        { name: 'The Impact', id: 'the-impact' },
        { name: 'Blueprint', id: 'blueprint' },
        { name: 'Risks', id: 'risks' },
    ];

    return (
        <header className="fixed w-full z-50 py-4" style={{ backgroundColor: Colors.white, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <nav className="container mx-auto px-6 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    {/* Simplified Meesho text/logo for styling */}
                    <img src="https://www.meesho.com/assets/svgicons/meeshoLogo.svg" alt="Meesho Logo" className="h-8" />
                    <span className="ml-40 text-2xl font-bold" style={{ color: '#430747'}}> Project Vistaar</span>
                </div>
                <div className="hidden md:flex space-x-8">
                    {navItems.map(item => (
                        <a
                            key={item.id}
                            href={`#${item.id}`}
                            onClick={(e) => onNavClick(e, `#${item.id}`)}
                            className={`relative nav-link font-medium transition-colors`}
                            style={{ color: Colors.textMedium, paddingBottom: '5px' }} // Adjusted padding for underline
                        >
                            {item.name}
                            {activeSection === item.id && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5" style={{ backgroundColor: Colors.accentPink }}></span>
                            )}
                        </a>
                    ))}
                </div>
            </nav>
        </header>
    );
};


const Hero = ({ setRef }) => (
    <section id="hero" className="py-24 md:py-32 flex items-center min-h-screen" style={{ backgroundColor: Colors.lightPurple }} ref={el => setRef('hero', el)}>
        <div className="container mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6" style={{ color: '#430747' }}>
                Meesho Onboarding India's Next Wave of Entrepreneurs
            </h1>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto" style={{ color: Colors.textMedium }}>
                A strategic blueprint to onboard 1 million artisans, enrich Meesho's platform with unique inventory, and drive substantial growth.
            </p>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="p-8 rounded-lg shadow-xl" style={{ backgroundColor: Colors.white, border: `1px solid ${Colors.borderLight}` }}>
                    <div className="text-5xl font-extrabold mb-2" style={{ color: '#430747' }}><AnimatedCounter target={1000000} /></div>
                    <p className="text-lg font-semibold" style={{ color: Colors.textMedium }}>New Artisans Onboarded</p>
                </div>
                <div className="p-8 rounded-lg shadow-xl" style={{ backgroundColor: Colors.white, border: `1px solid ${Colors.borderLight}` }}>
                    <div className="text-5xl font-extrabold mb-2" style={{ color: '#430747' }}><AnimatedCounter target={5000000} /></div>
                    <p className="text-lg font-semibold" style={{ color: Colors.textMedium }}>Unique Product Listings</p>
                </div>
                <div className="p-8 rounded-lg shadow-xl" style={{ backgroundColor: Colors.white, border: `1px solid ${Colors.borderLight}` }}>
                    <div className="text-5xl font-extrabold mb-2" style={{ color: '#430747' }}><AnimatedCounter target={500} suffix=" Cr" /></div>
                    <p className="text-lg font-semibold" style={{ color: Colors.textMedium }}>Crore Incremental GMV (24 Mo.)</p>
                </div>
            </div>
        </div>
    </section>
);

const TheChallenge = ({ setRef }) => (
    <section id="the-opportunity" className="py-20 bg-white" ref={el => setRef('the-opportunity', el)}>
        <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ color: '#430747' }}>The Opportunity & The Challenge</h2>
                <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: Colors.textMedium }}>
                    While Meesho has mastered urban reselling, India's vast creative economy, valued at over $100 billion with less than 2% online penetration, presents a massive untapped opportunity. However, significant barriers exist for artisans.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Left Column: Market Analysis & Problem */}
                <div>
                    <h3 className="text-3xl font-bold mb-6" style={{ color: '#430747' }}>The Sleeping Giant: India's Handicrafts Market</h3>
                    <p className="text-lg mb-6" style={{ color: Colors.textMedium }}>
                        An estimated 55 million+ artisans and craftspeople, primarily in Tier 3 and 4 regions, currently operate offline, disconnected from national markets and limited by local demand. This segment represents a massive, high-potential pool of unique, high-margin inventory.
                    </p>
                    <div className="bg-palePurple p-6 rounded-lg shadow-md mb-8">
                        <h4 className="font-bold text-xl mb-4" style={{ color: '#430747' }}>Market Potential: Online vs. Total</h4>
                        <div className="chart-container h-64 md:h-80"><MarketSizeChart /></div>
                    </div>
                    <p className="text-lg" style={{color: '#430747'}}>
                        **The Problem:** These artisans face significant barriers to joining the digital economy: low digital literacy, inconsistent internet access, complex logistics from remote locations, and a lack of access to working capital. A one-size-fits-all onboarding approach will not succeed.
                    </p>
                </div>

                {/* Right Column: Artisan Persona & Challenges */}
                <div className="relative p-8 rounded-lg shadow-xl" style={{ backgroundColor: Colors.white, border: `1px solid ${Colors.borderLight}` }}>
                    {/* Placeholder for Lakshmi image if you want to add one */}
                    <img src="https://i.pinimg.com/originals/71/52/ef/7152ef57e9cc654cad24ddc3fa944622.jpg" alt="Lakshmi the Artisan" className="w-full h-auto rounded-lg mb-6" /> 
                  

                    <h3 className="text-3xl font-bold mb-4" style={{ color: Colors.secondaryPurple }}>Meet Lakshmi: Our Target Artisan Persona</h3>
                    <p className="mb-6" style={{ color: Colors.textMedium }}>
                        Lakshmi, 42, is a master weaver of silk sarees from a village near Kanchipuram, Tamil Nadu. She represents millions of artisans who embody the opportunity and face the core challenges.
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-start"><span className="text-accentPink font-bold text-2xl mr-2">✓</span> <div><strong style={{ color: Colors.primaryDarkPurple }}>Goal:</strong> Earn a fair price for her craft, provide better education, gain recognition.</div></li>
                        <li className="flex items-start"><span className="text-accentPink font-bold text-2xl mr-2">✓</span> <div><strong style={{ color: Colors.primaryDarkPurple }}>Digital Barrier:</strong> Finds e-commerce apps confusing ("too many buttons and English words").</div></li>
                        <li className="flex items-start"><span className="text-accentPink font-bold text-2xl mr-2">✓</span> <div><strong style={{ color: Colors.primaryDarkPurple }}>Logistics:</strong> Nearest courier office is 15km away.</div></li>
                        <li className="flex items-start"><span className="text-accentPink font-bold text-2xl mr-2">✓</span> <div><strong style={{ color: Colors.primaryDarkPurple }}>Capital:</strong> Cannot afford to buy raw silk in bulk.</div></li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
);

const TheSolution = ({ setRef }) => {
    const [activeSolution, setActiveSolution] = useState(null);

    const handleCardClick = (solutionKey) => {
        setActiveSolution(solutionKey);
    };

    useEffect(() => {
        if (activeSolution === null) {
            setActiveSolution(Object.keys(reportData.solutions)[0]); // Set first solution active by default
        }
    }, [activeSolution]);

    const solutionData = activeSolution ? reportData.solutions[activeSolution] : null;

    return (
        <section id="the-solution" className="py-20" style={{ backgroundColor: Colors.lightPurple }} ref={el => setRef('the-solution', el)}>
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-4" style={{  color: '#430747' }}>The Solution: Project Vistaar's 3-Pronged Approach</h2>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: Colors.textMedium }}>
                        Project Vistaar is an ecosystem designed to systematically address every barrier faced by artisans like Lakshmi.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {Object.keys(reportData.solutions).map((key, index) => (
                        <div key={key} onClick={() => handleCardClick(key)}
                            className={`solution-card cursor-pointer p-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105`}
                            style={{
                                backgroundColor: activeSolution === key ? Colors.primaryDarkPurple : Colors.white,
                                color: activeSolution === key ? Colors.textLight : Colors.textDark,
                                border: `1px solid ${activeSolution === key ? Colors.primaryDarkPurple : Colors.borderLight}`
                            }}>
                            <h3 className="text-2xl font-bold mb-2">{index + 1}. {reportData.solutions[key].title}</h3>
                            <p style={{ color: activeSolution === key ? Colors.lightPurple : Colors.textMedium }}>
                                {reportData.solutions[key].points[0]}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="p-10 rounded-lg shadow-2xl" style={{ backgroundColor: Colors.white, border: `1px solid ${Colors.borderLight}` }}>
                    {solutionData ? (
                        <div>
                            <h3 className="text-3xl font-bold mb-6" style={{ color: Colors.secondaryPurple }}>{solutionData.title} Details:</h3>
                            <ul className="space-y-4 text-lg">
                                {solutionData.points.map((point, i) => (
                                    <li key={i} className="flex items-start">
                                        <span className="font-bold text-3xl mr-3" style={{ color: Colors.accentPink }}>&#x2022;</span> {/* Large bullet point */}
                                        <p style={{ color: Colors.textMedium }} dangerouslySetInnerHTML={{ __html: point }}></p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="text-center text-xl" style={{ color: Colors.textMedium }}>Click on a solution above to explore the details.</p>
                    )}
                </div>
            </div>
        </section>
    );
};

const TheImpact = ({ setRef }) => (
    <section id="the-impact" className="py-20 bg-white" ref={el => setRef('the-impact', el)}>
        <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ color: Colors.primaryDarkPurple }}>The Impact: Measuring Success with KPIs</h2>
                <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: Colors.textMedium }}>
                    Clear, measurable targets to track our progress, validate effectiveness, and ensure significant long-term impact on the artisan economy.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="p-6 rounded-lg shadow-xl text-center" style={{ backgroundColor: Colors.palePurple, border: `1px solid ${Colors.borderLight}` }}>
                    <h3 className="font-bold text-xl mb-4" style={{ color: Colors.secondaryPurple }}>Acquisition & Activation</h3>
                    <div className="chart-container h-48"><ActivationChart /></div>
                    <p className="mt-4" style={{ color: Colors.textMedium }}>Target: <strong style={{ color: Colors.primaryDarkPurple }}>405,000</strong> artisans onboarded with <strong style={{ color: Colors.primaryDarkPurple }}>{reportData.kpis.activation.target}%</strong> activation in Year 1.</p>
                </div>
                <div className="p-6 rounded-lg shadow-xl text-center" style={{ backgroundColor: Colors.palePurple, border: `1px solid ${Colors.borderLight}` }}>
                    <h3 className="font-bold text-xl mb-4" style={{ color: Colors.secondaryPurple }}>Engagement & Monetization</h3>
                    <div className="chart-container h-48"><EngagementChart /></div>
                    <p className="mt-4" style={{ color: Colors.textMedium }}>Target: <strong style={{ color: Colors.primaryDarkPurple }}>{reportData.kpis.engagement.listings}+</strong> listings & <strong style={{ color: Colors.primaryDarkPurple }}>₹{reportData.kpis.engagement.gmv.toLocaleString('en-IN')}</strong> avg. monthly GMV per artisan.</p>
                </div>
                <div className="p-6 rounded-lg shadow-xl text-center" style={{ backgroundColor: Colors.palePurple, border: `1px solid ${Colors.borderLight}` }}>
                    <h3 className="font-bold text-xl mb-4" style={{ color: Colors.secondaryPurple }}>Platform & Operational Health</h3>
                    <div className="chart-container h-48"><HealthChart /></div>
                    <p className="mt-4" style={{ color: Colors.textMedium }}>Target: <strong style={{ color: Colors.primaryDarkPurple }}>{reportData.kpis.health.catalogIncrease}%</strong> increase in unique items & CPA <strong style={{ color: Colors.primaryDarkPurple }}>&lt; ₹{reportData.kpis.health.cpa}</strong>.</p>
                </div>
            </div>
        </div>
    </section>
);

const Blueprint = ({ setRef }) => (
    <section id="blueprint" className="py-20" style={{ backgroundColor: Colors.lightPurple }} ref={el => setRef('blueprint', el)}>
        <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ color: Colors.primaryDarkPurple }}>Project Vistaar: Go-to-Market Blueprint</h2>
                <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: Colors.textMedium }}>
                    A phased 18-month rollout designed for strategic scaling and nationwide impact.
                </p>
            </div>
            {/* Horizontal Timeline concept - simplified for code gen, adjust CSS for true horizontal */}
            <div className="relative border-t-2 border-dashed mx-auto mt-12" style={{ borderColor: Colors.secondaryPurple, maxWidth: '900px' }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
                    {Object.keys(reportData.gtm).map((key, index) => {
                        const phase = reportData.gtm[key];
                        return (
                            <div key={key} className="relative p-6 rounded-lg shadow-lg text-center timeline-card"
                                 style={{ backgroundColor: Colors.white, border: `1px solid ${Colors.borderLight}`, top: (index % 2 === 0 ? '-30px' : '30px') }}> {/* Simple up/down offset */}
                                <div className="absolute left-1/2 transform -translate-x-1/2 -top-10 w-8 h-8 rounded-full flex items-center justify-center font-bold"
                                     style={{ backgroundColor: Colors.accentPink, color: Colors.white, border: `2px solid ${Colors.white}` }}>
                                    {index + 1}
                                </div>
                                <h3 className="text-2xl font-bold mb-2 pt-4" style={{ color: Colors.secondaryPurple }}>{phase.title}</h3>
                                <p className="font-semibold mb-2" style={{ color: Colors.textMedium }}>{phase.duration}</p>
                                <p className="text-sm" style={{ color: Colors.textMedium }}>{phase.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    </section>
);

const Risks = ({ setRef }) => (
    <section id="risks" className="py-20 bg-white" ref={el => setRef('risks', el)}>
        <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ color: Colors.primaryDarkPurple }}>Potential Risks & Mitigation Strategies</h2>
                <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: Colors.textMedium }}>
                    Anticipating challenges and proactively developing strategies to ensure the success and sustainability of Project Vistaar.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {reportData.risks.points.map((riskItem, index) => (
                    <div key={index} className="p-6 rounded-lg shadow-lg" style={{ backgroundColor: Colors.palePurple, border: `1px solid ${Colors.borderLight}` }}>
                        <h3 className="text-xl font-bold mb-2" style={{ color: Colors.secondaryPurple }}>Risk: {riskItem.risk}</h3>
                        <p className="text-base" style={{ color: Colors.textMedium }}>
                            <strong style={{ color: Colors.primaryDarkPurple }}>Mitigation:</strong> {riskItem.mitigation}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const Financials = ({ setRef }) => (
    <section id="financials" className="py-20" style={{ backgroundColor: Colors.lightPurple }} ref={el => setRef('financials', el)}>
        <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ color: Colors.primaryDarkPurple }}>Financial Projections</h2>
                <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: Colors.textMedium }}>
                    A clear path to profitability and significant long-term value, projecting an incremental ₹500 Crore in GMV over 24 months. All figures are in ₹ Crore.
                </p>
            </div>
            <div className="p-6 rounded-lg shadow-xl" style={{ backgroundColor: Colors.white, border: `1px solid ${Colors.borderLight}` }}>
                <h3 className="font-bold text-xl mb-4" style={{ color: Colors.secondaryPurple }}>Investment vs. Return (in ₹ Crore)</h3>
                <div className="chart-container h-80"><FinancialsChart /></div>
                <div className="mt-8 text-sm" style={{ color: Colors.textMedium }}>
                    <p><strong>Year 1:</strong> Total Investment: ₹{reportData.financials.investment[0].toFixed(1)} Cr, Net Revenue: ₹{reportData.financials.revenue[0].toFixed(1)} Cr, Net Profit/Loss: ₹{reportData.financials.netProfit[0].toFixed(1)} Cr (ROI: {((reportData.financials.netProfit[0] / reportData.financials.investment[0]) * 100).toFixed(1)}%)</p>
                    <p><strong>Year 2:</strong> Total Investment: ₹{reportData.financials.investment[1].toFixed(1)} Cr, Net Revenue: ₹{reportData.financials.revenue[1].toFixed(1)} Cr, Net Profit/Loss: ₹{reportData.financials.netProfit[1].toFixed(1)} Cr (ROI: {((reportData.financials.netProfit[1] / reportData.financials.investment[1]) * 100).toFixed(1)}%) - Reaching Breakeven</p>
                </div>
            </div>
        </div>
    </section>
);

const Footer = () => (
    <footer className="py-12 text-center" style={{ backgroundColor: Colors.primaryDarkPurple, color: Colors.textLight }}>
        <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-4">A Nation-Building Opportunity</h2>
            <p className="max-w-3xl mx-auto text-lg" style={{ color: Colors.palePurple }}>
                By investing in the grassroots creative economy, we unlock a massive, loyal seller base, create an unparalleled product catalog, and solidify Meesho's position as India's true e-commerce platform for the next billion users. Project Vistaar aligns perfectly with Meesho's core mission and represents a strategic leap forward.
            </p>
            <p className="mt-8 text-sm" style={{ color: Colors.palePurple }}>
                Prepared for: Meesho Team | Proposed by: Priyanshu, Business Management Senior Associate Candidate | Date: July 26, 2025
            </p>
        </div>
    </footer>
);


// --- Main App Component ---

export default function App() {
    // Initial active section is 'hero' (the first one)
    const [activeSection, setActiveSection] = useState('hero');
    // Using an object to store refs by ID
    const sectionRefs = useRef({});

    // Memoized callback to set refs for sections
    const setRef = useCallback((id, element) => {
        if (element) {
            sectionRefs.current[id] = element;
        } else {
            // Clean up old references if elements unmount (important for dynamic content)
            delete sectionRefs.current[id];
        }
    }, []); // Empty dependency array means this function is created once

    // Effect for setting up and cleaning up the Intersection Observer
    useEffect(() => {
        const observerOptions = {
            root: null, // The viewport
            // Defines the "active" zone: top 30% and bottom 30% are ignored.
            // A section is active when its content occupies the middle ~40% of the viewport.
            rootMargin: '-30% 0px -30% 0px',
            threshold: 0 // Observer fires as soon as element crosses the rootMargin
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // If a section is intersecting and is relatively central, set it as active
                if (entry.isIntersecting && entry.intersectionRatio > 0) {
                    setActiveSection(entry.target.id);
                }
            });
        }, observerOptions);

        // Function to start observing all current elements
        const observeElements = () => {
            // Ensure we are observing all elements currently in sectionRefs.current
            // and re-observe if necessary (e.g., after component updates)
            Object.values(sectionRefs.current).forEach(section => {
                if (section) {
                    observer.observe(section);
                }
            });
        };

        // Call observeElements on mount
        observeElements();

        // Cleanup function for useEffect: disconnect observer and unobserve elements
        return () => {
            Object.values(sectionRefs.current).forEach(section => {
                if (section) {
                    observer.unobserve(section);
                }
            });
            observer.disconnect();
        };
    }, [setRef]); // Dependency on setRef to re-run if setRef changes (though it shouldn't with useCallback)


    // Handler for smooth scrolling when a nav link is clicked
    const handleNavClick = (e, targetId) => {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Adjust header offset if header is fixed/sticky
            const headerOffset = document.querySelector('header').offsetHeight; // Dynamically get header height
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
    };

    const customStyles = `
        html { scroll-behavior: smooth; }

         General font styling, replace with specific Google Font if desired 
        body { font-family: 'Arial', sans-serif; } 
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap'); 
        body { font-family: 'Poppins', sans-serif; } 

         Header Navigation 
        .nav-link { 
            position: relative; /* For the absolute underline */
            display: inline-block; /* Or flex for text+icon */
            padding-bottom: 5px; /* Space for the underline */
            font-weight: 500; /* Medium weight */
            color: ${Colors.textMedium}; /* Default link color */
            transition: color 0.3s ease; 
        }
        .nav-link:hover { color: ${Colors.accentPink}; } /* Hover color */
        .nav-link.active { 
            color: ${Colors.secondaryPurple}; /* Active text color */
            font-weight: 600; /* Slightly bolder for active */
        }
        .nav-link.active::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 2px; /* Thickness of the underline */
            background-color: ${Colors.accentPink}; /* Color of the underline */
            transform-origin: bottom center;
            animation: expandUnderline 0.3s forwards;
        }
        @keyframes expandUnderline {
            from { transform: scaleX(0); }
            to { transform: scaleX(1); }
        }

        Hero Section Counters 
        .animated-counter-card {
            background-color: ${Colors.white};
            border: 1px solid ${Colors.borderLight};
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
            padding: 2rem;
            text-align: center;
        }
        .animated-counter-number {
            font-size: 3rem; /* text-6xl equivalent */
            font-weight: 800; /* font-extrabold equivalent */
            margin-bottom: 0.5rem;
            color: ${Colors.accentPink}; /* For first/third card */
        }
        .animated-counter-number.purple {
            color: ${Colors.secondaryPurple}; /* For second card */
        }
        .animated-counter-label {
            font-size: 1.125rem; /* text-lg equivalent */
            font-weight: 600; /* font-semibold equivalent */
            color: ${Colors.textMedium};
        }

        /* Solution Cards */
        .solution-card { 
            cursor: pointer; 
            padding: 2rem; 
            border-radius: 0.5rem; 
            box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
            transition: all 0.3s ease; 
            border: 1px solid transparent; /* Default transparent border */
        }
        .solution-card:hover { transform: translateY(-5px); box-shadow: 0 10px 15px rgba(0,0,0,0.15); }
        .solution-card.active {
            background-color: ${Colors.primaryDarkPurple} !important;
            color: ${Colors.textLight} !important;
            border-color: ${Colors.primaryDarkPurple} !important;
        }
        .solution-card.active p {
            color: ${Colors.lightPurple} !important;
        }

        /* Timeline / Blueprint */
        .timeline-card {
            min-height: 180px; /* Ensure cards have space */
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        /* Chart container styling */
        .chart-container {
            position: relative; width: 100%; max-width: 600px; margin-left: auto; margin-right: auto;
            height: 300px; max-height: 400px;
        }
        @media (min-width: 768px) { .chart-container { height: 350px; } }
    `;

    return (
        <div style={{ backgroundColor: Colors.white, color: Colors.textDark }} className="font-sans antialiased">
            <style>{customStyles}</style>
            <Header onNavClick={handleNavClick} activeSection={activeSection} />
            <main>
                {/* Each section now receives the setRef prop and its ID matches navItems */}
                <Hero setRef={setRef} />
                <TheChallenge setRef={setRef} /> {/* New section for Opportunity/Challenge */}
                <TheSolution setRef={setRef} />
                <TheImpact setRef={setRef} /> {/* Renamed from KPIs */}
                <Blueprint setRef={setRef} /> {/* Renamed from Timeline */}
                <Risks setRef={setRef} /> {/* New Risks section */}
                <Financials setRef={setRef} />
            </main>
            <Footer />
        </div>
    );
}