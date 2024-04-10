
CREATE (king_george:Person:Man {
    name: "George VI",
    firstName: "Albert",
    middleNames: "Frederick, Arthur, George",
    surname: "Windsor",
    birthDate: date("1895-12-14"),
    deathDate: date("1952-02-06")
})

CREATE (queen_mother:Person:Woman {
    name: "Queen Elizabeth The Queen Mother",
    firstName: "Elizabeth",
    surname: "Windsor",
    middleNames: "Angela, Marguerite",
    birthDate: date("1900-08-04"),
    deathDate: date("2002-03-30"),
    birthName: "Bowes-Lyon"
})

CREATE (queen_elizabeth:Person:Woman {
    name: "Elizabeth II",
    firstName: "Elizabeth",
    surname: "Windsor",
    middleNames: "Alexandra, Mary",
    birthDate: date("1926-04-21"),
    deathDate: date("2022-09-08")
})

CREATE (prince_philip:Person:Man {
    name: "Prince Philip, Duke of Edinburgh",
    firstName: "Philip",
    surname: "Mountbatten",
    birthDate: date("1921-06-10"),
    deathDate: date("2021-04-09")
})

CREATE (king_charles:Person:Man {
    name: "Charles III",
    firstName: "Charles",
    surname: "Mountbatten-Windsor",
    middleNames: "Philip, Arthur, George",
    birthDate: date("1948-11-14")
})

CREATE (princess_diana:Person:Woman {
    name: "Diana, Princess of Wales",
    firstName: "Diana",
    surname: "Mountbatten-Windsor",
    middleNames: "Frances",
    birthDate: date("1961-07-01"),
    deathDate: date("1997-08-31"),
    birthName: "Spencer"
})

CREATE (queen_camila:Person:Woman {
    name: "Queen Camilla",
    firstName: "Camila",
    surname: "Mountbatten-Windsor",
    middleNames: "Rosemary",
    birthDate: date("1947-07-17"),
    birthName: "Shand"
})

CREATE (prince_william:Person:Man {
    name: "William, Prince of Wales",
    firstName: "William",
    surname: "Mountbatten-Windsor",
    middleNames: "Arthur, Philip, Louis",
    birthDate: date("1982-06-21")
})

CREATE (princess_catherine:Person:Woman {
    name: "Catherine, Princess of Wales",
    firstName: "Catherine",
    surname: "Mountbatten-Windsor",
    middleNames: "Elizabeth",
    birthDate: date("1982-01-09"),
    birthName: "Middleton"
})

CREATE (prince_george:Person:Man {
    name: "Prince George of Wales",
    firstName: "George",
    surname: "Mountbatten-Windsor",
    middleNames: "Alexander, Louis",
    birthDate: date("2013-07-22")
})

CREATE (princess_charlotte:Person:Woman {
    name: "Princess Charlotte of Wales",
    firstName: "Charlotte",
    surname: "Mountbatten-Windsor",
    middleNames: "Elizabeth, Diana",
    birthDate: date("2015-05-02")
})

CREATE (prince_louis:Person:Man {
    name: "Prince Louis of Wales",
    firstName: "Louis",
    surname: "Mountbatten-Windsor",
    middleNames: "Arthur, Charles",
    birthDate: date("2018-04-23")
})

CREATE (prince_harry:Person:Man {
    name: "Prince Harry, Duke of Sussex",
    firstName: "Henry",
    surname: "Mountbatten-Windsor",
    middleNames: "Charles, Albert, David",
    birthDate: date("1984-09-15")
})

CREATE (duchess_meghan:Person:Woman {
    name: "Meghan, Duchess of Sussex",
    firstName: "Rachel",
    surname: "Mountbatten-Windsor",
    middleNames: "Meghan",
    birthDate: date("1981-08-04"),
    birthName: "Markle"
})

CREATE (prince_archie:Person:Man {
    name: "Prince Archie of Sussex",
    firstName: "Archie",
    surname: "Mountbatten-Windsor",
    middleNames: "Harrison",
    birthDate: date("2019-05-06")
})

