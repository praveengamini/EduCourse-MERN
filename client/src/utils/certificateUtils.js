export const generateCertificateCanvas = ({ username, courseName, imageSrc }) => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;

      // Draw background
      ctx.drawImage(image, 0, 0);

      // Draw username
      ctx.font = "bold 160px Arial";
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "center";
      const nameY = canvas.height / 2.1;
      ctx.fillText(username, canvas.width / 2, nameY);

      // Info text
      const line1 = `We give this certificate because ${username} has completed`;
      const line2 = `${courseName} in a fairly short time with satisfactory grades.`;
      ctx.font = "80px Arial";
      ctx.textAlign = "left";
      ctx.fillText(line1, 480, nameY + 360);
      ctx.fillText(line2, 480, nameY + 500);

      resolve(canvas.toDataURL("image/png"));
    };
  });
};
