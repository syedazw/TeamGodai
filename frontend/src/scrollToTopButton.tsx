import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // create a fake top sentinel
    const topElement = document.getElementById("top-sentinel");

    if (!topElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // jab top element screen se bahar jaye => show button
        setVisible(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
      }
    );

    observer.observe(topElement);

    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    document.getElementById("top-sentinel")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-[9999] bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-full"
    >
      ↑
    </button>
  );
}