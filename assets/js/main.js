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
            // Simulated news data - replace with actual RSS/API calls
            const mockNews = this.getMockNews();
            this.displayNews(mockNews.slice(this.newsOffset, this.newsOffset + this.newsLimit));
            this.newsOffset += this.newsLimit;
        } catch (error) {
            console.error('Error loading news:', error);
            this.newsContainer.innerHTML = '<div class="news-error">Kunde inte ladda nyheter. Försök igen senare.</div>';
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
    
    loadADCCUpdates() {
        const updates = [
            {
                title: "Ny viktklass 92kg",
                content: "ADCC introducerar 92kg-klassen för 2024"
            },
            {
                title: "Trials uppdatering",
                content: "Datum för regionala trials nu bekräftat"
            }
        ];
        
        this.adccUpdates.innerHTML = updates.map(update => `
            <div class="update-item">
                <h5>${update.title}</h5>
                <p>${update.content}</p>
            </div>
        `).join('');
    }
    
    loadBJJNews() {
        const bjjNews = [
            {
                title: "Ny svartbälte i Sverige",
                content: "Tre nya svartbälten graduerade i Stockholm"
            },
            {
                title: "IBJJF ranking uppdatering",
                content: "Svenska atleter klättrar i världsrankingen"
            }
        ];
        
        this.bjjNews.innerHTML = bjjNews.map(news => `
            <div class="update-item">
                <h5>${news.title}</h5>
                <p>${news.content}</p>
            </div>
        `).join('');
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
    
    // RSS Feed parsing (for future implementation)
    async fetchRSSFeed(url) {
        try {
            // This would require a CORS proxy in production
            const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`);
            const data = await response.json();
            return data.items;
        } catch (error) {
            console.error('Error fetching RSS feed:', error);
            return [];
        }
    }
    
    // Potential RSS feeds for grappling news (for future implementation)
    getRSSFeeds() {
        return [
            'https://www.flograppling.com/rss',
            'https://www.bjjee.com/feed/',
            'https://grapplinginsider.com/feed/',
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