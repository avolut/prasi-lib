
import { useLocal } from "@/utils/use-local";
import { FC } from "react";

export type PropTypeSwitch = {};
export const FieldTypeSwitch: FC<{
  valueName: string;
  description?: string;
  label?: string;
}> = ({ valueName, description, label }) => {
  const local = useLocal({ checked: false });
  // const FormSchema = z.object({
  //   valueName: z.boolean().default(false).optional(),
  // });
  // const form = useForm<z.infer<typeof FormSchema>>({
  //   resolver: zodResolver(FormSchema),
  // });

  // function onSubmit(data: z.infer<typeof FormSchema>) {
  //   console.log({ data });
  // }

  return (
    <div
      onClick={() => {
        local.checked = !local.checked;
        local.render();
      }}
    >
      {JSON.stringify(local.checked)}
    </div>
    // <Form {...form}>
    //   <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
    //     <div>
    //       <h3 className="mb-4 text-lg font-medium">
    //         {label != undefined ? label : "-"}
    //       </h3>
    //       <div className="space-y-4">
    //         <FormField
    //           control={form.control}
    //           name="first_value"
    //           render={({ field }) => (
    //             <FormItem className="flex items-center space-x-2">
    //               <div>
    //                 <FormLabel className="text-base">
    //                   {label != undefined ? label : "-"}
    //                 </FormLabel>
    //                 <FormDescription>
    //                   {description != undefined ? description : "-"}
    //                 </FormDescription>
    //               </div>
    //               <FormControl>
    //                 <Switch
    //                   checked={field.value}
    //                   onCheckedChange={field.onChange}
    //                 />
    //               </FormControl>
    //             </FormItem>
    //           )}
    //         />
    //       </div>
    //     </div>
    //     <Button type="submit">Submit</Button>
    //   </form>
    // </Form>
  );
};
