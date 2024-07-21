import { TimePassEn, TimePassVi } from "@/locales";

export function timePassed(time: string | Date | undefined, lang: "vi" | "en") {
    const T = lang === "en" ? TimePassEn : TimePassVi;

    const previousDate = time ? new Date(time) : new Date();
    const elapsed = new Date().getTime() - previousDate.getTime();

    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerWeek = msPerDay * 7;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;

    const date = `${previousDate.getDate()}/${previousDate.getMonth() + 1}/${previousDate.getFullYear()}`;

    if (elapsed === 0) {
        return T.now;
    }
    if (elapsed < msPerMinute) {
        return Math.round(elapsed / 1000) + ` ${T.second}`;
    } else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ` ${T.minute}`;
    } else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + ` ${T.hour}`;
    } else if (elapsed < msPerMonth) {
        return Math.round(elapsed / msPerDay) + ` ${T.day} | ` + date;
    } else if (elapsed < msPerMonth) {
        return Math.round(elapsed / msPerWeek) + ` ${T.week} | ` + date;
    } else if (elapsed < msPerYear) {
        return Math.round(elapsed / msPerMonth) + ` ${T.month} | ` + date;
    } else {
        return Math.round(elapsed / msPerYear) + ` ${T.year} | ` + date;
    }
}
