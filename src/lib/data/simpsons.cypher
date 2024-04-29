
CREATE (homer:Person:Man {
    name: "Homer Simpson",
    firstName: "Homer",
    middleNames: "Jay",
    surname: "Simpson",
    birthDate: date("1956-05-12")}
)

CREATE (marge:Person:Woman {
    name: "Marge Simpson",
    firstName: "Marjorie",
    middleNames: "Jacqueline",
    surname: "Simpson",
    birthName: "Bouvier",
    birthDate: date("1956-10-01")
})

CREATE (bart:Person:Man {
    name: "Bart Simpson",
    firstName: "Bartholomew",
    middleNames: "Jojo",
    surname: "Simpson",
    birthDate: date("1982-02-23")}
)

CREATE (lisa:Person:Woman {
    name: "Lisa Simpson",
    firstName: "Lisa",
    middleNames: "Marie",
    surname: "Simpson",
    birthDate: date("1984-05-04")
})

CREATE (maggie:Person:Woman {
    name: "Maggie Simpson",
    firstName: "Margaret",
    middleNames: "Lenny",
    surname: "Simpson",
    birthDate: date("1990-08-18")
})


// Relationships

CREATE (homer)-[:IS_MARRIED_TO { beginDate: date("1982-11-23") }]->(marge)
CREATE (homer)<-[:IS_CHILD_OF]-(bart)-[:IS_CHILD_OF]->(marge)
CREATE (homer)<-[:IS_CHILD_OF]-(lisa)-[:IS_CHILD_OF]->(marge)
CREATE (homer)<-[:IS_CHILD_OF]-(maggie)-[:IS_CHILD_OF]->(marge)

