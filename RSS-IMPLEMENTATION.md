# RSS 2.0.1 Implementation

This document describes the RSS 2.0.1 compliant implementation used in GrapplingNytt.se.

## RSS 2.0.1 Specification Compliance

Our implementation follows the [RSS 2.0.1 specification](https://www.rssboard.org/rss-2-0-1) as defined by the RSS Board.

### Core Structure

```xml
<rss version="2.0">
  <channel>
    <!-- Required elements -->
    <title>Channel Name</title>
    <link>Channel URL</link>
    <description>Channel Description</description>
    
    <!-- Optional elements -->
    <language>en-us</language>
    <pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
    <!-- ... more optional elements -->
    
    <item>
      <!-- At least title OR description required -->
      <title>Article Title</title>
      <description>Article Description</description>
      <link>Article URL</link>
      <pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
      <!-- ... more optional elements -->
    </item>
  </channel>
</rss>
```

## Implementation Features

### 1. Proper XML Parsing

- Uses `DOMParser` with `application/xml` MIME type
- Validates XML structure before processing
- Handles parsing errors gracefully

### 2. RSS 2.0.1 Validation

The implementation includes comprehensive validation:

#### Required Channel Elements
- `<title>` - Channel name
- `<link>` - Channel URL
- `<description>` - Channel description

#### Required Item Elements
- At least one of `<title>` OR `<description>` must be present

#### Optional Elements Supported
- **Channel**: `language`, `copyright`, `pubDate`, `ttl`, `image`, etc.
- **Item**: `author`, `category`, `enclosure`, `guid`, `source`, etc.

### 3. Namespace Extensions

Supports common RSS extensions:
- **Content**: `content:encoded` for full article content
- **Dublin Core**: `dc:creator`, `dc:date` for metadata
- **Media RSS**: `media:thumbnail` for images

### 4. Error Handling

- Graceful fallback when RSS feeds fail
- Detailed error logging for debugging
- Continues operation even with malformed feeds

## Feed Processing Pipeline

1. **Fetch RSS XML** via proxy services
2. **Parse XML** using RSS 2.0.1 parser
3. **Validate Structure** against specification
4. **Extract Content** with proper element handling
5. **Process Images** from multiple sources
6. **Display Content** in website format

## Proxy Services

Multiple proxy services ensure reliable RSS access:

1. **AllOrigins** - Returns raw XML for parsing
2. **RSS2JSON** - Pre-processes to JSON format

## Image Extraction Priority

Images are extracted in order of preference:

1. `media:thumbnail` (Media RSS extension)
2. `enclosure` with image MIME type
3. Images in `content:encoded` or `description`
4. Channel default image
5. Placeholder image

## Supported RSS Sources

Current grappling/BJJ RSS feeds:

- **Jits Magazine**: BJJ news, techniques, results
- **Grapplezilla**: Grappling news, BJJ, wrestling
- **BJJ Bear**: Grappling, BJJ, MMA blog
- **Inside BJJ Podcast**: BJJ interviews & stories
- **FloGrappling**: Professional grappling coverage
- **BJJEE**: European BJJ news
- **Grappling Insider**: Grappling news and analysis

## Usage Examples

### Basic RSS Parsing

```javascript
const grapplingNytt = new GrapplingNytt();
const rssData = await grapplingNytt.fetchRSSFeed('https://example.com/feed');

// RSS 2.0.1 compliant structure
console.log(rssData.channel.title);
console.log(rssData.items[0].title);
```

### Validation

```javascript
const validation = grapplingNytt.validateRSS201(rssData);
if (!validation.valid) {
    console.error('RSS validation errors:', validation.errors);
}
```

## Configuration

RSS feeds are configured in `data/rss-feeds.json`:

```json
{
  "feeds": [
    {
      "name": "Feed Name",
      "url": "https://example.com/feed",
      "category": "bjj",
      "active": true,
      "priority": 1
    }
  ]
}
```

## Performance Considerations

- **Caching**: 15-minute cache for RSS content
- **Rate Limiting**: Max 3 feeds loaded simultaneously
- **Timeouts**: 10-second timeout per feed
- **Fallbacks**: Mock data if all RSS feeds fail

## Debugging

Enable RSS debugging in browser console:

```javascript
// Check RSS parsing
localStorage.setItem('debug-rss', 'true');

// View validation results
console.log('RSS validation results appear in console');
```

## Future Enhancements

- [ ] RSS feed discovery (autodiscovery)
- [ ] Atom 1.0 feed support
- [ ] RSS analytics and statistics
- [ ] Custom RSS feed management interface
- [ ] RSS feed performance monitoring