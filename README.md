# AI-Powered RFP Management System

An intelligent Request for Proposal (RFP) management platform that automates vendor outreach, proposal parsing, and intelligent comparison using AI.

## 1. Project Setup

### a. Prerequisites

**Node.js & Package Managers:**
- Node.js v18+ (for Angular 18 and modern ES features)
- npm v9+ or yarn v1.22+

**Database:**
- MongoDB v6.0+ (local installation or MongoDB Atlas)

**API Keys:**
- OpenAI API key (for GPT-based parsing) OR
- Anthropic API key (for Claude-based parsing)
- Gmail account with App Password enabled for email integration

### b. Installation Steps

**Backend Setup:**
```bash
cd backend
npm install
```

**Frontend Setup:**
```bash
cd frontend
npm install
```

### c. Email Configuration

**Enable Gmail App Passwords:**
1. Go to Google Account → Security → 2-Step Verification
2. Navigate to App Passwords
3. Generate a new app password for "Mail"
4. Copy the 16-character password

**Configure `.env` file in backend root:**
```env
# Database
MONGO_URI=mongodb://localhost:27017/rfp-system
PORT=4000

# Email Sending (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password-here

# Email Receiving (IMAP)
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_USER=your-email@gmail.com
IMAP_PASS=your-app-password-here
IMAP_POLL_INTERVAL=60

# AI Configuration
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
AI_MOCK=false
```

### d. Running Locally

**Start MongoDB:**
```bash
mongod --dbpath /path/to/data
```

**Start Backend (Terminal 1):**
```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```
Backend runs on `http://localhost:4000`

**Start Frontend (Terminal 2):**
```bash
cd frontend
npm start  # or ng serve
```
Frontend runs on `http://localhost:4200`

**Access the Application:**
Open `http://localhost:4200` in your browser

### e. Seed Data & Initial Scripts

**Populate Initial Data:**
```bash
cd backend
npm run seed
```
This creates sample RFPs, vendors, and proposals in the database.

**Test Email Functionality:**
```bash
npm run mock-email
```
Simulates sending/receiving proposal emails for testing.

---

## 2. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | Angular | 18.0.0 |
| **UI Library** | Angular Material + CDK | 18.0.0 |
| **State Management** | RxJS | 7.8.0 |
| **Backend** | Node.js + Express | 4.18.2 |
| **Database** | MongoDB + Mongoose | 8.0.0 |
| **AI Providers** | OpenAI API / Anthropic Claude | 4.20.0 / 0.9.0 |
| **Email Solution** | Nodemailer (SMTP) + imap-simple (IMAP) | 6.9.7 / 5.1.0 |
| **Key Libraries** | TypeScript, dotenv, cors, body-parser | 5.4.0+ |

---

## 3. API Documentation

### AI Endpoints

**Parse RFP from Natural Language**
```http
POST /api/ai/parse-rfp
Content-Type: application/json

{
  "naturalLanguageText": "I need a website with payment integration, due by Jan 15, budget $50k"
}

Response 200:
{
  "title": "Website Development with Payment Integration",
  "description": "...",
  "requirements": ["Payment gateway", "Responsive design"],
  "deadline": "2025-01-15T00:00:00.000Z",
  "budget": 50000
}
```

**Parse Vendor Proposal Email**
```http
POST /api/ai/parse-proposal
Content-Type: application/json

{
  "emailBody": "We propose $45k for 6 months timeline..."
}

Response 200:
{
  "proposedCost": 45000,
  "timeline": "6 months",
  "keyFeatures": ["Custom design", "API integration"],
  "experience": "10 years",
  "teamSize": 5
}
```

**Compare Proposals**
```http
POST /api/ai/compare
Content-Type: application/json

{
  "rfpId": "64abc123..."
}

Response 200:
{
  "comparison": [
    {
      "vendor": {...},
      "score": 85,
      "strengths": ["Best price", "Fast delivery"],
      "weaknesses": ["Smaller team"]
    }
  ],
  "recommendation": "Vendor A recommended due to cost-effectiveness..."
}
```

