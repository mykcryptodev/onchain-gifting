import { useEffect, useState } from "react";
import { useGiftItems } from "~/contexts/GiftItemsContext";
import useDebounce from "~/hooks/useDebounce";

export function Password() {
  const { updatePassword } = useGiftItems();
  const [password, setPassword] = useState<string>("");
  const debouncedPassword = useDebounce(password, 500);

  useEffect(() => {
    updatePassword(debouncedPassword);
  }, [debouncedPassword]);

  return (
    <textarea 
      placeholder="Enter a message for your recipient!" 
      onChange={(e) => setPassword(e.target.value)} 
      className="w-full p-2 border border-gray-300 rounded-md mx-auto max-w-sm"
    />
  );
}
