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
  const [errorMessage, setErrorMessage] = useState<string>("");

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
        <p className="text-red-500 text-sm text-center opacity-90 mt-1">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