### RFP Endpoints

```http
GET    /api/rfps              - List all RFPs
POST   /api/rfps              - Create new RFP
POST   /api/rfps/:id/send     - Send RFP to vendors
```

### Vendor Endpoints

```http
GET    /api/vendors           - List vendors
POST   /api/vendors           - Add new vendor
PUT    /api/vendors/:id       - Update vendor
DELETE /api/vendors/:id       - Delete vendor
```

### Proposal Endpoints

```http
GET    /api/proposals         - List all proposals
GET    /api/proposals/rfp/:rfpId - Get proposals for RFP
```

### Email Endpoints

```http
POST   /api/email/check       - Manually trigger email check
```

**Error Responses (All endpoints):**
```json
{
  "error": "Detailed error message"
}
```
Status: 500 (Server Error), 400 (Bad Request), 404 (Not Found)

---

## 4. Decisions & Assumptions

### a. Key Design Decisions

**Model Architecture:**
- **Proposal Schema:** Stores both raw email content (`subject`, `body`) and AI-extracted `parsedData` separately to enable re-parsing if AI models improve
- **RFP-Vendor-Proposal Relationships:** Uses MongoDB ObjectId references with Mongoose `.populate()` for efficient joins
- **Score Calculation:** AI generates numeric scores (0-100) plus textual recommendations for human review

**Data Flow:**
1. User creates RFP → AI parses natural language into structured fields
2. System emails RFP to selected vendors via SMTP
3. IMAP service polls inbox every 60s for replies
4. AI extracts proposal details (cost, timeline, features) from email body
5. Comparison endpoint aggregates all proposals and generates rankings

**AI Integration:**
- Dual provider support (OpenAI GPT / Anthropic Claude) via `AI_PROVIDER` env variable
- Mock mode (`AI_MOCK=true`) returns hardcoded responses for development without API costs

### b. Assumptions

**Email Assumptions:**
- Vendors reply to the same email thread used to send the RFP
- Proposal emails are plain text or simple HTML (no complex attachments or PDFs)
- Email subject contains "RFP" or "Proposal" keywords for filtering
- Gmail IMAP allows automated access (requires App Password, not regular password)

**Format Assumptions:**
- Natural language RFP input is 1-3 sentences describing the project
- Vendor proposals mention cost (with currency symbol or keywords like "budget"), timeline (in weeks/months), and key deliverables
- Deadline dates are parseable by AI (e.g., "Jan 15 2025", "in 3 weeks")

**Limitations:**
- No file attachment handling for proposals (PDFs, DOCX)
- No multi-user authentication (single admin user implied)
- No real-time notifications (relies on IMAP polling every 60s)
- Comparison limited to proposals with complete `parsedData` (missing fields may skew scoring)

---

## 5. AI Tools Usage

### a. AI Tools Used

**During Development:**
- **GitHub Copilot** - Code completion and boilerplate generation
- **ChatGPT (GPT-4)** - Architecture design discussions, debugging complex Mongoose queries
- **Claude (Anthropic)** - Refining prompt engineering for proposal parsing
- **Cursor AI** - Multi-file refactoring and component scaffolding

**In Production (Part of the System):**
- **OpenAI GPT-4 Turbo** - Primary AI for parsing RFPs and proposals
- **Anthropic Claude 3** - Alternative AI provider for comparison

### b. What They Helped With

**Copilot:**
- Generated Angular Material form templates for Create RFP component
- Auto-completed IMAP email parsing logic in `receiveEmailService.js`
- Suggested Mongoose schema indexes for performance

**ChatGPT:**
- Debugged CORS issues between Angular (port 4200) and Express (port 4000)
- Designed the AI service architecture (single service with pluggable providers)
- Helped structure the `Proposal` schema to balance raw data vs. parsed data storage

**Claude:**
- Optimized prompt templates for extracting structured JSON from unstructured proposal text
- Suggested scoring criteria (cost, timeline, experience, features) for proposal comparison
- Reviewed security implications of storing email credentials

