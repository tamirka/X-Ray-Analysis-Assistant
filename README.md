# X-Ray Analysis Assistant

An AI-powered application for preliminary analysis of X-ray images. Patients can upload their X-rays to receive an initial assessment and guidance on next steps, such as booking a consultation.

This project is built with React, TypeScript, Vite, and uses a Vercel serverless function to securely interact with the OpenAI API.

## Getting Started

### Prerequisites

- Node.js (version 18 or later)
- An OpenAI API key

### Local Development

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd x-ray-analysis-assistant
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env` in the root of the project by copying the example file:
    ```bash
    cp .env.example .env
    ```
    Open the new `.env` file and add your OpenAI API key:
    ```
    OPENAI_API_KEY="your_openai_api_key_here"
    ```

4.  **Run the development server:**
    This command starts both the Vite frontend and the Vercel serverless function.
    ```bash
    npm run dev
    ```
    The application should now be running on `http://localhost:5173` (or another port if 5173 is in use).

### Deployment

This application is configured for easy deployment on [Vercel](https://vercel.com/).

1.  Push your code to a Git repository (GitHub, GitLab, etc.).
2.  Import the project into Vercel. Vercel will automatically detect the Vite configuration and build settings.
3.  **Configure Environment Variables:** In your Vercel project settings, go to **Settings > Environment Variables** and add the following:
    -   **Name:** `OPENAI_API_KEY`
    -   **Value:** Your OpenAI API key

Vercel will automatically deploy your project upon successful setup.

## Disclaimer

This tool provides a preliminary AI-based analysis and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare professional.
