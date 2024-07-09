import { FC } from "react";

export const Flow: FC<{
  children: any;
  PassProp: any;
  flow: { text: string; popover: any; icon: any }[];
  props?: any;
}> = ({ PassProp, children, flow, props }) => {
  return (
    <div {...props} className={cx(props.className, "c-flex-row")}>
      {flow.map((item, idx) => {
        return (
          <PassProp
            flow={flow}
            item={item}
            idx={idx}
            key={idx}
            is_last={idx === flow.length - 1}
          >
            {children}
          </PassProp>
        );
      })}
    </div>
  );
};
