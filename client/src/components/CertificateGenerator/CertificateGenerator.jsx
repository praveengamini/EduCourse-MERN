  import React, { useRef, useEffect } from "react";


  //usage: 
  //<CertificateGenerator username="Peruri S S V Vamsikrishna" courseName="Mobile Application Development"
  


  const CertificateGenerator = ({ username, courseName }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const image = new Image();
      image.src = "/certificate.png"; // <- Place your image in /public and name it like this

      image.onload = () => {
    canvas.width = image.width;
    canvas.height = image.height;

    // Draw background image
    ctx.drawImage(image, 0, 0);

    // USERNAME (centered in big font)
    ctx.font = "bold 160px Arial";  
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    const nameY = canvas.height / 2.1;
    ctx.fillText(username, canvas.width / 2, nameY);

  // Prepare INFO TEXT
  const line1 = `We give this certificate because ${username} has completed`;
  const line2 = `${courseName} in a fairly short time with satisfactory grades.`;

  // Draw INFO TEXT (left aligned)
  ctx.font = "80px Arial";
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "left";

  const paddingLeft = 480;      // adjust for desired left margin
  const spacingAbove = 360;      // space below username
  const lineHeight = 140;

  ctx.fillText(line1, paddingLeft, nameY + spacingAbove);
  ctx.fillText(line2, paddingLeft, nameY + spacingAbove + lineHeight);
  };

    }, [username, courseName]);

    const handleDownload = () => {
      const link = document.createElement("a");
      link.download = `${username}_certificate.png`;
      link.href = canvasRef.current.toDataURL("image/png");
      link.click();
    };

    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <canvas ref={canvasRef} style={{ maxWidth: "90%", border: "1px solid #ddd" }} />
        <br />
        <button onClick={handleDownload} style={{ marginTop: "20px", padding: "10px 20px" }}>
          Download Certificate
        </button>
      </div>
    );
  };

  export default CertificateGenerator;
