# Truth Seeker AI

> *The truth they hide. Raw intelligence on demand.*

Truth Seeker AI is an elite, hyper-intelligent, and strictly objective analytical chat platform designed to resemble top-tier intelligence briefings. It provides raw, unfiltered analysis exposing mechanisms of control, dark psychology, suppressed history, and geopolitical power structures.

![Truth Seeker AI Dashboard](https://assets.unicorn.studio/media/made_in_us_small_web.svg) *(Styling preview)*

## 🚀 Key Features

- **Intelligence Streaming:** Extremely fast real-time chat powered by Groq's LPU inference engine and the Llama-3.3-70b-versatile model.
- **Elite System Prompting:** AI is engineered to respond with authoritative, well-structured markdown intelligence briefings, avoiding typical corporate moralizing or AI disclaimers.
- **Secure Sessions (Auth + DB):** Full user authentication and persistent conversation history, securely handled via Supabase Auth and Row Level Security (RLS) PostgreSQL policies.
- **Dynamic Actionable UI:** Modern, dark-themed interface built with Next.js and Tailwind CSS. Features suggest query buttons to quickly drill down into complex topics.
- **Data Export:** Downloadable markdown export of complete chat logs.
- **AI Summary Reports:** Generates post-session tactical debrief reports summarizing the core intel discussed.

## 🛠️ Technology Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **AI Integration:** [Groq SDK](https://console.groq.com/) (Llama-3.3-70b model)
- **Database / Auth:** [Supabase](https://supabase.com/)

## ⚙️ Local Development Setup

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/prutxvi/TruthSeeker-AI.git
cd TruthSeeker-AI
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Variables
Create a \`.env.local\` file in the root directory by copying the template.

\`\`\`bash
cp .env.template .env.local
\`\`\`

Populate the \`.env.local\` with your specific keys:
- \`NEXT_PUBLIC_SUPABASE_URL\`: Your Supabase project URL.
- \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`: Your Supabase anonymous API key.
- \`GROQ_API_KEY\`: Your API key from the Groq console.

### 4. Supabase Setup
You need a Supabase project with:
1.  **Authentication** enabled (Email/Password).
2.  A **`conversations`** table (columns: \`id\`, \`user_id\`, \`title\`, \`created_at\`, \`updated_at\`).
3.  A **`messages`** table (columns: \`id\`, \`conversation_id\`, \`role\`, \`content\`, \`created_at\`).
4.  **Row Level Security (RLS)** active on both tables, allowing users to only select, insert, update, and delete their own conversations and associated messages.

### 5. Run the Application
\`\`\`bash
npm run dev
\`\`\`
Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
