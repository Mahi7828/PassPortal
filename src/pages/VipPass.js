import React, { useState, useRef } from "react";
import { Canvg } from "canvg";
import "canvas-toBlob";
import { jsPDF } from "jspdf";
import "./VipPass.css"; // Import the CSS file

const VIPPass = () => {
  const [name, setName] = useState("");
  const [modifiedSvg, setModifiedSvg] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const svgRef = useRef();

  const handleGenerateSVG = async () => {
    try {
      const response = await fetch("/template_VipPass.svg");
      let svgTemplate = await response.text();
      svgTemplate = svgTemplate.replace(/__NAME__/g, name);
      setModifiedSvg(svgTemplate);
    } catch (error) {
      console.error("An error occurred while modifying the SVG:", error);
      alert("An error occurred while modifying the SVG. Please try again.");
    }
  };

  const handleDownloadSVG = () => {
    const blob = new Blob([modifiedSvg], { type: "image/svg+xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "VIP_Pass.svg";
    link.click();
  };

  const handleDownloadPNG = async () => {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const v = await Canvg.fromString(ctx, modifiedSvg);

      // Set canvas dimensions to match the SVG dimensions
      const svgElement = svgRef.current.querySelector("svg");
      canvas.width = svgElement.width.baseVal.value;
      canvas.height = svgElement.height.baseVal.value;

      // Render the SVG onto the canvas
      await v.render();

      // Convert the canvas to a Blob and download it as a PNG
      canvas.toBlob((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "VIP_Pass.png";
        link.click();
      }, "image/png");
    } catch (error) {
      console.error(
        "An error occurred while converting the SVG to PNG:",
        error
      );
      alert(
        "An error occurred while converting the SVG to PNG. Please try again."
      );
    }
  };

  const handleGeneratePDF = async () => {
    try {
      // Create a canvas element
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Render SVG onto the canvas
      const v = await Canvg.fromString(ctx, modifiedSvg);

      // Set canvas dimensions to match the SVG dimensions
      const svgElement = svgRef.current.querySelector("svg");
      canvas.width = svgElement.width.baseVal.value;
      canvas.height = svgElement.height.baseVal.value;

      await v.render();

      // Convert the canvas to a PNG
      const dataUrl = canvas.toDataURL("image/png");

      // Create a PDF and add the PNG image
      const pdf = new jsPDF();
      pdf.addImage(dataUrl, "PNG", 0, 0, 210, 297); // A4 size in mm

      // Generate the PDF URL and set it to state
      const pdfBlob = pdf.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl);

      // Open the PDF in a new window and trigger the print dialog
      const newWindow = window.open(pdfUrl);
      if (newWindow) {
        // Trigger print dialog when the new window loads
        newWindow.onload = () => {
          newWindow.print();
        };
      } else {
        // Fallback for environments where `window.open` is blocked
        const iframe = document.createElement("iframe");

        // Improved iframe styling for better mobile compatibility
        iframe.style.position = "absolute";
        iframe.style.top = "0";
        iframe.style.left = "0";
        iframe.style.width = "1px"; // Minimized size
        iframe.style.height = "1px";
        iframe.style.border = "none";
        iframe.style.visibility = "hidden"; // Make it invisible but functional
        iframe.src = pdfUrl;

        document.body.appendChild(iframe);

        // Trigger print dialog after the iframe loads
        iframe.onload = () => {
          iframe.contentWindow.print();
          // Remove the iframe after printing to clean up the DOM
          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 1000);
        };
      }
    } catch (error) {
      // Enhanced error logging
      console.error("Error occurred while generating the PDF:", error);
      alert("An error occurred while generating the PDF. Please try again.");
    }
  };

  const handleSendMail = async () => {
    try {
      // Send the modified SVG via email (backend integration needed)
      const response = await fetch("/send-pass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, svg: modifiedSvg }),
      });

      if (response.ok) {
        alert(`Pass sent to ${name}!`);
      } else {
        throw new Error("Failed to send email.");
      }
    } catch (error) {
      console.error("An error occurred while sending the pass:", error);
      alert("An error occurred while sending the pass. Please try again.");
    }
  };

  return (
    <div className="container">
      <h1>VIP Pass</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <button type="button" onClick={handleGenerateSVG} disabled={!name}>
          Click to Proceed
        </button>
      </form>

      {modifiedSvg && (
        <div>
          <div
            ref={svgRef}
            dangerouslySetInnerHTML={{ __html: modifiedSvg }}
            style={{ display: "none" }}
          />
          <div className="button-container">
            <button onClick={handleDownloadSVG}>Download asSVG</button>
            <button onClick={handleDownloadPNG}>Download as PNG</button>
            <button onClick={handleGeneratePDF}>Generate PDF</button>
            <button onClick={handleSendMail}>Send Pass on Mail</button>
          </div>
        </div>
      )}

      {pdfUrl && (
        <div>
          <h2>Generated PDF</h2>
          {/* Display PDF using iframe */}
          <iframe
            src={pdfUrl}
            width="100%"
            height="600px"
            title="Generated PDF"
          />
          {/* Alternatively, provide a download link */}
          <a href={pdfUrl} download="VIP_Pass.pdf">
            Download PDF
          </a>
        </div>
      )}
    </div>
  );
};

export default VIPPass;
