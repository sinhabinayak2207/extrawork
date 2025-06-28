"use client";

const GlobalStyles = () => {
  return (
    <style jsx global>{`
      html, body {
        overflow-x: hidden;
        width: 100%;
        position: relative;
      }
      :root {
        --vw: 100vw;
      }
    `}</style>
  );
};

export default GlobalStyles;
