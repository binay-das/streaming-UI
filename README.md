# Streaming UI

A modern, minimalistic AI chat interface built with Next.js, Tailwind CSS, and the Google Gemini API. This project demonstrates a real-time streaming response UI experience.

## Features

-   **Real-time Streaming**: Seamless text streaming from the Gemini API.
-   **Modern UI**: Clean, minimalistic design inspired by top-tier chat applications.
-   **Dark/Light Mode**: Fully responsive theme switching with system preference detection.
-   **Markdown Support**: Renders code blocks, lists, and other markdown elements beautifully.
-   **Interactive Elements**:
    -   Copy to clipboard with visual feedback (tick icon & toast).
    -   Loading animations.
    -   Responsive message bubbles.

## Tech Stack

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **AI Integration**: [Google Generative AI SDK](https://www.npmjs.com/package/@google/generative-ai)
-   **Components**: [shadcn/ui](https://ui.shadcn.com/) (Sonner, Tooltip, Button, ScrollArea)

## Getting Started

### Prerequisites

-   Node.js 18+ installed.
-   A Google Gemini API Key.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/streaming-ui.git
    cd streaming-ui
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    # or
    npm install
    ```

3.  **Configure Environment Variables:**

    Create a `.env` file in the root directory and add your API key:

    ```env
    API_KEY=your_api_key_here
    ```

4.  **Run the development server:**

    ```bash
    pnpm dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.