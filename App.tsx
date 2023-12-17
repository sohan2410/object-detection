import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import { cameraWithTensors, bundleResourceIO } from "@tensorflow/tfjs-react-native";
import { Camera } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, LogBox, Platform, StyleSheet, View } from "react-native";
import Canvas from "react-native-canvas";
const TensorCamera = cameraWithTensors(Camera);

// LogBox.ignoreAllLogs(true);

const { width, height } = Dimensions.get("window");

export default function App() {
  // const [model, setModel] = useState<cocoSsd.ObjectDetection>();
  const [model, setModel] = useState<tf.GraphModel>();
  let context = useRef<CanvasRenderingContext2D>();
  const canvas = useRef<Canvas>();

  // function handleCameraStream(images: any) {
  //   const loop = async () => {
  //     const nextImageTensor = images.next().value;

  //     if (!model || !nextImageTensor) throw new Error('no model');

  //     model
  //       .detect(nextImageTensor)
  //       .then((predictions) => {
  //         drawRectangle(predictions, nextImageTensor);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });

  //     requestAnimationFrame(loop);
  //   };
  //   loop();
  // }
  function handleCameraStream(images: any) {
    const loop = async () => {
      const nextImageTensor = images.next().value;

      if (!model || !nextImageTensor) throw new Error("no model");

      console.log("nextImageTensor", nextImageTensor);
      const predictions = model.predict(nextImageTensor);
      console.log(predictions, "predictions");
      // .then((predictions) => {
      //   drawRectangle(predictions, nextImageTensor);
      // })
      // .catch((err) => {
      //   console.log(err);
      // });

      requestAnimationFrame(loop);
    };
    loop();
  }

  function drawRectangle(predictions: cocoSsd.DetectedObject[], nextImageTensor: any) {}

  const handleCanvas = async (can: Canvas) => {
    if (can) {
      can.width = width;
      can.height = height;
      const ctx: CanvasRenderingContext2D = can.getContext("2d");
      context.current = ctx;
      ctx.strokeStyle = "red";
      ctx.fillStyle = "red";
      ctx.lineWidth = 3;
      canvas.current = can;
    }
  };

  let textureDims;
  Platform.OS === "ios" ? (textureDims = { height: 1920, width: 1080 }) : (textureDims = { height: 1200, width: 1600 });

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        await tf.ready();
        // setModel(await cocoSsd.load());
        const modelJson = require("./assets/kaggle/model.json");
        const mobilenet_v2 = await require("./assets/kaggle/mobilenet_v2.bin");
        // const modelWeights1 = await require("./assets/kaggle/group1-shard1of2.bin");
        // const modelWeights2 = await require("./assets/kaggle/group1-shard2of2.bin");
        // setModel(
        //   await tf.loadGraphModel("https://www.kaggle.com/models/google/mobilenet-v2/frameworks/TfJs/variations/035-128-classification/versions/3", {
        //     fromTFHub: true,
        //   })
        // );

        const model = await tf.loadGraphModel(bundleResourceIO(modelJson, mobilenet_v2));
        console.log("mmm...", model);
        // setModel(model);
      } catch (err) {
        console.log("error in useEffect", err);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      {/* <TensorCamera
        // Standard Camera props
        style={styles.camera}
        type={Camera.Constants.Type.back}
        // Tensor related props
        cameraTextureHeight={textureDims.height}
        cameraTextureWidth={textureDims.width}
        resizeHeight={200}
        resizeWidth={152}
        resizeDepth={3}
        onReady={handleCameraStream}
        autorender={true}
        useCustomShadersToResize={false}
      /> */}

      <Canvas style={styles.canvas} ref={handleCanvas} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  canvas: {
    position: "absolute",
    zIndex: 1000000,
    width: "100%",
    height: "100%",
  },
});
