import Timeline from "../components/Timeline";
import Top from "../components/Top";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    return <Timeline />;
  } else {
    return <Top />;
  }
}
