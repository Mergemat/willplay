import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function Page() {
  return (
    <div>
      Hello world!
      <Button asChild>
        <Link href="/dashboard">Dashboard</Link>
      </Button>
    </div>
  );
}
