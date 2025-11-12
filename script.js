const URL = "./my_model/";
let model, webcam, labelContainer, maxPredictions;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        const flip = true;
        webcam = new tmImage.Webcam(250, 250, flip);
        await webcam.setup();
        await webcam.play();
        window.requestAnimationFrame(loop);

        // Replace placeholder with webcam
        const camBox = document.getElementById("camera-box");
        camBox.innerHTML = "";
        camBox.appendChild(webcam.canvas);

        labelContainer = document.getElementById("label-container");

        // Create label boxes
        for (let i = 0; i < maxPredictions; i++) {
            const wrapper = document.createElement("div");
            wrapper.classList.add("label-box");

            const name = document.createElement("span");
            name.classList.add("label-name");
            name.innerText = "Class " + (i + 1);

            const percent = document.createElement("span");
            percent.classList.add("label-percent");
            percent.innerText = "0%";

            wrapper.appendChild(name);
            wrapper.appendChild(percent);
            labelContainer.appendChild(wrapper);
        }
    } catch (err) {
        console.error(err);
        document.getElementById("placeholder").innerHTML =
            "<p style='color:#ff6b6b;'>❌ Camera access denied or model not found</p>";
    }
}

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const prob = (prediction[i].probability * 100).toFixed(1);
        const name = prediction[i].className;
        const row = labelContainer.childNodes[i];

        row.querySelector(".label-name").innerText = name;
        row.querySelector(".label-percent").innerText = `${prob}%`;

        if (prob > 80) {
            row.style.backgroundColor = "rgba(0, 201, 167, 0.5)";
        } else {
            row.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
        }
    }
}
✅ Features