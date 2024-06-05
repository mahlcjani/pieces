import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { gql } from "graphql-tag";

import { fetchEvents } from "@/lib/actions/calendar";
import {
  fetchChildren,
  fetchMarriages,
  fetchParents,
  fetchPeople,
  fetchPerson,
  fetchSiblings
} from "@/lib/actions/people";

const typeDefs = gql`
  enum Sex {
    MAN
    WOMAN
  }

  enum MarriageEndCause {
    DEATH,
    DIVORCE
  }

  type Person {
    id: ID!
    sex: Sex!
    name: String!
    firstName: String!
    middleName: String
    surname: String!
    birthName: String
    birthDate: String!
    deathDate: String
    nameDate: String
  }

  type Marriage {
    id: ID!
    wife: Person!
    husband: Person!
    beginDate: String!
    endDate: String
    endCause: MarriageEndCause
  }

  type Parentage {
    id: ID!
    parent: Person!
    child: Person!
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
    # Fetch calendar events
    calendar(since: String!, until: String!): [Event!]!
    # Fetch people
    people(query: String! = "", offset: Int = 0, limit: Int = 10): [Person!]!
    # Fetch person of given id
    person(id: ID!): Person
    # Fetch person's marriages (pid stands for person id)
    marriages(pid: ID!): [Marriage!]!
    # Fetch person's spouses
    spouses(pid: ID!): [Person!]!
    # Fetch person's children
    children(pid: ID!): [Parentage!]!
    # Fetch person's siblings
    siblings(pid: ID!): [Person!]!
    # Fetch person's parents
    parents(pid: ID!):  [Parentage!]!
    # Fetch person's mother
    mother(pid: ID!): Person
    # Fetch person's father
    father(pid: ID!): Person
  }

"""
  Compose query to get more information
  query($id: ID!) {
    person(id: $id) {
      name
    }
    marriages(pid: $id) {
      id
      beginDate
      endDate
      endCause
      wife {
        id
        name
      }
      husband {
        id
        name
      }
    }
    siblings(pid: $id) {
      id
      name
    }
  }
 """
`;

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

    marriages: async (parentResolver: never, {pid}: {pid: string}) => {
      return await fetchMarriages(pid);
    },

    spouses: async (parentResolver: never, {pid}: {pid: string}) => {
      return (await fetchMarriages(pid)).map((m) => m.wife.id === pid ? m.husband : m.wife);
    },

    children: async (parentResolver: never, {pid}: {pid: string}) => {
      return await fetchChildren(pid);
    },

    parents: async (parentResolver: never, {pid}: {pid: string}) => {
      return await fetchParents(pid);
    },

    mother: async (parentResolver: never, {pid}: {pid: string}) => {
      const parentage = (await fetchParents(pid)).find((p) => p.parent.sex == "Woman");
      return parentage ? parentage.parent : null
    },

    father: async (parentResolver: never, {pid}: {pid: string}) => {
      const parentage = (await fetchParents(pid)).find((p) => p.parent.sex == "Man");
      return parentage ? parentage.parent : null
    },

    siblings: async (parentResolver: never, {pid}: {pid: string}) => {
      return await fetchSiblings(pid);
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

  MarriageEndCause: {
    DEATH: "Death",
    DIVORCE: "Divorce"
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server);

export { handler as GET, handler as POST };
