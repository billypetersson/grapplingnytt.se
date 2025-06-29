// GrapplingNytt.se Main JavaScript

class GrapplingNytt {
    constructor() {
        this.newsContainer = document.getElementById('news-container');
        this.featuredContainer = document.getElementById('featured-container');
        this.eventsCalendar = document.getElementById('events-calendar');
        this.adccUpdates = document.getElementById('adcc-updates');
        this.bjjNews = document.getElementById('bjj-news');
        this.loadMoreBtn = document.getElementById('load-more');
        
        this.newsOffset = 0;
        this.newsLimit = 6;
        
        this.init();
    }
    
    init() {
        this.setupNavigation();
        this.loadNews();
        this.loadEvents();
        this.loadFeaturedContent();
        this.loadADCCUpdates();
        this.loadBJJNews();
        this.setupLoadMore();
    }
    
    setupNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    async loadNews() {
        try {
            // Try to load from RSS feeds first, fallback to mock data
            let allNews = [];
            const feeds = this.getRSSFeeds();
            
            // Attempt to load from RSS feeds
            for (const feed of feeds.slice(0, 3)) { // Load from first 3 feeds to avoid rate limits
                try {
                    const feedNews = await this.fetchRSSFeed(feed.url);
                    const processedNews = feedNews.map(item => ({
                        title: item.title,
                        excerpt: this.truncateText(item.description || item.content || 'Läs mer...', 150),
                        source: feed.name,
                        date: item.pubDate || new Date().toISOString(),
                        image: this.extractImageFromContent(item.content) || `https://via.placeholder.com/400x200/ed1c24/ffffff?text=${encodeURIComponent(feed.name)}`,
                        url: item.link || '#',
                        category: feed.category
                    }));
                    allNews = allNews.concat(processedNews.slice(0, 2)); // Max 2 articles per feed
                } catch (feedError) {
                    console.warn(`Failed to load feed ${feed.name}:`, feedError);
                }
            }
            
            // If no RSS news loaded, use mock data
            if (allNews.length === 0) {
                console.log('Using mock data as fallback');
                allNews = this.getMockNews();
            }
            
            // Sort by date and display
            allNews.sort((a, b) => new Date(b.date) - new Date(a.date));
            this.displayNews(allNews.slice(this.newsOffset, this.newsOffset + this.newsLimit));
            this.newsOffset += this.newsLimit;
            
        } catch (error) {
            console.error('Error loading news:', error);
            // Fallback to mock data on error
            const mockNews = this.getMockNews();
            this.displayNews(mockNews.slice(0, this.newsLimit));
            this.newsOffset = this.newsLimit;
        }
    }
    
    getMockNews() {
        return [
            {
                title: "ADCC 2024: Nya viktklasser annonserade",
                excerpt: "ADCC har meddelat ändringar i viktklasserna inför 2024 års turnering...",
                source: "FloGrappling",
                date: "2024-01-15",
                image: "https://via.placeholder.com/400x200/1a237e/ffffff?text=ADCC+2024",
                url: "#"
            },
            {
                title: "Gordon Ryan tillbaka efter skadepausen",
                excerpt: "Världens #1 inom nogi grappling meddelar comeback efter månaders vila...",
                source: "BJJ Fanatics",
                date: "2024-01-14",
                image: "https://via.placeholder.com/400x200/c62828/ffffff?text=Gordon+Ryan",
                url: "#"
            },
            {
                title: "Svenska VM-truppen presenterad",
                excerpt: "Svenska Grapplingförbundet har valt ut sina främsta utövare för årets VM...",
                source: "Svenska Grapplingförbundet",
                date: "2024-01-13",
                image: "https://via.placeholder.com/400x200/ffd600/000000?text=Svenska+VM-truppen",
                url: "#"
            },
            {
                title: "Ny BJJ-academy öppnar i Stockholm",
                excerpt: "Elite Grappling Team expanderar med en andra hall i huvudstaden...",
                source: "GrapplingNytt",
                date: "2024-01-12",
                image: "https://via.placeholder.com/400x200/1a237e/ffffff?text=BJJ+Stockholm",
                url: "#"
            },
            {
                title: "IBJJF European Championships: Resultat",
                excerpt: "Sammanfattning av helgens tävling i Paris med svenska framgångar...",
                source: "IBJJF",
                date: "2024-01-11",
                image: "https://via.placeholder.com/400x200/c62828/ffffff?text=IBJJF+Europeans",
                url: "#"
            },
            {
                title: "Mikey Musumeci vs Kade Ruotolo superfight",
                excerpt: "Två av världens bästa nogi-grapplers möts i kommande superfight...",
                source: "ONE Championship",
                date: "2024-01-10",
                image: "https://via.placeholder.com/400x200/ffd600/000000?text=Superfight",
                url: "#"
            }
        ];
    }
    
