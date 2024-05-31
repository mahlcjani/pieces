import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import isLeapYear from "dayjs/plugin/isLeapYear";

//import pl from "dayjs/locale/pl";

dayjs.extend(localizedFormat);
dayjs.extend(isLeapYear);
//dayjs.locale(pl);

export default dayjs;
