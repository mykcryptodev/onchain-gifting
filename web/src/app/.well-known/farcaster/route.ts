export async function GET() {
  const config = {
    accountAssociation: {
      header:
        "eyJmaWQiOjIxNzI0OCwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweGViYTc4NzE3YjZmMDU5Q0ZFMGI3NUU3NUMyZWQ0QkI3Y0E2NTE1NEYifQ",
      payload: "eyJkb21haW4iOiJvbmNoYWluZ2lmdC5jb20ifQ",
      signature:
        "MHg2YjRjNmQzYTdmOGFmOGUzNzQ5ZWE0YzFjOTdkMmM5MDMwOTgyYmE2YWJjOTIyMjc2OTM0MDViMjM4NWM4NmEyMmJhMzAzYTliMTJhMjBmMTZkZmE3OWJiNzViODA2MTMzOWVjMDI3ZDNjYmEyODg0MWY4NDExYzAwMTcxOWY2NTFj",
    },
    frame: {
      version: "1",
      name: "Onchain Gift",
      iconUrl: "https://onchaingift.com/images/logo.png",
      splashImageUrl: "https://onchaingift.com/images/logo.png",
      splashBackgroundColor: "#eeccff",
      homeUrl: "https://onchaingift.com",
      webhookUrl: "https://onchaingift.com/api/webhook",
      imageUrl: "https://onchaingift.com/images/logo.png",
      buttonTitle: "Give an onchain gift",
    },
  };

  return Response.json(config);
}