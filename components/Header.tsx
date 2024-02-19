import Logo from "@/components/Logo";
import DarkModeToggle from "@/components/DarkModeToggle";
import UserButton from "@/components/UserButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import Link from "next/link";
import { MessagesSquareIcon } from "lucide-react";

async function Header() {
  const session = await getServerSession(authOptions);
  return (
    <header className="sticky top-0 -z50 bg-white dark:bg-gray-900">
      <nav className="flex flex-col sm:flex-row items-center p-5 pl-2 bg-white dark:bg-gray-900 max-w-7xl mx-auto">
        <Logo />
        <div className="flex-1 flex items-center justify-end space-x-4">
          {/* Language Select*/}

          {/* If session exists (), else ()*/}
          {session ? (
            <>
              <Link href={"/chat"} prefetch={false}>
                <MessagesSquareIcon className="text-black dark:text-white" />
              </Link>
            </>
          ) : (
            <Link href={"/pricing"} className="text-black dark:text-white">
              Pricing
            </Link>
          )}

          <DarkModeToggle />

          <UserButton session={session} />
        </div>
      </nav>
    </header>
  );
}

export default Header;
