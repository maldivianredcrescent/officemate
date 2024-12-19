"use client";

import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "./button";

const SignaturePad = ({ onChange, width = 200, height = 200 }) => {
  const signatureRef = useRef(null);

  const handleClear = () => {
    signatureRef.current?.clear();
    if (onChange) {
      onChange(null);
    }
  };

  const handleSave = () => {
    if (!signatureRef.current?.isEmpty()) {
      // Get base64 string of signature
      const signatureData = signatureRef.current?.toDataURL();
      if (onChange) {
        onChange(signatureData);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="border border-gray-300 rounded">
        <SignatureCanvas
          ref={signatureRef}
          canvasProps={{
            width: window.innerWidth > 400 ? 430 : window.innerWidth - 60,
            height,
            className: "signature-canvas",
          }}
          backgroundColor="white"
        />
      </div>
      <div className="w-full flex gap-2">
        <button
          onClick={handleClear}
          className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Clear Signature
        </button>
        <Button onClick={handleSave} className="w-full">
          Sign
        </Button>
      </div>
    </div>
  );
};

export default SignaturePad;
