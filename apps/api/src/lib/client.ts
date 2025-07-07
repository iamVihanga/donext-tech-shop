import { hc } from "hono/client";

import type { AppType } from "@api/index";

export const client = hc<AppType>("https://gamezonetech.lk");
