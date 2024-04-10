
CREATE (day:Person:Man {
    name: "Father Day",
    firstName: "Father",
    surname: "Day",
    birthDate: date("1900-01-01"),
    nameDate: date("1900-06-23"),
})

CREATE (night:Person:Woman {
    name: "Mother Night",
    firstName: "Mother",
    surname: "Night",
    birthDate: date("1900-01-01"),
    nameDate: date("1900-05-26")
})

CREATE (day)-[:MARRIED_TO { beginDate: date("1900-01-01") }]->(night)

CREATE (monday:Person:Man {
    name: "Monday",
    firstName: "Monday",
    surname: "Day",
    birthDate: date("1920-02-12"),
    nameDate: date("1920-02-24")
})

CREATE (monday)-[:IS_CHILD_OF]->(day)
CREATE (monday)-[:IS_CHILD_OF]->(night)

CREATE (tuesday:Person:Woman {
    name: "Tuesday",
    firstName: "Tuesday",
    surname: "Day",
    birthDate: date("1930-05-27"),
    nameDate: date("1930-06-01")
})

CREATE (tuesday)-[:IS_CHILD_OF]->(day)
CREATE (tuesday)-[:IS_CHILD_OF]->(night)







CREATE (małgorzata:Person:Woman {
    name: "Małgorzata Misiołek",
    firstName: "Małgorzata",
    surname: "Misiołek",
    birthName: "Andruszkiewicz",
    birthDate: date("1983-07-04")
})

CREATE (maciej)-[:MARRIED_TO {beginDate: date("2020-02-22")}]->(małgorzata)

CREATE (maja:Person:Woman {
    name: "Maja Misiołek",
    firstName: "Maja",
    surname: "Misiołek",
    birthDate: date("2008-06-11")
})

CREATE (maja)-[:IS_CHILD_OF]->(maciej)

CREATE (antoni:Person:Man {
    name: "Antoni Misiołek",
    firstName: "Antoni",
    surname: "Misiołek",
    birthDate: date("2020-12-07")
})

CREATE (antoni)-[:IS_CHILD_OF]->(maciej)
CREATE (antoni)-[:IS_CHILD_OF]->(małgorzata)

CREATE (irena:Person:Woman {
    name: "Irena Misiołek",
    firstName: "Irena",
    surname: "Misiołek",
    birthDate: date("2022-04-15")
})

CREATE (irena)-[:IS_CHILD_OF]->(maciej)
CREATE (irena)-[:IS_CHILD_OF]->(małgorzata)

CREATE (halina:Person:Woman {
    name: "Halina Misiołek",
    firstName: "Halina",
    surname: "Misiołek",
    birthDate: date("2023-11-06")
})

CREATE (halina)-[:IS_CHILD_OF]->(maciej)
CREATE (halina)-[:IS_CHILD_OF]->(małgorzata)

// Marta's branch

CREATE (marta:Person:Woman {
    name: "Marta Malara",
    firstName: "Marta",
    surname: "Malara",
    birthName: "Misiołek",
    birthDate: date("1972-12-06"),
    nameDate: date("1973-02-22")
})

CREATE (marta)-[:IS_CHILD_OF]->(marian)
CREATE (marta)-[:IS_CHILD_OF]->(barbara)

CREATE (robert:Person:Man {
    name: "Robert Malara",
    firstName: "Robert",
    surname: "Malara",
    birthDate: date("1966-11-13")
})

CREATE (marta)-[:MARRIED_TO {beginDate: date("1991-09-14")}]->(robert)

CREATE (bartłomiej:Person:Man {
    name: "Bartłomiej Malara",
    firstName: "Bartłomiej",
    surname: "Malara",
    birthDate: date("1992-07-06")
})

CREATE (bartłomiej)-[:IS_CHILD_OF]->(marta)
CREATE (bartłomiej)-[:IS_CHILD_OF]->(robert)

CREATE (paulina:Person:Woman {
    name: "Paulina Malara",
    firstName: "Paulina",
    surname: "Malara",
    birthDate: date("1996-11-24")
})

CREATE (paulina)-[:IS_CHILD_OF]->(marta)
CREATE (paulina)-[:IS_CHILD_OF]->(robert)

CREATE (katarzyna:Person:Woman {
    name: "Katarzyna Malara",
    firstName: "Katarzyna",
    surname: "Malara",
    birthName: "???",
    birthDate: date("1993-06-25")
})

CREATE (bartłomiej)-[:PARTNER_OF {
    endDate: date("2021-11-20"),
    endCause: 'TheirMarriage'
}]->(katarzyna)

