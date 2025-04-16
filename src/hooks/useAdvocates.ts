
import { useEffect, useState } from "react";

export default function useAdvocates() {
  const [advocates, setAdvocates] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setLoading(false);
      });
    });
  }, []);

  return { advocates, loading };
}
