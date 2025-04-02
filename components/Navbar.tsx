"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";

export default function Navbar() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (error: any) {
      toast.error("Failed to sign out");
    }
  };

  return (
    <header className="border-b bg-black">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">API Docs Generator</h1>
        <Button
          variant="outline"
          className="text-black bg-white hover:bg-white hover:text-black"
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </div>
    </header>
  );
}