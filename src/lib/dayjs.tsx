import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

//import pl from "dayjs/locale/pl";

dayjs.extend(localizedFormat);
//dayjs.locale(pl);

export default dayjs;
