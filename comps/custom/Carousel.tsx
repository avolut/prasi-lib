import {
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Carousel as SCarousel,
} from "lib/comps/ui/carousel";
import { FC } from "react";

export const Carousel: FC<{ list: any[] }> = ({ list }) => {
  const final_list = Array.isArray(list) ? list : [];
  return (
    <div
      className={cx(
        "carousel c-flex c-flex-1 c-overflow-hidden",
        css`
          .carousel-next {
            right: 0px;
          }
          .carousel-prev {
            left: 0px;
          }
        `
      )}
    >
      <SCarousel className="c-flex-1" opts={{}}>
        <CarouselContent>
          {final_list.map((e: any, idx: number) => {
            return <CarouselItem key={idx}>{e}</CarouselItem>;
          })}
        </CarouselContent>
        <div className="absolute inset-0">
          <CarouselNext className="carousel-next" />
          <CarouselPrevious className="carousel-prev" />
        </div>
      </SCarousel>
    </div>
  );
};
