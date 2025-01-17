MATCH (m1:Museum),(m2:Museum) 
WHERE id(m1) > id(m2) 
WITH m1,m2, point.distance(m1.location_point,m2.location_point) as distance 
ORDER BY distance ASC
WHERE distance < 1000
WITH m1,collect({node:m2,distance:distance})[..5] as nearest 
UNWIND nearest as near 
WITH m1, near, near.node as nearest_node 
MERGE (m1)-[m:NEAR]-(nearest_node) SET m.distance = near.distance