"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const AuthProtect: React.FC<P> = (props) => {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    useEffect(() => {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("token");

          if (token !== "Dreamtosto20@4") {
            router.push("/login");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };

      fetchData();
    }, [router]);

    // if (!user) return <div>Loading...</div>; // or display loading spinner

    return <WrappedComponent {...props} />;
  };

  return AuthProtect;
};

export default withAuth;
