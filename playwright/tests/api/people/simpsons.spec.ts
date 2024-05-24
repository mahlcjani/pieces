import { expect } from "@playwright/test";
import { test } from "../steps";
import simpsons from "./simpsons.json" assert { type: "json" };

test.use({
  locale: "en"
})

function simpson(name: "homer" | "marge" | "bart" | "lisa" | "maggie", tag: number) {
  return {
    ...simpsons[name],
    name: `${simpsons[name].name} ${tag}`
  };
}

// Build Simpsons family and run some checks
// (please mind dates used are guesses)
test("should be able to create the Simpsons'", async ({ steps }) => {

  // Unique tag appendied to characters' names (Date.now() should be good enough)
  const tag = Date.now();

  const assertCreate = async (character: any) => {
    const p = await steps.addPerson(`should add ${character.firstName}`, character);
    expect(p).toMatchObject(character);

    const person = await steps.readPerson(`should read ${character.firstName}`, p.id);
    expect(person).toMatchObject(character);
    expect(person).toEqual(p);

    return person;
  };

  const assertRead = async (person: any) => {
    const p = await steps.readPersonEx(`should read ${person.firstName}`, person.id);
    expect(p).toMatchObject(person);
    return p;
  };

  const assertDelete = async (person: any) => {
    await steps.deletePerson(`should delete ${person.firstName}`, person.id);
    await steps.readPerson(`should read ${person.firstName}`, person.id, 404);
  };

  const assertSpouseLinked = async (person: any, spouse: any) => {
    return await steps.linkSpouses(
      `should connect ${person.firstName} and ${spouse.firstName}`,
      person.id,
      spouse.id
    );
  };

  const assertChildLinked = async (person: any, child: any) => {
    return await steps.linkParentChild(
      `should connect ${person.firstName} and ${child.firstName}`,
      person.id,
      child.id
    );
  };

  const assertPerson = (person: any, wifes: any[], husbands: any[], children: any[], parents: any[], siblings: any[]) => {
    expect(person.marriages).toHaveLength(wifes.length + husbands.length);
    expect(person.marriages).toEqual(
      expect.arrayContaining(
        wifes.map(spouse => expect.objectContaining({
          "wife": expect.objectContaining({"name": spouse.name})
        }))
      )
    );
    expect(person.marriages).toEqual(
      expect.arrayContaining(
        husbands.map(spouse => expect.objectContaining({
          "husband": expect.objectContaining({"name": spouse.name})
        }))
      )
    );

    expect(person.children).toHaveLength(children.length);
    expect(person.children).toEqual(
      expect.arrayContaining(
        children.map(child => expect.objectContaining({
          "child": expect.objectContaining({"name": child.name})
        }))
      )
    );

    expect(person.parents).toHaveLength(parents.length);
    expect(person.parents).toEqual(
      expect.arrayContaining(
        parents.map(parent => expect.objectContaining({
          "parent": expect.objectContaining({"name": parent.name})
        }))
      )
    );

    expect(person.siblings).toHaveLength(siblings.length);
    expect(person.siblings).toEqual(
      expect.arrayContaining(
        siblings.map(sibling => expect.objectContaining({"name": sibling.name}))
      )
    );
  };


  const homer = await assertCreate(simpson("homer", tag));
  const marge = await assertCreate(simpson("marge", tag));
  const bart = await assertCreate(simpson("bart", tag));
  const lisa = await assertCreate(simpson("lisa", tag));
  const maggie = await assertCreate(simpson("maggie", tag));

  await assertSpouseLinked(homer, marge);

  await assertChildLinked(homer, bart),
  await assertChildLinked(homer, lisa),
  await assertChildLinked(homer, maggie)

  await assertChildLinked(marge, bart),
  await assertChildLinked(marge, lisa),
  await assertChildLinked(marge, maggie)

  assertPerson(await assertRead(homer), [marge], [], [bart, lisa, maggie], [], []);
  assertPerson(await assertRead(marge), [], [homer], [bart, lisa, maggie], [], []);
  assertPerson(await assertRead(bart), [], [], [], [homer, marge], [lisa, maggie]);
  assertPerson(await assertRead(lisa), [], [], [], [homer, marge], [bart, maggie]);
  assertPerson(await assertRead(maggie), [], [], [], [homer, marge], [bart, lisa]);

  await assertDelete(homer);
  await assertDelete(marge);
  await assertDelete(bart);
  await assertDelete(lisa);
  await assertDelete(maggie);
});
