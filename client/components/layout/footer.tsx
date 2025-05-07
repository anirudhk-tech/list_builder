import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-800 py-2 text-center text-sm text-gray-500">
      © {new Date().getFullYear()} FlamesAI. All rights reserved.
    </footer>
  );
};
