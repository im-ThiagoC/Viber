// Header
// This is the Main Page of the application

// Imports
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";

const Page = async () => {

  return (
    <div>
      <Button variant="link" className="text-rose-600">
        Click me
      </Button>
    </div>

  );
}
 
export default Page;