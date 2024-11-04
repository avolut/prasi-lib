import { useLocal } from "lib/utils/use-local";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { FC, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "lib/comps/ui/carousel";

export const Slide: FC<{
  child: any;
  PassProp: any;
  props: any;
  mode?: "full" | "normal";
  direction?: "vertical" | "horizontal";
  deps?: any;
  _item?: PrasiItem;
  data: any;
}> = ({ child, PassProp, props, mode, direction, deps, _item, data }) => {
  return (
    <Carousel className="c-flex c-flex-row c-flex-grow c-flex-1 ">
      <CarouselContent>
        {Array.isArray(data) ? (
          <>
            {data.map((e, idx) => {
              return (
                <CarouselItem>
                  <PassProp item={e} idx={idx} slide={{ deps }}>
                    {child}
                  </PassProp>
                </CarouselItem>
              );
            })}
          </>
        ) : (
          <></>
        )}
      </CarouselContent>
    </Carousel>
  );
};
