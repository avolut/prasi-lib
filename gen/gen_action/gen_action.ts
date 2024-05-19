import { MDLocal } from "@/comps/md/utils/typings";
import { codeBuild } from "../master_detail/utils";
import { GenFn } from "../utils";
export const gen_action: GenFn<{ name: string; on_load: () => MDLocal }> = async (
  modify,
  data,
  arg: { name: string, on_load: () => MDLocal }
) => {
  const md = arg.on_load
  console.log("halo gen")
  console.log({modify, data, arg, md: md()})
//   const res = await codeBuild({
//     div: `\
// <>
//   {md.tab.active === "${arg.name}" && (
//     <div {...props} className={cx(props.className, "")}>
//       {children}
//     </div>
//   )}
// </>
//         `,
//   });
};
