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
import { FC, ReactNode, useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Date } from "./Date";
import { Datetime } from "./Datetime";
import { Dropdown } from "./Dropdown";
import { Relation } from "./Dropdown/relation";
import { InputMoney } from "./InputMoney";
import { Radio } from "./Radio";
import { SliderOptions } from "./Slider/types";
import { FieldOptions } from "./type";
import { FormHook, modify } from "./utils/utils";

export const Field: FC<{
  name: string;
  label: string;
  desc?: string;
  form?: FormHook;
  type:
    | "text"
    | "number"
    | "textarea"
    | "dropdown"
    | "relation"
    | "password"
    | "radio"
    | "date"
    | "datetime"
    | "money"
    | "slider"
    | "master-link";
  required: "y" | "n";
  options: FieldOptions;
  slider: () => Promise<SliderOptions>;
  on_change: (arg: { value: any }) => void | Promise<void>;
  PassProp: any;
  custom: "y" | "n";
  child: any;
  selection: "single" | "multi";
  suffix: any;
  placeholder?: any;
  label_alt:
    | ReactNode
    | FC<{ modify: typeof modify; data: any; current_name: string }>;
  rel_table: string;
  rel_fields: string[];
  rel_query: () => any;
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
  PassProp,
  custom,
  selection,
  suffix,
  child,
  placeholder,
  label_alt,
  rel_fields,
  rel_table,
  rel_query,
}) => {
  const value = form?.hook.getValues()[name];
  const local = useLocal({
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
    modify: null as any,
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

  const inputKeyDown = (e: any) => {
    if (e.key === "Enter" && form?.ref) {
      form.submit();
    }
  };

  const onChange = (e: any) => {
    form?.hook.setValue(name, e.currentTarget.value);
    form?.render();
  };

  if (form) {
    form.label[name] = label;
    if (required === "y") {
      form.validation[name] = "required";

      if (value) {
        delete form.hook.formState.errors[name];
      }
    } else {
      delete form.validation[name];
    }
  }

  return (
    <>
      <FormField
        control={form?.hook.control || ({} as any)}
        name={name}
        render={({ field }) => (
          <FormItem className="c-flex c-flex-1 c-flex-col">
            <FormLabel className="c-flex c-justify-between">
              <div className="c-flex c-items-center">
                {label}
                {required === "y" && (
                  <h1 className="c-ml-1 c-text-red-500">*</h1>
                )}
              </div>
              <div>
                {typeof label_alt === "function" &&
                  form &&
                  label_alt({
                    modify: local.modify
                      ? local.modify
                      : modify.bind({
                          form,
                        }),
                    current_name: name,
                    data: form.hook.getValues(),
                  })}
                {typeof label_alt !== "function" && label_alt}
              </div>
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

                {["text", "number", "password"].includes(type) &&
                  (suffix !== "" ? (
                    <div className="c-flex c-items-stretch">
                      <Input
                        {...field}
                        type={type}
                        spellCheck={false}
                        className="c-flex-1 c-rounded-r-none focus:c-rounded-r-none c-pr-1 c-border-r-0"
                        placeholder={placeholder}
                        onChange={onChange}
                        onKeyDown={inputKeyDown}
                      ></Input>
                      <span className="c-p-[7px] c-rounded-r c-bg-[#D3D3D5]">
                        {suffix || "-"}
                      </span>
                    </div>
                  ) : (
                    <Input
                      {...field}
                      type={type}
                      spellCheck={false}
                      placeholder={placeholder}
                      onKeyDown={inputKeyDown}
                      onChange={onChange}
                    />
                  ))}

                {type === "textarea" && (
                  <Textarea
                    {...field}
                    ref={textAreaRef}
                    spellCheck={false}
                    onChange={onChange}
                  />
                )}

                {type === "dropdown" && (
                  <Dropdown
                    options={options}
                    form={form}
                    name={name}
                    value={field.value}
                  />
                )}

                {type === "relation" && (
                  <Relation
                    relation={{
                      fields: rel_fields,
                      table: rel_table,
                      query: rel_query,
                    }}
                    form={form}
                    name={name}
                    value={field.value}
                  />
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

                {type === "radio" && (
                  <Radio
                    name={name}
                    options={options}
                    PassProp={PassProp}
                    child={child}
                    value={field.value}
                    custom={custom}
                    form={form}
                    selection={selection}
                    on_select={(value: any) => {
                      form?.hook.setValue(name, value);
                    }}
                    init_modify={(mod) => {
                      local.modify = mod;
                      local.render();
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
            {/* <FormDescription>{desc}</FormDescription> */}
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
