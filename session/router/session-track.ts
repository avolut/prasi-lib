import { EsensiSession } from "app/server/session";
import { sessionContext } from "lib/server/context";
import { SessionAuth } from "../type";

export default async function (this: any, arg: SessionAuth) {
  const ctx = sessionContext<EsensiSession>(this);
  // let result = "invalid" as ClientSessionStatus;
  // const session = ctx.session.findFirst({ uid, sid });
  // if (session) {
  //   if (!session.expired_at || session.expired_at > Date.now()) {
  //     result = "active";
  //   } else {
  //     result = "expired";
  //   }
  // }

  return { status: "ok" };
}
