import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Form, FormField } from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import { weatherAgent } from "./clients/mastra";

type ChatLineProps = {
  id: string;
  role: "user" | "assistant";
  message: string;
  side: "left" | "right";
};

const formSchema = z.object({
  message: z.string().nonempty(),
});

function App() {
  const [chat, setChat] = useState<ChatLineProps[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: "" },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setChat((prev) => [
      ...prev,
      {
        id: String(prev.length + 1),
        role: "user",
        message: values.message,
        side: "right",
      },
    ]);
    form.reset();

    const generateAgent = async () => {
      const response = await weatherAgent.generate({
        messages: [
          {
            role: "user",
            content: values.message,
          },
        ],
      });
      setChat((prev) => [
        ...prev,
        {
          id: String(prev.length + 1),
          role: "assistant",
          message: response.text,
          side: "left",
        },
      ]);
    };

    generateAgent();
  };

  return (
    <div className="w-screen h-screen flex justify-center p-4">
      <div className="container flex flex-col gap-4">
        <h2 className="text-2xl">Mastra Agent</h2>
        <div className="flex flex-col gap-4 p-4 grow bg-accent rounded-md">
          {chat.map((line) => (
            <ChatLine key={line.id} {...line} />
          ))}
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <Textarea
                  placeholder="チャットメッセージを入力してください"
                  className="resize-none"
                  {...field}
                />
              )}
            />
            <Button type="submit">送信</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

const MastraAvator = () => (
  <Avatar className="bg-black">
    <AvatarImage src="https://github.com/mastra-ai.png" />
    <AvatarFallback>AI</AvatarFallback>
  </Avatar>
);

const UserAvatar = () => (
  <Avatar>
    <AvatarImage src="https://github.com/shadcn.png" />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>
);

const ChatLine = ({ role, message, side }: ChatLineProps) => {
  const sideClass = side === "left" ? "flex-row" : "flex-row-reverse";
  return (
    <div className={`flex items-center gap-4 ${sideClass}`}>
      {role === "assistant" ? <MastraAvator /> : <UserAvatar />}
      <div className="min-w-fit max-w-1/2 h-full flex items-center p-4 bg-white rounded-md shadow">
        <p className="whitespace-pre-wrap">{message}</p>
      </div>
    </div>
  );
};

export default App;
