# ProofOf.ai - Browser Extension

**Deepfake Detection & Blockchain Verification - Right in Your Browser**

## Features

- 🔍 **Real-Time Detection** - Scan images on any webpage for deepfakes
- ⛓️ **Blockchain Verification** - Every scan is verified on Polygon blockchain
- 💰 **Earn JABL Tokens** - Get rewarded for protecting the internet
- 🛡️ **Visual Indicators** - See verification status directly on images
- 📊 **Track Statistics** - Monitor your contributions and earnings

## Installation

### For Development

1. Clone the repository:
   ```bash
   cd ai-safety-empire/browser-extension
   ```

2. Open Chrome and go to `chrome://extensions/`

3. Enable "Developer mode" (toggle in top right)

4. Click "Load unpacked"

5. Select the `browser-extension` folder

6. The extension is now installed! 🎉

### For Production

1. Download from Chrome Web Store (coming soon)
2. Click "Add to Chrome"
3. Start protecting the internet!

## Usage

### Scan Images on a Page

1. Click the ProofOf.ai extension icon in your browser
2. Click "Scan Images on Page"
3. View results instantly
4. Earn JABL tokens for each scan!

### Right-Click Verification

1. Right-click on any image
2. Select "Verify with ProofOf.ai"
3. Get instant results
4. See blockchain verification

### Visual Indicators

- Hover over images to see the "🛡️ Verify" button
- Click to verify that specific image
- Results show directly on the image

## How It Works

### Detection Process

1. **Image Capture** - Extension identifies images on the page
2. **API Request** - Sends image URL to AI Safety Empire API
3. **AI Analysis** - Multiple AI models analyze the image
4. **Council Voting** - 6 AIs vote on authenticity
5. **Blockchain Logging** - Decision is logged to Polygon blockchain
6. **Result Display** - You see the result instantly

### Reward System

- **Authentic Image**: +10 JABL tokens
- **Deepfake Detected**: +100 JABL tokens
- **Blockchain Verified**: Immutable proof of your contribution

### Privacy

- **No Image Upload** - Only URLs are sent to the API
- **No Tracking** - We don't track your browsing
- **Local Storage** - Your stats are stored locally
- **Optional Auth** - Sign in for blockchain rewards

## Configuration

### API Endpoint

By default, the extension connects to `http://localhost:8000` for development.

To change the API endpoint:

1. Open `popup.js`
2. Change `API_URL` constant
3. Reload the extension

### Production API

```javascript
const API_URL = 'https://api.aisafety.ai';
```

## Files Structure

```
browser-extension/
├── manifest.json          # Extension configuration
├── popup.html            # Popup UI
├── popup.js              # Popup logic
├── background.js         # Background service worker
├── content.js            # Content script (runs on pages)
├── content.css           # Content styles
├── icons/                # Extension icons
│   ├── icon-16.png
│   ├── icon-48.png
│   └── icon-128.png
└── README.md            # This file
```

## Development

### Testing

1. Make changes to the code
2. Go to `chrome://extensions/`
3. Click the reload icon on the ProofOf.ai extension
4. Test on any webpage

### Debugging

- **Popup**: Right-click extension icon → "Inspect popup"
- **Background**: Go to `chrome://extensions/` → "Service worker"
- **Content Script**: Open DevTools on any webpage

### Building for Production

```bash
# Create icons (if not already created)
# TODO: Add icon generation script

# Zip the extension
cd browser-extension
zip -r proofof-ai-extension.zip * -x "*.git*" -x "README.md"
```

## API Integration

The extension integrates with the AI Safety Empire API:

### Endpoints Used

- `POST /verify/` - Verify image for deepfakes
- `GET /blockchain/tokens/jabl/balance` - Get JABL balance
- `POST /blockchain/log-decision` - Log decision to blockchain

### Authentication

Optional API key for blockchain rewards:

```javascript
// In popup.js or background.js
const headers = {
  'Authorization': 'Bearer YOUR_API_KEY'
};
```

## Roadmap

### v1.0 (Current)
- [x] Basic deepfake detection
- [x] Popup interface
- [x] JABL token tracking
- [x] Context menu integration

### v1.1 (Next)
- [ ] User authentication
- [ ] Real blockchain sync
- [ ] Detailed analysis view
- [ ] Settings page

### v1.2 (Future)
- [ ] Video deepfake detection
- [ ] Audio deepfake detection
- [ ] Social media integration
- [ ] Community reporting

### v2.0 (Advanced)
- [ ] Real-time protection
- [ ] Automatic scanning
- [ ] Browser notifications
- [ ] Dashboard integration

## Contributing

We welcome contributions! Please see our [Contributing Guide](../CONTRIBUTING.md).

## Support

- 📚 [Documentation](https://docs.aisafety.ai)
- 💬 [Discord Community](https://discord.gg/aisafety)
- 🐛 [Report Issues](https://github.com/ai-safety-empire/browser-extension/issues)
- 📧 [Email Support](mailto:support@aisafety.ai)

## License

MIT License - see [LICENSE](../LICENSE) file for details.

## Credits

Built with purpose by the AI Safety Empire team.

Powered by:
- AI Safety Empire API
- Polygon Blockchain
- JabulonCoin (JABL)
- Council of AIs

---

**Protect the internet. Earn rewards. Build trust.**

[Website](https://proofof.ai) | [Documentation](https://docs.aisafety.ai) | [GitHub](https://github.com/ai-safety-empire)

