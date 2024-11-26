# nodes24-travelagents


# NextGen Travel Agents

A Berlin Museum Itinerary Planner using Neo4j and Langgraph’s AI Agentic for a personalized travel experience. 

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Installation](#installation)
5. [Database Setup](#database-setup)
6. [Usage](#usage)
7. [Configuration](#configuration)
8. [Contributing](#contributing)
9. [License](#license)
10. [Acknowledgments](#acknowledgments)

---

### Project Overview

This project is a personalized travel itinerary planner with a limited scope of Berlin museums. It uses Langgraph’s multiple AI Agents architecture, along with Neo4j graph databases to provide. The system allows users to generate optimized itineraries that consider distance, time, and user interests.

### Tech Stack

| Technology | Description                             |
|------------|-----------------------------------------|
| Language   | JavaScript                |
| Framework  | Next.js                    |
| Database   | Neo4j                    |
| Tools      | Langgraph, Neo4j     |

### Getting Started

Explain prerequisites for setting up the project (e.g., system requirements, libraries, API keys). Include links to any external accounts or resources needed.
This project requires:
- an OpenAI account
- a Tavily account
- an instance of Neo4j database
- Langsmith

### Installation

Provide a step-by-step guide for installing the project locally. Include commands and explain what each does where necessary.

```bash
# Clone the repository
git clone https://github.com/username/project-name.git

# Change directory into the project
cd project-name

# Install dependencies
npm install


### Database Setup

This section provides instructions on setting up and configuring the Neo4j database.

1. **Install Neo4j**  
   If Neo4j isn't installed yet, follow [Neo4j's official installation guide](https://neo4j.com/download/). Ensure that it’s accessible from your environment.

2. **Start Neo4j**  
   After installation, start the Neo4j database service:
   ```bash
   neo4j start
