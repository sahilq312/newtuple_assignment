type Message = {
  id: String;
  content: string;
  owner: "system" | "user" | "assistant";
};
