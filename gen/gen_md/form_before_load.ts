import { GFCol } from "../utils";

export const form_before_load = (
  table: string,
  pk: GFCol,
  title: string,
  label: string
) => {
  return `
  const master = md.cache("master") as
    | { reload: () => Promise<void> }
    | undefined;

  const id = master_detail_params(md).parent_id;

  const after_load = (item: any) => {
    const set_actions = () =>
      (md.ui.actions = [
        {
          label: "Delete",
          type: "destructive",
          onClick: async () => {
            if (confirm("Are you sure ?")) {
              md.ui.actions = [{ label: "Deleting...", type: "ghost" }];
              md.render();

              await db.${table}.delete({ where: { ${pk.name}: item.${
    pk.name
  } } });

              setTimeout(() => {
                md.ui.actions = [...md.ui.default_actions];
                md.ui.breadcrumb = [];
                md.ui.back = false;
                md.selected = null;
                md.render();
                if (md.mode !== "breadcrumb") {
                  master?.reload();
                }
              });
            }
          },
          icon: \`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>\`,
        },
        {
          label: "Save",
          onClick: async () => {
            md.ui.actions = [{ label: "Saving...", type: "ghost" }];
            md.render();
            await md.cache("detail").submit();
            setTimeout(() => {
              set_actions();
              md.render();
              if (md.mode !== "breadcrumb") {
                master?.reload();
              }
            }, 500);
          },
          icon: \`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>\`,
        },
      ]);
    set_actions();
    md.ui.breadcrumb = [[md.ui.title, ""]${
      label ? `, item?.["${label}"]` : ""
    }];
    md.render();
  };
  md.ui.breadcrumb = [[md.ui.title, ""], "..."];
  md.render();
  
`;
};