**Cursor:**
- Batch renamed components from initial prototype names to final naming convention
- Refactored CSS from inline styles to component-scoped stylesheets

### c. Notable Prompts/Approaches

**RFP Parsing Prompt (to OpenAI):**
```
Extract RFP details as JSON from this text: "{naturalLanguageText}"
Return: { title, description, requirements: string[], deadline: ISO date, budget: number }
```

**Proposal Comparison Prompt:**
```
Compare these proposals for RFP requirements. Score each 0-100 based on:
- Cost competitiveness (30%)
- Timeline feasibility (25%)
- Vendor experience (20%)
- Feature completeness (25%)

Return: { vendor, score, strengths: [], weaknesses: [] } for each, plus overall recommendation.
```

**Iterative Approach:**
- Started with mock AI responses to finalize data models before spending API credits
- Tested with 3 real vendor emails to refine extraction accuracy
- Adjusted prompts when AI misidentified currency (£ vs $ vs ₹)

### d. Learnings & Changes

**What I Learned:**
- AI parsing accuracy improves significantly with structured output formats (JSON schema in prompt)
- Email body text often has formatting quirks (extra newlines, signatures) - preprocessing cleaned this
- Mock mode was essential - saved ~$50 in API costs during development

**Changes Due to AI Tools:**
- **Original Plan:** Manually defined scoring weights in code
- **AI-Influenced Change:** Let AI dynamically generate scoring based on RFP-specific priorities (AI reads requirements and adjusts weights)

- **Original Plan:** Store only parsed data from proposals
- **Tool Insight:** Copilot suggested keeping raw `body` field for debugging/re-parsing, which proved invaluable when tweaking prompts

- **Prompt Evolution:** Initial proposal parsing prompt was too verbose (200 words). Claude helped reduce it to 50 words with better results

---

## Project Structure

```
rfp-system/
├── backend/
│   ├── models/           # Mongoose schemas (RFP, Proposal, Vendor)
│   ├── controllers/      # Route handlers (aiController, rfpController, etc.)
│   ├── routes/           # Express route definitions
│   ├── services/
│   │   ├── ai/           # AI parsing logic (aiService.js)
│   │   └── email/        # SMTP/IMAP services
│   ├── scripts/          # seed.js, mockEmail.js
│   ├── server.js         # Express app entry point
│   └── .env              # Environment variables (DO NOT COMMIT)
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── components/   # Dashboard, Inbox, CreateRFP, Compare, etc.
    │   │   ├── services/     # HTTP services (ai.service, rfp.service)
    │   │   ├── models/       # TypeScript interfaces
    │   │   └── app.routes.ts # Angular routing
    │   ├── environments/     # environment.ts, environment.prod.ts
    │   └── styles.css        # Global styles
    └── angular.json          # Angular CLI config
```

---

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit `.env` file** - Add it to `.gitignore`
2. **Rotate credentials** before deploying to production
3. **Use environment-specific secrets** (AWS Secrets Manager, Azure Key Vault)
4. **Gmail App Passwords** should be unique per application
5. **API Keys** - Set spending limits on OpenAI/Anthropic dashboards

---

## Troubleshooting

**MongoDB Connection Issues:**
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB (macOS/Linux)
brew services start mongodb-community

# Start MongoDB (Windows)
net start MongoDB
```

**Email Not Sending/Receiving:**
- Verify Gmail App Password is correct (not your regular password)
- Check "Less secure app access" is NOT enabled (use App Passwords instead)
- Ensure IMAP is enabled in Gmail settings

**AI Parsing Errors:**
- Set `AI_MOCK=true` in `.env` to test without API calls
- Check API key format (OpenAI starts with `sk-`, Anthropic with `sk-ant-`)
- Verify API quota/billing on provider dashboard

---

## License

MIT License - Feel free to use for learning or commercial projects.

---

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Contact

For questions or issues, please open a GitHub issue or contact the maintainer.

**Built with ❤️ using AI-assisted development tools**
