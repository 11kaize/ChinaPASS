import { preloadRegion, setRegionLoader } from "morphicons/dom";
import * as region from "morphicons/region";

// Metro bundles the filled-shape driver on both native and web. No remote chunk,
// CDN dependency or 100 ms first-interaction wait for the region code.
setRegionLoader(async () => region);
void preloadRegion().catch(() => {});
export const iconSpring = { stiffness: 330, damping: 34 };
