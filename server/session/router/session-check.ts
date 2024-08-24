import { EsensiSession } from "app/server/session";
import { sessionContext } from "lib/server/context";
import { ClientSessionStatus } from "../type";

export default async function (this: any, uid: string, sid: string) {
  const ctx = sessionContext<EsensiSession>(this);

  let result = "invalid" as ClientSessionStatus;

  return result;
}
