WITH ' PREFIX sch: <http://schema.org/> 
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
} ' AS sparql 
CALL n10s.rdf.import.fetch(
  "https://query.wikidata.org/sparql?query=" +  
      apoc.text.urlencode(sparql),"JSON-LD", 
    { headerParams: { Accept: "application/ld+json"} ,   
      handleVocabUris: "IGNORE"})
YIELD terminationStatus, triplesLoaded
RETURN terminationStatus, triplesLoaded