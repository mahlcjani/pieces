import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

// const dayjs = base;

dayjs.extend(localizedFormat);

export default dayjs;
