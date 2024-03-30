import { GFCol } from "@/gen/utils";
import { useLocal } from "@/utils/use-local";
import get from "lodash.get";
import { FC, useEffect } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";
import {
  MasterDetailConfig,
  MasterDetailLocal,
  MasterDetailProp,
} from "./type";
import { master_detail_gen_hash, master_detail_params } from "./utils";

export const MasterDetail: FC<MasterDetailProp> = (props) => {
  const { header, name, mode, title, actions, gen_fields, md_parent } = props;
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
      parent: md_parent,
    },
    () => {
      const params = master_detail_params(md);
      const hash = params.hash;

      if (params.tabs && params.tabs[md.name]) {
        md.active_tab = params.tabs[md.name];
      }
      if (md.mode === "breadcrumb") {
        if (hash && hash[name] && md.pk) {
          if (md.pk.type === "int") {
            md.selected = { [md.pk.name]: parseInt(hash[name]) };
          } else {
            md.selected = { [md.pk.name]: hash[name] };
          }
        }
      }
      md.render();
    }
  );

  const local = useLocal({ init: false }, () => {
    local.init = true;
    local.render();
  });

  if (local.init) {
    const params = master_detail_params(md);
    const hash = params.hash;
    delete hash.parent_id;

    if (!md.selected) {
      delete hash[md.name];
      master_detail_gen_hash(params);
    } else if (md.pk) {
      hash[md.name] = md.selected[md.pk.name];
      master_detail_gen_hash(params);
    }
  }

  if (!md.pk && gen_fields) {
    for (const str of gen_fields) {
      try {
        const f = JSON.parse(str) as GFCol;
        if (f.is_pk) md.pk = f;
      } catch (e) {}
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

    useEffect(() => {
      md.mode = mode;
      md.render();
    }, [mode]);
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
      {md.mode === "breadcrumb" && (
        <BreadcrumbMode props={props} md={md} header={header} />
      )}
      {md.mode === "vertical" && (
        <VerticalMode props={props} md={md} header={header} />
      )}
      {md.mode === "horizontal" && (
        <HorizontalMode props={props} md={md} header={header} />
      )}
      {isEditor && (
        <div className="c-hidden">
          <props.PassProp md={md}>{props.detail}</props.PassProp>
        </div>
      )}
    </div>
  );
};

const VerticalMode: FC<{
  props: MasterDetailProp;
  md: MasterDetailConfig;
  header: any;
}> = ({ props, md, header }) => {
  return (
    <div className={cx("c-flex-1")}>
      <PanelGroup direction="vertical">
        <Panel className="c-border-b">
          <props.PassProp md={md}>{props.master}</props.PassProp>
        </Panel>
        <>
          <PanelResizeHandle />
          <Panel
            className="c-flex c-flex-col c-items-stretch"
            defaultSize={
              parseInt(localStorage.getItem(`prasi-md-h-${md.name}`) || "") ||
              undefined
            }
            onResize={(e) => {
              if (e < 80) {
                localStorage.setItem(`prasi-md-h-${md.name}`, e.toString());
              }
            }}
          >
            <props.PassProp md={md}>{header}</props.PassProp>
            <Detail props={props} md={md} />
          </Panel>
        </>
      </PanelGroup>
    </div>
  );
};

const HorizontalMode: FC<{
  props: MasterDetailProp;
  md: MasterDetailConfig;
  header: any;
}> = ({ props, md, header }) => {
  return (
    <div className={cx("c-flex-1")}>
      <PanelGroup direction="horizontal">
        <Panel className="c-border-r">
          <props.PassProp md={md}>{props.master}</props.PassProp>
        </Panel>
        <>
          <PanelResizeHandle />
          <Panel
            className="c-flex c-flex-col c-items-stretch"
            defaultSize={
              parseInt(localStorage.getItem(`prasi-md-h-${md.name}`) || "") ||
              undefined
            }
            onResize={(e) => {
              if (e < 80) {
                localStorage.setItem(`prasi-md-h-${md.name}`, e.toString());
              }
            }}
          >
            <props.PassProp md={md}>{header}</props.PassProp>
            <Detail props={props} md={md} />
          </Panel>
        </>
      </PanelGroup>
    </div>
  );
};

const BreadcrumbMode: FC<{
  props: MasterDetailProp;
  md: MasterDetailConfig;
  header: any;
}> = ({ props, md, header }) => {
  return (
    <>
      <props.PassProp md={md}>{header}</props.PassProp>
      <div className={cx("c-flex-1 c-flex-col c-flex")}>
        <div
          className={cx(
            md.selected && "c-hidden",
            "c-flex c-flex-1 c-flex-col"
          )}
        >
          <props.PassProp md={md}>{props.master}</props.PassProp>
        </div>
        {md.selected && <Detail props={props} md={md} />}
      </div>
    </>
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
    if (childs[idx]) {
      md.active_tab = childs[idx].name;
    }
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
                padding-left: 20px !important;
                height: auto !important;
              `
            )}
          >
            {childs.map((e: { name: string }) => {
              return (
                <TabsTrigger
                  value={e.name}
                  onClick={() => {
                    const params = master_detail_params(md);
                    const hash = params.hash;
                    delete hash.parent_id;

                    params.tabs[md.name] = e.name;
                    master_detail_gen_hash(params);

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
