import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useGiftItems } from "~/contexts/GiftItemsContext";
import useDebounce from "~/hooks/useDebounce";

export function Password() {
  const { updatePassword } = useGiftItems();
  const [password, setPassword] = useState<string>("");
  const debouncedPassword = useDebounce(password, 500);
  const [hasSeenToast, setHasSeenToast] = useState(false);

  useEffect(() => {
    updatePassword(debouncedPassword);
  }, [debouncedPassword, updatePassword]);

  return (
    <textarea 
      placeholder="Enter a message for your recipient!" 
      onChange={(e) => setPassword(e.target.value)} 
      onFocus={() => {
        if (!hasSeenToast) {
          toast.info("Be careful with this message! Anyone can use this message to claim your gift.");
          setHasSeenToast(true);
        }
      }}
      className="w-full p-2 border border-gray-300 rounded-md mx-auto max-w-sm"
    />
  );
}
