# NextGen Travel Agents

A Berlin Museum Itinerary Planner using Neo4j and Langgraph’s AI Agentic for a personalized travel experience. 

This repository contains the code from the talk **“NextGen Travel Agents: Merging AI Agentic and Neo4j for Personalized Experiences”** presented at [Neo4j’s NODES24 conference on November 7th, 2024](https://neo4j.com/nodes2024/agenda/next-gen-travel-agents-merging-ai-agentic-and-neo4j-for-personalized-experiences/).

* 📺 Watch the presentation on [Neo4j’s YouTube channel](https://youtu.be/QskiaNqaqlc)

* 📄 View the presentation slides [here on Google Docs](https://docs.google.com/presentation/d/1eAT8y9IBUsIXxnR43OTbkb_Y31XVR-b7hrtgsi4KJ2g/edit?usp=sharing)

---

## Table of Contents

1. [Project Overview](#project-overview)

2. [Getting Started](#getting-started)

3. [Installation](#installation)

4. [Database Setup](#database-setup)

5. [Usage](#usage)

6. [License](#license)

7. [Further Resources](#further-resources)

---

## Project Overview

This project is a personalized travel itinerary planner with a limited scope of Berlin museums. It combines Langgraph’s multiple AI Agents architecture with Neo4j graph database. The system allows users to generate optimized itineraries that consider distance, time, and user interests.

This project uses TypeScript as the programming language and Next.js as the framework for building the application. It uses Neo4j as the graph database to store and query relationships between data.

## Getting Started

### Technologies Used

- [Neo4j](https://neo4j.com/) 
- [Langchain JS](https://js.langchain.com/docs/introduction/)
- [Langgraph.js](https://langchain-ai.github.io/langgraphjs/)
- [Next.js](https://nextjs.org/)

### Requirements

- OpenAI API key. Get your key [at OpenAI](https://openai.com/api/)
- Tavily API key. Get your key [at Tavily](https://tavily.com/)
- an instance of Neo4j database (locally or in [AuraDB](https://neo4j.com/product/auradb/)) 
- Langsmith (optional)

## Installation

To get all the dependencies 
```
npm install
```

and then

```
npm run dev
```
to run the application


### Getting the data for the museum application


The Berlin museum data is from Wikidata, following the example in the [Tomaz Bratanic’s article about Exploring Pathfinding Graph Algorithm](https://tbgraph.wordpress.com/2020/09/01/traveling-tourist-part-2-exploring-pathfinding-graph-algorithms/).

To execute the `SPARQL` query, we need [the Neosemantics (n10s) plugin](https://github.com/neo4j-labs/neosemantics), which only supports up to Neo4j version 5.20 (as of 16.01.2025).

Alternatively, you can also use the database dump at `resource/neo4j.dump`. It's tested with local Neo4j database version 5.20. 

This is the `SPARQL` query for Berlin Museums

```
PREFIX sch: <http://schema.org/> 
CONSTRUCT{ 
    ?museum a sch:Museum; 
    sch:name ?museumLabel; 
    sch:name_de ?museumLabel; 
    sch:name_en ?museumLabel_en; 
    sch:location ?coordinates; 
    sch:website ?website;
    sch:HAS_TYPE ?museumType. 
    ?museumType a sch:MuseumType;
    sch:name ?museumTypeLabel;
} 
WHERE { 
    ?museum (wdt:P31/wdt:P279*) wd:Q33506.
    ?museum wdt:P131 wd:Q163966. 
    ?museum rdfs:label ?museumLabel. FILTER(LANG(?museumLabel) = "de") 
    OPTIONAL { ?museum rdfs:label ?museumLabel_en. FILTER(LANG(?museumLabel_en) = "en") }
    ?museum wdt:P625 ?coordinates.
    OPTIONAL { ?museum wdt:P856 ?website. }
    OPTIONAL { 
        ?museum wdt:P31 ?museumType.
        ?museumType rdfs:label ?museumTypeLabel.
        FILTER(LANG(?museumTypeLabel) = "en")
    }
    OPTIONAL { 
        ?museum wdt:P131 ?municipal.
        ?municipal rdfs:label ?municipalName.
        FILTER(LANG(?municipalName) = "en")
    }
} 
```





### Configuration

To set config, create a `.env.local` file details, fill in the details from the Neo4j instance and the other keys you've acquired. 

```

NEO4J_URI=
NEO4J_USERNAME=
NEO4J_PASSWORD=

OPENAI_API_KEY=

TAVILY_API_KEY=

LANGCHAIN_CALLBACKS_BACKGROUND = “true”
LANGCHAIN_TRACING_V2=true
LANGCHAIN_ENDPOINT=
LANGCHAIN_API_KEY=
LANGCHAIN_PROJECT=  

```



## Further Resources

* To learn more about Neo4j for free: [Neo4j GraphAcademy](https://graphacademy.neo4j.com/)

