import { useLocal } from "@/utils/use-local";
import get from "lodash.get";
import { FC, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import {
  MasterDetailConfig,
  MasterDetailLocal,
  MasterDetailProp,
} from "./type";
import { GFCol } from "@/gen/utils";
import { master_detail_gen_hash, master_detail_params } from "./utils";

export const MasterDetail: FC<MasterDetailProp> = (props) => {
  const { header, name, mode, title, actions, gen_fields } = props;
  const md = useLocal<MasterDetailLocal & { cache_internal: any }>(
    {
      name,
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
      pk: null as null | GFCol,
    },
    () => {
      if (!isEditor) {
        const hash = master_detail_params(md);
        if (hash && hash[name] && md.pk) {
          if (md.pk.type === "int") {
            md.selected = { [md.pk.name]: parseInt(hash[name]) };
          } else {
            md.selected = { [md.pk.name]: hash[name] };
          }
          md.render();
        }
      }
    }
  );
  if (!md.pk && gen_fields) {
    for (const str of gen_fields) {
      const f = JSON.parse(str) as GFCol;
      if (f.is_pk) md.pk = f;
    }
  }

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
  const local = useLocal({ init: false }, () => {
    local.init = true;
    local.render();
  });

  if (local.init) {
    const hash = master_detail_params(md);
    delete hash.parent_id;

    if (!md.selected) {
      delete hash[md.name];
      location.hash = master_detail_gen_hash(hash);
    } else if (md.pk) {
      hash[md.name] = md.selected[md.pk.name];
      location.hash = master_detail_gen_hash(hash);
    }
  }

  return (
    <div className={cx("c-flex-1 c-flex-col c-flex")}>
      <div
        className={cx(md.selected && "c-hidden", "c-flex c-flex-1 c-flex-col")}
      >
        <props.PassProp md={md}>{props.master}</props.PassProp>
      </div>
      {md.selected && <Detail props={props} md={md} />}
      {isEditor && !local.init && (
        <div className="c-hidden">
          <Detail props={props} md={md} />
        </div>
      )}
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
