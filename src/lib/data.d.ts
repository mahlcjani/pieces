// names comma delimited list?
// search would work

// TODO convert to interface
export type Person = {
  id: string;
  sex: "Man" | "Woman";
  name: string;
  names?: string[];
  firstName: string;
  firstNames?: string[];
  middleName?: string;
  middleNames?: string[];
  surname: string;
  birthName?: string;
  birthDate: Date;
  deathDate?: Date;
  nameDate?: Date;
  // To support spouses until something better comes to my mind
  rel?: any;
}
/*
export type Relative = {

}

Parent == Person

Spouse
marryBeginDate
marryEndDate;
marryEndCause;

Relative is Child


interface Human {

}

interface RelatedHuman extends Human {
  relation: "child" | "parent" | "sibling" | "spouse"; // friend,
  beginDate: Date | undefined;
  endDate: Date | undefined;
  endReason: "SpouseDeath" | undefined;
}
export type Relation = {
  type: "child" | "parent" | "sibling" | "spouse";
}
*/

export type Anniversary = {
  date: Date;
  type: "Birthday" | "Marriage" | "Nameday";
  cardinality: number;
  title?: string;
  people: Person[];
};