CREATE (bartłomiej)-[:MARRIED_TO {beginDate: date("2021-11-20")}]->(katarzyna)

CREATE (hubert:Person:Man {
    name: "Hubert ???",
    firstName: "Hubert",
    surname: "???",
    birthDate: date("1991-07-14")
})

CREATE (hubert)-[:PARTNER_OF]->(paulina)

// Tomasz' branch

CREATE (tomasz:Person:Man {
    name: "Tomasz Misiołek",
    firstName: "Tomasz",
    surname: "Misiołek",
    birthDate: date("1974-01-06")
})

CREATE (tomasz)-[:IS_CHILD_OF]->(marian)
CREATE (tomasz)-[:IS_CHILD_OF]->(barbara)

CREATE (justyna:Person:Woman {
    name: "Justyna Bal-Misiołek",
    firstName: "Justyna",
    surname: "Bal-Misiołek",
    birthName: "Bal",
    birthDate: date("1983-01-07")
})

CREATE (tomasz)-[:MARRIED_TO {beginDate: date("2012-06-23")}]->(justyna)

// Magdalena's branch

CREATE (magdalena:Person:Woman {
    name: "Magdalena Sypień",
    firstName: "Magdalena",
    surname: "Sypień",
    birthName: "Misiołek",
    birthDate: date("1974-12-02")
})

CREATE (magdalena)-[:IS_CHILD_OF]->(marian)
CREATE (magdalena)-[:IS_CHILD_OF]->(barbara)

CREATE (grzegorz:Person:Man {
    name: "Grzegorz Sypień",
    firstName: "Grzegorz",
    surname: "Sypień",
    birthDate: date("1975-02-18")
})

CREATE (magdalena)-[:MARRIED_TO {beginDate: date("2005-06-24")}]->(grzegorz)

CREATE (weronika:Person:Woman {
    name: "Weronika Sypień",
    firstName: "Weronika",
    surname: "Sypień",
    birthDate: date("2007-02-19")
})

CREATE (weronika)-[:IS_CHILD_OF]->(magdalena)
CREATE (weronika)-[:IS_CHILD_OF]->(grzegorz)

CREATE (szymon:Person:Man {
    name: "Szymon Sypień",
    firstName: "Szymon",
    surname: "Sypień",
    birthDate: date("2010-01-04")
})

CREATE (szymon)-[:IS_CHILD_OF]->(magdalena)
CREATE (szymon)-[:IS_CHILD_OF]->(grzegorz)

//  Jerzy's branch

CREATE (jerzy:Person:Man {
    name: "Jerzy Misiołek",
    firstName: "Jerzy",
    surname: "Misiołek",
    birthDate: date("1981-06-01")
})

CREATE (jerzy)-[:IS_CHILD_OF]->(marian)
CREATE (jerzy)-[:IS_CHILD_OF]->(barbara)

CREATE (agnieszka:Person:Woman {
    name: "Agnieszka Misiołek",
    firstName: "Agnieszka",
    surname: "Misiołek",
    birthName: "Gorczyca",
    birthDate: date("1984-01-20")
})

CREATE (jerzy)-[:MARRIED_TO {beginDate: date("2009-05-23")}]->(agnieszka)

CREATE (gabriela:Person:Woman {
    name: "Gabriela Misiołek",
    firstName: "Gabriela",
    surname: "Misiołek",
    birthDate: date("2010-09-29")
})

CREATE (gabriela)-[:IS_CHILD_OF]->(jerzy)
CREATE (gabriela)-[:IS_CHILD_OF]->(agnieszka)

CREATE (anna:Person:Woman {
    name: "Anna Misiołek",
    firstName: "Anna",
    surname: "Misiołek",
    birthDate: date("2013-09-30")
})

CREATE (anna)-[:IS_CHILD_OF]->(jerzy)
CREATE (anna)-[:IS_CHILD_OF]->(agnieszka)


RETURN *

// To find active relationships
MATCH (m:Man)-[r:MARRIED_TO|PARTNER_OF where r.endDate is null]-(w:Woman)
RETURN m.name, w.name

MATCH (w:Woman)-[m:MARRIED_TO]-(p)
RETURN 'marriage' AS kind,
  w.firstName AS name1,
  p.firstName AS name2,
  m.beginDate.month AS month,
  m.beginDate.day AS day
UNION
MATCH (p:Person)
RETURN 'birthday' AS kind,
  p.firstName AS name1,
  '' AS name2,
  p.birthDate.month AS month,
  p.birthDate.day AS day





