import { useLocal } from "lib/utils/use-local";
import { FC } from "react";

export const Accordion: FC<{
  on_load: () => Promise<any[]>;
  PassProp: any;
  child: any;
}> = ({ on_load, PassProp, child }) => {
  const local = useLocal(
    { list: [] as any[], loading: true, active: 0 },
    async () => {
      local.list = await on_load();
      local.loading = false;
      local.render();
    }
  );

  return (
    <>
      {local.loading ? (
        <PassProp
          loading={true}
          item={{}}
          activate={() => {}}
          active={-1}
          idx={-1}
        >
          {child}
        </PassProp>
      ) : (
        local.list.map((item, idx) => {
          return (
            <PassProp
              loading={false}
              item={item}
              idx={idx}
              key={idx}
              active={local.active}
              activate={() => {
                local.active = idx;
                local.render();
              }}
            >
              {child}
            </PassProp>
          );
        })
      )}
    </>
  );
};
