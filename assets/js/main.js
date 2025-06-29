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
        this.remainingNews = [];
        
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
        // Show loading indicator
        this.newsContainer.innerHTML = '<div class="news-loading"><div class="loading-spinner"></div>Laddar nyheter...</div>';
        
        try {
            const feeds = this.getRSSFeeds().slice(0, 3); // Limit to 3 feeds for speed
            const feedPromises = feeds.map(feed => this.loadFeedWithTimeout(feed, 5000)); // 5 second timeout per feed
            
            // Load feeds in parallel with Promise.allSettled to continue even if some fail
            const results = await Promise.allSettled(feedPromises);
            
            let allNews = [];
            results.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value.length > 0) {
                    allNews = allNews.concat(result.value);
                } else if (result.status === 'rejected') {
                    console.warn(`Feed ${feeds[index].name} failed:`, result.reason);
                }
            });
            
            // If no RSS news loaded, use mock data
            if (allNews.length === 0) {
                console.log('No RSS feeds loaded, using mock data');
                allNews = this.getMockNews();
            }
            
            // Sort by date and display
            allNews.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Clear loading and display news
            this.newsContainer.innerHTML = '';
            this.displayNews(allNews.slice(0, this.newsLimit));
            this.newsOffset = this.newsLimit;
            
            // Store remaining news for "load more"
            this.remainingNews = allNews.slice(this.newsLimit);
            
        } catch (error) {
            console.error('Error loading news:', error);
            // Fallback to mock data on error
            const mockNews = this.getMockNews();
            this.newsContainer.innerHTML = '';
            this.displayNews(mockNews.slice(0, this.newsLimit));
            this.newsOffset = this.newsLimit;
        }
    }
    
    async loadFeedWithTimeout(feed, timeout = 5000) {
        return new Promise(async (resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error(`Feed ${feed.name} timed out after ${timeout}ms`));
            }, timeout);
            
            try {
                const rssData = await this.fetchRSSFeed(feed.url);
                clearTimeout(timer);
                
                const processedNews = rssData.items.slice(0, 3).map(item => ({
                    title: item.title || 'Ingen titel',
                    excerpt: this.truncateText(
                        item.description || 
                        item['content:encoded'] || 
                        'Läs mer...', 
                        150
                    ),
                    source: feed.name,
                    date: item.pubDate || new Date().toISOString(),
                    image: this.extractRSSImage(item, rssData.channel) || 
                           `https://via.placeholder.com/400x200/ed1c24/ffffff?text=${encodeURIComponent(feed.name)}`,
                    url: item.link || '#',
                    category: feed.category,
                    author: item.author || item['dc:creator'] || '',
                    guid: item.guid?.value || item.link || ''
                }));
                
                resolve(processedNews);
            } catch (error) {
                clearTimeout(timer);
                reject(error);
            }
        });
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
        const card = document.createElement('article');
        card.className = 'news-card';
        card.setAttribute('role', 'article');
        card.setAttribute('tabindex', '0');
        
        // Make the entire card clickable
        card.innerHTML = `
            <div class="news-card-image">
                <img src="${article.image}" alt="${article.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x200/ed1c24/ffffff?text=GrapplingNytt'">
            </div>
            <div class="news-card-content">
                <h3 class="news-card-title">${article.title}</h3>
                <p class="news-card-excerpt">${article.excerpt}</p>
                <div class="news-meta">
                    <span class="news-source">${article.source}</span>
                    <span class="news-date">${this.formatDate(article.date)}</span>
                </div>
                <div class="news-card-link">
                    <span class="read-more">Läs mer →</span>
                </div>
            </div>
        `;
        
        // Add click event with proper URL handling
        const handleClick = (e) => {
            e.preventDefault();
            if (article.url && article.url !== '#') {
                // Open external links in new tab
                window.open(article.url, '_blank', 'noopener,noreferrer');
            } else {
                console.warn('No URL available for article:', article.title);
            }
        };
        
        // Add click and keyboard events
        card.addEventListener('click', handleClick);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClick(e);
            }
        });
        
        // Add hover effects
        card.addEventListener('mouseenter', () => {
            card.style.cursor = article.url && article.url !== '#' ? 'pointer' : 'default';
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
                    const rssData = await this.fetchRSSFeed(feed.url);
                    const adccRelated = rssData.items.filter(item => 
                        item.title?.toLowerCase().includes('adcc') ||
                        item.description?.toLowerCase().includes('adcc') ||
                        item['content:encoded']?.toLowerCase().includes('adcc')
                    ).slice(0, 2);
                    
                    adccNews = adccNews.concat(adccRelated.map(item => ({
                        title: this.truncateText(item.title, 60),
                        content: this.truncateText(
                            item.description || item['content:encoded'], 
                            100
                        ),
                        url: item.link
                    })));
                } catch (error) {
                    console.warn(`Failed to load ADCC updates from ${feed.name}:`, error.message);
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
                    const rssData = await this.fetchRSSFeed(feed.url);
                    const bjjItems = rssData.items.slice(0, 2).map(item => ({
                        title: this.truncateText(item.title, 50),
                        content: this.truncateText(
                            item.description || item['content:encoded'], 
                            80
                        ),
                        url: item.link
                    }));
                    bjjNews = bjjNews.concat(bjjItems);
                } catch (error) {
                    console.warn(`Failed to load BJJ news from ${feed.name}:`, error.message);
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
            this.loadMoreBtn.addEventListener('click', async () => {
                this.loadMoreBtn.disabled = true;
                this.loadMoreBtn.innerHTML = '<div class="loading-spinner"></div>Laddar fler...';
                
                try {
                    // If we have remaining news from the last load, show those first
                    if (this.remainingNews && this.remainingNews.length > 0) {
                        const moreNews = this.remainingNews.slice(0, this.newsLimit);
                        this.remainingNews = this.remainingNews.slice(this.newsLimit);
                        this.displayNews(moreNews);
                        
                        // If no more remaining news, try to load fresh content
                        if (this.remainingNews.length === 0) {
                            await this.loadMoreFromFeeds();
                        }
                    } else {
                        // Load fresh content from feeds
                        await this.loadMoreFromFeeds();
                    }
                } catch (error) {
                    console.error('Error loading more news:', error);
                    // Show mock news as fallback
                    const mockNews = this.getMockNews();
                    const startIndex = this.newsOffset;
                    const moreNews = mockNews.slice(startIndex, startIndex + this.newsLimit);
                    if (moreNews.length > 0) {
                        this.displayNews(moreNews);
                        this.newsOffset += moreNews.length;
                    }
                } finally {
                    this.loadMoreBtn.disabled = false;
                    this.loadMoreBtn.innerHTML = 'Ladda fler nyheter';
                }
            });
        }
    }
    
    async loadMoreFromFeeds() {
        const feeds = this.getRSSFeeds().slice(3, 6); // Load different feeds for variety
        const feedPromises = feeds.map(feed => this.loadFeedWithTimeout(feed, 3000)); // Shorter timeout for "load more"
        
        const results = await Promise.allSettled(feedPromises);
        let moreNews = [];
        
        results.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value.length > 0) {
                moreNews = moreNews.concat(result.value);
            }
        });
        
        if (moreNews.length > 0) {
            moreNews.sort((a, b) => new Date(b.date) - new Date(a.date));
            this.displayNews(moreNews.slice(0, this.newsLimit));
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
    
    // Extract image from RSS 2.0.1 item following specification
    extractRSSImage(item, channel) {
        // 1. Check for media:thumbnail (Media RSS extension)
        if (item['media:thumbnail']) {
            return item['media:thumbnail'].url;
        }
        
        // 2. Check for enclosure with image type
        if (item.enclosure && item.enclosure.type && 
            item.enclosure.type.startsWith('image/')) {
            return item.enclosure.url;
        }
        
        // 3. Extract from content:encoded or description
        const content = item['content:encoded'] || item.description || '';
        if (content) {
            const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
            if (imgMatch) return imgMatch[1];
            
            // Look for direct image URLs in content
            const urlMatch = content.match(/https?:\/\/[^\s<>"]+\.(jpg|jpeg|png|gif|webp)/i);
            if (urlMatch) return urlMatch[0];
        }
        
        // 4. Check channel image as fallback
        if (channel && channel.image && channel.image.url) {
            return channel.image.url;
        }
        
        return null;
    }
    
    // RSS Feed parsing following RSS 2.0.1 specification
    async fetchRSSFeed(url) {
        const proxies = [
            {
                name: 'RSS2JSON',
                url: `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`,
                type: 'json_converted'
            },
            {
                name: 'AllOrigins',
                url: `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
                type: 'json_wrapped'
            }
        ];
        
        for (const proxy of proxies) {
            try {
                const response = await fetch(proxy.url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, application/xml, text/xml, */*'
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                if (proxy.type === 'json_converted') {
                    const data = await response.json();
                    if (data.status === 'ok' && data.items) {
                        // Convert RSS2JSON format back to RSS 2.0.1 compliant structure
                        const rssData = this.convertFromRSS2JSON(data);
                        const validation = this.validateRSS201(rssData);
                        
                        if (!validation.valid) {
                            console.warn(`RSS validation errors for ${url}:`, validation.errors);
                        }
                        if (validation.warnings.length > 0) {
                            console.warn(`RSS validation warnings for ${url}:`, validation.warnings);
                        }
                        
                        return rssData;
                    }
                } else if (proxy.type === 'json_wrapped') {
                    const data = await response.json();
                    if (data.contents) {
                        const rssData = this.parseRSS201XML(data.contents);
                        const validation = this.validateRSS201(rssData);
                        
                        if (!validation.valid) {
                            console.warn(`RSS validation errors for ${url}:`, validation.errors);
                        }
                        if (validation.warnings.length > 0) {
                            console.warn(`RSS validation warnings for ${url}:`, validation.warnings);
                        }
                        
                        return rssData;
                    }
                }
            } catch (error) {
                console.warn(`RSS proxy ${proxy.name} failed for ${url}:`, error.message);
                continue;
            }
        }
        
        throw new Error(`All RSS proxies failed for URL: ${url}`);
    }
    
    // RSS 2.0.1 compliant XML parser
    parseRSS201XML(xmlString) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
            
            // Check for XML parsing errors
            const parserError = xmlDoc.querySelector('parsererror');
            if (parserError) {
                throw new Error(`XML parsing error: ${parserError.textContent}`);
            }
            
            // Validate RSS 2.0.1 structure
            const rssElement = xmlDoc.querySelector('rss');
            if (!rssElement) {
                throw new Error('Invalid RSS: Missing <rss> root element');
            }
            
            const version = rssElement.getAttribute('version');
            if (!version || !version.startsWith('2.0')) {
                console.warn(`RSS version ${version} may not be fully compatible with RSS 2.0.1`);
            }
            
            const channel = xmlDoc.querySelector('rss > channel');
            if (!channel) {
                throw new Error('Invalid RSS: Missing <channel> element');
            }
            
            // Extract channel metadata (RSS 2.0.1 required elements)
            const channelData = this.extractChannelData(channel);
            
            // Extract items following RSS 2.0.1 specification
            const items = channel.querySelectorAll('item');
            const parsedItems = Array.from(items).map(item => this.parseRSSItem(item));
            
            return {
                channel: channelData,
                items: parsedItems
            };
            
        } catch (error) {
            console.error('Error parsing RSS 2.0.1 XML:', error);
            throw error;
        }
    }
    
    // Extract RSS 2.0.1 channel data
    extractChannelData(channel) {
        const getElementText = (selector) => {
            const element = channel.querySelector(selector);
            return element ? element.textContent.trim() : '';
        };
        
        return {
            title: getElementText('title'), // Required
            link: getElementText('link'),   // Required
            description: getElementText('description'), // Required
            language: getElementText('language'),
            copyright: getElementText('copyright'),
            managingEditor: getElementText('managingEditor'),
            webMaster: getElementText('webMaster'),
            pubDate: getElementText('pubDate'),
            lastBuildDate: getElementText('lastBuildDate'),
            category: getElementText('category'),
            generator: getElementText('generator'),
            docs: getElementText('docs'),
            cloud: this.parseCloudElement(channel.querySelector('cloud')),
            ttl: getElementText('ttl'),
            image: this.parseImageElement(channel.querySelector('image')),
            rating: getElementText('rating'),
            textInput: this.parseTextInputElement(channel.querySelector('textInput')),
            skipHours: this.parseSkipHours(channel.querySelector('skipHours')),
            skipDays: this.parseSkipDays(channel.querySelector('skipDays'))
        };
    }
    
    // Parse RSS 2.0.1 item following specification
    parseRSSItem(item) {
        const getElementText = (selector) => {
            const element = item.querySelector(selector);
            return element ? element.textContent.trim() : '';
        };
        
        const getAllElements = (selector) => {
            return Array.from(item.querySelectorAll(selector)).map(el => el.textContent.trim());
        };
        
        // RSS 2.0.1 requires at least title OR description
        const title = getElementText('title');
        const description = getElementText('description');
        
        if (!title && !description) {
            console.warn('RSS item missing both title and description (RSS 2.0.1 violation)');
        }
        
        return {
            title: title,
            link: getElementText('link'),
            description: description,
            author: getElementText('author'),
            category: getAllElements('category'),
            comments: getElementText('comments'),
            enclosure: this.parseEnclosureElement(item.querySelector('enclosure')),
            guid: this.parseGuidElement(item.querySelector('guid')),
            pubDate: getElementText('pubDate'),
            source: this.parseSourceElement(item.querySelector('source')),
            // Common namespace extensions
            'content:encoded': getElementText('content\\:encoded'),
            'dc:creator': getElementText('dc\\:creator'),
            'dc:date': getElementText('dc\\:date'),
            'media:thumbnail': this.parseMediaThumbnail(item.querySelector('media\\:thumbnail'))
        };
    }
    
    // Helper methods for RSS 2.0.1 elements
    parseImageElement(imageEl) {
        if (!imageEl) return null;
        return {
            url: imageEl.querySelector('url')?.textContent || '',
            title: imageEl.querySelector('title')?.textContent || '',
            link: imageEl.querySelector('link')?.textContent || '',
            width: parseInt(imageEl.querySelector('width')?.textContent) || undefined,
            height: parseInt(imageEl.querySelector('height')?.textContent) || undefined,
            description: imageEl.querySelector('description')?.textContent || ''
        };
    }
    
    parseEnclosureElement(enclosureEl) {
        if (!enclosureEl) return null;
        return {
            url: enclosureEl.getAttribute('url') || '',
            length: parseInt(enclosureEl.getAttribute('length')) || 0,
            type: enclosureEl.getAttribute('type') || ''
        };
    }
    
    parseGuidElement(guidEl) {
        if (!guidEl) return null;
        return {
            value: guidEl.textContent.trim(),
            isPermaLink: guidEl.getAttribute('isPermaLink') !== 'false'
        };
    }
    
    parseSourceElement(sourceEl) {
        if (!sourceEl) return null;
        return {
            url: sourceEl.getAttribute('url') || '',
            value: sourceEl.textContent.trim()
        };
    }
    
    parseCloudElement(cloudEl) {
        if (!cloudEl) return null;
        return {
            domain: cloudEl.getAttribute('domain') || '',
            port: parseInt(cloudEl.getAttribute('port')) || 80,
            path: cloudEl.getAttribute('path') || '',
            registerProcedure: cloudEl.getAttribute('registerProcedure') || '',
            protocol: cloudEl.getAttribute('protocol') || ''
        };
    }
    
    parseTextInputElement(textInputEl) {
        if (!textInputEl) return null;
        return {
            title: textInputEl.querySelector('title')?.textContent || '',
            description: textInputEl.querySelector('description')?.textContent || '',
            name: textInputEl.querySelector('name')?.textContent || '',
            link: textInputEl.querySelector('link')?.textContent || ''
        };
    }
    
    parseSkipHours(skipHoursEl) {
        if (!skipHoursEl) return [];
        return Array.from(skipHoursEl.querySelectorAll('hour')).map(h => parseInt(h.textContent));
    }
    
    parseSkipDays(skipDaysEl) {
        if (!skipDaysEl) return [];
        return Array.from(skipDaysEl.querySelectorAll('day')).map(d => d.textContent.trim());
    }
    
    parseMediaThumbnail(thumbnailEl) {
        if (!thumbnailEl) return null;
        return {
            url: thumbnailEl.getAttribute('url') || '',
            width: parseInt(thumbnailEl.getAttribute('width')) || undefined,
            height: parseInt(thumbnailEl.getAttribute('height')) || undefined
        };
    }
    
    // Convert RSS2JSON format to our RSS 2.0.1 structure
    convertFromRSS2JSON(data) {
        return {
            channel: {
                title: data.feed?.title || '',
                link: data.feed?.link || '',
                description: data.feed?.description || '',
                image: data.feed?.image ? { url: data.feed.image } : null
            },
            items: data.items.map(item => ({
                title: item.title || '',
                link: item.link || '',
                description: item.description || '',
                pubDate: item.pubDate || '',
                author: item.author || '',
                'content:encoded': item.content || '',
                enclosure: item.enclosure || null,
                guid: item.guid ? { value: item.guid, isPermaLink: true } : null
            }))
        };
    }
    
    // Validate RSS 2.0.1 compliance
    validateRSS201(rssData) {
        const errors = [];
        const warnings = [];
        
        // Validate channel required elements
        if (!rssData.channel) {
            errors.push('Missing channel element');
            return { valid: false, errors, warnings };
        }
        
        if (!rssData.channel.title) {
            errors.push('Channel missing required title element');
        }
        
        if (!rssData.channel.link) {
            errors.push('Channel missing required link element');
        }
        
        if (!rssData.channel.description) {
            errors.push('Channel missing required description element');
        }
        
        // Validate items
        if (rssData.items && rssData.items.length > 0) {
            rssData.items.forEach((item, index) => {
                if (!item.title && !item.description) {
                    warnings.push(`Item ${index + 1}: Missing both title and description (RSS 2.0.1 requires at least one)`);
                }
                
                if (item.guid && typeof item.guid === 'object' && !item.guid.value) {
                    warnings.push(`Item ${index + 1}: GUID element present but empty`);
                }
                
                if (item.enclosure && (!item.enclosure.url || !item.enclosure.type)) {
                    warnings.push(`Item ${index + 1}: Enclosure missing required url or type attribute`);
                }
            });
        }
        
        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
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