"use client";

import { useEffect, useRef } from "react";
// @ts-ignore
import * as pannellum from "pannellum";
import "pannellum/build/pannellum.css";

export interface PanoramaHotspot {
  pitch: number;
  yaw: number;
  type: "info" | "scene";
  text?: string;
  sceneId?: string;
}

export interface PanoramaScene {
  id: string;
  title: string;
  image: string;
  hotspots: PanoramaHotspot[];
}

interface HeritagePanoramaProps {
  scenes: PanoramaScene[];
  defaultSceneId: string;
}

export default function HeritagePanorama({ scenes, defaultSceneId }: HeritagePanoramaProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const pannellumInstance = useRef<any>(null);

  useEffect(() => {
    if (viewerRef.current && !pannellumInstance.current && pannellum) {
      const scenesConfig: Record<string, any> = {};

      scenes.forEach((scene) => {
        scenesConfig[scene.id] = {
          title: scene.title,
          type: "equirectangular",
          panorama: scene.image,
          hotSpots: scene.hotspots.map((hs) => ({
            pitch: hs.pitch,
            yaw: hs.yaw,
            type: hs.type,
            text: hs.text,
            sceneId: hs.sceneId,
          })),
        };
      });

      pannellumInstance.current = pannellum.viewer(viewerRef.current, {
        default: {
          firstScene: defaultSceneId,
          autoLoad: true,
          compass: true,
        },
        scenes: scenesConfig,
      });
    }

    return () => {
      if (pannellumInstance.current && pannellumInstance.current.destroy) {
        pannellumInstance.current.destroy();
        pannellumInstance.current = null;
      }
    };
  }, [scenes, defaultSceneId]);

  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-3xl shadow-md border border-[#e2d8c5]">
      <div ref={viewerRef} className="h-full w-full" />
    </div>
  );
}