const express = require("express");
const app = express();
const Tesseract = require("tesseract.js");

const uploadCloud = require("./cloudinary.config");

app.use(express.json());
const PORT = 3000;

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.post("/upload", uploadCloud.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  return res.status(200).json({
    message: "File uploaded successfully",
    url: req.file.path,
  });
});

app.post("/Image_To_Text", async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No image URL provided" });
    }

    console.log(image);
    const imageUrl = String(`${image}`);

    Tesseract.recognize(imageUrl, "eng", { logger: (m) => console.log(m) })
      .then(({ data: { text } }) => {
        res.status(200).json({ text });
        console.log("Recognition completed.");
      })
      .catch((error) => {
        console.error("Tesseract Error:", error.message);
        res.status(500).json({ error: "Failed to process image." });
      });
  } catch (err) {
    console.error("Unexpected Error:", err.message);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(3000, "0.0.0.0", () => {
  console.log(`Server is running on http://192.168.106.117:${PORT}`);
});
