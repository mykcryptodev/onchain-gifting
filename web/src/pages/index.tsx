import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
export default function Home() {
  const router = useRouter();

  return (
    <>
      <Image 
        src="/images/logo.png" 
        alt="Logo" 
        width={72} 
        height={72} 
        priority 
        className="mb-4"
      />
      <h1 className="text-2xl font-bold mb-4 text-center">Onchain Gift Pack</h1>
      <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch max-w-4xl mx-auto">
        <div className="w-full md:w-1/2 p-6 border border-gray-200 rounded-lg flex flex-col items-center gap-4">
          <h2 className="text-xl font-semibold">Claim a Gift</h2>
          <p className="text-gray-600 text-center">Enter the secret message to claim your gift</p>
          <form 
            className="w-full max-w-sm"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const password = new FormData(form).get("password") as string;
              if (password) {
                void router.push(`/claim/${password}`);
              }
            }}
          >
            <input
              type="text"
              name="password"
              placeholder="Enter secret message..."
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <button
              type="submit"
              className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Claim Gift
            </button>
          </form>
        </div>

        <div className="w-full md:w-1/2 p-6 border border-gray-200 rounded-lg flex flex-col items-center gap-4">
          <h2 className="text-xl font-semibold">Create a Gift</h2>
          <p className="text-gray-600 text-center">Create a gift pack to send to someone special</p>
          <Link
            href="/create"
            className="w-full max-w-sm bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors mt-auto"
          >
            Create Gift Pack
          </Link>
        </div>
      </div>
    </>
  );
}
