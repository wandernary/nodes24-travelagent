# nodes24-travelagents


# NextGen Travel Agents

A Berlin Museum Itinerary Planner using Neo4j and Langgraph’s AI Agentic for a personalized travel experience. 

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Getting Started](#getting-started)
3. [Installation](#installation)
4. [Database Setup](#database-setup)
5. [Usage](#usage)
6. [License](#license)

---

### Project Overview

This project is a personalized travel itinerary planner with a limited scope of Berlin museums. It uses Langgraph’s multiple AI Agents architecture, along with Neo4j graph databases to provide the knowledge graph and routing. The system allows users to generate optimized itineraries that consider distance, time, and user interests.

This project uses JavaScript as the programming language and Next.js as the framework for building the application. It uses Neo4j as the graph database to store and query relationships between data.

### Getting Started

This project requires:
- OpenAI API key. Get your key [here] (https://openai.com/api/)
- Tavily API key. Get your key [here] (https://tavily.com/)
- an instance of Neo4j database (locally or in AuraDB) 
- Langsmith (optional)

### Installation

Tbd of step-by-step guide for installing the project locally. 

### Database Setup

Tbd instructions on setting up and configuring the Neo4j database, including getting the data from Wikidata.

### Usage

Tbd examples of how to use the application, including any special commands or configurations.

#### Configuration
.env file details
API keys, database connections, and other sensitive information guidelines
Configuration files format and any specific customization options
   ```plaintext
   NEO4J_URI=bolt://localhost:7687
   NEO4J_USER=neo4j
   NEO4J_PASSWORD=your_password
   ```

### License