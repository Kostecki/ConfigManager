import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/da";

const LOCALE = "da";
const TZ = "Europe/Copenhagen";

dayjs.extend(timezone);
dayjs.extend(utc);

dayjs.locale(LOCALE);
dayjs.tz.setDefault(TZ);

export default dayjs;
