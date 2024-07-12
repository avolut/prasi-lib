import { router } from "app/router";
type ROUTES = keyof typeof router;
export const route_params = async <T extends ROUTES>(
  route: T,
  arg: ROUTES[]
) => {
  const r = router[route];
  if (r) {
    // r()
  }
};
