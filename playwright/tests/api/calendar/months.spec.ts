import { expect } from "@playwright/test";
import { test } from "../steps";

// These tests depend on Kennedy family being loaded into Neo4j

test("should return anniversaries for January 2000", async ({ steps }) => {
  await test.step("", async () => {
    const events = await steps.calendar("fetch events", {
      since: "2000-01-01",
      until: "2000-02-01",
    });

    expect(events, "expect birthdays of Carolyn, Matthew, Patrick, Robert and Jack").toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-01-07T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Carolyn Jeanne Bessette-Kennedy",
              "birthDate": "1966-01-07T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-01-11T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Matthew Maxwell Taylor Kennedy",
              "birthDate": "1965-01-11T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-01-14T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Patrick Joseph Kennedy",
              "birthDate": "1858-01-14T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-01-17T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Robert Francis Kennedy Jr.",
              "birthDate": "1954-01-17T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-01-19T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Jack Schlossberg",
              "birthDate": "1993-01-19T00:00:00.000Z"
            })
          ])
        }),
      ])
    );
  });
});

test("should return anniversaries for February 2000", async ({ steps }) => {
  await test.step("", async () => {
    const events = await steps.calendar("fetch events", {
      since: "2000-02-01",
      until: "2000-03-01",
    });

    expect(events, "expect birthdays of Mark, Kathleen, Jean, Edward, Victoria, Michael and Kara").toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-02-17T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Mark Kennedy Shriver",
              "birthDate": "1964-02-17T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-02-20T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Kathleen Agnes Cavendish",
              "birthDate": "1920-02-20T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-02-20T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Jean Ann Smith",
              "birthDate": "1928-02-20T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-02-22T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Edward Moore Kennedy",
              "birthDate": "1932-02-22T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-02-26T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Victoria Anne Kennedy",
              "birthDate": "1954-02-26T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-02-27T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Michael LeMoyne Kennedy",
              "birthDate": "1958-02-27T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-02-27T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Kara Anne Kennedy",
              "birthDate": "1960-02-27T00:00:00.000Z"
            })
          ])
        }),
      ])
    );
  });
});

test("should return anniversaries for March 2000", async ({ steps }) => {
  await test.step("", async () => {
    const events = await steps.calendar("fetch events", {
      since: "2000-03-01",
      until: "2000-04-01",
    });

    expect(events, "expect birthdays of Francis and Douglas").toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-03-11T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Francis Benedict Kennedy",
              "birthDate": "1891-03-11T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-03-24T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Douglas Harriman Kennedy",
              "birthDate": "1967-03-24T00:00:00.000Z"
            })
          ])
        }),
      ])
    );
  });
});

test("should return anniversaries for April 2000", async ({ steps }) => {
  await test.step("", async () => {
    const events = await steps.calendar("fetch events", {
      since: "2000-04-01",
      until: "2000-05-01",
    });

    expect(events, "expect birthdays of Margaret, Ethel and Robert, marriages of Patricia and Peter, Maria and Arnold").toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-04-02T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Margaret Louise DeVine",
              "birthDate": "1926-04-02T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-04-11T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Ethel Kennedy",
              "birthDate": "1928-04-11T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-04-28T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Robert Sargent Shriver III",
              "birthDate": "1954-04-28T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Marriage",
          "date": "2000-04-24T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Patricia Helen Lawford",
              "birthName": "Kennedy"
            }),
            expect.objectContaining({
              "name": "Peter Sydney Ernest Lawford"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Marriage",
          "date": "2000-04-26T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Maria Owings Shriver"
            }),
            expect.objectContaining({
              "name": "Arnold Alois Schwarzenegger"
            })
          ])
        }),
      ])
    );
  });
});