CREATE (princess_lilibet:Person:Woman {
    name: "Princess Lilibet of Sussex",
    firstName: "Lilibet",
    surname: "Mountbatten-Windsor",
    middleNames: "Diana",
    birthDate: date("2021-06-04")
})

CREATE (princess_anne:Person:Woman {
    name: "Anne, Princess Royal",
    firstName: "Anne",
    surname: "Mountbatten-Windsor",
    middleNames: "Elizabeth, Alice, Louise",
    birthDate: date("1950-08-15")
})

CREATE (mark_philips:Person:Man {
    name: "Mark Phillips",
    firstName: "Mark",
    surname: "Philips",
    middleNames: "Peter",
    birthDate: date("1948-09-22")
})

CREATE (timothy_laurence:Person:Man {
    name: "Timothy Laurence",
    firstName: "Timothy",
    surname: "Laurence",
    middleNames: "James, Hamilton",
    birthDate: date("1955-03-01")
})

CREATE (prince_andrew:Person:Man {
    name: "Prince Andrew, Duke of York",
    firstName: "Andrew",
    surname: "Mountbatten-Windsor",
    middleNames: "Albert, Christian, Edward",
    birthDate: date("1960-02-19")
})

CREATE (duchess_sarah:Person:Woman {
    name: "Sarah, Duchess of York",
    firstName: "Sarah",
    surname: "Mountbatten-Windsor",
    middleNames: "Margaret",
    birthDate: date("1959-10-15"),
    birthName: "Ferguson"
})

CREATE (princess_beatrice:Person:Woman {
    name: "Princess Beatrice",
    firstName: "Beatrice",
    surname: "Mountbatten-Windsor",
    middleNames: "Elizabeth, Mary",
    birthDate: date("1988-08-08")
})

CREATE (princess_eugenie:Person:Woman {
    name: "Princess Eugenie",
    firstName: "Eugenie",
    surname: "Mountbatten-Windsor",
    middleNames: "Victoria, Helena",
    birthDate: date("1990-03-23")
})

CREATE (prince_edward:Person:Man {
    name: "Prince Edward, Duke of Edinburgh",
    firstName: "Edward",
    surname: "Mountbatten-Windsor",
    middleNames: "Antony, Richard, Louis",
    birthDate: date("1964-03-10")
})

CREATE (duchess_sophie:Person:Woman {
    name: "Sophie, Duchess of Edinburgh",
    firstName: "Sophie",
    surname: "Mountbatten-Windsor",
    middleNames: "Helen",
    birthDate: date("1965-01-20"),
    birthName: "Rhys-Jones"
})

CREATE (lady_louise:Person:Woman {
    name: "Lady Louise Windsor",
    firstName: "Louise",
    surname: "Mountbatten-Windsor",
    middleNames: "Alice, Elizabeth, Mary",
    birthDate: date("2003-11-08")
})

CREATE (prince_james:Person:Man {
    name: "James, Earl of Wessex",
    firstName: "James",
    surname: "Mountbatten-Windsor",
    middleNames: "Alexander, Philip, Theo",
    birthDate: date("2007-12-17")
})

CREATE (princess_margaret:Person:Woman {
    name: "Princess Margaret, Countess of Snowdon",
    firstName: "Margaret",
    surname: "Windsor",
    middleNames: "Rose",
    birthDate: date("1930-08-21"),
    deathDate: date("2002-02-09")
})

CREATE (earl_antony:Person:Man {
    name: "Antony Armstrong-Jones, 1st Earl of Snowdon",
    firstName: "Antony",
    surname: "Armstrong-Jones",
    middleNames: "Charles, Robert",
    birthDate: date("1930-03-07"),
    deathDate: date("2017-01-13")
})

CREATE (earl_david:Person:Man {
    name: "David Armstrong-Jones, 2nd Earl of Snowdon",
    firstName: "David",
    surname: "Armstrong-Jones",
    middleNames: "Albert, Charles",
    birthDate: date("1961-11-03")
})

CREATE (lady_sarah:Person:Woman {
    name: "Lady Sarah Chatto",
    firstName: "Sarah",
    surname: "Chatto",
    middleNames: "Frances, Elizabeth",
    birthDate: date("1964-05-01"),
    birthName: "Armstrong-Jones"
})

