import rpc from "@nextplate/rpc";

export const client = rpc(
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://api.gamezonetech.lk"
);
