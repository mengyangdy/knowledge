import {defineConfig} from "tsup";
import * as path from 'path';


export default defineConfig({
  entry:['src/node.ts'],
  outDir:path.resolve(__dirname,'./'),
  dts:true,
  external: ['vitepress'],
  noExternal: ['vitepress-plugin-tabs']
})