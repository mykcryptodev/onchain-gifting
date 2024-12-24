import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useGiftItems } from "~/contexts/GiftItemsContext";
import useDebounce from "~/hooks/useDebounce";

export function Password() {
  const { updatePassword } = useGiftItems();
  const [password, setPassword] = useState<string>("");
  const debouncedPassword = useDebounce(password, 500);
  const [hasSeenToast, setHasSeenToast] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const isValid = debouncedPassword.length >= 20;
    setShowError(debouncedPassword.length > 0 && !isValid);
    if (isValid) {
      updatePassword(debouncedPassword);
    } else {
      updatePassword("");
    }
  }, [debouncedPassword, updatePassword]);

  return (
    <div className="w-full max-w-sm mx-auto">
      <textarea 
        placeholder="Enter a message for your recipient!" 
        onChange={(e) => setPassword(e.target.value)} 
        onFocus={() => {
          if (!hasSeenToast) {
            toast.info("Be careful with this message! Anyone can use this message to claim your gift.");
            setHasSeenToast(true);
          }
        }}
        className={`w-full p-2 border rounded-md ${showError ? 'border-red-500' : 'border-gray-300'}`}
      />
      {showError && (
        <p className="text-red-500 text-sm mt-1">
          Message must be at least 20 characters long
        </p>
      )}
    </div>
  );
}
