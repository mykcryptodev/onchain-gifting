import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useGiftItems } from "~/contexts/GiftItemsContext";
import useDebounce from "~/hooks/useDebounce";
import crypto from 'crypto';

const MIN_PASSWORD_LENGTH = 20;

export function Password() {
  const { updatePassword, password: saltedPassword } = useGiftItems();
  const [password, setPassword] = useState<string>("");
  const debouncedPassword = useDebounce(password, 500);
  const [hasSeenToast, setHasSeenToast] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const salt = useMemo(() => ':::' + crypto.randomBytes(16).toString('hex'), []);

  useEffect(() => {
    const isLongEnough = debouncedPassword.length >= MIN_PASSWORD_LENGTH;
    const isValid = isLongEnough;

    if (debouncedPassword.length > 0) {
      if (!isLongEnough) {
        setErrorMessage(`Message must be at least ${MIN_PASSWORD_LENGTH} characters long`);
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
      updatePassword(debouncedPassword + salt);
    } else {
      updatePassword("");
    }
  }, [debouncedPassword, updatePassword, salt]);

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
      <details className={password ? 'block' : 'hidden'}>
        <summary className="text-sm">View gift secret</summary>
        <div className="flex flex-col p-2">
          <p className="text-xs">Secret phrase to claim gift:</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs p-2 bg-gray-100 rounded-md overflow-x-auto whitespace-nowrap">{saltedPassword}</code>
            <button
              onClick={() => {
                void navigator.clipboard.writeText(saltedPassword);
                toast.success('Copied to clipboard!');
              }}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>
          <p className="text-xs mt-2 p-2 bg-blue-100 text-blue-800 rounded-md">The secret phrase is used to claim your gift. Keep it safe! It is created using your message and a random string. If you lose it, you can reclaim your gift in Gifts From Me section.</p>
        </div>
      </details>
      {showError && (
        <p className="text-red-500 text-sm text-center opacity-90 mt-1">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
