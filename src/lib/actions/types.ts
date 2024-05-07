
// All types are serializable in order to be transfered between server and client components
// All dates are in ISO 8601 format

export type Sex = "Man" | "Woman";

export type Person = {
  id: string;
  sex: Sex;
  name: string;
  names?: string[];
  firstName: string;
  firstNames?: string[];
  middleName?: string;
  middleNames?: string[];
  surname: string;
  birthName?: string;
  // ISO 8601 format
  birthDate: string;
  deathDate?: string;
  nameDate?: string;
};

/**
 * parent or child properties can be undefined because records can be returned in context of
 * concrete persons. For instance if asking for children of person A parent property may be left unset.
 */
export type Parentage = {
  id: string;
  parent: Person;
  child: Person;
};

/**
 * spouses can be single Person meaning the other spouse when quering for spouses of
 * specific person.
 */
export type Marriage = {
  id: string;
  beginDate: string;
  endDate?: string;
  // Don't care whos death
  endCause?: "Death" | "Divorce";
  wife: Person;
  husband: Person;
};

export type Anniversary = {
  date: string;
  type: "Birthday" | "Marriage" | "Nameday";
  cardinality: number;
  title?: string;
  people: Person[];
};
