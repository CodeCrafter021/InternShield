# InternShield

InternShield is a student-first internship safety platform designed to help students verify whether a company or internship offer is genuine before they trust it, share personal data, or pay any fee.

The platform combines company verification, offer-letter analysis, student reports, and AI-assisted scam detection into one streamlined experience.

Live Demo: https://intern-shield-blue.vercel.app/

## Why InternShield?

Students often receive internship offers that look legitimate but are actually fraudulent. These offers may:

- ask for upfront money or deposits
- use suspicious or fake email domains
- show mismatched company information
- use vague job descriptions or unrealistic promises
- hide red flags in the offer letter or recruiter communication

InternShield helps students make informed decisions by scanning available evidence and presenting a clear risk assessment.

## Problem Statement

As internships become more competitive, scam operations have become more sophisticated. A large number of students fall victim to fake internship offers and recruitment traps, losing both time and money.

There is currently no simple, transparent, and student-friendly system that consolidates:

- company reputation checks
- domain and website validation
- suspicious offer detection
- risk scoring based on evidence
- community-driven warnings and reports

InternShield fills that gap.

## Solution Overview

InternShield provides a smart verification dashboard where users can:

- search a company or internship listing
- evaluate company and domain credibility
- review suspicious patterns in internship communication
- analyze offer letter risk signals
- read community and student feedback
- receive an overall trust score and evidence-based verdict

## Key Features

### 1. Company Verification
Users can search for a company and inspect:

- website credibility
- domain trust indicators
- company identity signals
- historical and community risk data

### 2. Offer Letter & Communication Risk Analysis
The system checks for:

- payment requests
- vague or manipulated job details
- unusual recruiter behavior
- mismatched domain and company information
- suspicious email patterns

### 3. Trust Score Engine
Each company or opportunity is analyzed and assigned a risk category such as:

- Low Risk
- Medium Risk
- High Risk

This gives users a quick, readable decision support tool rather than a vague or black-box result.

### 4. Student Reviews & Threat Intelligence
Students can contribute to a wider trust network by reporting suspicious companies and offers. This helps others avoid similar experiences.

### 5. Privacy-Focused Experience
InternShield emphasizes transparency and user safety. It allows students to verify offers before sharing sensitive personal information or making financial commitments.

## How It Works

1. User enters a company name or checks an offer letter.
2. InternShield validates the company profile, website, and online presence.
3. Reputation and risk signals are analyzed against suspicious patterns.
4. The platform returns a clear verdict with evidence and guidance.

## Architecture

InternShield is built as a full-stack web application with a modern frontend and secure backend.

### Frontend
- React
- Vite
- React Router
- Framer Motion
- Modern glassmorphism UI

### Backend
- Java
- Spring Boot
- Spring Security
- JWT authentication support
- REST APIs for auth and verification workflows

### Database / Data Layer
- PostgreSQL support configured for production-ready persistence

### Security & Validation
- JWT-based authentication framework
- API security structure
- validation logic for user and company checks

## Project Structure

```bash
InternShield/
├── backend/              # Spring Boot API and service layer
│   ├── src/
│   ├── pom.xml
│   └── README.md
├── frontend/             # React + Vite website
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
├── .github/
├── .vscode/
├── README.md             # Main project documentation
└── .gitignore
```

## Demo and Deployment

The project is deployed on Vercel for the frontend:

https://intern-shield-blue.vercel.app/

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, Vite, CSS, Framer Motion |
| Backend | Java, Spring Boot |
| Security | Spring Security, JWT |
| Database | PostgreSQL |
| Deployment | Vercel (Frontend), backend-ready for Java hosting |

## Getting Started

### Prerequisites

Before running the project, ensure you have:

- Node.js 18+
- npm or yarn
- Java 17+
- Maven
- PostgreSQL (for full backend functionality)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will run in development mode and can be opened in the browser using the local Vite URL.

### Backend Setup

```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

### Environment Variables

Create environment files as required:

- frontend/.env
- backend application properties for database and JWT configuration

Example values include API base URLs, database credentials, and security secrets.

## Application Flow

The typical user experience is:

- sign up or log in
- go to the dashboard
- search a company or internship opportunity
- check risk indicators
- view evidence summary and trust score
- decide whether to proceed or report the opportunity

## Roadmap

Planned improvements include:

- OCR-based offer-letter scanning
- AI-powered NLP scam detection
- stronger company database validation
- real-time community reporting system
- enhanced dashboard analytics
- mobile-first experience improvements
- production deployment and API integration hardening

## Impact

InternShield is designed to protect students from online fraud and build a safer internship ecosystem. The aim is not only to detect scam opportunities but also to create awareness, transparency, and trust in the internship hiring process.

## Project Vision

The vision of InternShield is to become a trusted safety layer for students entering the job market — a platform that helps them verify opportunities quickly, confidently, and without fear of exploitation.

## License

This project is for academic and portfolio use unless otherwise specified.

## Contact

For project collaboration, questions, or demo discussions, connect through the project repository or the public portfolio website.

---

Developed with the goal of protecting students from fraudulent internship opportunities and building a more trustworthy hiring ecosystem.