test("should return anniversaries for May 2000", async ({ steps }) => {
  await test.step("", async () => {
    const events = await steps.calendar("fetch events", {
      since: "2000-05-01",
      until: "2000-06-01",
    });

    expect(events, "expect birthdays of Charles, Tatiana, Patricia, JFK and Thomas, marriages of Kathleen and William, Jean and Stephen, Eunice and Robert").toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-05-05T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Charles Joseph Burke Jr",
              "birthDate": "1928-05-05T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-05-05T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Tatiana Schlossberg",
              "birthDate": "1990-05-05T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-05-06T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Patricia Helen Lawford",
              "birthDate": "1924-05-06T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-05-17T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "John Fitzgerald Kennedy",
              "birthDate": "1917-05-17T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-05-25T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Thomas Francis Burke",
              "birthDate": "1933-05-25T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Marriage",
          "date": "2000-05-06T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Kathleen Agnes Cavendish",
              "birthName": "Kennedy",
            }),
            expect.objectContaining({
              "name": "William John Robert Cavendish"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Marriage",
          "date": "2000-05-19T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Jean Ann Smith",
              "birthName": "Kennedy",
            }),
            expect.objectContaining({
              "name": "Stephen Edward Smith"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Marriage",
          "date": "2000-05-23T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Eunice Mary Shriver",
              "birthName": "Kennedy",
            }),
            expect.objectContaining({
              "name": "Robert Sargent Shriver Jr."
            })
          ])
        }),
      ])
    );
  });
});

test("should return anniversaries for June 2000", async ({ steps }) => {
  await test.step("", async () => {
    const events = await steps.calendar("fetch events", {
      since: "2000-06-01",
      until: "2000-07-01",
    });

    expect(events, "expect birthdays of George, David and Rose, marriages of Joseph and Rose, Mary and George").toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-06-10T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "George William Connelly",
              "birthDate": "1898-06-10T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-06-15T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "David Anthony Kennedy",
              "birthDate": "1955-06-15T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-06-25T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Rose Schlossberg",
              "birthDate": "1988-06-25T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Marriage",
          "date": "2000-06-14T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Margaret Louise Burke",
              "birthName": "Kennedy",
            }),
            expect.objectContaining({
              "name": "Charles Joseph Burke"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Marriage",
          "date": "2000-06-17T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Robert Francis Kennedy"
            }),
            expect.objectContaining({
              "name": "Ethel Kennedy",
              "birthName": "Skakel"
            })
          ])
        }),
      ])
    );
  });
});


test("should return anniversaries for July 2000", async ({ steps }) => {
  await test.step("", async () => {
    const events = await steps.calendar("fetch events", {
      since: "2000-07-01",
      until: "2000-08-01",
    });

    expectBirthday(events, "2000-07-04T00:00:00.000Z", {
      "name": "Kathleen Hartington Townsend",
      "birthDate": "1951-07-04T00:00:00.000Z"
    });

    expectBirthday(events, "2000-07-04T00:00:00.000Z", {
      "name": "Christopher George Kennedy",
      "birthDate": "1963-07-04T00:00:00.000Z"
    });

    expectBirthday(events, "2000-07-10T00:00:00.000Z", {
      "name": "Eunice Mary Shriver",
      "birthDate": "1921-07-10T00:00:00.000Z"
    });

    expectBirthday(events, "2000-07-14T00:00:00.000Z", {
      "name": "Patrick Joseph Kennedy II",
      "birthDate": "1967-07-14T00:00:00.000Z"
    });

    expectBirthday(events, "2000-07-19T00:00:00.000Z", {
      "name": "Edwin Arthur Schlossberg",
      "birthDate": "1945-07-19T00:00:00.000Z"
    });

    expectBirthday(events, "2000-07-22T00:00:00.000Z", {
      "name": "Rose Elizabeth Kennedy",
      "birthDate": "1890-07-22T00:00:00.000Z"
    });

    expectBirthday(events, "2000-07-20T00:00:00.000Z", {
      "name": "Anthony Paul Kennedy Shriver",
      "birthDate": "1965-07-20T00:00:00.000Z"
    });

    expectBirthday(events, "2000-07-25T00:00:00.000Z", {
      "name": "Joseph Patrick Kennedy Jr.",
      "birthDate": "1915-07-25T00:00:00.000Z"
    });

    expectBirthday(events, "2000-07-28T00:00:00.000Z", {
      "name": "Jacqueline Kennedy Onassis",
      "birthDate": "1929-07-28T00:00:00.000Z"
    });

    expectBirthday(events, "2000-07-30T00:00:00.000Z", {
      "name": "Arnold Alois Schwarzenegger",
      "birthDate": "1947-07-30T00:00:00.000Z"
    });

    expect(events, "expect marriages of Edward and Victoria, Caroline and Edwin").toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          "type": "Marriage",
          "date": "2000-07-03T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Edward Moore Kennedy"
            }),
            expect.objectContaining({
              "name": "Victoria Anne Kennedy",
              "birthName": "Reggie"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Marriage",
          "date": "2000-07-19T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Caroline Bouvier Kennedy"
            }),
            expect.objectContaining({
              "name": "Edwin Arthur Schlossberg"
            })
          ])
        }),
      ])
    );
  });
});

