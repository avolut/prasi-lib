import { FC } from "react";

export const Flow: FC<{
  children: any;
  PassProp: any;
  flow: { text: string; popover: any; icon: any }[];
  props?: any;
  active?: string | (() => string);
}> = ({ PassProp, children, flow, props, active }) => {
  const active_str = typeof active === "function" ? active() : active;
  const active_idx = flow.findIndex(e=> e.text === active_str)

  return (
    <div {...props} className={cx(props.className, "c-flex-row")}>
      {flow.map((item, idx) => {
        return (
          <PassProp
            flow={flow}
            item={item}
            idx={idx}
            key={idx}
            active={active}
            active_idx={active_idx}
            is_last={idx === flow.length - 1}
            is_first={idx === 0}
          >
            {children}
          </PassProp>
        );
      })}
    </div>
  );
};
