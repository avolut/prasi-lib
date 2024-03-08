import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/comps/ui/form";
import { useLocal } from "@/utils/use-local";
import autosize from "autosize";
import { FC, useEffect, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { ButtonOptions } from "./ButtonOptions";
import { Date } from "./Date";
import { Datetime } from "./Datetime";
import { InputMoney } from "./InputMoney";
import { PopUpDropdown } from "./PopUpDropdown";
import { SliderOptions } from "./Slider/types";

export const Field: FC<{
  name: string;
  label: string;
  desc?: string;
  form?: { hook: UseFormReturn<any, any, undefined>; render: () => void };
  type:
    | "text"
    | "textarea"
    | "dropdown"
    | "password"
    | "button-options"
    | "date"
    | "datetime"
    | "money"
    | "slider"
    | "master-link";
  required: "y" | "n";
  options: () => Promise<{ value: string; label: string }[]>;
  slider: () => Promise<SliderOptions>;
  on_change: (arg: { value: any }) => void | Promise<void>;
}> = ({
  name,
  form,
  desc,
  label,
  type,
  required,
  options,
  slider,
  on_change,
}) => {
  const value = form?.hook.getValues()[name];
  const local = useLocal({
    dropdown: {
      popup: false,
    },
    date: {
      // label: "",
      popup: false,
    },
    slider: {
      value: 0,
      opt: {
        step: 1,
        min: { value: 0, label: "Start" },
        max: { value: 100, label: "End" },
      } as SliderOptions,
      status: "init" as "init" | "loading" | "ready",
    },
  });

  const textAreaRef = useRef<any>();
  useEffect(() => {
    autosize(textAreaRef.current);
    return () => {
      autosize.destroy(textAreaRef.current);
    };
  }, []);

  useEffect(() => {
    if (type === "slider") {
      local.slider.value = parseSliderValue(value, local.slider.opt);
      if (typeof slider === "function") {
        if (local.slider.status === "init") {
          local.slider.status = "ready";
          local.render();
          (async () => {
            const res = await slider();

            local.slider.opt = res;
            local.render();
          })();
        }
      } else {
        local.slider.status = "ready";
        local.render();
      }
    }
  }, [value]);

  return (
    <>
      {local.dropdown.popup && (
        <PopUpDropdown
          on_close={() => {
            local.dropdown.popup = false;
            local.render();
          }}
          on_select={(value: any) => {
            form?.hook.setValue(name, value);
          }}
          title={label}
          options={options}
        />
      )}
      <FormField
        control={form?.hook.control || ({} as any)}
        name={name}
        render={({ field }) => (
          <FormItem className="c-flex c-flex-1 c-flex-col">
            <FormLabel className="flex">
              {label}
              {required === "y" && <h1 className="c-ml-1 c-text-red-500">*</h1>}
            </FormLabel>
            <FormControl>
              <>
                {type === "slider" && (
                  <div className="c-flex-1 c-min-h-[40px] c-flex">
                    <div className="c-flex c-flex-col c-items-center">
                      <div>{local.slider.opt.min.value}</div>
                      <div>{local.slider.opt.min.label}</div>
                    </div>
                    <div className="c-flex-1 c-flex-col c-items-stretch">
                      <input
                        type="range"
                        className="c-flex-1 c-w-full"
                        onInput={(e) => {
                          const value = e.currentTarget.value;

                          local.slider.value = parseSliderValue(
                            value,
                            local.slider.opt
                          );
                          form?.hook.setValue(name, value);
                          local.render();
                        }}
                        value={local.slider.value}
                        min={local.slider.opt.min.value}
                        max={local.slider.opt.max.value}
                      />
                      <div className="c-w-full c-mx-auto c-text-center">
                        {local.slider.value}
                      </div>
                    </div>

                    <div className="c-flex c-flex-col c-items-center">
                      <div>{local.slider.opt.max.value}</div>
                      <div>{local.slider.opt.max.label}</div>
                    </div>
                  </div>
                )}

                {["text", "password"].includes(type) && (
                  <Input
                    {...field}
                    type={type}
                    onChangeCapture={
                      typeof on_change === "function"
                        ? (e) => {
                            console.log(e.currentTarget.value);
                            on_change({ value: e.currentTarget.value });
                          }
                        : undefined
                    }
                  />
                )}

                {type === "textarea" && (
                  <Textarea {...field} ref={textAreaRef} />
                )}

                {type === "dropdown" && (
                  <Button
                    onClick={() => {
                      local.dropdown.popup = true;
                      local.render();
                    }}
                    variant={"outline"}
                  >
                    {field.value}
                  </Button>
                )}

                {type === "date" && (
                  <Date
                    on_select={(value: any) => {
                      form?.hook.setValue(name, value);
                    }}
                  />
                )}

                {type === "datetime" && (
                  <Datetime
                    on_select={(value: any) => {
                      form?.hook.setValue(name, value);
                    }}
                  />
                )}

                {type === "button-options" && (
                  <ButtonOptions
                    options={options}
                    value={field.value}
                    on_select={(value: any) => {
                      form?.hook.setValue(name, value);
                    }}
                  />
                )}

                {type === "money" && (
                  <InputMoney
                    value={field.value}
                    on_select={(value: any) => {
                      form?.hook.setValue(name, value);
                    }}
                  />
                )}
              </>
            </FormControl>
            <FormDescription>{desc}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

const parseSliderValue = (value: any, opt: SliderOptions) => {
  let val = value;
  if (typeof value !== "number") {
    try {
      val = parseInt(val);
    } catch (e) {
      val = opt.min.value;
    }
  }

  if (typeof val !== "number" || isNaN(val)) {
    val = opt.min.value;
  }

  if (val >= opt.max.value) return opt.max.value;
  else if (val <= opt.min.value) return opt.min.value;
  return val;
};
