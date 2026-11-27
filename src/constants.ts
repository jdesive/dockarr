import * as Path from "path";
import * as os from "os";
import {version} from '../package.json';

export const DOCKARR_VERSION = version;
export const dockarrDir = Path.join(os.homedir(), ".dockarr");
