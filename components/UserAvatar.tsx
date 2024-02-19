import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";

function UserAvatar({
  name,
  image,
  className,
}: {
  name?: string | null;
  image?: string | null;
  className?: string;
}) {
  return (
    <Avatar className={cn("bg-white text-black", className)}>
      {image && (
        <Image
          src={image}
          alt={name || "User name"}
          width={40}
          height={40}
          className="rounded-full"
        />
      )}
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback
        delayMs={1000}
        className="dark:bg-white dark:text-black text-lg"
      >
        {/* Split the name by spaces to handle multiple parts (e.g., first and last name)
      Map over each part to get the first character of each part
      Join these first characters to form the initials */}
        {name
          ?.split(" ")
          .map((part) => part[0])
          .join("")}
      </AvatarFallback>
    </Avatar>
  );
}

export default UserAvatar;
