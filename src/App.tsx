import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const createUserFormSchema = z.object({
  name: z
    .string()
    .nonempty("O nome é obrigatório")
    .transform((name) => {
      return name
        .trim()
        .split(" ")
        .map((word) => {
          return word[0].toLocaleUpperCase().concat(word.substring(1));
        })
        .join(" ");
    }),
  email: z
    .string()
    .nonempty("O e-mail é obrigatório.")
    .email("Insira um email."),
  // .refine(email => {
  //   return email.endsWith('rocketseat.com.br')
  // }, "O e-mail precisa ser da rocketseat!"),
  password: z
    .string()
    .nonempty("A senha é obrigatória.")
    .min(6, "A senha precisa de no mínimo 6 caracteres."),

  techs: z.array(
    z.object({
      title: z.string().nonempty("O título é obbrigatório"),
      knowledge: z.coerce.number().min(1).max(100),
    })
  ).min(2, "Insira pelo menos duas tecnologias.")
});

type CreateUserFormData = z.infer<typeof createUserFormSchema>;

const App: React.FC = () => {
  const [output, setOutput] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "techs",
  });

  function addNewTech() {
    append({ title: "", knowledge: 0 });
  }

  function createUser(data: CreateUserFormData) {
    setOutput(JSON.stringify(data, null, 2));
  }

  return (
    <main className="h-screen bg-zinc-50 flex items-center justify-center flex-col gap-10">
      <form
        onSubmit={handleSubmit(createUser)}
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="name">Nome</label>
          <input
            type="nome"
            className="border border-zinc-200 shadow-sm rounded h-10 px-3"
            {...register("name")}
          />
          {errors.name && <span className="text-red-500">{errors.name.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            className="border border-zinc-200 shadow-sm rounded h-10 px-3"
            {...register("email")}
          />
          {errors.email && <span className="text-red-500">{errors.email.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password">Senha</label>

          <input
            type="password"
            className="border border-zinc-200 shadow-sm rounded h-10 px-3"
            {...register("password")}
          />

          {errors.password && <span className="text-red-500">{errors.password.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="techs" className="flex items-center justify-between">
            Técnologias
            <button
              type="button"
              onClick={addNewTech}
              className="text-emerald-500 text-xs"
            >
              Adicionar
            </button>
          </label>

          {fields.map((field, index) => (
            <div className="flex gap-2" key={field.id}>
              <div className="flex flex-1 flex-col gap-1">
                <input
                  type="text"
                  className=" border border-zinc-200 shadow-sm rounded h-10 px-3"
                  {...register(`techs.${index}.title`)}
                />
                {errors.techs?.[index]?.title && (
                  <span className="text-red-500">{errors.techs[index]?.message}</span>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-1">
                <input
                  type="techs"
                  className="w-16 border border-zinc-200 shadow-sm rounded h-10 px-3"
                  {...register(`techs.${index}.knowledge`)}
                />
                {errors.techs?.[index]?.knowledge && (
                  <span className="text-red-500">{errors.techs[index]?.knowledge?.message}</span>
                )}
              </div>
            </div>
          ))}
          {errors.techs && <span className="text-red-500">{errors.techs.message}</span>}
        </div>

        <button
          type="submit"
          className="bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600"
        >
          Salvar
        </button>
      </form>

      <pre>{output}</pre>
    </main>
  );
};

export default App;
