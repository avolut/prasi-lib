import { Form as FForm } from "@/comps/ui/form";
import { FC } from "react";
import { useForm } from "react-hook-form";

export const Form: FC<{
  on_load: () => any;
  on_submit: (arg: { form: any; error: any }) => any;
  body: any;
  form: { hook: any; render: () => void };
  PassProp: any;
}> = ({ on_load, body, form, PassProp, on_submit }) => {
  const form_hook = useForm<any>({
    defaultValues: on_load,
  });

  form.hook = form_hook;

  return (
    <FForm {...form_hook}>
      <div
        className={
          "flex-1 flex flex-col w-full items-stretch relative overflow-auto"
        }
      >
        <div className="absolute inset-0">
          <PassProp
            submit={() => {
              on_submit({ form: form.hook.getValues(), error: {} });
            }}
          >
            {body}
          </PassProp>
        </div>
      </div>
    </FForm>
  );
};
