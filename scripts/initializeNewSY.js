import { CurrentSchoolYear} from "../src/schema/currentschoolyear.js";

try {
    const currentYear = new Date().getFullYear();
    const fromYear = currentYear.toString();
    const toYear = (currentYear + 1).toString();

    const initializeSY = await CurrentSchoolYear.create({
        fromYear: fromYear,
        toYear: toYear
    })

    console.log('DB SY Intiialized');
} catch (error) {
    console.error(error);
}