    displayNews(news) {
        if (this.newsOffset === this.newsLimit) {
            this.newsContainer.innerHTML = '';
        }
        
        news.forEach(article => {
            const newsCard = this.createNewsCard(article);
            this.newsContainer.appendChild(newsCard);
        });
    }
    
    createNewsCard(article) {
        const card = document.createElement('div');
        card.className = 'news-card';
        
        card.innerHTML = `
            <img src="${article.image}" alt="${article.title}" loading="lazy">
            <div class="news-card-content">
                <h3>${article.title}</h3>
                <p>${article.excerpt}</p>
                <div class="news-meta">
                    <span class="news-source">${article.source}</span>
                    <span class="news-date">${this.formatDate(article.date)}</span>
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => {
            // In a real implementation, this would navigate to the full article
            console.log('Navigate to:', article.url);
        });
        
        return card;
    }
    
    loadEvents() {
        const events = [
            {
                title: "ADCC World Championships",
                date: "2024-09-14",
                location: "Las Vegas, USA",
                type: "adcc"
            },
            {
                title: "IBJJF Swedish Open",
                date: "2024-03-15",
                location: "Stockholm, Sverige",
                type: "bjj"
            },
            {
                title: "Polaris 28",
                date: "2024-02-24",
                location: "London, UK",
                type: "grappling"
            },
            {
                title: "Svenska Mästerskapen NoGi",
                date: "2024-04-20",
                location: "Göteborg, Sverige",
                type: "nogi"
            }
        ];
        
        this.eventsCalendar.innerHTML = events.map(event => `
            <div class="event-item">
                <div class="event-date">${this.formatDate(event.date)}</div>
                <div class="event-title">${event.title}</div>
                <div class="event-location">${event.location}</div>
            </div>
        `).join('');
    }
    
    loadFeaturedContent() {
        const featuredArticles = [
            {
                title: "Grapplingens historia i Sverige",
                excerpt: "En djupdykning i hur grappling utvecklats i Sverige från 1990-talet till idag."
            },
            {
                title: "Träningsguide: NoGi för nybörjare",
                excerpt: "Allt du behöver veta för att komma igång med no-gi grappling."
            },
            {
                title: "ADCC-regelverket förklarat",
                excerpt: "En genomgång av ADCC:s unika regelsystem och poängräkning."
            }
        ];
        
        this.featuredContainer.innerHTML = featuredArticles.map(article => `
            <div class="featured-card">
                <h4>${article.title}</h4>
                <p>${article.excerpt}</p>
            </div>
        `).join('');
    }
    
    async loadADCCUpdates() {
        try {
            // Try to load ADCC-related news from RSS feeds
            const feeds = this.getRSSFeeds();
            let adccNews = [];
            
            for (const feed of feeds) {
                try {
                    const feedNews = await this.fetchRSSFeed(feed.url);
                    const adccRelated = feedNews.filter(item => 
                        item.title.toLowerCase().includes('adcc') ||
                        item.description?.toLowerCase().includes('adcc') ||
                        item.content?.toLowerCase().includes('adcc')
                    ).slice(0, 2);
                    
                    adccNews = adccNews.concat(adccRelated.map(item => ({
                        title: this.truncateText(item.title, 60),
                        content: this.truncateText(item.description || item.content, 100),
                        url: item.link
                    })));
                } catch (error) {
                    console.warn(`Failed to load ADCC updates from ${feed.name}:`, error);
                }
            }
            
            // Fallback to static content if no RSS data
            if (adccNews.length === 0) {
                adccNews = [
                    {
                        title: "Ny viktklass 92kg",
                        content: "ADCC introducerar 92kg-klassen för 2024",
                        url: "#"
                    },
                    {
                        title: "Trials uppdatering", 
                        content: "Datum för regionala trials nu bekräftat",
                        url: "#"
                    }
                ];
            }
            
            this.adccUpdates.innerHTML = adccNews.slice(0, 3).map(update => `
                <div class="update-item">
                    <h5><a href="${update.url}" target="_blank" rel="noopener">${update.title}</a></h5>
                    <p>${update.content}</p>
                </div>
            `).join('');
            
        } catch (error) {
            console.error('Error loading ADCC updates:', error);
            // Fallback content
            this.adccUpdates.innerHTML = `
                <div class="update-item">
                    <h5>ADCC nyheter</h5>
                    <p>Laddar ADCC-uppdateringar...</p>
                </div>
            `;
        }
    }
    
    async loadBJJNews() {
        try {
            // Try to load BJJ-specific news from RSS feeds
            const feeds = this.getRSSFeeds().filter(feed => feed.category === 'bjj');
            let bjjNews = [];
            
            for (const feed of feeds.slice(0, 2)) { // Load from top 2 BJJ feeds
                try {
                    const feedNews = await this.fetchRSSFeed(feed.url);
                    const bjjItems = feedNews.slice(0, 2).map(item => ({
                        title: this.truncateText(item.title, 50),
                        content: this.truncateText(item.description || item.content, 80),
                        url: item.link
                    }));
                    bjjNews = bjjNews.concat(bjjItems);
                } catch (error) {
                    console.warn(`Failed to load BJJ news from ${feed.name}:`, error);
                }
            }
            
            // Fallback to static content if no RSS data
            if (bjjNews.length === 0) {
                bjjNews = [
                    {
                        title: "Ny svartbälte i Sverige",
                        content: "Tre nya svartbälten graduerade i Stockholm",
                        url: "#"
                    },
                    {
                        title: "IBJJF ranking uppdatering",
                        content: "Svenska atleter klättrar i världsrankingen",
                        url: "#"
                    }
                ];
            }
            
            this.bjjNews.innerHTML = bjjNews.slice(0, 3).map(news => `
                <div class="update-item">
                    <h5><a href="${news.url}" target="_blank" rel="noopener">${news.title}</a></h5>
                    <p>${news.content}</p>
                </div>
            `).join('');
            
        } catch (error) {
            console.error('Error loading BJJ news:', error);
            // Fallback content
            this.bjjNews.innerHTML = `
                <div class="update-item">
                    <h5>BJJ nyheter</h5>
                    <p>Laddar BJJ-nyheter...</p>
                </div>
            `;
        }
    }
    
    setupLoadMore() {
        if (this.loadMoreBtn) {
            this.loadMoreBtn.addEventListener('click', () => {
                this.loadNews();
            });
        }
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('sv-SE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    truncateText(text, maxLength) {
        if (!text) return '';
        // Remove HTML tags
        const cleanText = text.replace(/<[^>]*>/g, '');
        if (cleanText.length <= maxLength) return cleanText;
        return cleanText.substr(0, maxLength) + '...';
    }
    
    extractImageFromContent(content) {
        if (!content) return null;
        // Try to extract image URL from content
        const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch) return imgMatch[1];
        
        // Try to find image in enclosure or media tags
        const mediaMatch = content.match(/https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)/i);
        if (mediaMatch) return mediaMatch[0];
        
        return null;
    }
    
    // RSS Feed parsing with multiple proxy fallbacks
    async fetchRSSFeed(url) {
        const proxies = [
            `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`,
            `https://cors-anywhere.herokuapp.com/${url}`,
            `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
        ];
        
        for (const proxyUrl of proxies) {
            try {
                const response = await fetch(proxyUrl);
                
                if (proxyUrl.includes('rss2json')) {
                    const data = await response.json();
                    if (data.status === 'ok' && data.items) {
                        return data.items;
                    }
                } else if (proxyUrl.includes('allorigins')) {
                    const data = await response.json();
                    if (data.contents) {
                        return this.parseRSSXML(data.contents);
                    }
                } else {
                    // Direct CORS proxy
                    const text = await response.text();
                    return this.parseRSSXML(text);
                }
            } catch (error) {
                console.warn(`RSS proxy ${proxyUrl} failed:`, error);
                continue;
            }
        }
        
        throw new Error('All RSS proxies failed');
    }
    
    parseRSSXML(xmlString) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
            const items = xmlDoc.querySelectorAll('item');
            
            return Array.from(items).map(item => ({
                title: item.querySelector('title')?.textContent || '',
                description: item.querySelector('description')?.textContent || '',
                content: item.querySelector('content\\:encoded')?.textContent || item.querySelector('description')?.textContent || '',
                link: item.querySelector('link')?.textContent || '',
                pubDate: item.querySelector('pubDate')?.textContent || '',
                author: item.querySelector('author')?.textContent || item.querySelector('dc\\:creator')?.textContent || ''
            }));
        } catch (error) {
            console.error('Error parsing RSS XML:', error);
            return [];
        }
    }
    
    // RSS feeds for grappling news
    getRSSFeeds() {
        return [
            {
                name: 'Jits Magazine',
                url: 'https://jitsmagazine.com/feed',
                category: 'bjj',
                description: 'BJJ-nyheter, teknik, resultat'
            },
            {
                name: 'Grapplezilla',
                url: 'https://grapplezilla.com/feed',
                category: 'grappling',
                description: 'Grappling-nyheter, BJJ, brottning'
            },
            {
                name: 'BJJ Bear',
                url: 'https://bjjbear.com/feed',
                category: 'bjj',
                description: 'Blogg om grappling, BJJ, MMA'
            },
            {
                name: 'Inside BJJ Podcast',
                url: 'https://insidebjj.libsyn.com/rss',
                category: 'podcast',
                description: 'BJJ-intervjuer & berättelser'
            },
            {
                name: 'Destroyer Submission Grappling',
                url: 'https://dstryrsg1.rssing.com/chan-23899833/all_p1.html',
                category: 'grappling',
                description: 'Fokus på grappling i Japan/Asien'
            }
        ];
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GrapplingNytt();
});

// Service Worker registration for potential future PWA features
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}