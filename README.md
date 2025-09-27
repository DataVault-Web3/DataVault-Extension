# Order History Extension

A Chrome extension that requests user consent to access Amazon order history with a modern Web3-style interface.

## Features

- 🎨 **Web3-Style UI**: Modern, gradient-based design with glass-morphism effects
- 🔒 **Privacy-First**: Explicit consent required before any data access
- 📦 **Order History Extraction**: Attempts to extract order data from various Amazon pages
- 🚫 **No Data Storage**: All data is only logged to console, no external transmission
- 📱 **Responsive Design**: Works on different screen sizes

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the extension folder
4. The extension icon should appear in your Chrome toolbar

## How It Works

1. **Visit Amazon**: Navigate to any Amazon.com page
2. **Consent Dialog**: A Web3-style modal will appear asking for consent
3. **Choose Response**:
   - **Allow**: Extension attempts to extract order history and logs it to console
   - **Decline**: Modal closes and no data is accessed
4. **View Results**: Open Developer Tools (F12) and check the Console tab for extracted data

## Data Extraction

The extension uses multiple strategies to extract order information:

- **Current Page Parsing**: Extracts visible order/product information
- **DOM Analysis**: Searches for order-related elements and attributes
- **Product Details**: Extracts current product information if on a product page
- **Local Storage**: Checks for cached order data (non-intrusive)

## Privacy & Security

- ✅ **Explicit Consent**: Always asks permission before accessing data
- ✅ **Local Only**: Data is only logged to browser console
- ✅ **No Transmission**: No data sent to external servers
- ✅ **No Storage**: No persistent data storage
- ✅ **Transparent**: Open source code for review

## Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Permissions**: Active tab access, scripting, Amazon.com host permissions
- **Content Security**: No external resources loaded

## File Structure

```
extension-order-history/
├── manifest.json          # Extension configuration
├── content.js            # Main extraction logic
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
├── popup-styles.css      # Popup styling
├── styles.css            # Content script styling
├── background.js         # Service worker
├── icons/               # Extension icons
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md            # This file
```

## Development

The extension is built with vanilla JavaScript, HTML, and CSS. No external dependencies required.

### Key Components

- **Content Script**: Injected into Amazon pages, handles consent and extraction
- **Background Script**: Service worker for extension lifecycle management
- **Popup**: Extension toolbar popup with status information

## Troubleshooting

- **No dialog appears**: Ensure you're on an Amazon.com page and refresh
- **No data extracted**: Try visiting your Amazon orders page specifically
- **Console empty**: Make sure Developer Tools are open before clicking "Allow"

## Legal Notice

This extension is for demonstration and educational purposes. Users are responsible for compliance with Amazon's Terms of Service and applicable privacy laws.
