import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { gql } from "graphql-tag";

import { fetchEvents } from "@/lib/actions/calendar";
import { fetchPeople, fetchPerson } from "@/lib/actions/people";

type CalendarArgs = {
  since: string;
  until: string;
}

type PeopleArgs = {
  query: string;
  offset: number;
  limit: number;
}

const resolvers = {
  Query: {
    calendar: async (parentResolver: never, {since, until}: CalendarArgs) => {
      return await fetchEvents(since, until);
    },
    people: async (parentResolver: never, {query, offset, limit}: PeopleArgs) => {
      return await fetchPeople(query, offset, limit);
    },
    person: async (parentResolver: never, {id}: {id: string}) => {
      return await fetchPerson(id);
    },
  },

  EventType: {
    MARRIAGE: "Marriage",
    BIRTHDAY: "Birthday",
    NAMEDAY: "Nameday"
  },

  Sex: {
    MAN: "Man",
    WOMAN: "Woman"
  },

};

const typeDefs = gql`
  enum Sex {
    MAN
    WOMAN
  }

#  input PersonFragment {
#
#  }



  type Person {
    id: ID!
    sex: Sex
    name: String!
    firstName: String!
    middleName: String
    surname: String
    birthName: String
    birthDate: String
    deathDate: String
    nameDate: String
  }

  enum EventType {
    MARRIAGE,
    BIRTHDAY,
    NAMEDAY
  }

  type Event {
    date: String!
    type: EventType!
    cardinality: Int
    people: [Person!]!
  }

  type Query {
    calendar(since: String, until: String): [Event!]!
    people(query: String, offset: Int, limit: Int): [Person!]!
    person(id: ID): Person
  }
`;

const server = new ApolloServer({
  resolvers,
  typeDefs,
});

const handler = startServerAndCreateNextHandler(server);

export { handler as GET, handler as POST };
