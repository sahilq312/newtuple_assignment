"use client";
import { ArrowUpIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "../ui/input-group";
import { useState } from "react";

export const ChatInput = ({
  onSend,
  loading,
}: {
  onSend: (prompt: string) => void;
  loading: boolean;
}) => {
  const [prompt, setPrompt] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleSend = () => {
    onSend(prompt);
    setPrompt("");
    setIsButtonDisabled(true);
  };

  return (
    <div className="w-full flex justify-center items-center p-6 border-t">
      <InputGroup className="max-w-5xl w-full">
        <InputGroupTextarea
          value={prompt}
          placeholder="Ask anything"
          onChange={(e) => {
            const val = e.target.value;
            setPrompt(val);
            setIsButtonDisabled(val.length === 0 || val.length > 200);
          }}
        />

        <InputGroupAddon align="inline-end">
          <InputGroupButton disabled>{prompt.length}/200</InputGroupButton>

          <InputGroupButton
            className="bg-primary text-primary-foreground rounded-full"
            onClick={handleSend}
            disabled={isButtonDisabled || loading}
          >
            <ArrowUpIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
};
