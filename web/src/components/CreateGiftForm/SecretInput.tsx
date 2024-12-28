"use client";

import { Input } from "~/components/ui/input";

import { useEffect, useState } from "react";
import { useGiftItems } from "~/contexts/GiftItemsContext";
import useDebounce from "~/hooks/useDebounce";

import { useToast } from "~/hooks/use-toast";
import { Label } from "../ui/label";

export function InputSecret() {
  const { updatePassword } = useGiftItems();
  const [password, setPassword] = useState<string>("");
  const debouncedPassword = useDebounce(password, 500);
  const [hasSeenToast, setHasSeenToast] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { toast } = useToast();

  useEffect(() => {
    const isLongEnough = debouncedPassword.length >= 20;
    const endsWithSpecialChar = /[^a-zA-Z0-9\s]$/.test(debouncedPassword);
    const isValid = isLongEnough && !endsWithSpecialChar;

    if (debouncedPassword.length > 0) {
      if (!isLongEnough) {
        setErrorMessage("Message must be at least 20 characters long");
        setShowError(true);
      } else if (endsWithSpecialChar) {
        setErrorMessage("Message cannot end with a special character");
        setShowError(true);
      } else {
        setShowError(false);
        setErrorMessage("");
      }
    } else {
      setShowError(false);
      setErrorMessage("");
    }

    if (isValid) {
      updatePassword(debouncedPassword);
    } else {
      updatePassword("");
    }
  }, [debouncedPassword, updatePassword]);
  return (
    <div className="flex flex-col gap-2">
      <Label>Secret Words</Label>
      <Input
        type="text"
        onChange={(e) => setPassword(e.target.value)}
        onFocus={() => {
          if (!hasSeenToast) {
            toast({
              title: "Careful!",
              description:
                "Be careful with this message! Anyone can use this message to claim your gift.",
            });
            setHasSeenToast(true);
          }
        }}
        className="flex w-full items-center gap-x-3 rounded-lg bg-white p-3"
        placeholder="The secret word use to claim this gift"
      />
      {showError && (
        <p className="mt-1 text-sm text-red-500 opacity-90">{errorMessage}</p>
      )}
    </div>
  );
}
