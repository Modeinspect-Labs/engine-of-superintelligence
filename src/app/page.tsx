import { redirect } from "next/navigation";
import { ORG } from "@/lib/data";

export default function Home() {
  redirect(`/organization/${ORG.id}`);
}
