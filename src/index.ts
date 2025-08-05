/* components */
import "@components/app-root";
import "@components/context-menu";
import "@components/drag-controller";
import "@components/image-window";
import "@components/test-window";

/* styles */
import "./index.css";

/* 3rd party */
import "lit-portal";

import imageMagickWasm from "@assets/magick.wasm";
import { initializeImageMagick } from "@imagemagick/magick-wasm";

/* image magick */

(async () => {
    const res = await fetch(imageMagickWasm);
    await initializeImageMagick(await res.arrayBuffer());
})();