test("should return anniversaries for August 2000", async ({ steps }) => {
  await test.step("", async () => {
    const events = await steps.calendar("fetch events", {
      since: "2000-08-01",
      until: "2000-09-01",
    });

    expect(events, "expect birthdays of Mary, Patrick, Charles, Arabella and Timothy").toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-08-06T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Mary Loretta Connelly",
              "birthDate": "1892-08-06T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-08-07T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Patrick Bouvier Kennedy",
              "birthDate": "1963-08-07T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-08-23T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Charles Joseph Burke",
              "birthDate": "1899-08-23T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-08-23T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Arabella Kennedy",
              "birthDate": "1956-08-23T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-08-29T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Timothy Perry Shriver",
              "birthDate": "1959-08-29T00:00:00.000Z"
            })
          ])
        }),
      ])
    );
  });
});

test("should return anniversaries for September 2000", async ({ steps }) => {
  await test.step("", async () => {
    const events = await steps.calendar("fetch events", {
      since: "2000-09-01",
      until: "2000-10-01",
    });

    expect(events, "expect birthdays of Virginia, Joseph, and 9 more, marriages of JFK and Jacqueline, John and Carolyn").toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-09-02T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Virginia Joan Kennedy",
              "birthDate": "1936-09-02T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-09-06T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Joseph Patrick Kennedy Sr.",
              "birthDate": "1888-09-06T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-09-07T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Peter Sydney Ernest Lawford",
              "birthDate": "1923-09-07T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-09-08T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Mary Kerry Kennedy",
              "birthDate": "1959-09-08T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-09-09T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Mary Courtney Kennedy",
              "birthDate": "1956-09-09T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-09-13T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Rose Marie Kennedy",
              "birthDate": "1918-09-13T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-09-24T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Joseph Patrick Kennedy II",
              "birthDate": "1952-09-24T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-09-24T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Stephen Edward Smith",
              "birthDate": "1927-09-24T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-09-26T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Edward Moore Kennedy Jr.",
              "birthDate": "1961-09-26T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Marriage",
          "date": "2000-09-12T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "John Fitzgerald Kennedy"
            }),
            expect.objectContaining({
              "name": "Jacqueline Kennedy Onassis",
              "birthName": "Bouvier"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Marriage",
          "date": "2000-09-21T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "John Fitzgerald Kennedy Jr."
            }),
            expect.objectContaining({
              "name": "Carolyn Jeanne Bessette-Kennedy",
              "birthName": "Bessette"
            })
          ])
        }),
      ])
    );
  });
});

