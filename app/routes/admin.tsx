import { useNavigate } from "@remix-run/react";
import localforage from "localforage";

import { Button } from "~/components/Button";

export default function Admin() {
  const navigate = useNavigate();

  const reset = () => {
    if (confirm("Are you sure you want to reset the local DB?")) {
      localforage.clear();
      navigate("/");
    }
  };

  return (
    <main className="relative min-h-screenm-6 p-8">
      <Button variant="warn" onClick={reset}>
        Reset local DB
      </Button>
    </main>
  );
}

Admin.displayName = "Admin";
