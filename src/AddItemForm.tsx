import { Button, Input } from "antd";
import { PaperClipOutlined } from "@ant-design/icons";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

export type AddItemFormPropsType = {
  addItem: (title: string) => void;
};

const schema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Поле не может быть пустым")
    .max(50, "Максимум 50 символов")
    .regex(/^[^<>@#$%^&*]*$/, "Недопустимые символы"),
});

type FormValues = z.infer<typeof schema>;

const AddItemForm = ({ addItem }: AddItemFormPropsType) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "" },
  });

  const onSubmit = (data: FormValues) => {
    addItem(data.title.trim());
    reset();
  };

  return (
    <form className='addItem' onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name='title'
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            status={errors.title ? "error" : ""}
            placeholder='Введите задачу'
          />
        )}
      />
      <Button htmlType='submit' block className='btn-green' type='primary'>
        <PaperClipOutlined />
      </Button>
      {errors.title && (
        <div className='error-message'>{errors.title.message}</div>
      )}
    </form>
  );
};

export default AddItemForm;