// Relationships

CREATE (king_george)-[:MARRIED_TO { beginDate: date("1923-04-26"), endDate: date("1952-02-06"), endCause: "HisDeath" }]->(queen_mother)
CREATE (king_george)<-[:IS_CHILD_OF]-(queen_elizabeth)-[:IS_CHILD_OF]->(queen_mother)
CREATE (king_george)<-[:IS_CHILD_OF]-(princess_margaret)-[:IS_CHILD_OF]->(queen_mother)

CREATE (queen_elizabeth)-[:MARRIED_TO { beginDate: date("1947-11-20"), endDate: date("2021-04-09"), endCause: "HisDeath" }]->(prince_philip)
FOREACH ( p IN [king_charles, princess_anne, prince_andrew, prince_edward] |
  CREATE (queen_elizabeth)<-[:IS_CHILD_OF]-(p)-[:IS_CHILD_OF]->(prince_philip)
)

CREATE (princess_margaret)-[:MARRIED_TO { beginDate: date("1960-05-06"), endDate: date("1978-07-11"), endCause: "Divorce" }]->(earl_antony)
CREATE (princess_margaret)<-[:IS_CHILD_OF]-(earl_david)-[:IS_CHILD_OF]->(earl_antony)
CREATE (princess_margaret)<-[:IS_CHILD_OF]-(lady_sarah)-[:IS_CHILD_OF]->(earl_antony)

CREATE (king_charles)-[:MARRIED_TO { beginDate: date("1981-07-29"), endDate: date("1996-08-28"), endCause: "Divorce" }]->(princess_diana)
CREATE (king_charles)<-[:IS_CHILD_OF]-(prince_william)-[:IS_CHILD_OF]->(princess_diana)
CREATE (king_charles)<-[:IS_CHILD_OF]-(prince_harry)-[:IS_CHILD_OF]->(princess_diana)

CREATE (king_charles)-[:MARRIED_TO { beginDate: date("2005-04-09") }]->(queen_camila)

CREATE (princess_anne)-[:MARRIED_TO { beginDate: date("1973-11-14"), endDate: date("1992-04-23"), endCause: "Divorce" }]->(mark_philips)
CREATE (princess_anne)-[:MARRIED_TO { beginDate: date("1992-12-12") }]->(timothy_laurence)

CREATE (prince_andrew)-[:MARRIED_TO { beginDate: date("1986-07-23"), endDate: date("1996-05-30"), endCause: "Divorce" }]->(duchess_sarah)
CREATE (prince_andrew)<-[:IS_CHILD_OF]-(princess_beatrice)-[:IS_CHILD_OF]->(duchess_sarah)
CREATE (prince_andrew)<-[:IS_CHILD_OF]-(princess_eugenie)-[:IS_CHILD_OF]->(duchess_sarah)

CREATE (prince_edward)-[:MARRIED_TO { beginDate: date("1999-06-19") }]->(duchess_sophie)
CREATE (prince_edward)<-[:IS_CHILD_OF]-(lady_louise)-[:IS_CHILD_OF]->(duchess_sophie)
CREATE (prince_edward)<-[:IS_CHILD_OF]-(prince_james)-[:IS_CHILD_OF]->(duchess_sophie)

CREATE (prince_william)-[:MARRIED_TO { beginDate: date("2011-04-29") }]->(princess_catherine)
FOREACH ( p IN [prince_george, princess_charlotte, prince_louis] |
  CREATE (prince_william)<-[:IS_CHILD_OF]-(p)-[:IS_CHILD_OF]->(princess_catherine)
)

CREATE (prince_harry)-[:MARRIED_TO { beginDate: date("2018-05-19") }]->(duchess_meghan)
CREATE (prince_harry)<-[:IS_CHILD_OF]-(prince_archie)-[:IS_CHILD_OF]->(duchess_meghan)
CREATE (prince_harry)<-[:IS_CHILD_OF]-(princess_lilibet)-[:IS_CHILD_OF]->(duchess_meghan)