test("should return anniversaries for October 2000", async ({ steps }) => {
  await test.step("", async () => {
    const events = await steps.calendar("fetch events", {
      since: "2000-10-01",
      until: "2000-11-01",
    });

    expect(events, "expect birthdays of Mary and Margaret, marriages of Joseph and Rose, Mary and George").toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-10-21T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Mary Louise McCarthy",
              "birthDate": "1928-10-21T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-10-22T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Margaret Louise Burke",
              "birthDate": "1898-10-22T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Marriage",
          "date": "2000-10-07T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Joseph Patrick Kennedy Sr."
            }),
            expect.objectContaining({
              "name": "Rose Elizabeth Kennedy",
              "birthName": "Fitzgerald"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Marriage",
          "date": "2000-10-12T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Mary Loretta Connelly",
              "birthName": "Kennedy",
            }),
            expect.objectContaining({
              "name": "George William Connelly"
            })
          ])
        }),
      ])
    );
  });
});

test("should return anniversaries for November 2000", async ({ steps }) => {
  await test.step("", async () => {
    const events = await steps.calendar("fetch events", {
      since: "2000-11-01",
      until: "2000-12-01",
    });

    expect(events, "expect birthdays of [Maria, Robert, RFK, John, Caroline] marriages of [Patrick and Mary, Edward and Virginia]").toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-11-06T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Maria Owings Shriver",
              "birthDate": "1955-11-06T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-11-09T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Robert Sargent Shriver Jr.",
              "birthDate": "1915-11-09T00:00:00.000Z"
            })
          ])
        }),

        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-11-20T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Robert Francis Kennedy",
              "birthDate": "1925-11-20T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-11-25T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "John Fitzgerald Kennedy Jr.",
              "birthDate": "1960-11-25T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-11-27T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Caroline Bouvier Kennedy",
              "birthDate": "1957-11-27T00:00:00.000Z"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Marriage",
          "date": "2000-11-23T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Patrick Joseph Kennedy"
            }),
            expect.objectContaining({
              "name": "Mary Augusta Kennedy",
              "birthName": "Hickney"
            })
          ])
        }),
        expect.objectContaining({
          "type": "Marriage",
          "date": "2000-11-29T00:00:00.000Z",
          "people": expect.arrayContaining([
            expect.objectContaining({
              "name": "Edward Moore Kennedy"
            }),
            expect.objectContaining({
              "name": "Virginia Joan Kennedy",
              "birthName": "Bennett"
            })
          ])
        }),
      ])
    );
  });
});

test("should return anniversaries for December 2000", async ({ steps }) => {
  await test.step("", async () => {
    const events = await steps.calendar("fetch events", {
      since: "2000-12-01",
      until: "2001-01-01",
    });

    expectBirthday(events, "2000-12-06T00:00:00.000Z", {
      "name": "Mary Augusta Kennedy",
      "birthDate": "1857-12-06T00:00:00.000Z"
    });


    expect(events, "expect birthdays of [Mary, William, Rory]").toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-12-06T00:00:00.000Z",
          "people": [
            expect.objectContaining({
              "name": "Mary Augusta Kennedy",
              "birthDate": "1857-12-06T00:00:00.000Z"
            })
          ]
        }),
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-12-10T00:00:00.000Z",
          "people": [
            expect.objectContaining({
              "name": "William John Robert Cavendish",
              "birthDate": "1917-12-10T00:00:00.000Z"
            })
          ]
        }),
        expect.objectContaining({
          "type": "Birthday",
          "date": "2000-12-12T00:00:00.000Z",
          "people": [
            expect.objectContaining({
              "name": "Rory Elizabeth Katherine Kennedy",
              "birthDate": "1968-12-12T00:00:00.000Z"
            })
          ]
        }),
      ])
    );
  });
});

const expectBirthday = (events: any, date: string, person: any) => {
  expect(events, `expect birthday of ${person.name}`).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        "type": "Birthday",
        "date": date,
        "people": [expect.objectContaining(person)]
      })
    ])
  );
}

