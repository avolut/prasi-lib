import { useLocal } from "@/utils/use-local";
import get from "lodash.get";
import { FC, useEffect } from "react";
import {
  MasterDetailConfig,
  MasterDetailLocal,
  MasterDetailProp,
} from "./type";
import { Tab } from "../custom/Tab";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

export const MasterDetail: FC<MasterDetailProp> = (props) => {
  const { header, PassProp, master, detail, mode, title, actions } = props;
  const md = useLocal<MasterDetailLocal & { cache_internal: any }>({
    mode,
    selected: null,
    active_tab: "",
    ui: {
      back: false,
      title: title,
      breadcrumb: [],
      default_actions: null as any,
      actions: null as any,
    },
    cache_internal: {},
    cache: null as any,
  });

  if (!md.ui.actions) {
    md.ui.actions = actions(md);
    md.ui.default_actions = actions(md);
  }

  if (!md.cache) {
    md.cache = (name: string, opt?: { reset: boolean }) => {
      if (!md.cache_internal[name] || opt?.reset) md.cache_internal[name] = {};
      return md.cache_internal[name];
    };
  }

  if (isEditor) {
    useEffect(() => {
      md.ui.title = title;
      md.render();
    }, [title]);
  }

  useEffect(() => {
    let back = false;
    if (md.selected && md.mode === "breadcrumb") {
      back = true;
    }
    if (back !== md.ui.back) {
      md.ui.back = back;
      md.render();
    }
  }, [md.selected]);

  return (
    <div
      className={cx(
        "c-flex-1 c-flex-col c-flex c-w-full c-h-full c-overflow-hidden"
      )}
    >
      <props.PassProp md={md}>{header}</props.PassProp>
      <BreadcrumbMode props={props} md={md} />
    </div>
  );
};

const BreadcrumbMode: FC<{
  props: MasterDetailProp;
  md: MasterDetailConfig;
}> = ({ props, md }) => {
  return (
    <div className={cx("c-flex-1 c-flex-col c-flex")}>
      <div
        className={cx(md.selected && "c-hidden", "c-flex c-flex-1 c-flex-col")}
      >
        <props.PassProp md={md}>{props.master}</props.PassProp>
      </div>
      {md.selected && <Detail props={props} md={md} />}
    </div>
  );
};

const Detail: FC<{
  props: MasterDetailProp;
  md: MasterDetailConfig;
}> = ({ props, md }) => {
  const childs = get(
    props.detail,
    "props.meta.item.component.props.detail.content.childs"
  );

  let idx = childs.findIndex(
    (e: any) => e.name.toLowerCase() === md.active_tab.toLowerCase()
  );
  if (idx < 0) {
    idx = 0;
    md.active_tab = childs[idx].name;
    setTimeout(md.render);
  }
  const content = childs[idx];

  return (
    <>
      {childs.length > 1 && (
        <Tabs
          value={content.name}
          className={cx(
            css`
              padding: 0;
              button {
                border-radius: 0;
              }
            `
          )}
        >
          <TabsList
            overrideClassName
            className={cx(
              "c-flex c-w-full c-rounded-none c-border-b c-border-gray-300 c-justify-start",
              css`
                padding: 0 !important;
                height: auto !important;
              `
            )}
          >
            {childs.map((e: { name: string }) => {
              return (
                <TabsTrigger
                  value={e.name}
                  onClick={() => {
                    md.active_tab = e.name;
                    md.render();
                  }}
                  overrideClassName
                >
                  <div
                    className={cx(
                      "c-p-1 c-h-10 c-flex c-items-center",
                      md.active_tab === e.name
                        ? css`
                            border-bottom: 2px solid #3c82f6;
                          `
                        : "border-b-transparent"
                    )}
                  >
                    <div className={cx("c-mr-1 c-flex-1 c-px-1 c-flex")}>
                      {e.name}
                    </div>
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      )}
      <props.PassProp md={md}>{content}</props.PassProp>
    </>
  );
};
