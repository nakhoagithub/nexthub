"use client";
import dynamic from "next/dynamic";
import React, { useMemo, useRef, useState } from "react";

const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});

const Page = () => {
  const editor = useRef(null);
  const [content, setContent] = useState("<p>asdasds<strong>adas đá a<em>das dá</em></strong></p>");

  return (
    <>
      <JoditEditor
        // ref={editor}
        value={content}
        onBlur={(newContent) => setContent(newContent)}
        onChange={(newContent) => {
          console.log(newContent);
        }}
      />
    </>
  );
};

export default Page;
