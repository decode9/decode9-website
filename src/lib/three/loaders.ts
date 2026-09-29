import type { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

export const loadModel = async (url: string): Promise<Group> => (await loader.loadAsync(url)).scene;
