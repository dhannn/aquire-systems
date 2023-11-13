import { CurrentSchoolYear } from "../src/schema/currentschoolyear.js";

const fromYear = 2023;
const toYear = fromYear + 1;

await CurrentSchoolYear.create({
    fromYear: fromYear,
    toYear: toYear
});
