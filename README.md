
📖 About The Project
Kaam Kinara is a modern, full-stack application designed to seamlessly connect skilled service providers (Workers) with individuals seeking their expertise (Customers). Whether you need a plumber, a graphic designer, or a private tutor, Kaam Kinara provides a reliable and user-friendly marketplace to find and book local services.

This project is built with the latest technologies to ensure a scalable, performant, and maintainable platform. It features distinct, feature-rich dashboards for customers, workers, and administrators, creating a tailored experience for every user role.

🚀 Key Features
👤 Role-Based Dashboards: Separate, feature-rich interfaces for Customers, Workers, and Administrators.

📅 Seamless Booking & Scheduling: An intuitive calendar-based system for customers to book services and for workers to manage their schedules.

🛠️ Gig & Service Management: Workers can easily create, update, and manage their service listings (gigs).

💬 Real-Time Messaging: Integrated chat functionality allows for direct and instant communication between customers and workers.

🔍 Service Discovery: Customers can browse and search for available services.

🔐 Secure Authentication: Safe and secure login and signup functionality for all user roles.

💅 Modern & Responsive UI: Beautifully designed with Tailwind CSS and Shadcn/UI, ensuring a great experience on any device.

⚡ Optimistic UI Updates: Smooth user experience with optimistic updates for actions like messaging and booking.

🛠️ Built With
This project leverages a modern, powerful tech stack to deliver a top-tier user experience.

Framework: Next.js 14 (with App Router)

Language: TypeScript

Styling: Tailwind CSS

UI Components: Shadcn/UI

State Management: Zustand

Calendar: React Day Picker

Deployment: Vercel

🏁 Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites
Make sure you have the following installed on your machine:

Node.js (v18 or later)

pnpm

Installation
Clone the repository:

git clone https://github.com/anasraheemdev/kaamkinara.git
cd kaamkinara

Install dependencies:

pnpm install

Set up environment variables:
Create a .env.local file in the root of your project and add the necessary environment variables.

# Example .env.local
NEXT_PUBLIC_API_URL="http://localhost:3000/api"

# Add other variables for database, auth, etc.
DATABASE_URL="..."
NEXTAUTH_URL="..."
NEXTAUTH_SECRET="..."

Run the development server:

pnpm dev

Open http://localhost:3000 with your browser to see the result.

📂 Project Structure
The project uses the Next.js App Router for intuitive file-based routing.

kaamkinara/
├── app/                      # Main application folder
│   ├── (auth)/               # Authentication routes (login, signup)
│   ├── (dashboard)/          # Main dashboard layouts and pages
│   │   ├── admin/            # Admin-specific routes
│   │   ├── customer/         # Customer-specific routes
│   │   └── worker/           # Worker-specific routes
│   ├── api/                  # API routes
│   ├── globals.css           # Global styles
│   └── layout.tsx            # Root layout
├── components/               # Shared React components
│   ├── calendar/             # Calendar and scheduling components
│   ├── chat/                 # Chat interface components
│   ├── layout/               # Layout components (sidebar, dashboard)
│   └── ui/                   # Reusable UI elements from Shadcn/UI
├── lib/                      # Utility functions and libraries
│   ├── chat-store.ts         # Zustand store for chat state
│   └── utils.ts              # Helper functions
├── public/                   # Static assets
└── tailwind.config.ts        # Tailwind CSS configuration

🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
Distributed under the MIT License. See LICENSE for more information.

📧 Contact
Anas Raheem - @anasraheemdev - anasraheem48@gmail.com

Project Link: https://github.com/anasraheemdev/kaamkinara
