
import { 
  useEffect, 
  // useCallback, 
  useState 
} from "react";
import sdk, {
  // FrameNotificationDetails,
  type FrameContext,
} from "@farcaster/frame-sdk";
// import { Button } from "~/components/ui/Button";


export default function Frame(
  // { title }: { title?: string } = { title: "Frames v2 Demo" }
) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [, setContext] = useState<FrameContext>();
  // const [addFrameResult, setAddFrameResult] = useState("");
  // const [notificationDetails, setNotificationDetails] =
  //   useState<FrameNotificationDetails | null>(null);
  // const [sendNotificationResult, setSendNotificationResult] = useState("");

  // useEffect(() => {
  //   setNotificationDetails(context?.client.notificationDetails ?? null);
  // }, [context]);

  useEffect(() => {
    const load = async () => {
      setContext(await sdk.context);
      sdk.actions.ready({});
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  // const addFrame = useCallback(async () => {
  //   try {
  //     setNotificationDetails(null);

  //     const result = await sdk.actions.addFrame();

  //     if (result.added) {
  //       if (result.notificationDetails) {
  //         setNotificationDetails(result.notificationDetails);
  //       }
  //       setAddFrameResult(
  //         result.notificationDetails
  //           ? `Added, got notificaton token ${result.notificationDetails.token} and url ${result.notificationDetails.url}`
  //           : "Added, got no notification details"
  //       );
  //     } else {
  //       setAddFrameResult(`Not added: ${result.reason}`);
  //     }
  //   } catch (error) {
  //     setAddFrameResult(`Error: ${error}`);
  //   }
  // }, []);

  // const sendNotification = useCallback(async () => {
  //   setSendNotificationResult("");
  //   if (!notificationDetails || !context) {
  //     return;
  //   }

  //   try {
  //     const response = await fetch("/api/send-notification", {
  //       method: "POST",
  //       mode: "same-origin",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         fid: context.user.fid,
  //         notificationDetails,
  //       }),
  //     });

  //     if (response.status === 200) {
  //       setSendNotificationResult("Success");
  //       return;
  //     } else if (response.status === 429) {
  //       setSendNotificationResult("Rate limited");
  //       return;
  //     }

  //     const data = await response.text();
  //     setSendNotificationResult(`Error: ${data}`);
  //   } catch (error) {
  //     setSendNotificationResult(`Error: ${error}`);
  //   }
  // }, [context, notificationDetails]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return null;

  // return (
  //   <div className="w-[300px] mx-auto py-4 px-2">
  //     <h1 className="text-2xl font-bold text-center mb-4">{title}</h1>
  //     <div>
  //       <h2 className="font-2xl font-bold">Add to client & notifications</h2>

  //       <div className="mt-2 mb-4 text-sm">
  //         Client fid {context?.client.clientFid},
  //         {context?.client.added
  //           ? " frame added to client,"
  //           : " frame not added to client,"}
  //         {notificationDetails
  //           ? " notifications enabled"
  //           : " notifications disabled"}
  //       </div>

  //       <div className="mb-4">
  //         <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
  //           <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
  //             sdk.actions.addFrame
  //           </pre>
  //         </div>
  //         {addFrameResult && (
  //           <div className="mb-2 text-sm">
  //             Add frame result: {addFrameResult}
  //           </div>
  //         )}
  //         <Button onClick={addFrame} disabled={context?.client.added}>
  //           Enable notifications
  //         </Button>
  //       </div>

  //       {sendNotificationResult && (
  //         <div className="mb-2 text-sm">
  //           Send notification result: {sendNotificationResult}
  //         </div>
  //       )}
  //       <div className="mb-4">
  //         <Button onClick={sendNotification} disabled={!notificationDetails}>
  //           Send notification
  //         </Button>
  //       </div>
  //     </div>
  //   </div>
  // );
}